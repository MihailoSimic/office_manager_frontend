import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import { Table, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import format from "date-fns/format";
import BASE_URL from "../../api/baseUrl";
import globalStyles from "../../styles/GlobalStyles";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useNavigate } from "react-router-dom";
import TokenExpiredSwal from "../components/TokenExpiredSwal";
import StyledSpinner from "../components/StyledSpinner";
import TablePagination from "../components/TablePagination";
const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const sortedReservations = [...reservations].sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0;
      if (d.includes("-")) return new Date(d).getTime();
      const [day, month, year] = d.split(".");
      return new Date(`${year}-${month}-${day}`).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();
  const handleSeatClick = (seat) => {
    const reservation = reservations.find(
      (r) =>
        r.seat_number === seat.seat_number &&
        r.date === format(selectedDate, "yyyy-MM-dd") &&
        r.status === "approved"
    );
    if (reservation) {
      setSelectedReservation(reservation);
      setModalOpen(true);
    } else {
      setSelectedReservation(null);
      setModalOpen(true);
    }
  }

  const handleReservationSubmit = async (reservationId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/reservation/${reservationId}?status=${status}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "rejected", reservation_id: reservationId })
      });
      const data = await res.json();
      if (res.status === 401) {
        TokenExpiredSwal();
        navigate("/");
        return;
      }
      if (res.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: data.message || "Rezervacija ažurirana!",
          showConfirmButton: false,
          timer: 3000
        });

        setReservations(reservations.map(r => r._id === reservationId ? { ...r, status } : r));
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Greška pri ažuriranju rezervacije.",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška u komunikaciji sa serverom!",
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: "Da li ste sigurni?",
      text: "Ova akcija će trajno obrisati rezervaciju!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Da, obriši!",
      cancelButtonText: "Ne, zadrži"
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${BASE_URL}/reservation/${reservationId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.status === 401) {
        TokenExpiredSwal();
        navigate("/");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: data.message || "Rezervacija obrisana!",
          showConfirmButton: false,
          timer: 2000
        });
        setReservations(reservations.filter(r => r._id !== reservationId));
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Greška pri brisanju rezervacije.",
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška u komunikaciji sa serverom!",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resRes, seatsRes] = await Promise.all([
          fetch(`${BASE_URL}/reservation`,
            { 
              method: "GET",
              credentials: "include" 
            }
          ),
          fetch(
            `${BASE_URL}/seat`,
            { method: "GET", credentials: "include" }
          )
        ]);
        if (resRes?.status === 401 || seatsRes?.status === 401) {
          TokenExpiredSwal();
          navigate("/");
          return;
        }
        const reservationsData = await resRes.json();
        const seatsData = await seatsRes.json();
        setReservations(reservationsData);
        setSeats(seatsData);
      } catch (error) {
        console.error("Greška prilikom učitavanja rezervacija ili sedista:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-center">Sve rezervacije</h2>
      {loading ? (
        <StyledSpinner />
      ) : (
        <>
          <Table bordered hover responsive style={globalStyles.tableStyle}>
            <thead>
              <tr>
                <th style={globalStyles.tableHeader}>Korisnik</th>
                <th style={globalStyles.tableHeader}>Datum</th>
                <th style={globalStyles.tableHeader}>Mesto</th>
                <th style={globalStyles.tableHeader}>Status</th>
                <th style={globalStyles.tableHeader}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {sortedReservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ fontSize: 18, color: '#888', padding: '32px 0' }}>
                    Nema rezervacija
                  </td>
                </tr>
              ) : (
                paginatedReservations.map((res) => (
                  <tr key={res._id}>
                    <td style={globalStyles.tableCell}>{res.username}</td>
                    <td style={globalStyles.tableCell}>{res.date}</td>
                    <td style={globalStyles.tableCell}>{res.seat_number}</td>
                    <td style={globalStyles.tableCell}>
                      {res.status === "pending" && (
                        <span style={{ color: "#FFA500", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#fffbe6', boxShadow: '0 1px 4px #ffe0a3' }}>
                          Na čekanju
                        </span>
                      )}
                      {res.status === "approved" && (
                        <span style={{ color: "#2ecc40", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#eafaf1', boxShadow: '0 1px 4px #b2f7c1' }}>
                          Odobreno
                        </span>
                      )}
                      {res.status === "rejected" && (
                        <span style={{ color: "#ff3b3b", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#ffeaea', boxShadow: '0 1px 4px #ffb2b2' }}>
                          Odbijeno
                        </span>
                      )}
                    </td>
                    <td style={globalStyles.tableCell}>
                      {res.status === "pending" ? (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            className="me-2"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #b2f7c1' }}
                            onClick={() => handleReservationSubmit(res._id, "approved")}
                          >
                            Odobri
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            className="me-2"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #ffb2b2' }}
                            onClick={() => handleReservationSubmit(res._id, "rejected")}
                          >
                            Odbij
                          </Button>
                          <Button
                            color="dark"
                            outline
                            size="sm"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #888' }}
                            onClick={() => handleDeleteReservation(res._id)}
                          >
                            Obriši
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            color="dark"
                            outline
                            size="sm"
                            className="ms-2"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #888' }}
                            onClick={() => handleDeleteReservation(res._id)}
                          >
                            Obriši
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
      <h2 className="mt-3 mb-4 text-center">Raspored sedenja</h2>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Flatpickr
          data-enable-time={false}
          value={selectedDate}
          onChange={(date) => setSelectedDate(date[0])}
          options={{ dateFormat: "d.m.Y" }}
        />
      </div>
      <div>
        {Object.keys(groupedSeats).map((rowNumber) => (
          <Row key={rowNumber} className="mb-2" style={{ justifyContent: "center" }}>
            {groupedSeats[rowNumber].map((seat, index) => {
              const reservation = reservations.find(
                (r) =>
                  r.seat_number === seat.seat_number &&
                  r.date === format(selectedDate, "yyyy-MM-dd") &&
                  r.status === "approved"
              );
              const reserved = Boolean(reservation);

              return (
                <Col key={seat.id || index} xs="auto">
                  {seat.enabled === false ? (
                    <Button className="m-1" disabled style={{ visibility: "hidden" }}>&nbsp;</Button>
                  ) : (
                    <Button
                      color={reserved ? "secondary" : "success"}
                      disabled={!reserved ? false : false}
                      onClick={() => handleSeatClick(seat)}
                      className="m-1"
                    >
                      {seat.seat_number}
                    </Button>
                  )}
                </Col>
              );
            })}
          </Row>
        ))}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            {selectedReservation ? "Detalji rezervacije" : "Mesto je slobodno"}
          </ModalHeader>
          <ModalBody>
            {selectedReservation ? (
              <>
                <p><strong>Mesto:</strong> {selectedReservation.seat_number}</p>
                <p><strong>Datum:</strong> {selectedReservation.date}</p>
                <p><strong>Korisnik:</strong> {selectedReservation.username}</p>
                <p><strong>Status:</strong> {selectedReservation.status}</p>
              </>
            ) : (
              <p>Ovo mesto je slobodno za odabrani datum.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};


export default AdminReservations;

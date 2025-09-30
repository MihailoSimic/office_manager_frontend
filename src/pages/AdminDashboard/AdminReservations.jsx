import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import { Table, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import format from "date-fns/format";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableStyle = {
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)",
    color: "#fff",
    textAlign: "center",
  };

  const cellStyle = {
    textAlign: "center",
    verticalAlign: "middle",
  };

  const rowStyle = {
    background: "rgba(108, 99, 255, 0.1)", // blaga ljubičasto-plava nijansa
  };

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
  };
  // Fetch reservations and seats on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resRes, seatsRes] = await Promise.all([
          fetch("http://localhost:8000/reservation", { method: "GET", credentials: "include" }),
          fetch("http://localhost:8000/seat", { method: "GET", credentials: "include" })
        ]);
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});
  const isSeatReserved = (seatNumber) => {
      return reservations.some(
        (r) =>
          r.seat_number === seatNumber &&
          r.date === format(selectedDate, "yyyy-MM-dd") &&
          r.status === "approved"
      );
    }

  // Sortiraj rezervacije po datumu opadajuće
  const sortedReservations = [...reservations].sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0;
      if (d.includes("-")) return new Date(d).getTime();
      const [day, month, year] = d.split(".");
      return new Date(`${year}-${month}-${day}`).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  // PAGINACIJA
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }
  return (
    <div>
      <h2 className="mb-4 text-center">Sve rezervacije</h2>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Spinner color="primary" style={{ width: 60, height: 60, borderWidth: 6 }} />
        </div>
      ) : (
        <>
          <Table bordered hover responsive style={{ borderRadius: 8, background: 'white', border: 'none', marginBottom: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr>
                <th style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Korisnik</th>
                <th style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Datum</th>
                <th style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Mesto</th>
                <th style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Status</th>
                <th style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Akcija</th>
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
                  <tr key={res._id} style={{ background: 'rgba(108, 99, 255, 0.1)', borderBottom: '2px solid #e9eafc' }}>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: 15 }}>{res.username}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: 15 }}>{res.date}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: 15 }}>{res.seat_number}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {res.status === "pending" ? (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            className="me-2"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #b2f7c1' }}
                            onClick={() => handleApprove(res._id)}
                          >
                            Odobri
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #ffb2b2' }}
                            onClick={() => handleReject(res._id)}
                          >
                            Odbij
                          </Button>
                        </>
                      ) : (
                        <span style={{ fontSize: 18, color: '#2ecc40' }}>✔</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* PAGINACIJA */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Pagination size="md">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem active={currentPage === idx + 1} key={idx}>
                    <PaginationLink onClick={() => handlePageChange(idx + 1)}>{idx + 1}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              </Pagination>
            </div>
          )}
        </>
      )}
      {/* Raspored sedenja i modal */}
      <h2 className="mb-4 text-center">Raspored sedenja</h2>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Flatpickr
          data-enable-time={false}
          value={selectedDate}
          onChange={(date) => setSelectedDate(date[0])}
          options={{ dateFormat: "d.m.Y", minDate: "today" }}
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

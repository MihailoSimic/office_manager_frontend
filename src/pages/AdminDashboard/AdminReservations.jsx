import React, { useState } from "react";
import { Table, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import format from "date-fns/format";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const AdminReservations = ({ reservations, setReservations, seats, setSeats }) => {
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
  const handleSeatClick = (seat) => {
    // tražimo rezervaciju koja je odobrena za to mesto i datum
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
  const handleApprove = async (id) => {
    try {
      const updated = reservations.map((r) =>
        r._id === id ? { ...r, status: "approved" } : r
      );
      const res = updated.find((r) => r._id === id);
      console.log("Updated res", res);

      const response = await fetch(
        `http://localhost:8000/reservation/${id}?status=approved`,
        {
          method: "PUT",
          credentials: "include", // OBAVEZNO za cookie auth
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response)
      if (response.ok) {
        setReservations(updated);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Rezervacija uspešno odobrena!",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        const errorData = await response.json();
        console.log(errorData);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: errorData.detail || "Došlo je do greške",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška u komunikaciji sa serverom!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleReject = (id) => {
    try {
      const updated = reservations.map((r) =>
        r._id === id ? { ...r, status: "rejected" } : r
      );
      const res = updated.find((r) => r._id === id);
      console.log('Updated res', res)
      const response = fetch(`http://localhost:8000/reservation/${id}?status=rejected`, {
        method: "PUT",
        credentials: "include",          // OBAVEZNO za cookie auth
        headers: { "Content-Type": "application/json" }
      });
      setReservations(updated);
    } catch (error) {
      console.log(error);
    }
  };

  const tableStyle = {
    borderRadius: "12px",
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

  return (
    <div>
      <h2 className="mb-4 text-center">Sve rezervacije</h2>
      <Table bordered hover responsive style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Korisnik</th>
            <th style={headerStyle}>Datum</th>
            <th style={headerStyle}>Mesto</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nema rezervacija
              </td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr key={res._id} style={rowStyle}>
                <td style={cellStyle}>{res.username}</td>
                <td style={cellStyle}>{res.date}</td>
                <td style={cellStyle}>{res.seat_number}</td>
                <td style={cellStyle}>
                  {res.status === "pending" && (
                    <span style={{ color: "#FFA500", fontWeight: "bold" }}>
                      Na čekanju
                    </span>
                  )}
                  {res.status === "approved" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Odobreno
                    </span>
                  )}
                  {res.status === "rejected" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Odbijeno
                    </span>
                  )}
                </td>
                <td style={cellStyle}>
                  {res.status === "pending" ? (
                    <>
                      <Button
                        color="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(res._id)}
                      >
                        Odobri
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleReject(res._id)}
                      >
                        Odbij
                      </Button>
                    </>
                  ) : (
                    <span>✔</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
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
                <Button
                  color={reserved ? "secondary" : "success"}
                  disabled={!reserved ? false : false} // samo otvara modal ako je rezervisano
                  onClick={() => handleSeatClick(seat)}
                  className="m-1"
                >
                  {seat.seat_number}
                </Button>
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

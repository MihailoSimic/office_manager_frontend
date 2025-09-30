import React, { useState } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Flatpickr from "react-flatpickr";
import format from "date-fns/format";
import "flatpickr/dist/themes/material_blue.css";

import Swal from "sweetalert2";

function Reservation({ seats, reservations, setReservations }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Grupisanje sedišta po redovima
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Provera da li je sedište već rezervisano za odabrani datum
  const isSeatReserved = (seatNumber) => {
    return reservations.some(
      (r) =>
        r.seat_number === seatNumber &&
        r.date === format(selectedDate, "yyyy-MM-dd") &&
        r.status === "approved"
    );
  };

  const handleSeatClick = (seat) => {
    if (isSeatReserved(seat.seat_number)) return; // ne otvara modal za zauzeta mesta
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleReservationSubmit = async () => {
    if (!selectedSeat || !selectedDate) return;

    try {
      const response = await fetch("http://localhost:8000/reservation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          seat_number: selectedSeat.seat_number,
          date: format(selectedDate, "yyyy-MM-dd"),
          username: JSON.parse(localStorage.getItem("user")).username,
          status: "pending",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Rezervacija poslata!",
          showConfirmButton: false,
          timer: 3000,
        });
        // refresh rezervacija
        const res = await fetch("http://localhost:8000/reservation", {
          credentials: "include",
        });
        setReservations(await res.json());
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Greška prilikom rezervacije",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška prilikom rezervacije",
        showConfirmButton: false,
        timer: 3000,
      });
    }

    setModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-3 text-center">Rezervacija mesta</h2>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Flatpickr
          data-enable-time={false}
          value={selectedDate}
          onChange={(date) => setSelectedDate(date[0])}
          options={{ dateFormat: "d.m.Y", minDate: "today" }}
        />
      </div>

      {Object.keys(groupedSeats).map((rowNumber) => (
        <Row key={rowNumber} className="mb-2" style={{ justifyContent: "center" }}>
          {groupedSeats[rowNumber].map((seat) => {
            const reserved = isSeatReserved(seat.seat_number);
            return (
              <Col key={seat.id} xs="auto">
                  {seat.enabled === false ? (
                    <Button className="m-1" disabled style={{ visibility: "hidden" }}>&nbsp;</Button>
                  ) : (
                    <Button
                      color={reserved ? "secondary" : "success"}
                      disabled={reserved}
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

      {/* Modal za potvrdu rezervacije */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Rezervacija sedišta {selectedSeat?.seat_number}
        </ModalHeader>
        <ModalBody>
          <p>Datum: {selectedDate.toLocaleDateString()}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleReservationSubmit}>
            Potvrdi
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Odustani
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Reservation;

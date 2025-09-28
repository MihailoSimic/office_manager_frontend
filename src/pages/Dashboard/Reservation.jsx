import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import Flatpickr from "react-flatpickr";
import format from "date-fns/format";
import "flatpickr/dist/themes/material_blue.css";

function Reservation({ seats, setSeats, reservations, setReservations }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState("");

  // Grupisanje sedista po redovima
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleReservationSubmit = async () => {
    if (!selectedSeat || !selectedDate) return;

    try {
      const response = await fetch("http://localhost:8000/reservation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // salje cookie
        body: JSON.stringify({
          seat_number: selectedSeat.seat_number,
          date: format(selectedDate, "yyyy-MM-dd"),
          username: JSON.parse(localStorage.getItem("user")).username,
          status: "pending"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Rezervacija poslana!");
      } else {
        alert(data.detail || "Greška prilikom rezervacije");
      }
    } catch (error) {
      console.error(error);
      alert("Greška prilikom rezervacije");
    }

    setModalOpen(false);
    setNote("");
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
          {groupedSeats[rowNumber].map((seat) => (
            <Col key={seat.id} xs="auto">
              <Button color="primary" onClick={() => handleSeatClick(seat)}>
                {seat.seat_number}
              </Button>
            </Col>
          ))}
        </Row>
      ))}

      {/* Modal za rezervaciju */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Rezervacija sedista {selectedSeat?.seat_number}
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
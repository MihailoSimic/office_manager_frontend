import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import Flatpickr from "react-flatpickr";
import format from "date-fns/format";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/baseUrl";
import TokenExpiredSwal from "../utils/TokenExpiredSwal";
import StyledSpinner from "../utils/StyledSpinner";
import Swal from "sweetalert2";

import "flatpickr/dist/themes/material_blue.css";

function Reservation() {

  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
  };

  const handleSeatClick = (seat) => {
    if (isSeatReserved(seat.seat_number)) return;
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleReservationSubmit = async () => {
    if (!selectedSeat || !selectedDate) return;

    try {
      const response = await fetch(`${BASE_URL}/reservation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          seat_number: selectedSeat.seat_number,
          date: format(selectedDate, "yyyy-MM-dd"),
          username: JSON.parse(localStorage.getItem("user")).username,
          status: "pending"
        })
      });

      const data = await response.json();

      if (response.status === 401) {
        TokenExpiredSwal();
        navigate("/");
        return;
      }
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Rezervacija poslata!",
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Greška prilikom rezervacije",
          showConfirmButton: false,
          timer: 3000
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
        timer: 3000
      });
    }
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [seatsRes, reservationsRes] = await Promise.all([
          fetch(`${BASE_URL}/seat`, { credentials: "include" }),
          fetch(`${BASE_URL}/reservation`, { credentials: "include" })
        ]);
        if (seatsRes.status === 401 || reservationsRes.status === 401) {
          TokenExpiredSwal();
          navigate("/");
          return;
        }
        const seatsData = seatsRes.ok ? await seatsRes.json() : [];
        const reservationsData = reservationsRes.ok ? await reservationsRes.json() : [];
        setSeats(seatsData);
        setReservations(reservationsData);
        setLoading(false);
      } catch (err) {
        console.error("Greška prilikom učitavanja podataka:", err);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <StyledSpinner />;
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

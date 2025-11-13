import React, { useState } from "react";
import { Row, Col, Button, Input, Form, FormGroup, Label } from "reactstrap";

import Swal from "sweetalert2";
import BASE_URL from "../../api/baseUrl";
import TokenExpiredSwal from "../components/TokenExpiredSwal";
import { useNavigate } from "react-router-dom";
const OfficeEditor = () => {
  const [seatsGenerated, setSeatsGenerated] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [groupedSeats, setGroupedSeats] = useState({});
  const navigate = useNavigate();

  const generateSeats = () => {
    let seatNumber = 1;
    const grouped = {};

    for (let r = 1; r <= rows; r++) {
      grouped[r] = [];
      for (let c = 1; c <= cols; c++) {
        grouped[r].push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          seat_number: seatNumber++,
          enabled: true,
        });
      }
    }
    setGroupedSeats(grouped);
    setSeatsGenerated(true);
  };

  const handleCancel = () => {
    setGroupedSeats({});
    setRows(0);
    setCols(0);
    setSeatsGenerated(false);
  }

  const toggleSeat = (row, id) => {
    setGroupedSeats((prev) => {
      const newSeats = { ...prev };
      newSeats[row] = newSeats[row].map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      );
      return newSeats;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allSeats = Object.values(groupedSeats)
      .flat()
      .map(({ id, ...seat }) => seat);

    try {
      const response = await fetch(`${BASE_URL}/seat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(allSeats)
      });
      if (response.status === 401) {
        TokenExpiredSwal();
        navigate("/");
        return;
      }
      if (response.ok) {
        handleCancel();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Raspored uspešno sačuvan!",
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        const data = await response.json();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Greška pri čuvanju rasporeda!",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška pri komunikaciji sa serverom!",
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <div className="p-4">
      <h3>Generiši novi raspored sedenja</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="mb-1 ms-1">
          <Col xs="auto">
            <FormGroup className="d-flex align-items-center">
              <Label for="rows" className="me-2">Redovi:</Label>
              <Input
                type="number"
                id="rows"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                style={{ width: "80px" }}
                disabled={seatsGenerated}
              />
            </FormGroup>
          </Col>
          <Col xs="auto">
            <FormGroup className="d-flex align-items-center">
              <Label for="cols" className="me-2">Kolone:</Label>
              <Input
                type="number"
                id="cols"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                style={{ width: "80px" }}
                disabled={seatsGenerated}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="ms-4">
          <Col xs="auto">
            {!seatsGenerated ? (
              <Button color="primary" type="button" onClick={generateSeats} className="me-2">
                Generiši
              </Button>
            ) : null}
          </Col>
          {seatsGenerated && (
            <Col xs="auto">
              <Button color="secondary" type="button" onClick={() => handleCancel()} className="me-2">
                Odustani
              </Button>
            </Col>
          )}
          <Col xs="auto">
            <Button color="success" type="submit" disabled={Object.keys(groupedSeats).length === 0}>
              Sačuvaj
            </Button>
          </Col>
        </Row>
      </Form>

      {Object.keys(groupedSeats).length > 0 && (
        <div className="mb-2 text-center">
          Klikom na dugme brišeš mesto iz rasporeda (mesto postaje sivo i neće biti dostupno za rezervaciju).
        </div>
      )}
      {Object.keys(groupedSeats).map((rowNumber) => (
        <Row key={rowNumber} className="mb-2" style={{ justifyContent: "center" }}>
          {groupedSeats[rowNumber].map((seat) => (
            <Col key={seat.id} xs="auto">
              <Button
                color={seat.enabled ? "success" : "secondary"}
                onClick={() => toggleSeat(rowNumber, seat.id)}
                className="m-1"
              >
                {seat.seat_number}
              </Button>
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default OfficeEditor;
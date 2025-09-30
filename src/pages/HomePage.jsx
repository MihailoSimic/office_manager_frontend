import React from "react";
import { Link } from "react-router-dom";
import globalStyles from "../styles/GlobalStyles";
import { Button } from "reactstrap";
export default function HomePage() {
  return (
    <div style={globalStyles.container}>
      <div>
        <h1>Office Seat Scheduler</h1>
        <p>
          Rezerviši svoje mesto u kancelariji brzo i jednostavno.
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Button color="success" tag={Link} to="/login">
            Uloguj se
          </Button>
          <Button color="primary" tag={Link} to="/register">
            Registruj se
          </Button>
        </div>
      </div>
    </div>
  );
}

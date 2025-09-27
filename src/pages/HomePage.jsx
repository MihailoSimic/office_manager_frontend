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
            Login
          </Button>
          <Button color="primary" tag={Link} to="/register">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  content: {
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)", // automatski se prilagođava
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "clamp(1rem, 3vw, 1.3rem)",
    marginBottom: "30px",
    color: "#444",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap", // na manjim ekranima dugmići će preći jedan ispod drugog
  },
  button: {
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    transition: "0.3s",
    fontSize: "1rem",
    minWidth: "120px",
    textAlign: "center",
  },
};

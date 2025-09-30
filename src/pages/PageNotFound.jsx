import React from "react";
import { Container, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import globalStyles from "../styles/GlobalStyles";
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={globalStyles.container}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem", color: "#dc3545" }}>
        404
      </h1>
      <h2 style={{ marginBottom: "2rem" }}>Stranica nije pronađena</h2>
      <p style={{ marginBottom: "2rem" }}>
        Izgleda da ruta koju tražiš ne postoji ili je uklonjena.
      </p>
      <Button color="primary" onClick={() => navigate("/")}>
        Povratak na početnu
      </Button>
    </div>
  );
};

export default PageNotFound;

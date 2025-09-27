import React, { useState } from "react";
import { Row, Col, Input, Button, Alert } from "reactstrap";
import globalStyles from "../styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success"); // success ili danger

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setMessage("Morate uneti username i password!");
      setColor("danger");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Došlo je do greške");
        setColor("danger");
      } else {
        setMessage(`Uspešno prijavljen! Dobrodošao ${data.username}`);
        setColor("success");

        // Sačuvaj korisnika u localStorage ili context
        // localStorage.setItem("user", JSON.stringify(data));

        // Navigacija na Dashboard nakon npr. 1s da korisnik vidi poruku
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setMessage("Greška prilikom konekcije sa serverom");
      setColor("danger");
    }
  };
  return (
    <div style={globalStyles.container}>
      <Row className="w-100 justify-content-center">
        <Col xs="12" sm="8" md="6" lg="4">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />
            <Button
              type="submit"
              color="success"
              className="w-100 mb-3"
            >
              Login
            </Button>
          </form>
          {message && <Alert color={color}>{message}</Alert>}
        </Col>
      </Row>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import { Row, Col, Input, Button, Alert } from "reactstrap";
import globalStyles from "../styles/GlobalStyles";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setMessage("Morate uneti username i password!");
      setColor("danger");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Registracija neuspešna");
        setColor("danger");
      } else {
        setMessage(`Korisnik ${data.username} je uspešno registrovan!`);
        setColor("success");

        // po želji, možeš odmah prebaciti na login ili sačuvati info
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
          <h2 className="text-center mb-4">Register</h2>
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
            <Button type="submit" color="primary" className="w-100 mb-3">
              Register
            </Button>
          </form>
          {message && <Alert color={color}>{message}</Alert>}
        </Col>
      </Row>
    </div>
  );
}

export default Register;
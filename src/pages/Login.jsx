import React, { useState } from "react";
import { Row, Col, Input, Button, Alert } from "reactstrap";
import globalStyles from "../styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

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
        credentials: "include", // obavezno za cookie
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Došlo je do greške");
        setColor("danger");
      } else {
        // Sačuvaj token u localStorage
        console.log(data)
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage(`Uspešno prijavljen! Dobrodošao ${data.user?.username}`);
        setColor("success");

        // Navigacija na Dashboard nakon kratkog delay-a
        setTimeout(() => {
          console.log(data.user.role)
          if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 800);
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
          <h2 className="text-center mb-4">Uloguj se</h2>
          <form onSubmit={handleSubmit} className="text-center">
            <Input
              type="text"
              placeholder="Korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />

            {message && <Alert color={color}>{message}</Alert>}

            <div className="d-flex justify-content-between">
              <Button
                color="secondary"
                onClick={() => navigate("/")}
                className="w-45"
              >
                Odustani
              </Button>
              <Button
                type="submit"
                color="success"
                className="w-45"
              >
                Uloguj se
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
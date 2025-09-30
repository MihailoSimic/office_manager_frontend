import React, { useState } from "react";
import { Row, Col, Input, Button, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom"; // import navigate
import globalStyles from "../styles/GlobalStyles";
import BASE_URL from "../api/baseUrl";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const navigate = useNavigate(); // hook za navigaciju

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (username === "" || password === "" || confirmPassword === "") {
      setMessage("Morate popuniti sva polja!");
      setColor("danger");
      return;
    }

    // Provera formata lozinke
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{5,}$/;
    if (!passwordRegex.test(password)) {
      setMessage("Lozinka mora imati bar 5 karaktera, jedno veliko slovo, jedan broj i jedan specijalan znak.");
      setColor("danger");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Lozinke se ne poklapaju!");
      setColor("danger");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Registracija neuspešna");
        setColor("danger");
      } else {
        setMessage(`Korisnik ${data.user?.username} je uspešno registrovan!`);
        localStorage.setItem("user", JSON.stringify(data.user));
        setColor("success");

        // kratko čekanje pa preusmeravanje
        setTimeout(() => {
          navigate("/dashboard"); // preusmeravanje na dashboard
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
          <h2 className="text-center mb-4">Registracija</h2>
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
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Ponovi lozinku"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4"
            />

            <div className="d-flex justify-content-between">
              <Button
                type="button"
                color="secondary"
                onClick={() => navigate("/")}
                className="w-45"
              >
                Odustani
              </Button>
              <Button
                type="submit"
                color="primary"
                className="w-45"
              >
                Registruj se
              </Button>
            </div>
          </form>

          {message && <Alert color={color} className="mt-3">{message}</Alert>}
        </Col>
      </Row>

    </div>
  );
}

export default Register;
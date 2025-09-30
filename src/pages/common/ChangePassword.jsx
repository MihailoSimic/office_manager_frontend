import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container, Alert } from "reactstrap";

const ChangePassword = (user, setUser) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success"); // boja poruke: success/error

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validacija: nove lozinke moraju biti iste
    if (newPassword !== confirmPassword) {
      setColor("danger");
      setMessage("Nova lozinka i potvrda lozinke se ne poklapaju!");
      return;
    }

    try {
      // Uzmi user-a iz localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        setColor("danger");
        setMessage("Niste prijavljeni!");
        return;
      }

      // Napravi payload sa novom lozinkom
      const updatedUser = {
        ...storedUser,
        password: newPassword,
      };

      // Pošalji PUT na backend sa ID-em u URL-u
      const response = await fetch(
        `http://localhost:8000/user/${storedUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setColor("success");
        setMessage(data.message || "Lozinka uspešno promenjena!");

        // Osveži localStorage sa novim podacima
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Resetuj polja
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setColor("danger");
        setMessage(data.detail || "Došlo je do greške.");
      }
    } catch (err) {
      console.error(err);
      setColor("danger");
      setMessage("Greška u komunikaciji sa serverom!");
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4">Promena lozinke</h2>
      {message && <Alert color={color}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="oldPassword">Stara lozinka:</Label>
          <Input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="newPassword">Nova lozinka:</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Ponovite novu lozinku:</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="success" type="submit">
          Promeni lozinku
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;

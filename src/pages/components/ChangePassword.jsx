
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{5,}$/;
    if (!passwordRegex.test(newPassword)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lozinka mora imati bar 5 karaktera, jedno veliko slovo, jedan broj i jedan specijalan znak.",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Nova lozinka i potvrda lozinke se ne poklapaju!",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Morate biti prijavljeni da biste promenili lozinku!",
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }

      const hashedPassword = storedUser.password;
      const oldPasswordMatch = await bcrypt.compare(oldPassword, hashedPassword);
      if (!oldPasswordMatch) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Stara lozinka nije ispravna!",
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }

      const updatedUser = {
        ...storedUser,
        password: newPassword,
      };

      const response = await fetch(
        `http://localhost:8000/user/${storedUser._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: data.message || "Lozinka uspešno promenjena!",
          showConfirmButton: false,
          timer: 3000
        });

        localStorage.setItem("user", JSON.stringify(data.user));

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.detail || "Došlo je do greške.",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Greška u komunikaciji sa serverom!",
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4">Promena lozinke</h2>
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

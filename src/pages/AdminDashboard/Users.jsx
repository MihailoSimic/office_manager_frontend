import React, { useState } from "react";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";

const Users = ({ users, setUsers }) => {
  const [loading, setLoading] = useState(false);

  const onUserUpdated = async (updatedUser) => {
    try {
      const res = await fetch(`http://localhost:8000/user/${updatedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Korisnik ${updatedUser.username} je odobren!`,
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        console.error("Backend nije uspeo da ažurira korisnika");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Korisnika nije moguće odobriti.",
          timer: 3000
        });
      }
    } catch (err) {
      console.error("Greška pri ažuriranju korisnika:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Došlo je do problema pri komunikaciji sa serverom.",
        timer: 3000
      });
    }
  };

  const onUserDeleted = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/user/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Korisnik je uspešno obrisan.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        console.error("Backend nije uspeo da obriše korisnika");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Korisnika nije moguće obrisati.",
        });
      }
    } catch (err) {
      console.error("Greška pri brisanju korisnika:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Došlo je do problema pri komunikaciji sa serverom.",
        timer: 3000,
      });
    }
  };

  const handleApprove = async (user) => {
    setLoading(true);
    try {
      const updatedUser = { ...user, approved: true };
      const response = await fetch(`http://localhost:8000/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        onUserUpdated(updatedUser);
      } else {
        Swal.fire({
          icon: "error",
          title: "Greška",
          text: "Greška pri odobravanju korisnika",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do problema pri komunikaciji sa serverom",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/user/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUserDeleted(userId);
      } else {
        Swal.fire({
          icon: "error",
          title: "Greška",
          text: "Greška pri brisanju korisnika",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do problema pri komunikaciji sa serverom",
      });
    } finally {
      setLoading(false);
    }
  };

  const unapprovedUsers = users?.filter((u) => !u.approved) || [];
  const approvedUsers = users?.filter((u) => u.approved) || [];

  return (
    <div>
      <h3>Neodobreni korisnici</h3>
      {unapprovedUsers.length === 0 ? (
        <p>Svi korisnici su odobreni 🎉</p>
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Uloga</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {unapprovedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    color="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApprove(user)}
                    disabled={loading}
                  >
                    Odobri
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    disabled={loading}
                  >
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h3 className="mt-5">Odobreni korisnici</h3>
      {approvedUsers.length === 0 ? (
        <p>Trenutno nema odobrenih korisnika.</p>
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Uloga</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {approvedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    disabled={loading}
                  >
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Users;

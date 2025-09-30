import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "reactstrap";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Swal from "sweetalert2";
import BASE_URL from "../../api/baseUrl";
import globalStyles from "../../styles/GlobalStyles";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Greška prilikom učitavanja korisnika:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  // PAGINACIJA
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const allUsers = [...users];
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);
  const paginatedUsers = allUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  const [loading, setLoading] = useState(false);

  const onUserUpdated = async (updatedUser) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${updatedUser._id}`, {
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
      const res = await fetch(`${BASE_URL}/user/${userId}`, {
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
      const response = await fetch(`${BASE_URL}/user/${user._id}`, {
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
    const result = await Swal.fire({
      title: 'Da li ste sigurni?',
      text: 'Ova akcija je nepovratna. Korisnik će biti obrisan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Obriši',
      cancelButtonText: 'Odustani',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/user/${userId}`, {
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
    }
  };

  const unapprovedUsers = users?.filter((u) => !u.approved) || [];
  const approvedUsers = users?.filter((u) => u.approved) || [];

  return (
    <div>
      <h2 className="mb-4 text-center">Korisnici</h2>
      {loadingUsers ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Spinner color="primary" style={{ width: 60, height: 60, borderWidth: 6 }} />
        </div>
      ) : (
        <>
          <Table
            bordered
            hover
            responsive
            style={globalStyles.tableStyle}
          >
            <thead>
              <tr>
                <th style={globalStyles.tableHeader}>Korisničko ime</th>
                <th style={globalStyles.tableHeader}>Uloga</th>
                <th style={globalStyles.tableHeader}>Status</th>
                <th style={globalStyles.tableHeader}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center" style={{ fontSize: 18, color: '#888', padding: '32px 0' }}>
                    Nema korisnika
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user._id}
                    style={{
                      transition: 'background 0.2s',
                      borderRadius: currentPage === 1 && paginatedUsers[0]._id === user._id
                        ? '18px 18px 0 0'
                        : currentPage === totalPages && paginatedUsers[paginatedUsers.length - 1]._id === user._id
                        ? '0 0 18px 18px'
                        : 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#e1bee7')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...globalStyles.tableCell }}>{user.username}</td>
                    <td style={{ ...globalStyles.tableCell }}>{user.role}</td>
                    <td style={{ ...globalStyles.tableCell }}>
                      {user.approved ? (
                        <span style={{ color: '#2ecc40', fontWeight: 'bold', fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#eafaf1', boxShadow: '0 1px 4px #b2f7c1' }}>Odobren</span>
                      ) : (
                        <span style={{ color: '#FFA500', fontWeight: 'bold', fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#fffbe6', boxShadow: '0 1px 4px #ffe0a3' }}>Na čekanju</span>
                      )}
                    </td>
                    <td style={{ ...globalStyles.tableCell }}>
                      {!user.approved && (
                        <Button
                          color="success"
                          size="sm"
                          className="me-2"
                          style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #b2f7c1' }}
                          onClick={() => handleApprove(user)}
                          disabled={loading}
                        >
                          Odobri
                        </Button>
                      )}
                      <Button
                        color="danger"
                        size="sm"
                        style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #ffb2b2' }}
                        onClick={() => handleDelete(user._id)}
                        disabled={loading}
                      >
                        Obriši
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* PAGINACIJA */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Pagination size="md">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem active={currentPage === idx + 1} key={idx}>
                    <PaginationLink onClick={() => handlePageChange(idx + 1)}>{idx + 1}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;

import React from "react";
import { Table, Button } from "reactstrap";

const AdminReservations = ({ reservations, setReservations }) => {
  const handleApprove = (id) => {
    try {
      const updated = reservations.map((r) =>
        r._id === id ? { ...r, status: "approved" } : r
      );
      const res = updated.find((r) => r._id === id);
      console.log('Updated res', res)
      const response = fetch(`http://localhost:8000/reservation/${id}?status=approved`, {
        method: "PUT",
        credentials: "include",          // OBAVEZNO za cookie auth
        headers: { "Content-Type": "application/json" }
      });
      setReservations(updated);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = (id) => {
    try {
      const updated = reservations.map((r) =>
        r._id === id ? { ...r, status: "rejected" } : r
      );
      const res = updated.find((r) => r._id === id);
      console.log('Updated res', res)
      const response = fetch(`http://localhost:8000/reservation/${id}?status=rejected`, {
        method: "PUT",
        credentials: "include",          // OBAVEZNO za cookie auth
        headers: { "Content-Type": "application/json" }
      });
      setReservations(updated);
    } catch (error) {
      console.log(error);
    }
  };

  const tableStyle = {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #6C63FF 0%, #ACB6E5 100%)",
    color: "#fff",
    textAlign: "center",
  };

  const cellStyle = {
    textAlign: "center",
    verticalAlign: "middle",
  };

  const rowStyle = {
    background: "rgba(108, 99, 255, 0.1)", // blaga ljubičasto-plava nijansa
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Sve rezervacije</h2>
      <Table bordered hover responsive style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Korisnik</th>
            <th style={headerStyle}>Datum</th>
            <th style={headerStyle}>Mesto</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nema rezervacija
              </td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr key={res._id} style={rowStyle}>
                <td style={cellStyle}>{res.username}</td>
                <td style={cellStyle}>{res.date}</td>
                <td style={cellStyle}>{res.seat_number}</td>
                <td style={cellStyle}>
                  {res.status === "pending" && (
                    <span style={{ color: "#FFA500", fontWeight: "bold" }}>
                      Na čekanju
                    </span>
                  )}
                  {res.status === "approved" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Odobreno
                    </span>
                  )}
                  {res.status === "rejected" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Odbijeno
                    </span>
                  )}
                </td>
                <td style={cellStyle}>
                  {res.status === "pending" ? (
                    <>
                      <Button
                        color="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(res._id)}
                      >
                        Odobri
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleReject(res._id)}
                      >
                        Odbij
                      </Button>
                    </>
                  ) : (
                    <span>✔</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminReservations;

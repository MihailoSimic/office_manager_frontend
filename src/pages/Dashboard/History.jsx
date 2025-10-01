import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "reactstrap";
import Swal from "sweetalert2";
import { format } from "date-fns/format";
import BASE_URL from "../../api/baseUrl";
import globalStyles from "../../styles/GlobalStyles";
const History = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/reservation/my`, {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Da li ste sigurni?",
      text: "Ova akcija će otkazati vašu rezervaciju!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Da, otkaži!",
      cancelButtonText: "Ne, zadrži"
    });
    if (!result.isConfirmed) return;
    setCanceling(id);
    try {
      const response = await fetch(`${BASE_URL}/reservation/${id}?status=rejected`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        setReservations(reservations.map(r => r._id === id ? { ...r, status: "rejected" } : r));
        Swal.fire({
          icon: "success",
          title: "Rezervacija je otkazana!",
          showConfirmButton: false,
          timer: 1800
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Greška pri otkazivanju!",
          showConfirmButton: false,
          timer: 1800
        });
      }
    } finally {
      setCanceling("");
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <Spinner color="primary" style={{ width: 60, height: 60, borderWidth: 6 }} />
    </div>
  )

  return (
    <div>
      <h2 className="mb-4 text-center">Istorija rezervacija</h2>
      <Table bordered hover responsive style={globalStyles.tableStyle}>
        <thead>
          <tr>
            <th style={globalStyles.tableHeader}>Datum</th>
            <th style={globalStyles.tableHeader}>Mesto</th>
            <th style={globalStyles.tableHeader}>Status</th>
            <th style={globalStyles.tableHeader}>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center" style={{ fontSize: 18, color: '#888', padding: '32px 0' }}>
                Nema rezervacija
              </td>
            </tr>
          ) : (
            reservations.map(r => (
              <tr key={r._id}>
                <td style={globalStyles.tableCell}>{format(new Date(r.date), "dd.MM.yyyy.")}</td>
                <td style={globalStyles.tableCell}>{r.seat_number}</td>
                <td style={globalStyles.tableCell}>
                  {r.status === "pending" && (
                    <span style={{ color: "#FFA500", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#fffbe6', boxShadow: '0 1px 4px #ffe0a3' }}>
                      Na čekanju
                    </span>
                  )}
                  {r.status === "approved" && (
                    <span style={{ color: "#2ecc40", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#eafaf1', boxShadow: '0 1px 4px #b2f7c1' }}>
                      Odobreno
                    </span>
                  )}
                  {r.status === "rejected" && (
                    <span style={{ color: "#ff3b3b", fontWeight: "bold", fontSize: 15, padding: '4px 12px', borderRadius: 8, background: '#ffeaea', boxShadow: '0 1px 4px #ffb2b2' }}>
                      Odbijeno
                    </span>
                  )}
                </td>
                <td style={globalStyles.tableCell}>
                  {r.status === "pending" ? (
                    <Button
                      color="danger"
                      size="sm"
                      style={{ fontWeight: 600, letterSpacing: 0.5, boxShadow: '0 2px 8px #ffb2b2' }}
                      disabled={canceling === r._id}
                      onClick={() => handleCancel(r._id)}
                    >
                      {canceling === r._id ? <Spinner size="sm" /> : "Otkaži"}
                    </Button>
                  ) : (
                    <span style={{ fontSize: 18, color: '#2ecc40' }}>✔</span>
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

export default History;

import React, { useEffect, useState } from "react";
import { 
  Button,
  Table,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import Swal from "sweetalert2";
import { format } from "date-fns/format";
import { useNavigate } from "react-router-dom";
import TokenExpiredSwal from "../components/TokenExpiredSwal";
import BASE_URL from "../../api/baseUrl";
import globalStyles from "../../styles/GlobalStyles";
import TablePagination from "../components/TablePagination";
import StyledSpinner from "../components/StyledSpinner";
const History = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const paginatedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/reservation/my`, {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        if (response.status === 401) {
          TokenExpiredSwal();
          navigate("/");
          return;
        }
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

  if (loading) return <StyledSpinner />

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
          {paginatedReservations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center" style={{ fontSize: 18, color: '#888', padding: '32px 0' }}>
                Nema rezervacija
              </td>
            </tr>
          ) : (
            paginatedReservations.map(r => (
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
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default History;

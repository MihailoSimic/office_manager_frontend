import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import Logout from "../Dashboard/Logout";
// Ovde importuj komponente za admin sekcije:
import AdminReservations from "./AdminReservations";
import FirstPage from "./FirstPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [seats, setSeats] = useState([]);
  const [users, setUsers] = useState([]);

  const sidebarStyle = {
    width: "20%",
    background: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  };

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive ? "#6C63FF" : "rgba(255, 255, 255, 0.3)",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
  });

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
  };

  const contentStyle = {
    flex: 1,
    padding: "30px",
    color: "#333",
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:8000/reservation", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Greška prilikom učitavanja rezervacija:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Greška prilikom učitavanja novih korisnika:", error);
      }
    };

    const fetchSeats = async () => {
      try {
        const response = await fetch("http://localhost:8000/seat", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error("Greška prilikom učitavanja sedista:", error);
      }
    };

    fetchReservations();
    fetchUsers();
    fetchSeats();
  }, []);

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Admin Panel</h3>
        <Button style={buttonStyle(activeTab === "home")} onClick={() => setActiveTab("home")}>
          Početna strana
        </Button>
        <Button
          style={buttonStyle(activeTab === "reservations")}
          onClick={() => setActiveTab("reservations")}
        >
          Rezervacije
        </Button>
        <Button
          style={buttonStyle(activeTab === "newUsers")}
          onClick={() => setActiveTab("newUsers")}
        >
          Novi korisnici
        </Button>
        <Button
          style={buttonStyle(activeTab === "password")}
          onClick={() => setActiveTab("password")}
        >
          Promeni lozinku
        </Button>
        <Button
          style={buttonStyle(activeTab === "logout")}
          onClick={() => setActiveTab("logout")}
        >
          Izloguj se
        </Button>
      </div>

      {/* Glavni sadržaj */}
      <div style={contentStyle}>
        {activeTab === "home" && <FirstPage user={JSON.parse(localStorage.getItem("user"))}/>}
        {activeTab === "reservations" && (
          <AdminReservations 
            reservations={reservations}
            setReservations={setReservations}
            seats={seats}
            setSeats={setSeats}
            users={users}
            setUsers={setUsers}
          />
        )}
        {activeTab === "newUsers" && (
          <div>Ovde će ići forma za nove korisnike</div>
        )}
        {activeTab === "password" && <div>Ovde će ići forma za promenu lozinke</div>}
        {activeTab === "logout" && <Logout activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
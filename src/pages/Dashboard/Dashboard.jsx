import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import Logout from "./Logout";
import FirstPage from "../components/FirstPage";
import Reservation from "./Reservation";
import ChangePassword from "../components/ChangePassword";
import BASE_URL from "../../api/baseUrl";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const sidebarStyle = {
    width: "20%",
    background: "rgba(0, 0, 0, 0.4)", // tamniji, proziran
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
      const fetchSeats = async () => {
        try {
          const response = await fetch(`${BASE_URL}/seat`, {
            method: "GET",
            credentials: "include" // zbog httpOnly cookie
          });
          const data = await response.json();
          setSeats(data);
        } catch (error) {
          console.error("Greška prilikom učitavanja sedista:", error);
        }
      };
      const fetchReservations = async () => {
        try {
          const response = await fetch(`${BASE_URL}/reservation`, {
            method: "GET",
            credentials: "include" // zbog httpOnly cookie
          });
          const data = await response.json();
          setReservations(data);
        } catch (error) {
          console.error("Greška prilikom učitavanja sedista:", error);
        }
      }
      fetchReservations();
      fetchSeats();
    }, []);
  

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Office Manager</h3>
        <Button style={buttonStyle(activeTab === "home")} onClick={() => setActiveTab("home")}>
          Početna strana
        </Button>
        <Button style={buttonStyle(activeTab === "reserve")} disabled = {!user?.approved} onClick={() => setActiveTab("reserve")}>
          Rezerviši mesto
        </Button>
        <Button style={buttonStyle(activeTab === "password")} disabled = {!user?.approved} onClick={() => setActiveTab("password")}>
          Promeni lozinku
        </Button>
        <Button style={buttonStyle(activeTab === "logout")} onClick={() => setActiveTab("logout")}>
          Izloguj se
        </Button>
      </div>

      {/* Glavni sadržaj */}
      <div style={contentStyle}>
        {activeTab === "home" && <FirstPage user={JSON.parse(localStorage.getItem("user"))}/>}
        {activeTab === "reserve" && (
          <Reservation 
            seats={seats}
            setSeats={setSeats}
            reservations={reservations}
            setReservations={setReservations}>
              Ovde će ići forma za rezervaciju mesta
          </Reservation>
          )
        }
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "logout" && <Logout activeTab={activeTab} setActiveTab={setActiveTab}/>}
      </div>
    </div>
  );
};

export default Dashboard;
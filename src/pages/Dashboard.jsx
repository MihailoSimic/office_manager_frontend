import React, { useState } from "react";
import { Button } from "reactstrap";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("reserve");

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

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Office Manager</h3>
        <Button style={buttonStyle(activeTab === "reserve")} onClick={() => setActiveTab("reserve")}>
          Rezerviši mesto
        </Button>
        <Button style={buttonStyle(activeTab === "password")} onClick={() => setActiveTab("password")}>
          Promeni lozinku
        </Button>
        <Button style={buttonStyle(activeTab === "logout")} onClick={() => setActiveTab("logout")}>
          Izloguj se
        </Button>
      </div>

      {/* Glavni sadržaj */}
      <div style={contentStyle}>
        {activeTab === "reserve" && <div>Ovde će ići forma za rezervaciju mesta</div>}
        {activeTab === "profile" && <div>Ovde će ići detalji korisnika i forma za edit profil</div>}
        {activeTab === "password" && <div>Ovde će ići forma za promenu lozinke</div>}
        {activeTab === "logout" && <div>Ovde će ići forma za izlogovanje</div>}
      </div>
    </div>
  );
};

export default Dashboard;
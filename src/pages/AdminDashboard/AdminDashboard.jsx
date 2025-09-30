import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import Logout from "../Dashboard/Logout";
import AdminReservations from "./AdminReservations";
import Users from "./Users";
import OfficeEditor from "./OfficeEditor";

import FirstPage from "../components/FirstPage";
import ChangePassword from "../components/ChangePassword";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("reservations")
  const user = JSON.parse(localStorage.getItem("user"))
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

  return (
    <div style={containerStyle}>
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
          Korisnici
        </Button>
        <Button
          style={buttonStyle(activeTab === "office")}
          onClick={() => setActiveTab("office")}
        >
          Izmeni raspored sedenja
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

      <div style={contentStyle}>
        {activeTab === "home" && <FirstPage user={JSON.parse(localStorage.getItem("user"))}/>}
        {activeTab === "reservations" && <AdminReservations />}
        {activeTab === "newUsers" && <Users />}
        {activeTab === "office" && <OfficeEditor />}
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "logout" && <Logout activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}


export default AdminDashboard;
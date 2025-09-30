import React from "react";
import { Button, Row, Col, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import globalStyles from "../../styles/GlobalStyles";

function Logout({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:8000/user/logout", {
      method: "POST",
      credentials: "include"
    });

    localStorage.removeItem("user");
    navigate("/login");
    
  } catch (err) {
    console.error("Logout nije uspeo", err);
  }
};

  const handleCancel = () => {
    setActiveTab("home");
  };

  return (
    <div style={globalStyles.container}>
      <Row className="w-100 justify-content-center">
        <Col xs="12" sm="10" md="8" lg="6">
          <Alert color="warning" style={{ textAlign: "center", padding: "30px" }}>
            <div style={{ marginBottom: "20px", fontSize: "1.2rem" }}>
              Da li ste sigurni da želite da se izlogujete?
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              <Button color="danger" onClick={handleLogout} style={{ minWidth: "100px", padding: "10px 20px" }}>
                Da
              </Button>
              <Button color="secondary" onClick={handleCancel} style={{ minWidth: "100px", padding: "10px 20px" }}>
                Ne
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </div>
  );
}

export default Logout;
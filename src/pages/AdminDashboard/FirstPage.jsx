import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import globalStyles from "../../styles/GlobalStyles";

function FirstPage({ user }) {
  return (
    <div style={{ ...globalStyles.container, padding: "40px" }}>
      <Row className="justify-content-center">
        <Col xs="12" md="10" lg="8">
          <Card 
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.1)", // polu-transparentno
              border: "none", 
              backdropFilter: "blur(8px)", 
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <CardBody>
              <CardTitle tag="h2" className="text-center mb-4" style={{ color: "#333" }}>
                Dobrodošli, {user.username}!
              </CardTitle>
              <CardText className="text-center mb-4" style={{ color: "#555" }}>
                Drago nam je što koristite Office Seat Manager.
              </CardText>
              <CardText style={{ color: "#444", fontSize: "1.1rem" }}>
                <strong>Korisničko ime:</strong> {user.username} <br/>
                <strong>Uloga:</strong> {user.role} <br/>
                <strong>Odobren: {user.approved ? "Da" : "Ne"} </strong>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FirstPage;
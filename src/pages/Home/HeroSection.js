import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

const HeroSection = () => {
  return (
    <Container fluid className="hero-section">
      <Container>
        <Row className="justify-content-center">
          <Col sm={12} md={10} lg={8}>
            <h1 className="hero-heading fw-normal text-center pinot-font">
              Create. Inspire. Mentor.
            </h1>
            <p className="lead">
              A digital art space for creators who learn, share and grow
              together
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="primary" className="rounded-pill px-5">
                Explore Art
              </Button>
              <Button variant="secondary" className="rounded-pill px-5">
                Browse Tutorials Art
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default HeroSection;

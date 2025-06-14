import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "../../styles/FeaturedContent.module.css";
import design from "../../styles/UniversalDesign.module.css";

const FeaturedContent = () => {
  return (
    <Container fluid className={`${styles.FeaturedBorderTop}`}>
      <Container className="my-4 py-4">
        <h2 className={`${styles.FeaturedHeading}`}>Featured This Week</h2>
        <Row className="g-4 justify-content-center">
          {/* Card 1 */}
          <Col sm={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="/images/11.png" // Replace with your own image
                alt="Digital Collage artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  Digital Collage Magic
                </Card.Title>
                <Card.Text className="mt-auto text-center">
                  Learn how to blend textures, colors, and photos to create
                  stunning digital collages using Photoshop layers and masks.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="/images/10.png"
                alt="Lighting Effects artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  Lighting Effects in Portrait Art
                </Card.Title>
                <Card.Text className="mt-auto text-center">
                  Explore how lighting can transform your digital portraits with
                  simple brush techniques and layer modes.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="/images/13.png"
                alt="Environment Design artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  Environment Design for Games
                </Card.Title>
                <Card.Text className="mt-auto text-center">
                  See how concept artists block out game worlds with mood,
                  atmosphere, and visual storytelling.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default FeaturedContent;

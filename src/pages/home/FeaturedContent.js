import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import astronaut from "../../assets/astronaut.webp";
import lady from "../../assets/lady-in-the-clouds.webp";
import tree from "../../assets/tree-of-music-notes.webp";
import styles from "../../styles/FeaturedContent.module.css";

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
                src={lady}
                alt="Fantasy lady in the clouds artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  Dreams in the Sky
                </Card.Title>
                <Card.Text
                  className={`${styles.FeatureCardText} mt-3 text-center`}
                >
                  Transform everyday skies into surreal portraits with
                  Photoshop's blending modes, layer masks, and soft brushes. By
                  shaping cloud textures into human features, this piece
                  captures the serenity of imagination floating weightlessly
                  above the world.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={astronaut}
                alt="Fantasy astronaut artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  Cosmic Explorer
                </Card.Title>
                <Card.Text
                  className={`${styles.FeatureCardText} mt-3 text-center`}
                >
                  Bring outer space to life with Photoshop's masking tools,
                  gradient overlays, and particle brushes. By blending vibrant
                  nebula textures with a splash of liquid effects, this artwork
                  transforms a lone astronaut into a surreal journey through
                  color and imagination.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={tree}
                alt="Tree made of musical notes artwork"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className={`${styles.FeatureCardTitle} mb-5 text-center`}
                >
                  The Symphony Tree
                </Card.Title>
                <Card.Text
                  className={`${styles.FeatureCardText} mt-3 text-center`}
                >
                  Discover how blending custom brushes, clipping masks, and
                  layer styles in Photoshop can turn a simple silhouette into a
                  vibrant explosion of creativity. By combining colorful
                  gradients with scattered musical note shapes, this artwork
                  transforms a tree into a living symphony of sound and color.
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

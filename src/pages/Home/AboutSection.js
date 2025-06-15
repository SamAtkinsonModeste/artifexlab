import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import styles from "../../styles/AboutSection.module.css";
import design from "../../styles/UniversalDesign.module.css";

const AboutSection = () => {
  return (
    <Container fluid className={`${styles.AboutBg}`}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col sm={12} md={10} lg={8} className="d-flex justify-content-center">
            <h2 className={`${styles.About} text-center`}>About</h2>
            <p className={`${design.textWhiteLight} text-center`}>
              <span className={`${design.ArtifexLab}`}>ArtifexLab</span> is a
              digital space built for creators who express themselves through
              visual art, design, and digital storytelling. Whether you're a
              Photoshop artist, animator, or concept designer, this platform is
              your creative home.
            </p>
            <p className={`${design.textWhiteLight} text-center`}>
              Share your work, discover inspiring projects from other artists,
              and learn new skills through guided tutorials. ArtifexLab is a
              place to create, inspire others, and grow together as a creative
              community.
            </p>
            <blockquote className={`${design.ArtifexLabQuote} text-center`}>
              <p className="mb-0">“Every brushstroke is a step forward.</p>
              <p className="mb-0">Every tutorial, a shared spark.”</p>
              <span className={`${design.ArtifexLab}`}> — ArtifexLab</span>
            </blockquote>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AboutSection;

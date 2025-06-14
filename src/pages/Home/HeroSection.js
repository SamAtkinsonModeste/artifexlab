import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import styles from "../../styles/Hero.module.css";
import design from "../../styles/UniversalDesign.module.css";
import btnStyle from "../../styles/Button.module.css";

const HeroSection = () => {
  return (
    <Container
      fluid
      className={`${styles.bgHeroImage} ${styles.HeroBottomBorder}`}
    >
      <Container>
        <Row className="justify-content-center">
          <Col sm={12} md={10} lg={8}>
            <h1 className={`${design.TaglineBlack} text-center mt-3`}>
              Create. Inspire. Mentor.
            </h1>
            <p className={`${styles.Lead} text-center`}>
              A digital art space for creators who learn, share and grow
              together
            </p>
            <div className="d-flex flex-column justify-content-center gap-3 my-4">
              <Button className={`${btnStyle.CallOutArt} rounded-pill`}>
                &larr; &nbsp; Explore Art
              </Button>
              <Button className={`${btnStyle.CallOutTutorial} rounded-pill`}>
                Browse Tutorials Art &nbsp; &rarr;
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default HeroSection;

import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import styles from "../../styles/Hero.module.css";
import design from "../../styles/UniversalDesign.module.css";
import btnStyle from "../../styles/Button.module.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <Container
      fluid
      className={`${styles.bgHeroImage} ${styles.HeroBottomBorder} ${styles.bgHeroImageBig}`}
    >
      <Container>
        <Row className="justify-content-center">
          <Col sm={12} md={10} lg={8} xxl={12}>
            <h1
              className={`${design.TaglineBlack} text-center mt-3 mt-lg-4 mt-xlg-5`}
            >
              Create. Inspire. Mentor.
            </h1>
            <p className={`${styles.Lead} text-center`}>
              A digital art space for creators who learn, share and grow
              together
            </p>

            <div className="d-flex flex-column flex-md-row justify-content-center gap-3 gap-md-5 my-4 my-lg-5">
              <Button
                as={Link}
                to="/artworks"
                aria-label="Go to Artworks"
                className={`${styles.CallOutArt} ${btnStyle.Button} ${btnStyle.Wide} rounded-pill`}
              >
                &larr; &nbsp; Explore Art
              </Button>
              <Button
                as={Link}
                to="/tutorials"
                aria-label="Go to Tutorials"
                className={`${styles.CallOutTutorial} ${btnStyle.Button} ${btnStyle.Wide}  rounded-pill`}
              >
                Browse Tutorials &nbsp; &rarr;
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default HeroSection;

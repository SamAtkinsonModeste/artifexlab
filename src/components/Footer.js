import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "../styles/Footer.module.css";
import Design from "../styles/UniversalDesign.module.css";

const Footer = () => {
  return (
    <Container fluid className={` ${styles.Footer}`}>
      <Container className="mt-auto text-center py-2">
        <p className={`mb-1 fst-italic ${Design.TaglineSmall}`}>
          “Create. Inspire. Mentor.”
        </p>
        <div className="d-flex justify-content-center gap-3 my-3">
          <span className={styles.FooterSocialIcons}>
            <Nav.Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <i className="fab fa-instagram"></i>
            </Nav.Link>
          </span>
          <span className={styles.FooterSocialIcons}>
            <Nav.Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon facebook"
            >
              <i className="fab fa-facebook"></i>
            </Nav.Link>
          </span>
          <span className={styles.FooterSocialIcons}>
            <Nav.Link
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon twitter"
            >
              <i className="fab fa-x-twitter"></i>
            </Nav.Link>
          </span>
        </div>

        <small className={`${styles.FooterCopySmall}`}>
          © 2025 ArtifexLab. All rights reserved.
        </small>
      </Container>
    </Container>
  );
};

export default Footer;

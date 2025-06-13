import React from "react";
import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <Container fluid className="main-footer">
      <Container className="mt-auto border-top text-center py-3">
        <p className="mb-1 fst-italic">“Create. Inspire. Mentor.”</p>

        <small>© 2025 ArtifexLab. All rights reserved.</small>
      </Container>
    </Container>
  );
};

export default Footer;

import React from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import styles from "../styles/NotFound.module.css";
import baseStyles from "../App.module.css";

import eye from "../assets/art-of-eye.webp";
import pageNotFound from "../assets/page-not-found.png";
import Asset from "./Asset";

const PageNotFound = () => {
  return (
    <Container className={styles.NotFoundWrapper}>
      <div className={styles.Canvas}>
        <div
          className={`d-flex justify-content-center align-items-center ${styles.EyeContainer}`}
        >
          <Image
            className={baseStyles.FillerImage}
            src={eye}
            alt="Eye artwork"
          />
        </div>
        <div className={`d-flex flex-column ${styles.NotFound}`}>
          <Asset
            src={pageNotFound}
            message="Sorry, the page you're looking for doesn't exist"
          />
        </div>
      </div>
    </Container>
  );
};

export default PageNotFound;

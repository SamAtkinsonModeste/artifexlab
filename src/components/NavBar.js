import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/artifexLab-logo.svg";
import styles from "../styles/NavBar.module.css";
import Design from "../styles/Design.module.css";

const NavBar = () => {
  return (
    <Navbar expand="md" className="w-sm-80 px-3 w-md-100">
      <Container fluid>
        <div>
          <Navbar.Brand>
            <img
              src={logo}
              alt="ArtifexLab Logo"
              className={styles.NavbarLogo}
              height="60"
            />
          </Navbar.Brand>
        </div>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className={`${Design.bgMainGradient} ${Design.textWhiteLight}`}
        />

        <Navbar.Collapse id="navbar-nav" className="mt-2">
          <Nav className={`${styles.NavLab}  ms-auto rounded ps-3`}>
            <NavDropdown
              title={
                <div className="bg-primary rounded-circle p-1 d-inline-block">
                  <img
                    src="/default_profile.jpg"
                    alt="User avatar"
                    className="rounded-circle mb-md-3"
                    width="40"
                    height="40"
                  />
                </div>
              }
              id="user-nav-dropdown"
              className={`order-0 order-md-5 ${styles.NavFade} ${styles.DelayOne} ${Design.bgWhiteBase} w-75`}
            >
              <NavDropdown.Item>My Profile</NavDropdown.Item>
              <NavDropdown.Item>Edit Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Sign Out</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              className={`order-1 order-md-0 ${styles.NavFade} ${styles.delay2} `}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className={`order-2 order-md-1 ${styles.NavFade} ${styles.delay3} `}
            >
              Artworks
            </Nav.Link>

            <NavDropdown
              title="Tutorials"
              id="tutorials-nav-dropdown"
              className={`order-3 order-md-2 ${styles.NavFade} ${styles.delay4}  w-75`}
            >
              <NavDropdown.Item>View Tutorials</NavDropdown.Item>
              <NavDropdown.Item>Tutorial Attempts</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              className={`order-4 order-md-3 ${styles.NavFade} ${styles.delay5}`}
            >
              Feed
            </Nav.Link>

            <NavDropdown
              title="Create"
              id="create-nav-dropdown"
              className={`order-5 order-md-4 ${styles.NavFade} ${styles.delay6}  pe-md-5 w-75`}
            >
              <NavDropdown.Item>Upload Artwork</NavDropdown.Item>
              <NavDropdown.Item>Create a Tutorial</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import logo from "../assets/artifexLab-logo.svg";
import styles from "../styles/NavBar.module.css";
import Design from "../styles/Design.module.css";

const NavBar = () => {
  return (
    <Navbar expand="lg" className="w-sm-80 px-3 w-md-100">
      <Container fluid>
        <Navbar.Brand>
          <img
            src={logo}
            alt="ArtifexLab Logo"
            className={styles.NavbarLogo}
            height="60"
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          className={`${Design.bgMainGradient} ${Design.textWhiteLight}`}
        />

        <Navbar.Collapse id="navbar-nav" className="mt-2">
          <Nav className={`${styles.NavLab} ms-auto rounded ps-3`}>
            {/* Home */}
            <NavLink
              to="/"
              className={`order-1 order-md-0 ${styles.NavLink} ${styles.NavFade} ${styles.delay2} activeClassName=${styles.Active}`}
            >
              Home
            </NavLink>

            {/* Artworks */}
            <NavLink
              to="/artworks"
              className={`order-2 order-md-1 ${styles.NavLink} ${styles.NavFade} ${styles.delay3} activeClassName=${styles.Active}`}
            >
              Artworks
            </NavLink>

            {/* Tutorials */}
            <NavDropdown
              title={<span className={styles.NavLink}>Tutorials</span>}
              id="tutorials-nav-dropdown"
              className={`order-3 order-md-2 ${styles.NavFade} ${styles.delay4} w-50`}
            >
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/view-tutorials"
              >
                View Tutorials
              </NavDropdown.Item>
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/tutorial-results"
              >
                Tutorial Results
              </NavDropdown.Item>
            </NavDropdown>

            {/* Feed */}
            <NavLink
              to="/feed"
              className={`order-4 order-md-3 ${styles.NavLink} ${styles.NavFade} ${styles.delay5} activeClassName=${styles.Active}`}
            >
              Feed
            </NavLink>

            {/* Create - this will be hidden for logged-out users later */}
            <NavDropdown
              title={<span className={styles.NavLink}>Create</span>}
              id="create-nav-dropdown"
              className={`order-5 order-md-4  ${styles.NavFade} ${styles.delay6}   w-50`}
            >
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/upload-artwork"
              >
                Upload Artwork
              </NavDropdown.Item>
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/create-tutorials"
              >
                Create a Tutorial
              </NavDropdown.Item>
            </NavDropdown>

            {/* Sign In */}
            <NavLink
              to="/signin"
              className={` order-6 order-md-5 ps-md-4 ${styles.NavLink} ${styles.NavFade} ${styles.delay7} text-nowrap`}
            >
              Sign In
            </NavLink>

            {/* Register */}
            <NavLink
              to="/register"
              className={`order-7 order-md-6 ${styles.NavLink} ${styles.NavFade} ${styles.delay8}`}
            >
              Register
            </NavLink>

            {/* User dropdown - this will be hidden for logged-out users later */}
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
              className={`order-6 order-md-5  ${styles.NavFade} ${styles.DelayOne} ${Design.bgWhiteBase} w-75`}
            >
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/profile"
              >
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/edit-profile"
              >
                Edit Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                className={`${styles.NavLink} activeClassName=${styles.Active} `}
                as={NavLink}
                to="/signin"
              >
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

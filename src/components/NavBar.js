import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import logo from "../assets/artifexLab-logo.svg";
import styles from "../styles/NavBar.module.css";
import Design from "../styles/Design.module.css";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import Avatar from "./Avatar";

// import Avatar from "./Avatar";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [expanded, setExpanded] = useState();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  const loggedInIcons = (
    <>
      {/* Feed */}
      <NavLink
        to="/feed"
        className={`order-5 order-md-3 ${styles.NavLink} ${styles.NavFade} ${styles.delay4} activeClassName=${styles.Active}`}
        onClick={handleLinkClick}
      >
        <span className={styles.NavBarIcons}>
          <i className="fas fa-stream"></i>
        </span>
        Feed
      </NavLink>

      {/* Tutorial Results */}
      <NavLink
        to="/tutorial-results"
        className={`order-5 order-md-4 text-nowrap ${styles.NavLink} ${styles.NavFade} ${styles.delay5} activeClassName=${styles.Active}`}
        onClick={handleLinkClick}
      >
        <span className={styles.NavBarIcons}>
          <i className="fas fa-clipboard-check"></i>
        </span>{" "}
        Tutorial Results
      </NavLink>

      {/* Create Dropdown */}
      <NavDropdown
        title={
          <>
            <span className={styles.NavBarIcons}>
              <i className="fas fa-plus"></i>
            </span>{" "}
            <span className={styles.NavLink}>Create</span>
          </>
        }
        id="create-nav-dropdown"
        className={`order-5 order-md-5 ${styles.NavFade} ${styles.delay6} ${styles.Dropdown}`}
      >
        <NavDropdown.Item
          className={`${styles.NavLink} ${styles.Dropdown} activeClassName=${styles.Active}`}
          as={NavLink}
          onClick={handleLinkClick}
          to="/upload-artwork"
        >
          <span className={styles.NavBarIcons}>
            <i className="fas fa-paint-brush"></i>
          </span>
          Upload Artwork
        </NavDropdown.Item>

        <NavDropdown.Item
          className={`${styles.NavLink} activeClassName=${styles.Active} ${styles.Dropdown}`}
          as={NavLink}
          onClick={handleLinkClick}
          to="/create-tutorials"
        >
          <span className={styles.NavBarIcons}>
            <i className="fas fa-file-alt"></i>
          </span>
          Create a Tutorial
        </NavDropdown.Item>
      </NavDropdown>

      {/* User Dropdown */}
      <Nav.Item
        className={`order-0 order-md-6 order-lg-6 ${styles.ProfileNav}`}
      >
        <NavDropdown
          title={
            <div
              className={styles.NavAvatarWrap}
              style={{ position: "relative" }}
            >
              <div className={styles.AvatarContainer}>
                <Avatar
                  src={currentUser?.profile_image}
                  text="Profile"
                  height={40}
                />
                <i
                  className={`fas fa-circle-notch ${styles.NavAvatarStatus}${styles.Dropdown}`}
                ></i>
              </div>
            </div>
          }
          id="user-nav-dropdown"
          className={`${styles.NavFade} ${styles.DelayOne} ${Design.bgWhiteBase}`}
        >
          <NavDropdown.Item
            className={`${styles.NavLink} activeClassName=${styles.Active} ${styles.Dropdown}`}
            as={NavLink}
            onClick={handleLinkClick}
            to={`/profiles/${currentUser?.profile_id}`}
          >
            My Profile
          </NavDropdown.Item>
          <NavDropdown.Item
            className={`${styles.NavLink} activeClassName=${styles.Active} ${styles.Dropdown}`}
            as={NavLink}
            onClick={handleLinkClick}
            to={`/profiles/${currentUser?.profile_id}`}
          >
            Edit Profile
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            className={`${styles.NavLink} activeClassName=${styles.Active} ${styles.ActiveSignOut}`}
            as={NavLink}
            onClick={handleSignOut}
            to="/"
          >
            Sign Out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav.Item>
    </>
  );

  const loggedOutIcons = (
    <>
      {/* Sign In */}
      <NavLink
        to="/signin"
        className={`order-4 order-md-3 ps-md-4 ${styles.NavLink} ${styles.NavFade} ${styles.delay7} text-nowrap`}
        onClick={handleLinkClick}
      >
        <span className={`${styles.NavBarIcons} me-2`}>
          <i className="fas fa-right-to-bracket"></i>
        </span>
        Sign In
      </NavLink>

      {/* Sign Up */}
      <NavLink
        to="/signup"
        className={`order-5 order-md-4 text-nowrap ${styles.NavLink} ${styles.NavFade} ${styles.delay8}`}
        onClick={handleLinkClick}
      >
        <span className={`${styles.NavBarIcons} me-2`}>
          <i className="fas fa-id-badge"></i>
        </span>
        Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className="w-sm-80 px-3 w-md-100"
    >
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
              className={`order-1 order-md-0 ${styles.NavLink} ${styles.NavFade} ${styles.delay1} activeClassName=${styles.Active}`}
              onClick={handleLinkClick}
            >
              Home
            </NavLink>

            {/* Artworks */}
            <NavLink
              to="/artworks"
              className={`order-3 order-md-1 ${styles.NavLink} ${styles.NavFade} ${styles.delay2} activeClassName=${styles.Active}`}
              onClick={handleLinkClick}
            >
              Artworks
            </NavLink>

            {/* View Tutorials */}
            <NavLink
              to="/tutorials"
              className={`order-4 order-md-2 text-nowrap ${styles.NavLink} ${styles.NavFade} ${styles.delay3} activeClassName=${styles.Active}`}
              onClick={handleLinkClick}
            >
              View Tutorials
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/artifexLab-logo.svg";
import styles from "../styles/NavBar.module.css";
import Design from "../styles/UniversalDesign.module.css";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import Avatar from "./Avatar";
import { removeTokenTimestamp } from "../utils/utils";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const navClass =
    (base) =>
    ({ isActive }) =>
      `${base} ${isActive ? styles.Active : styles.NavLink}`;

  const isCreateActive =
    location.pathname.startsWith("/artworks/create") ||
    location.pathname.startsWith("/tutorials/create");

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
      removeTokenTimestamp();
    }
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  const loggedInIcons = (
    <>
      {/* Create Dropdown */}
      <NavDropdown
        id="create-nav-dropdown"
        title={
          <>
            <span className={`${styles.NavBarIcons} ${styles.NavBarCreate}`}>
              <i className="fas fa-plus"></i>
            </span>{" "}
            <span
              className={`${styles.NavLink} ${
                isCreateActive ? styles.Active : ""
              }`}
            >
              Create
            </span>
          </>
        }
        className={`${styles.NavFade} ${styles.delay4} ${styles.Dropdown}`}
      >
        <NavDropdown.Item
          id="uploadArt"
          as={NavLink}
          to="/artworks/create"
          onClick={handleLinkClick}
          className={navClass(`${styles.NavLink} ${styles.Dropdown} `)}
        >
          <span className={styles.NavBarIcons}>
            <i className="fas fa-paint-brush"></i>
          </span>
          Upload Artwork
        </NavDropdown.Item>

        <NavDropdown.Item
          as={NavLink}
          to="/tutorials/create"
          onClick={handleLinkClick}
          className={navClass(`${styles.NavLink} ${styles.Dropdown}`)}
        >
          <span className={styles.NavBarIcons}>
            <i className="fas fa-file-alt"></i>
          </span>
          Create a Tutorial
        </NavDropdown.Item>
      </NavDropdown>

      {/* User Dropdown */}
      <Nav.Item className={`${styles.ProfileNav}`}>
        <NavDropdown
          id="user-nav-dropdown"
          title={
            <div
              className={styles.NavAvatarWrap}
              style={{ position: "relative" }}
            >
              <div className={styles.AvatarContainer}>
                <Avatar src={currentUser?.profile_image} height={40} />
                <i
                  className={`fas fa-circle-notch ${styles.NavAvatarStatus} ${styles.Dropdown}`}
                ></i>
              </div>
              <span className="visually-hidden">Profile menu</span>
            </div>
          }
          className={`${styles.NavFade} ${styles.delay5} ${Design.bgWhiteBase}`}
        >
          <NavDropdown.Item
            as={NavLink}
            end
            to={`/profiles/${currentUser?.profile_id}`}
            onClick={handleLinkClick}
            className={navClass(
              `${styles.NavLink} ${styles.Dropdown} ${styles.NavProfile}`
            )}
          >
            My Profile
          </NavDropdown.Item>

          <NavDropdown.Item
            as={NavLink}
            to={`/profiles/${currentUser?.profile_id}/edit`}
            onClick={handleLinkClick}
            className={navClass(`${styles.NavLink} ${styles.Dropdown}`)}
          >
            Edit Profile
          </NavDropdown.Item>

          <NavDropdown.Divider />

          {/* Sign Out: special styling */}
          <NavDropdown.Item
            as={NavLink}
            to="/"
            onClick={handleSignOut}
            className={`${styles.NavLink} ${styles.ActiveSignOut}`}
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
        onClick={handleLinkClick}
        className={navClass(
          `${styles.NavLink} ${styles.NavFade} ${styles.delay4} text-nowrap`
        )}
      >
        <span className={`${styles.NavBarIcons} me-2`}>
          <i className="fas fa-right-to-bracket"></i>
        </span>
        Sign In
      </NavLink>

      {/* Sign Up */}
      <NavLink
        to="/signup"
        onClick={handleLinkClick}
        className={navClass(
          `text-nowrap ${styles.NavLink} ${styles.NavFade} ${styles.delay5}`
        )}
      >
        <span className={`${styles.NavBarIcons} me-2`}>
          <i className="fas fa-id-badge"></i>
        </span>
        Sign Up
      </NavLink>
    </>
  );

  return (
    <Container fluid className={styles.NavContainer}>
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className="align-content-center"
      >
        <Navbar.Brand>
          <img src={logo} alt="ArtifexLab Logo" className={styles.NavbarLogo} />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          className={`${Design.bgMainGradient} ${Design.textWhiteLight} ms-auto`}
        />

        <Navbar.Collapse id="navbar-nav" className="mt-2">
          <Nav className={`${styles.NavLab} ms-auto rounded ps-3`}>
            {/* Home */}
            <NavLink
              to="/"
              end
              onClick={handleLinkClick}
              className={navClass(`${styles.NavFade} ${styles.delay1}`)}
            >
              Home
            </NavLink>

            {/* Artworks */}
            <NavLink
              to="/artworks"
              end
              onClick={handleLinkClick}
              className={navClass(`${styles.NavFade} ${styles.delay2}`)}
            >
              Artworks
            </NavLink>

            {/* View Tutorials */}
            <NavLink
              to="/tutorials"
              end
              onClick={handleLinkClick}
              className={navClass(
                `text-nowrap ${styles.NavFade} ${styles.delay3}`
              )}
            >
              Tutorials
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default NavBar;

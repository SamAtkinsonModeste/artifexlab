import React, { useState } from "react";
import styles from "../../styles/Artwork.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import Tooltip from "react-bootstrap/Tooltip";
import Avatar from "../../components/Avatar";
import FieldAlerts from "../../components/FieldAlerts";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { Link, useNavigate } from "react-router-dom";

const Tutorial = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    tutorial_comments_count,
    tutorial_likes_count,
    tutorial_liked_id,
    title,
    description,
    preview_art,
    updated_at,
    tutorialPage,
    setTutorials,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = props.is_owner;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const updateTutorialState = (updater) => {
    if (typeof setTutorials === "function") {
      setTutorials((prev) => ({
        ...prev,
        results: prev.results.map((t) => (t.id === id ? updater(t) : t)),
      }));
    } else if (typeof props.setTutorial === "function") {
      props.setTutorial((prev) => updater(prev));
    }
    // else: no-op (component used without state setters)
  };

  const handleEdit = () => {
    navigate(`/tutorials/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tutorials/${id}/`);
      navigate("/tutorials");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/tutorial-likes/", {
        tutorial: id,
      });
      updateTutorialState((t) => ({
        ...t,
        tutorial_likes_count: (t.tutorial_likes_count || 0) + 1,
        tutorial_liked_id: data.id,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/tutorial-likes/${tutorial_liked_id}/`);
      updateTutorialState((t) => ({
        ...t,
        tutorial_likes_count: Math.max(0, (t.tutorial_likes_count || 0) - 1),
        tutorial_liked_id: null,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Card className={styles.Artwork}>
      <Card.Body>
        {showDeleteConfirm && (
          <div className="px-3 pb-3">
            <FieldAlerts
              messages={["Delete this tutorial? This cannot be undone."]}
            />
            <div className="d-grid gap-2 d-sm-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-primary rounded-pill"
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await axiosRes.delete(`/tutorials/${id}/`);
                    if (tutorialPage) {
                      // On detail page → go back to list
                      navigate("/tutorials");
                    } else if (typeof setTutorials === "function") {
                      // On list page → remove this card
                      setTutorials((prev) => ({
                        ...prev,
                        results: prev.results.filter((t) => t.id !== id),
                      }));
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setDeleting(false);
                    setShowDeleteConfirm(false);
                  }
                }}
                disabled={deleting}
                aria-label="Confirm delete tutorial"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>

              <button
                type="button"
                className="btn btn-secondary rounded-pill"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                aria-label="Cancel delete tutorial"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <Row className="align-items-center justify-content-between">
          <Link
            className={uniStyles.ProfileLink}
            to={`/profiles/${profile_id}`}
          >
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span className={` ${uniStyles.ArtUpdate} textDarkBlue`}>
              {updated_at}
            </span>
            {is_owner && tutorialPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={() => setShowDeleteConfirm(true)}
              />
            )}
          </div>
        </Row>
      </Card.Body>
      <Col
        xs={12}
        className={`${uniStyles.BorderPeach} d-flex flex-column gap-2`}
      >
        {title && (
          <Card.Title className={`${styles.ArtworkTitles} text-center`}>
            {props.condensed ? (
              <Link to={`/tutorials/${id}`}>{title}</Link>
            ) : (
              title
            )}
          </Card.Title>
        )}

        {preview_art &&
          (props.condensed ? (
            <Link to={`/tutorials/${id}`} className="d-block">
              <div
                className="rounded overflow-hidden mx-auto"
                style={{
                  width: 220,
                  height: 140,
                  maxWidth: "100%",
                }}
              >
                <img
                  src={preview_art}
                  alt={title || "Tutorial image"}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </Link>
          ) : (
            /**NOTE - DETAIL VIEW: no constraints, just responsive  */
            <Link to={`/tutorials/${id}`} className="d-block">
              <img
                src={preview_art}
                alt={title || "Tutorial image"}
                className="img-fluid rounded"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  margin: "0 auto",
                }}
              />
            </Link>
          ))}

        {description && (
          <Card.Text
            className="my-2 text-body-secondary"
            style={
              props.condensed
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // clamp to 3 lines in list view
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
                : undefined
            }
          >
            {description}
          </Card.Text>
        )}
      </Col>
      <Card.Body>
        <div
          className={`${styles.PostBar} d-flex align-items-center justify-content-center`}
        >
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own tutorial!</Tooltip>}
            >
              <i className={`fa-regular fa-heart ${styles.HeartOutline}`} />
            </OverlayTrigger>
          ) : tutorial_liked_id ? (
            <span onClick={handleUnlike}>
              <i className={`fa-solid fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`fa-regular fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like!</Tooltip>}
            >
              <i className={`fa-regular fa-heart ${styles.HeartOutline}`} />
            </OverlayTrigger>
          )}
          <span className={styles.LikeCount}>{tutorial_likes_count ?? 0}</span>
          <Link to={`/tutorials/${id}`}>
            <i className={` ${styles.Comment} fa-regular fa-comments`} />
          </Link>
          <span className={styles.CommentCount}>
            {" "}
            {tutorial_comments_count ?? 0}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Tutorial;

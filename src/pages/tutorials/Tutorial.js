import React from "react";
import styles from "../../styles/Artwork.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Row from "react-bootstrap/Row";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
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
    image,
    updated_at,
    tutorialPage,
    setTutorials,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = props.is_owner;
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tutorials/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tutorials/${id}/`);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/tutorial-likes/", {
        tutorial: id,
      });
      setTutorials((prevTutorials) => ({
        ...prevTutorials,
        results: prevTutorials.results.map((tutorial) => {
          return tutorial.id === id
            ? {
                ...tutorial,
                tutorial_likes_count: tutorial.tutorial_likes_count + 1,
                tutorial_liked_id: data.id,
              }
            : tutorial;
        }),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosReq.delete(`/tutorial-likes/${tutorial_liked_id}/`);
      setTutorials((prevTutorials) => ({
        ...prevTutorials,
        results: prevTutorials.results.map((tutorial) => {
          return tutorial.id === id
            ? {
                ...tutorial,
                tutorial_likes_count: tutorial.tutorial_likes_count - 1,
                tutorial_liked_id: null,
              }
            : tutorial;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className={styles.Artwork}>
      <Card.Body>
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
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Row>
      </Card.Body>
      <Link to={`/tutorials/${id}`}>
        <div className={styles.ImageWrapper}>
          <Card.Img src={image} alt={title} />
        </div>
      </Link>

      <Card.Body>
        {title && (
          <Card.Title className={`${styles.ArtworkTitles} text-center`}>
            {title}
          </Card.Title>
        )}
        {description && <Card.Text>{description}</Card.Text>}
        <div
          className={`${styles.PostBar} d-flex align-items-center justify-content-center`}
        >
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
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
          <span className={styles.LikeCount}>{tutorial_likes_count}</span>
          <Link to={`/tutorials/${id}`}>
            <i className={` ${styles.Comment} fa-regular fa-comments`} />
          </Link>
          <span className={styles.CommentCount}>
            {" "}
            {tutorial_comments_count}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Tutorial;

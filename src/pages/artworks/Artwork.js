import React from "react";
import styles from "../../styles/Artwork.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Row from "react-bootstrap/Row";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { Link, useNavigate } from "react-router-dom";

const Artwork = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    artwork_comments_count,
    artwork_likes_count,
    artwork_liked_id,
    title,
    description,
    image,
    updated_at,
    artworkPage,
    setArtworks,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/artworks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/artworks/${id}/`);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/artworklikes/", { artwork: id });
      setArtworks((prevArtworks) => ({
        ...prevArtworks,
        results: prevArtworks.results.map((artwork) => {
          return artwork.id === id
            ? {
                ...artwork,
                artwork_likes_count: artwork.artwork_likes_count + 1,
                artwork_liked_id: data.id,
              }
            : artwork;
        }),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosReq.delete(`/artworklikes/${artwork_liked_id}/`);
      setArtworks((prevArtworks) => ({
        ...prevArtworks,
        results: prevArtworks.results.map((artwork) => {
          return artwork.id === id
            ? {
                ...artwork,
                artwork_likes_count: artwork.artwork_likes_count - 1,
                artwork_liked_id: null,
              }
            : artwork;
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
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && artworkPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Row>
      </Card.Body>
      <Link to={`/artworks/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>

      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {description && <Card.Text>{description}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="fas fa-heart" />
            </OverlayTrigger>
          ) : artwork_liked_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {artwork_likes_count}
          <Link to={`/artworks/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {artwork_comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Artwork;

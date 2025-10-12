import React, { useState } from "react";
import commentStyles from "../../styles/Comment.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
import CommentEditForm from "./CommentEditForm";

const Comments = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setComments,
    endpoint,
    setParent,
    countKey,
  } = props;

  //USEHOOK - showEditForm & setShowEditForm
  const [showEditForm, setShowEditForm] = useState(false);

  // ANCHOR currentUser
  const currentUser = useCurrentUser();
  //ANCHOR owner
  const is_owner = currentUser?.username === owner;

  //STEP - 8
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`${endpoint}${id}/`);
      setParent((prev) => ({
        results: [
          {
            ...prev.results[0],
            [countKey]: prev.results[0][countKey] - 1,
          },
        ],
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <hr />
      <Container>
        <Row className="align-items-start g-2">
          <Col xs="auto">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} />
            </Link>
          </Col>
          <Col xs={7} md={9} lg={10} className="align-self-center ms-1">
            <span className={commentStyles.Owner}>{owner}</span>
            <span className={commentStyles.Date}>{updated_at}</span>
            {showEditForm ? (
              <CommentEditForm
                id={id}
                profile_id={profile_id}
                content={content}
                profileImage={profile_image}
                setComments={setComments}
                setShowEditForm={setShowEditForm}
                endpoint={endpoint}
              />
            ) : (
              <p className={commentStyles.PostedMessage}>{content}</p>
            )}
          </Col>
          <Col xs="auto position-relative">
            {is_owner && !showEditForm && (
              <MoreDropdown
                handleEdit={() => setShowEditForm(true)}
                handleDelete={handleDelete}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Comments;

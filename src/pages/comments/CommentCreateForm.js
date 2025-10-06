import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/Form.module.css";
import btnStyles from "../../styles/Button.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const {
    setComments,
    profileImage,
    profile_id,
    owner,
    endpoint,
    fkKey,
    parentId,
    setParent,
    countKey,
  } = props;

  const [content, setContent] = useState("");

  if (!endpoint || !fkKey || !parentId || !setParent || !countKey) {
    console.warn("CommentCreateForm: missing required props", {
      endpoint,
      fkKey,
      parentId,
      hasSetParent: !!setParent,
      countKey,
    });
    return null;
  }

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { content: content.trim(), [fkKey]: parentId };
      const { data } = await axiosRes.post(endpoint, payload);

      setComments((prevComments) => ({
        ...prevComments,
        results: [
          {
            ...data,
            owner,
            profile_id,
            profile_image: profileImage,
          },
          ...prevComments.results,
        ],
      }));

      setParent((prev) => ({
        results: [
          {
            ...prev.results[0],
            [countKey]: prev.results[0][countKey] + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group controlId="comment">
        <InputGroup>
          <Link className={styles.CommentLink} to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Label className="d-none">Your Comment</Form.Label>
          <Form.Control
            className={styles.Textarea}
            placeholder="my thoughts..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${btnStyles.Button} ${btnStyles.BtnBasePeach} btn d-block ms-auto`}
        disabled={!content.trim()}
        type="submit"
      >
        post
      </button>
    </Form>
  );
}

export default CommentCreateForm;

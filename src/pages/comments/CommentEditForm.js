import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import formStyles from "../../styles/Form.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/CommentCreateEditForm.module.css";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments, endpoint } = props;

  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.patch(`${endpoint}${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: data.content,
                updated_at: data.update_at,
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pe-1">
        <Form.Control
          className={`${formStyles.Textarea} ${styles.Message} `}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-end">
        <button
          className={`${styles.Button} ${btnStyles.Button} ${btnStyles.BtnBasePeach}`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={`${styles.Button} ${btnStyles.Button} ${btnStyles.BtnBasePurple}`}
          disabled={!formContent.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;

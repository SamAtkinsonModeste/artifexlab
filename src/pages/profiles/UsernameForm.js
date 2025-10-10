import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import FieldAlerts from "../../components/FieldAlerts";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import uniStyles from "../../styles/UniversalDesign.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import formStyles from "../../styles/Form.module.css";
import styles from "../../styles/SignInUpForm.module.css";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      navigate(-1);
    }
  }, [currentUser, navigate, id]);

  //USEEFFECT - IF SUCCESSFULL SUBMISSION
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className="mt-5">
      <Row className={styles.Row}>
        <Col className="py-2 mx-auto text-center" md={6}>
          <Container className={appStyles.Content}>
            <h1
              className={`${uniStyles.ArtifexLab} ${uniStyles.BorderRadius} ${uniStyles.bgMainGradient} py-2`}
            >
              Change Username
            </h1>
            <Form onSubmit={handleSubmit} className="my-2">
              <Form.Group controlId="username">
                <Form.Label className="d-none">Change username</Form.Label>
                <Form.Control
                  className={`${formStyles.Input} ${formStyles.InputSignIn}`}
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Form.Group>
              <FieldAlerts messages={errors?.username} />
              <Button
                className={`${btnStyles.Button} ${btnStyles.SmallWide} ${btnStyles.Cancel}`}
                onClick={() => navigate(-1)}
              >
                cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.SmallWide} ${btnStyles.Submit}`}
                type="submit"
                disabled={success}
              >
                save
              </Button>
              {success && (
                <div
                  className="mt-3"
                  ref={(el) => el && el.scrollIntoView({ behavior: "smooth" })}
                >
                  <FieldAlerts
                    messages={[
                      <>
                        User name Changed to:{" "}
                        <span className={uniStyles.ProfileLink}>
                          {username}
                        </span>
                      </>,
                    ]}
                    variant="success"
                  />
                </div>
              )}
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default UsernameForm;

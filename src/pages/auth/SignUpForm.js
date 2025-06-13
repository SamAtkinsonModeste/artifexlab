import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import eyeArt from "../../assets/eye-art.webp";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import axios from "axios";
import FieldAlerts from "../../components/FieldAlerts";

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const { username, password1, password2 } = signUpData;
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/profile");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  //EVENTHANDLER - handleChange of form inputs
  const handleChange = (evt) => {
    setSignUpData({
      ...signUpData,
      [evt.target.name]: evt.target.value,
    });
  };

  //EVENTHANDLER - handleSubmit of new User sign up
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(signUpData);
      await axios.post("/dj-rest-auth/registration/", signUpData);
      setSuccess(true);
      console.log("Success!");
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container>
      <Row className={styles.Row}>
        <Col className="my-auto py-2 p-md-2" md={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>sign up</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
                <FieldAlerts messages={errors?.username} />
              </Form.Group>

              <Form.Group controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                />
                <FieldAlerts messages={errors?.password1} />
              </Form.Group>

              <Form.Group controlId="password2">
                <Form.Label className="d-none">Confirm Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                />
                <FieldAlerts messages={errors?.password2} />
              </Form.Group>

              <Button
                variant="none"
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.SignUpIn}`}
                type="submit"
                disabled={success}
              >
                Sign Up
              </Button>
              <FieldAlerts messages={errors?.non_field_errors} />
              {success && (
                <div
                  className="mt-3"
                  ref={(el) => el && el.scrollIntoView({ behaviour: "smooth" })}
                >
                  <FieldAlerts
                    messages={[
                      "Account created successfully! Redirecting to your profile page.",
                    ]}
                    variant="success"
                  />
                </div>
              )}
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/signin">
              Already have an account? <span>Sign in</span>
            </Link>
          </Container>
        </Col>
        <Col
          md={6}
          className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
        >
          <Image className={`${appStyles.FillerImage}`} src={eyeArt} />
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;

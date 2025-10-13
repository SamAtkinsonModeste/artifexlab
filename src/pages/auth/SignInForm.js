import React, { useEffect, useState } from "react";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";

import formStyles from "../../styles/Form.module.css";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import FieldAlerts from "../../components/FieldAlerts";
import eyeArt from "../../assets/eye-art.webp";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";

const SignInForm = () => {
  const setCurrentUser = useSetCurrentUser();
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Redirect shortly after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Handle input change
  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific errors AND general login error
    setErrors((prev) => ({
      ...prev,
      [name]: null,
      non_field_errors: null, // <-- important for bad-credentials message
    }));
  };

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);

      setCurrentUser(data.user);
      setTokenTimestamp(data);
      setSuccess(true);
      setErrors({});
      // console.log("Success!", data);
    } catch (err) {
      // console.log(err);
      setSuccess(false);
      // Store the API error object so FieldAlerts can render it
      setErrors(err.response?.data || { non_field_errors: ["Login failed"] });
    }
  };

  return (
    <Container>
      <Row className={styles.Row}>
        <Col className="my-auto py-2 p-md-2" md={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>sign in</h1>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={`${formStyles.Input} ${formStyles.InputSignIn}`}
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </Form.Group>
              <FieldAlerts messages={errors?.username} />

              <Form.Group controlId="password" className="mt-2">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={`${formStyles.Input} ${formStyles.InputSignIn}`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </Form.Group>
              <FieldAlerts messages={errors?.password} />

              {/* Global login error from dj-rest-auth */}
              <div className="mt-3">
                <FieldAlerts messages={errors?.non_field_errors} />
              </div>

              <Button
                variant="none"
                className={`${btnStyles.Button} ${btnStyles.SignUpIn} mt-3`}
                type="submit"
                disabled={success}
              >
                Sign In
              </Button>

              {success && (
                <div
                  className="mt-3"
                  ref={(el) => el && el.scrollIntoView({ behavior: "smooth" })}
                >
                  <FieldAlerts
                    messages={[`Welcome back ${username}`]}
                    variant="success"
                  />
                </div>
              )}
            </Form>
          </Container>

          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/signup">
              Don&apos;t have an account? <span>Sign Up now!</span>
            </Link>
          </Container>
        </Col>

        <Col
          md={6}
          className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
        >
          <Image className={`${appStyles.FillerImage}`} src={eyeArt} alt="" />
        </Col>
      </Row>
    </Container>
  );
};

export default SignInForm;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import FieldAlerts from "../../components/FieldAlerts";
import eyeArt from "../../assets/eye-art.webp";
import { SetCurrentUserContext } from "../../App";

const SignInForm = () => {
  const setCurrentUser = useContext(SetCurrentUserContext);
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  //USEEFFECT - IF SUCCESSFULL SUBMISSION
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  //EVENTHANDLER - handleChange of form inputs
  const handleChange = (evt) => {
    setSignInData({
      ...signInData,
      [evt.target.name]: evt.target.value,
    });
  };

  //EVENTHANDLER - handleSubmit of new User sign up
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(signInData);
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
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
            <h1 className={styles.Header}>sign in</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              <FieldAlerts messages={errors?.username} />

              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              <FieldAlerts messages={errors?.password} />

              <Button
                variant="none"
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.SignUpIn}`}
                type="submit"
                disabled={success}
              >
                Sign In
              </Button>

              {success && (
                <div
                  className="mt-3"
                  ref={(el) => el && el.scrollIntoView({ behaviour: "smooth" })}
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
              Don't have an account? <span>Sign Up now!</span>
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

export default SignInForm;

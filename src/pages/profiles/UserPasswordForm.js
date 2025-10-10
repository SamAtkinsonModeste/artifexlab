import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import FieldAlerts from "../../components/FieldAlerts";

import uniStyles from "../../styles/UniversalDesign.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import formStyles from "../../styles/Form.module.css";
import styles from "../../styles/SignInUpForm.module.css";

const UserPasswordForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (evt) => {
    setUserData({
      ...userData,
      [evt.target.name]: evt.target.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [evt.target.name]: null,
    }));
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // redirect user if they are not the owner of this profile
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
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
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
              Change Password
            </h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="d-none">New password</Form.Label>
                <Form.Control
                  className={`${formStyles.Input} ${formStyles.InputSignIn}`}
                  placeholder="new password"
                  type="password"
                  value={new_password1}
                  onChange={handleChange}
                  name="new_password1"
                />
              </Form.Group>
              <FieldAlerts messages={errors?.new_password1} />
              <Form.Group>
                <Form.Label className="d-none">Confirm password</Form.Label>
                <Form.Control
                  className={`${formStyles.Input} ${formStyles.InputSignIn}`}
                  placeholder="confirm new password"
                  type="password"
                  value={new_password2}
                  onChange={handleChange}
                  name="new_password2"
                />
              </Form.Group>
              <FieldAlerts messages={errors?.new_password2} />
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
                    messages={[`Password changed successfully!`]}
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

export default UserPasswordForm;

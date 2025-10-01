import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const imageFile = useRef();
  const previewUrlRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    image: "",
  });
  const { name, bio, image } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (!currentUser) return;

      if (currentUser?.profile_id?.toString() !== id) {
        navigate("/");
        return;
      }

      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        const { display_name, bio, profile_image } = data;
        setProfileData({
          name: display_name ?? "",
          bio: bio ?? "",
          image: profile_image || "",
        });
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    handleMount();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [currentUser, id, navigate]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("display_name", name);
    formData.append("bio", bio);

    if (imageFile?.current?.files[0]) {
      formData.append("profile_image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.patch(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.profile_image,
      }));
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Artist Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={bio}
          onChange={handleChange}
          name="bio"
          rows={7}
        />
      </Form.Group>

      {errors?.bio?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => navigate(-1)}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {image && (
                <figure>
                  <Image
                    src={image}
                    alt={`${name || currentUser?.username}'s avatar`}
                    fluid
                  />
                </figure>
              )}
              {errors?.profile_image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>

                <Form.Control
                  className="d-none"
                  id="image-upload"
                  type="file"
                  name="profile_image"
                  ref={imageFile}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length) {
                      if (previewUrlRef.current) {
                        URL.revokeObjectURL(previewUrlRef.current);
                      }

                      const file = e.target.files[0];
                      const blobUrl = URL.createObjectURL(file);
                      previewUrlRef.current = blobUrl;
                      setProfileData({
                        ...profileData,
                        image: blobUrl,
                      });
                    }
                  }}
                />
              </div>
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;

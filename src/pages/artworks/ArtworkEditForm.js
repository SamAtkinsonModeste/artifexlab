import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Upload from "../../assets/upload.svg";
import { useParams, useNavigate } from "react-router-dom";
import FieldAlerts from "../../components/FieldAlerts";
import { axiosReq } from "../../api/axiosDefaults";

import appStyles from "../../App.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";
import styles from "../../styles/ArtUpLoadForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import formStyles from "../../styles/Form.module.css";

import Asset from "../../components/Asset";

const ArtworkEditForm = () => {
  const [artworkData, setArtworkData] = useState({
    title: "",
    description: "",
    previewImage: "",
  });

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);

  const { title, description, previewImage } = artworkData;
  const isBlobUrl = (u) => typeof u === "string" && u.startsWith("blob:");

  const handleChange = (evt) => {
    setArtworkData({
      ...artworkData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleImageChange = (evt) => {
    if (evt.target.files?.length) {
      const file = evt.target.files[0];
      if (isBlobUrl(previewImage)) URL.revokeObjectURL(previewImage);
      setArtworkData((prev) => ({
        ...prev,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleCancel = () => {
    navigate(`/artworks/${id}`);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setErrors({});

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (imageInput.current?.files?.length) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.patch(`/artworks/${id}/`, formData);
      navigate(`/artworks/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const formFields = (
    <>
      {/* Title Field */}

      <Form.Group controlId="artTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          className={formStyles.CreateArtInput}
          type="text"
          name="title"
          placeholder="Title of Your Artwork"
          value={title}
          onChange={handleChange}
        />
        <FieldAlerts messages={errors?.title} />
      </Form.Group>

      {/* Content Field */}
      <Form.Group controlId="artContent" className="mt-3 mx-auto">
        <Form.Label>Content</Form.Label>
        <Form.Control
          className={formStyles.CreateArtTextarea}
          as="textarea"
          rows={6}
          name="description"
          placeholder="Tell us about your artwork..."
          value={description}
          onChange={handleChange}
        />
        <FieldAlerts messages={errors?.description} />
      </Form.Group>
      <div className="d-flex justify-content-center gap-3 my-4">
        {/* Cancel button */}
        <Button
          type="button"
          className={`${btnStyles.Button} ${btnStyles.Cancel} ${btnStyles.SmallWide} rounded-pill`}
          onClick={handleCancel}
        >
          Cancel
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`${btnStyles.Button} ${btnStyles.Submit} ${btnStyles.SmallWide}  rounded-pill `}
        >
          Save Changes
        </Button>
      </div>
    </>
  );

  React.useEffect(() => {
    let isMounted = true;

    async function fetchArtwork() {
      try {
        setLoading(true);
        const { data: a } = await axiosReq.get(`/artworks/${id}/`);

        if (!isMounted) return;

        setArtworkData({
          title: a.title ?? a.artwork_title ?? "",
          description: a.description ?? a.artwork_description ?? "",
          previewImage: a.image ?? a.preview_art ?? "", // server image URL
        });
        setErrors({});
      } catch (err) {
        if (isMounted) setErrors(err.response?.data || {});
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchArtwork();

    return () => {
      isMounted = false;
    };
  }, [id]);

  React.useEffect(() => {
    return () => {
      if (isBlobUrl(previewImage)) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  if (loading) return <Asset spinner message="Loading artwork…" />;

  return (
    <Form className={styles.ArtWorkForm} onSubmit={handleSubmit}>
      <section className={uniStyles.RowWrapperBg}>
        <div className={uniStyles.pageShell}>
          <Row>
            <h2>Edit Artwork</h2>

            <Col className="py-2 p-0 p-md-2 d-flex max-width" md={6} lg={7}>
              <Container
                className={`${appStyles.Content} ${uniStyles.BorderPeach}`}
              >
                <Form.Group className="text-center">
                  {previewImage ? (
                    <>
                      <figure>
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            maxHeight: "300px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </figure>
                      <div className="mt-2">
                        <Form.Label
                          className={`${btnStyles.Button} ${btnStyles.BtnBasePeach} btn my-auto`}
                          htmlFor="image-upload"
                          aria-label="Change artwork image"
                        >
                          Change the artwork Image
                        </Form.Label>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Form.Label
                        htmlFor="image-upload"
                        className="text-center"
                      >
                        <Asset
                          src={Upload}
                          message="Click or tap to upload an image"
                        />
                      </Form.Label>
                    </div>
                  )}

                  <Form.Control
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={imageInput}
                    className="d-none"
                  />
                  <FieldAlerts
                    messages={
                      errors?.image ??
                      errors?.preview_art ??
                      errors?.previewImage
                    }
                  />
                </Form.Group>
              </Container>
            </Col>
            {/* Reusable form fields */}
            <Col xs={12} md={6} lg={5} className="p-0 p-md-2">
              <Container
                className={`${appStyles.Content} ${uniStyles.BorderPeach} `}
              >
                {formFields}
              </Container>
            </Col>
          </Row>
        </div>
      </section>
    </Form>
  );
};

export default ArtworkEditForm;

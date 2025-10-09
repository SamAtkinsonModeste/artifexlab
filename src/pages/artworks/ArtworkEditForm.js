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
    image: "",
  });

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);

  const { title, description, image } = artworkData;
  const isBlobUrl = (u) => typeof u === "string" && u.startsWith("blob:");

  const handleChange = (evt) => {
    setArtworkData({
      ...artworkData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleImageChange = (evt) => {
    if (evt.target.files.length) {
      if (image) {
        URL.revokeObjectURL(image);
      }
      setArtworkData({
        ...artworkData,
        image: URL.createObjectURL(evt.target.files[0]),
      });
    }
  };

  const handleCancel = () => {
    setArtworkData({
      title: "",
      description: "",
      image: "",
    });
    setErrors({});
    if (image) {
      URL.revokeObjectURL(image);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Image file:", imageInput.current?.files[0]);
    setErrors({});

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (imageInput.current?.files?.length) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.patch(`/artworks/${id}`, formData);
      console.log("Artwork edited:");
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
          Create
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
          // prefer your serializer’s fields; fall back to alternates just in case
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
      if (isBlobUrl(previewImage)) URL.revokeObjectURL(previewImage);
    };
  }, [id, previewImage]);

  return (
    <Form className={styles.ArtWorkForm} onSubmit={handleSubmit}>
      <section className={uniStyles.RowWrapperBg}>
        <div className={uniStyles.pageShell}>
          <Row>
            <h2>Upload Artwork</h2>

            <Col className="py-2 p-0 p-md-2 d-flex max-width" md={6} lg={7}>
              <Container
                className={`${appStyles.Content} ${uniStyles.BorderPeach}`}
              >
                <Form.Group className="text-center">
                  {image ? (
                    <>
                      <figure>
                        <img
                          src={image}
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
                        >
                          Change the Image
                        </Form.Label>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Form.Label
                        htmlFor="image-upload"
                        className={` ${styles.AssestContainer} text-center`}
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
                  <FieldAlerts messages={errors?.image} />
                </Form.Group>
              </Container>
            </Col>
            {/* Reusable form fields */}
            <Col sx={2} md={6} lg={5} className="p-0 p-md-2">
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

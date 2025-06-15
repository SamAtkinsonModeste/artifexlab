import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import FieldAlerts from "../../components/FieldAlerts";
import { axiosReq } from "../../api/axiosDefaults";
import btnStyles from "../../styles/Button.module.css";
import design from "../../styles/UniversalDesign.module.css";

const ArtUploadForm = () => {
  const [artworkData, setArtworkData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const { title, content, image } = artworkData;
  const [errors, setErrors] = useState({});

  const imageInput = useRef(null);
  const navigate = useNavigate();

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
      content: "",
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
    console.log("Content:", content);
    console.log("Image file:", imageInput.current?.files[0]);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/artworks/", formData);
      console.log("Post create:", data);
      navigate(`/artworks/${data.id}`);
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
          type="text"
          name="title"
          placeholder="Title of Your Artwork"
          value={title}
          onChange={handleChange}
        />
        <FieldAlerts messages={errors?.title} />
      </Form.Group>

      {/* Content Field */}
      <Form.Group controlId="artContent" className="mt-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          placeholder="Tell us about your artwork..."
          value={content}
          onChange={handleChange}
        />
        <FieldAlerts messages={errors?.content} />
      </Form.Group>

      {/* Cancel button */}
      <Button
        className={`${btnStyles.CallOutArt} ${btnStyles.MedWide} rounded-pill m-2`}
        onClick={handleCancel}
      >
        Cancel
      </Button>

      {/* Submit Button */}
      <Button
        type="submit"
        className={`${btnStyles.CallOutTutorial} ${btnStyles.MedWide}  rounded-pill mx-4 my-5`}
      >
        Create
      </Button>
    </>
  );

  return (
    <Container className="mt-4">
      <h2>Upload Artwork</h2>
      <Form onSubmit={handleSubmit}>
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
              <div>
                <Form.Label
                  className="btn btn-primary mt-2"
                  htmlFor="image-upload"
                >
                  Change the Image
                </Form.Label>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center">
              <Form.Label htmlFor="image-upload" className="w-100 text-center">
                Click to upload an image
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

        {/* Reusable form fields */}
        {formFields}
      </Form>
    </Container>
  );
};

export default ArtUploadForm;

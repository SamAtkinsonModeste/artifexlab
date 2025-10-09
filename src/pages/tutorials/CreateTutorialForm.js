import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldAlerts from "../../components/FieldAlerts";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import Asset from "../../components/Asset";
import Upload from "../../assets/upload.svg";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import FormStyles from "../../styles/Form.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";

import { axiosReq } from "../../api/axiosDefaults";

const CreateTutorialForm = () => {
  const [tutorialData, setTutorialData] = useState({
    title: "",
    description: "",
    previewImage: "",
  });

  const { title, description, previewImage } = tutorialData;
  const [showStepForm, setShowStepForm] = useState(false);

  const [stepTitle, setStepTitle] = useState("");
  const [stepInstructions, setStepInstructions] = useState("");
  const [steps, setSteps] = useState([]);
  const [stepImage, setStepImage] = useState(null);
  const [showStepImageInput, setShowStepImageInput] = useState(false);
  const [stepImagePreview, setStepImagePreview] = useState(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  const [errors, setErrors] = useState({});

  const imageInput = useRef(null);
  const navigate = useNavigate();

  const handleToggleStepForm = () => setShowStepForm((prev) => !prev);
  const handleToggleStepImageInput = () =>
    setShowStepImageInput((prev) => !prev);

  const handleChange = (evt) => {
    setTutorialData({
      ...tutorialData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleImageChange = (evt) => {
    if (evt.target.files.length) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setTutorialData({
        ...tutorialData,
        previewImage: URL.createObjectURL(evt.target.files[0]),
      });
    }
  };

  const handleAddStep = () => {
    if (stepTitle.trim() && stepInstructions.trim()) {
      const newStep = {
        step_number: steps.length + 1,
        step_title: stepTitle,
        step_content: stepInstructions,
        step_image: stepImage || null,
      };
      setSteps((prevSteps) => [...prevSteps, newStep]);

      if (stepImagePreview) {
        URL.revokeObjectURL(stepImagePreview);
        setStepImagePreview(null);
      }

      setStepTitle("");
      setStepInstructions("");
      setShowStepForm(false);
      setStepImage(null);
      setShowStepImageInput(false);
    }
  };

  const handleStepImageChange = (evt) => {
    if (evt.target.files.length) {
      const file = evt.target.files[0];

      if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);

      setStepImage(file);
      setStepImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStepCancel = () => {
    if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);
    setStepImagePreview(null);
    setStepImage(null);
    setStepTitle("");
    setStepInstructions("");
    setShowStepForm(false);
    setShowStepImageInput(false);
  };

  const handleCancel = () => {
    setTutorialData({ title: "", description: "", previewImage: "" });
    setErrors({});
    if (previewImage) URL.revokeObjectURL(previewImage);
    if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);

    setStepImagePreview(null);
    setStepImage(null);
    setStepTitle("");
    setStepInstructions("");
    setShowStepForm(false);
    setShowStepImageInput(false);
    setSteps([]);
  };

  const confirmDeleteStep = (indexToRemove) => {
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== indexToRemove);
      return next.map((s, idx) => ({ ...s, step_number: idx + 1 }));
    });
    setPendingDeleteIndex(null);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formData = new FormData();
    formData.append("tutorial_title", title);
    formData.append("tutorial_description", description);
    formData.append("preview_art", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/tutorials/", formData);

      for (const step of steps) {
        const stepFormData = new FormData();
        stepFormData.append("tutorial", data.id);
        stepFormData.append("tutorial_title", title);
        stepFormData.append("step_number", step.step_number);
        stepFormData.append("step_title", step.step_title);
        stepFormData.append("step_content", step.step_content);
        if (step.step_image) {
          stepFormData.append("step_image", step.step_image);
        }
        await axiosReq.post("/tutorial-steps/", stepFormData);
      }
      navigate(`/tutorials/${data.id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  // ----- Reusable chunks

  const formFields = (
    <Container>
      {/* Title Field */}
      <Container className={`${appStyles.Content} ${uniStyles.BorderPeach} `}>
        <Form.Group>
          <Form.Label htmlFor="tutorial-title">Title</Form.Label>
          <Form.Control
            id="tutorial-title"
            className={FormStyles.Input}
            type="text"
            name="title"
            placeholder="Title of Your Tutorial"
            value={title}
            onChange={handleChange}
          />
          <FieldAlerts messages={errors?.title} />
        </Form.Group>

        {/* Content Field */}
        <Form.Group className="mt-3">
          <Form.Label htmlFor="tutorial-description">Content</Form.Label>
          <Form.Control
            id="tutorial-description"
            className={FormStyles.Textarea}
            as="textarea"
            rows={6}
            name="description"
            placeholder="Description of your tutorial..."
            value={description}
            onChange={handleChange}
          />
          <FieldAlerts messages={errors?.description} />
        </Form.Group>
      </Container>
    </Container>
  );

  const stepForm = showStepForm && (
    <Form.Group className="mt-3">
      <Form.Label htmlFor="step-title">Step Title</Form.Label>
      <Form.Control
        id="step-title"
        className={FormStyles.Input}
        type="text"
        name="stepTitle"
        placeholder="Title for this step..."
        value={stepTitle}
        onChange={(e) => setStepTitle(e.target.value)}
      />

      <Form.Label htmlFor="step-instructions" className="mt-2">
        Step Instructions
      </Form.Label>
      <Form.Control
        id="step-instructions"
        className={FormStyles.Textarea}
        as="textarea"
        rows={3}
        placeholder="Step Instructions..."
        name="stepInstructions"
        value={stepInstructions}
        onChange={(e) => setStepInstructions(e.target.value)}
      />

      {/* Toggle image input button */}
      <div className="d-flex justify-content-center align-content-center">
        <Button
          type="button"
          className={`${btnStyles.Submit} ${btnStyles.MedWide} rounded-pill mx-4 my-4`}
          onClick={handleToggleStepImageInput}
        >
          {showStepImageInput ? "Remove Step Image" : "Add Image With Step"}
        </Button>
      </div>

      {/* Conditional image input field */}
      {showStepImageInput && (
        <Col className="d-flex flex-column align-items-center text-center">
          <Form.Label className="mt-3" htmlFor="step-image-upload">
            Step Image
          </Form.Label>

          {stepImagePreview ? (
            <>
              <figure>
                <img
                  src={stepImagePreview}
                  alt="Selected step preview"
                  style={{
                    maxHeight: "300px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </figure>
              <div className="text-center">
                <Form.Label
                  className="btn btn-primary mt-2"
                  htmlFor="step-image-upload"
                >
                  Change Step Image
                </Form.Label>
              </div>
            </>
          ) : (
            <div className="w-sm-100 w-md-50">
              <Form.Label
                htmlFor="step-image-upload"
                className="w-100 text-center"
              >
                <Asset src={Upload} message="Click or tap to upload an image" />
              </Form.Label>
            </div>
          )}

          <Form.Control
            id="step-image-upload"
            type="file"
            accept="image/*"
            onChange={handleStepImageChange}
            className="d-none"
          />
        </Col>
      )}

      {/* Save & Cancel step buttons (stack on mobile, side-by-side on sm+) */}
      <div className="d-grid gap-2 d-sm-flex justify-content-center w-100 mt-3">
        <Button
          type="button"
          className={`${btnStyles.Submit} ${btnStyles.MedWide} rounded-pill w-100`}
          onClick={handleAddStep}
        >
          Save Step
        </Button>
        <Button
          type="button"
          className={`${btnStyles.Cancel} ${btnStyles.MedWide} rounded-pill w-100`}
          onClick={handleStepCancel}
        >
          Cancel Step
        </Button>
      </div>
    </Form.Group>
  );

  const stepsPreview = steps.length > 0 && (
    <div className="mt-4">
      <h5>Steps Preview:</h5>
      <ul>
        {steps.map((step, index) => (
          <li
            className={`${uniStyles.BorderPeachBottom} list-group-item p-3 p-sm-4`}
            key={index}
          >
            <div className="d-flex flex-column gap-3">
              <h5 className="mb-1 fw-semibold">
                Step {step.step_number}: Title - {step.step_title}
              </h5>

              <div className="d-flex flex-column flex-md-row align-items-md-stretch gap-4">
                {/* Thumbnail (left) */}
                <div className="flex-shrink-0">
                  <small className="text-uppercase d-block">
                    Step {step.step_number} - Image
                  </small>
                  {step.step_image && (
                    <div
                      className="ratio ratio-4x3 rounded overflow-hidden"
                      style={{ width: "180px" }}
                    >
                      <img
                        src={URL.createObjectURL(step.step_image)}
                        alt={`Step ${step.step_number} thumbnail`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                {/* Text (right) */}
                <div className="flex-grow-1 d-flex flex-column h-100">
                  <h6 className="mb-2">Step {step.step_number} Instructions</h6>
                  <p className="mb-0 my-md-auto text-body-secondary">
                    {step.step_content}
                  </p>
                </div>
              </div>
            </div>
            <div className="d-grid gap-2 d-sm-flex justify-content-center w-100 mt-2">
              <Button
                type="button"
                className={`${btnStyles.Cancel} ${btnStyles.MedWide} rounded-pill w-sm-100 w-md-50`}
                aria-label={`Delete step ${step.step_number}`}
                onClick={() => setPendingDeleteIndex(index)}
              >
                Delete Step
              </Button>
            </div>
            {pendingDeleteIndex === index && (
              <div className="mt-2">
                <FieldAlerts
                  messages={[
                    `Delete step ${step.step_number}? This cannot be undone.`,
                  ]}
                />
                <div className="d-grid gap-2 d-sm-flex justify-content-center w-100 mt-2">
                  <Button
                    type="button"
                    className={`${btnStyles.Submit} ${btnStyles.MedWide} rounded-pill w-100`}
                    onClick={() => confirmDeleteStep(index)}
                  >
                    Confirm Delete
                  </Button>
                  <Button
                    type="button"
                    className={`${btnStyles.Cancel} ${btnStyles.MedWide} rounded-pill w-100`}
                    onClick={() => setPendingDeleteIndex(null)}
                  >
                    Keep Step
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  // Add button
  const stepActions = (
    <Container className="d-flex align-items-center justify-content-center">
      <Button
        type="button"
        className={`${btnStyles.Submit} ${btnStyles.MedWide} rounded-pill m-2 w-sm-100`}
        onClick={handleToggleStepForm}
      >
        Add a Step{" "}
        <span>
          <i className="fa-solid fa-circle-plus"></i>
        </span>
      </Button>
    </Container>
  );

  /**NOTE - revokes preview URLS on unmount */
  React.useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
      if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);
    };
  }, [previewImage, stepImagePreview]);

  return (
    <Form onSubmit={handleSubmit}>
      <section className={uniStyles.RowWrapperBg}>
        <div className={uniStyles.pageShell}>
          <Row className="top-row">
            <h2>Upload Tutorials</h2>

            <Col className="py-2 p-0 p-md-2 max-width" md={6} lg={7}>
              <Container
                className={`${appStyles.Content} ${uniStyles.BorderPeach} `}
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
                      <div className="text-center">
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
                      <Form.Label
                        htmlFor="image-upload"
                        className="w-sm-100 w-md-50 text-center"
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
            <Col xs={12} md={6} lg={5} className="p-0 p-md-2">
              {formFields}
            </Col>
          </Row>
        </div>
      </section>

      <section className={uniStyles.RowWrapperBg}>
        <div className={uniStyles.pageShell}>
          <Row className="bottom-row">
            <Col>{stepForm}</Col>
            {!showStepForm && stepActions}

            {stepsPreview}

            {/* Submit / Cancel (stack on mobile, side-by-side on sm+) */}
            <div className="d-grid gap-2 d-sm-flex justify-content-center w-100 my-4">
              <Button
                type="submit"
                className={`${btnStyles.BtnBasePurple} ${btnStyles.MedWide} rounded-pill w-100`}
              >
                Submit Your Tutorial
              </Button>
              <Button
                type="button"
                className={`${btnStyles.Cancel} ${btnStyles.MedWide} rounded-pill w-100`}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Row>
        </div>
      </section>
    </Form>
  );
};

export default CreateTutorialForm;

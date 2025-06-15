import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldAlerts from "../../components/FieldAlerts";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import btnStyles from "../../styles/Button.module.css";
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

  const [errors, setErrors] = useState({});

  const imageInput = useRef(null);
  const navigate = useNavigate();

  const handleToggleStepForm = () => {
    setShowStepForm((prev) => !prev);
  };

  const handleToggleStepImageInput = () => {
    setShowStepImageInput((prev) => !prev);
  };

  const handleChange = (evt) => {
    setTutorialData({
      ...tutorialData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleImageChange = (evt) => {
    if (evt.target.files.length) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
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
      console.log(newStep);
      setSteps((prevSteps) => [...prevSteps, newStep]);
      setStepTitle("");
      setStepInstructions("");
      setShowStepForm(false);
      setStepImage(null);
      setShowStepImageInput(false);
    }
  };

  const handleCancel = () => {
    setTutorialData({
      title: "",
      description: "",
      previewImage: "",
    });
    setErrors({});
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Image file:", imageInput.current?.files[0]);

    const formData = new FormData();

    formData.append("tutorial_title", title);
    formData.append("tutorial_description", description);
    formData.append("preview_art", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/tutorials/", formData);
      console.log("Post create:", data);

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
      console.log("All steps added");
      navigate(`/tutorials/${data.id}`);
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
          placeholder="Title of Your Tutorial"
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
          name="description"
          placeholder="Description of your tutorial..."
          value={description}
          onChange={handleChange}
        />
        <FieldAlerts messages={errors?.description} />
      </Form.Group>

      {showStepForm && (
        <Form.Group className="mt-3">
          <Form.Label>Step Title</Form.Label>
          <Form.Control
            type="text"
            name="stepTitle"
            placeholder="Title for this step..."
            value={stepTitle}
            onChange={(e) => setStepTitle(e.target.value)}
          />

          <Form.Label className="mt-2">Step Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Step Instructions..."
            name="stepInstructions"
            value={stepInstructions}
            onChange={(e) => setStepInstructions(e.target.value)}
          />

          {/* Toggle image input button */}
          <Button
            className={`${btnStyles.CallOutArt} ${btnStyles.MedWide} rounded-pill m-2`}
            onClick={handleToggleStepImageInput}
          >
            {showStepImageInput ? "Remove Step Image" : "Add Image With Step"}
          </Button>

          {/* Conditional image input field */}
          {showStepImageInput && (
            <>
              <Form.Label className="mt-3">Step Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setStepImage(e.target.files[0])}
              />
            </>
          )}

          {/* Save step button */}
          <Button
            className={`${btnStyles.CallOutArt} ${btnStyles.MedWide} rounded-pill m-2`}
            onClick={handleAddStep}
          >
            Save Step
          </Button>
        </Form.Group>
      )}

      {steps.length > 0 && (
        <div className="mt-4">
          <h5>Steps Preview:</h5>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>
                <strong>
                  {step.step_number}: {step.step_title}
                </strong>
                <p>{step.step_content}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Add button */}
      <Button
        className={`${btnStyles.CallOutArt} ${btnStyles.MedWide} rounded-pill m-2`}
        onClick={handleToggleStepForm}
      >
        Add a Step{" "}
        <span>
          <i class="fa-solid fa-circle-plus"></i>
        </span>
      </Button>

      <Button
        className={`${btnStyles.CallOutArt} ${btnStyles.MedWide} rounded-pill m-2`}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </>
  );

  return (
    <Container className="mt-4">
      <h2>Upload Tutorials</h2>
      <Form onSubmit={handleSubmit}>
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
        {/* Submit Button */}
        <Button
          type="submit"
          className={`${btnStyles.CallOutTutorial} ${btnStyles.MedWide}  rounded-pill mx-4 my-5`}
        >
          Submit Your Tutorial
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTutorialForm;

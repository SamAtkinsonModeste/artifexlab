import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const isBlobUrl = (url) => typeof url === "string" && url.startsWith("blob:");

const TutorialEditForm = () => {
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
  const [deletingStepId, setDeletingStepId] = useState(null);
  const [renumbering, setRenumbering] = useState(false);
  const [savingStepId, setSavingStepId] = useState(null); // for image replace/remove

  const [errors, setErrors] = useState({});

  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

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
      if (isBlobUrl(previewImage)) URL.revokeObjectURL(previewImage);
      setTutorialData({
        ...tutorialData,
        previewImage: URL.createObjectURL(evt.target.files[0]),
      });
    }
  };

  const handleAddStep = async () => {
    if (!stepTitle.trim() || !stepInstructions.trim()) return;

    const nextNumber = steps.length + 1;
    const payload = {
      tutorial: id,
      step_number: nextNumber,
      step_title: stepTitle,
      step_content: stepInstructions,
    };

    try {
      if (stepImage) payload.step_image = stepImage;
      const created = await postStep(payload);

      /**NOTE add to UI with id from server */
      setSteps((prev) => [
        ...prev,
        {
          id: created.id,
          step_number: nextNumber,
          step_title: stepTitle,
          step_content: stepInstructions,
          step_image: created.step_image || stepImage || null,
        },
      ]);

      /**NOTE  CLEANUP*/
      if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);
      setStepImagePreview(null);
      setStepImage(null);
      setStepTitle("");
      setStepInstructions("");
      setShowStepForm(false);
      setShowStepImageInput(false);
    } catch (err) {
      setErrors(err.response?.data || {});
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
    navigate(`/tutorials/${id}`);
  };

  const handleReplaceStepImage = async (step, index, file) => {
    if (!file || !step.id) return;
    try {
      setSavingStepId(step.id);
      await patchStep(step.id, { step_image: file });
      // optimistic UI
      setSteps((prev) =>
        prev.map((s, i) =>
          i === index ? { ...s, step_image: URL.createObjectURL(file) } : s
        )
      );
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setSavingStepId(null);
    }
  };

  const handleRemoveStepImage = async (step, index) => {
    if (!step.id) {
      /**NOTE - local-only fallback */
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, step_image: null } : s))
      );
      return;
    }
    try {
      setSavingStepId(step.id);
      await patchStep(step.id, { step_image: null }); // clears on server
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, step_image: null } : s))
      );
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setSavingStepId(null);
    }
  };

  const renumberSteps = async (list) => {
    setRenumbering(true);
    try {
      /**NOTE - compute new numbers */
      const withNumbers = list.map((s, idx) => ({
        ...s,
        step_number: idx + 1,
      }));

      /**NOTE - figure out which changed */
      const changed = withNumbers.filter(
        (s, idx) => steps[idx]?.step_number !== s.step_number
      );

      // PATCH only changed ones (must have id)
      await Promise.all(
        changed
          .filter((s) => !!s.id)
          .map((s) => patchStep(s.id, { step_number: s.step_number }))
      );

      /**NOTE - commit to state */
      setSteps(withNumbers);
    } finally {
      setRenumbering(false);
    }
  };

  const confirmDeleteStep = async (indexToRemove) => {
    const target = steps[indexToRemove];
    setPendingDeleteIndex(null);

    try {
      setDeletingStepId(target.id || "__local__");

      // 1) delete on server if it has an id
      if (target.id) await deleteStep(target.id);

      // 2) remove locally
      const next = steps.filter((_, i) => i !== indexToRemove);

      // 3) renumber remaining 1..N and PATCH only changed
      await renumberSteps(next);
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setDeletingStepId(null);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formData = new FormData();
    formData.append("tutorial_title", title);
    formData.append("tutorial_description", description);
    if (imageInput.current?.files?.length) {
      formData.append("preview_art", imageInput.current.files[0]);
    }

    try {
      await axiosReq.patch(`/tutorials/${id}/`, formData);
      navigate(`/tutorials/${id}`);
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
                        src={
                          typeof step.step_image === "string"
                            ? step.step_image
                            : URL.createObjectURL(step.step_image)
                        }
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

            <Button
              type="button"
              className={`${btnStyles.Submit} ${btnStyles.MedWide} rounded-pill w-sm-100 w-md-50`}
              onClick={() =>
                document.getElementById(`step-image-input-${index}`).click()
              }
              disabled={savingStepId === step.id}
            >
              {savingStepId === step.id ? "Saving…" : "Replace Image"}
            </Button>

            <Button
              type="button"
              className={`${btnStyles.Cancel} ${btnStyles.MedWide} rounded-pill w-sm-100 w-md-50`}
              onClick={() => handleRemoveStepImage(step, index)}
              disabled={savingStepId === step.id}
              aria-label={`Remove image for step ${step.step_number}`}
            >
              Remove Image
            </Button>

            <input
              id={`step-image-input-${index}`}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={(e) =>
                handleReplaceStepImage(step, index, e.target.files?.[0] || null)
              }
            />

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

  /**NOTE  Prefill tutorial & steps on mount*/

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const { data: t } = await axiosReq.get(`/tutorials/${id}/`);
        const { data: s } = await axiosReq.get(
          `/tutorial-steps/?tutorial=${id}&ordering=step_number`
        );

        if (!isMounted) return;

        setTutorialData({
          title: t.tutorial_title || "",
          description: t.tutorial_description || "",
          previewImage: t.preview_art || "",
        });

        const mapped = (s.results || s || []).map((st) => ({
          id: st.id,
          step_number: st.step_number,
          step_title: st.step_title || "",
          step_content: st.step_content || "",
          step_image: st.step_image || null,
        }));

        setSteps(mapped);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  /**NOTE - revokes preview URLS on unmount */
  React.useEffect(() => {
    return () => {
      if (isBlobUrl(previewImage)) URL.revokeObjectURL(previewImage);
      if (stepImagePreview) URL.revokeObjectURL(stepImagePreview);
    };
  }, [previewImage, stepImagePreview]);

  const postStep = async (payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(
      ([k, v]) => v !== undefined && v !== null && fd.append(k, v)
    );
    const { data } = await axiosReq.post("/tutorial-steps/", fd);
    return data; // expects { id, ... }
  };

  const patchStep = async (id, payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v === null) fd.append(k, ""); // DRF convention to clear file fields
      else if (v !== undefined) fd.append(k, v);
    });
    await axiosReq.patch(`/tutorial-steps/${id}/`, fd);
  };

  const deleteStep = async (id) => {
    await axiosReq.delete(`/tutorial-steps/${id}/`);
  };

  if (loading) return <Asset spinner message="Loading tutorial…" />;
  return (
    <Form onSubmit={handleSubmit}>
      <section className={uniStyles.RowWrapperBg}>
        <div className={uniStyles.pageShell}>
          <Row className="top-row">
            <h2>Edit Tutorial</h2>

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
                Save Changes
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

export default TutorialEditForm;

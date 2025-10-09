import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import appStyles from "../../App.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";
import Tutorial from "./Tutorial";
import Comment from "../comments/Comments";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import FieldAlerts from "../../components/FieldAlerts";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function TutorialPage() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });
  const [steps, setSteps] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const isOwner =
    typeof tutorial.results[0]?.is_owner !== "undefined"
      ? tutorial.results[0].is_owner
      : currentUser?.username === tutorial.results[0]?.owner;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [
          { data: tutorialData },
          { data: commentsData },
          { data: stepsData },
        ] = await Promise.all([
          axiosReq.get(`/tutorials/${id}/`),
          axiosReq.get(`/tutorial-comments/?tutorial=${id}`),
          axiosReq.get(`/tutorial-steps/?tutorial=${id}&ordering=step_number`),
        ]);
        setTutorial({ results: [tutorialData] });
        setComments(commentsData);
        setSteps(stepsData?.results ?? stepsData ?? []);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  const tutorialId = tutorial.results[0]?.id ?? Number(id);
  if (!tutorial.results[0]) {
    return <Asset spinner message="Loading tutorial…" />;
  }

  const handleDeleteTutorial = async () => {
    try {
      setDeleting(true);
      await axiosRes.delete(`/tutorials/${id}/`);
      navigate("/tutorials");
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <section className={uniStyles.RowWrapperBg}>
      <div className={uniStyles.pageShell}>
        <Row className="h-100">
          <Col className="py-2 p-0 p-lg-2" lg={8}>
            <PopularProfiles mobile />
            <Container
              className={`${appStyles.Content} ${uniStyles.BorderPeach} mt-3`}
            >
              {tutorial.results[0] && (
                <Tutorial
                  {...tutorial.results[0]}
                  setTutorial={setTutorial}
                  tutorialPage
                  is_owner={
                    typeof tutorial.results[0]?.is_owner !== "undefined"
                      ? tutorial.results[0].is_owner
                      : currentUser?.username === tutorial.results[0]?.owner
                  }
                />
              )}

              {steps.length > 0 && (
                <>
                  <h5 className="mb-3">Steps</h5>
                  <ul className="list-group list-group-flush">
                    {steps.map((s) => (
                      <li
                        key={s.id ?? s.step_number}
                        className={`${uniStyles.BorderPeachBottom} list-group-item p-3`}
                      >
                        <div className="d-flex flex-column flex-md-row gap-3">
                          <div className="flex-shrink-0">
                            <small className="text-uppercase d-block mb-1">
                              Step {s.step_number}
                            </small>
                            {s.step_image && (
                              <div
                                className="ratio ratio-4x3 rounded overflow-hidden"
                                style={{ width: "180px" }}
                              >
                                <img
                                  src={s.step_image}
                                  alt={`Step ${s.step_number} thumbnail`}
                                  className="w-100 h-100"
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            {s.step_title && (
                              <h6 className="mb-2">{s.step_title}</h6>
                            )}
                            {s.step_content && (
                              <p className="mb-0 text-body-secondary">
                                {s.step_content}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {isOwner && (
                <Container
                  className={`${appStyles.Content} ${uniStyles.BorderPeach} my-3`}
                >
                  {!showDeleteConfirm ? (
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        className="rounded-pill"
                        onClick={() => setShowDeleteConfirm(true)}
                        aria-label="Delete tutorial"
                      >
                        Delete Tutorial
                      </Button>
                    </div>
                  ) : (
                    <>
                      <FieldAlerts
                        messages={[
                          "Delete this tutorial? This cannot be undone.",
                        ]}
                      />
                      <div className="d-grid gap-2 d-sm-flex justify-content-end mt-2">
                        <Button
                          className="rounded-pill"
                          onClick={handleDeleteTutorial}
                          disabled={deleting}
                          aria-label="Confirm delete tutorial"
                        >
                          {deleting ? "Deleting…" : "Confirm Delete"}
                        </Button>
                        <Button
                          variant="secondary"
                          className="rounded-pill"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleting}
                          aria-label="Cancel delete tutorial"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </Container>
              )}

              <Container
                className={`${appStyles.Content}  ${uniStyles.BorderPeach}`}
              >
                {currentUser ? (
                  <CommentCreateForm
                    endpoint="/tutorial-comments/"
                    fkKey="tutorial"
                    parentId={tutorialId}
                    setParent={setTutorial}
                    setComments={setComments}
                    countKey="tutorial_comments_count"
                    profile_id={currentUser.profile_id}
                    profileImage={profile_image}
                    owner={currentUser.username}
                  />
                ) : comments.results.length ? (
                  "Comments"
                ) : null}
                {comments.results.length ? (
                  <InfiniteScroll
                    children={comments.results.map((comment) => (
                      <Comment
                        key={comment.id}
                        {...comment}
                        setComments={setComments}
                        endpoint="/tutorial-comments/"
                        setParent={setTutorial}
                        countKey="tutorial_comments_count"
                      />
                    ))}
                    dataLength={comments.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!comments.next}
                    next={() => fetchMoreData(comments, setComments)}
                  />
                ) : currentUser ? (
                  <span>No comments yet, be the first to comment!</span>
                ) : (
                  <span>No comments... yet</span>
                )}
              </Container>
            </Container>
          </Col>
          <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
            <PopularProfiles />
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default TutorialPage;

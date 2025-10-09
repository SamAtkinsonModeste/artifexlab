import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import appStyles from "../../App.module.css";
import uniStyles from "../../styles/UniversalDesign.module.css";
import styles from "../../styles/ArtworksPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import formStyles from "../../styles/Form.module.css";

import { NavLink, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Tutorial from "./Tutorial";
import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function TutorialsPage({ message = "No tutorials found.", filter = "" }) {
  const currentUser = useCurrentUser();
  const location = useLocation();
  const [tutorials, setTutorials] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const queryString = searchParams.toString();
        const { data } = await axiosReq.get(
          `/tutorials/?${filter}${queryString}`
        );
        setTutorials(data);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchTutorials();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser, searchParams]);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setQuery(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
    if (query) {
      sp.set("search", query);
    } else {
      sp.delete("search");
    }
    setSearchParams(sp);
  }, [query, searchParams, setSearchParams]);

  return (
    <section className={uniStyles.RowWrapperBg}>
      <div className={uniStyles.pageShell}>
        <Row className="h-100">
          <Col className="py-2 p-0 p-lg-2" lg={8}>
            <PopularProfiles mobile />

            <Row>
              <Nav
                variant="pills"
                className={` ${styles.PillBar} mb-3 d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2`}
              >
                <Nav.Item className="mx-2 my-2">
                  <Nav.Link
                    className={` ${btnStyles.BtnBasePurple} rounded-pill`}
                    as={NavLink}
                    to={{ pathname: "/tutorials", search: location.search }}
                    end
                  >
                    All Tutorials
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mx-2 my-2">
                  <Nav.Link
                    className={`${btnStyles.BtnBasePurple} rounded-pill`}
                    as={NavLink}
                    to={{
                      pathname: "/tutorials/liked",
                      search: location.search,
                    }}
                  >
                    Liked
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mx-2 my-2">
                  <Nav.Link
                    className={` ${btnStyles.BtnBasePurple} rounded-pill`}
                    as={NavLink}
                    to={{
                      pathname: "/tutorials/following",
                      search: location.search,
                    }}
                  >
                    Following
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>

            <Form
              className={styles.SearchBar}
              onSubmit={(evt) => evt.preventDefault()}
            >
              <i className={`fas fa-search ${styles.SearchIcon}`} />
              <Form.Control
                id="search"
                name="search"
                type="text"
                className={` ${formStyles.InputSearch}  mr-sm-2`}
                placeholder="Search Tutorials"
                value={query}
                onChange={(evt) => setQuery(evt.target.value)}
              />
            </Form>
          </Col>
          <Col className="py-2 p-0 p-lg-2" lg={8}>
            {hasLoaded ? (
              <>
                {tutorials.results.length ? (
                  <InfiniteScroll
                    dataLength={tutorials.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!tutorials.next}
                    next={() => fetchMoreData(tutorials, setTutorials)}
                  >
                    <Row className="g-4 mx-0">
                      {tutorials.results.map((tutorial) => (
                        <Col
                          key={tutorial.id}
                          xs={12}
                          md={6}
                          className="d-flex"
                        >
                          <Tutorial
                            {...tutorial}
                            title={tutorial.title ?? tutorial.tutorial_title}
                            description={
                              tutorial.description ??
                              tutorial.tutorial_description
                            }
                            preview_art={tutorial.preview_art ?? tutorial.image}
                            profile_image={
                              tutorial.profile_image ??
                              tutorial.owner_profile_image ??
                              tutorial.owner_image ??
                              null
                            }
                            setTutorials={setTutorials}
                            condensed
                          />
                        </Col>
                      ))}
                    </Row>
                  </InfiniteScroll>
                ) : (
                  <Container className={appStyles.Content}>
                    <Asset src={NoResults} message={message} />
                  </Container>
                )}
              </>
            ) : (
              <Container className={appStyles.Content}>
                <Asset spinner />
              </Container>
            )}
          </Col>
          <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
            <PopularProfiles />
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default TutorialsPage;

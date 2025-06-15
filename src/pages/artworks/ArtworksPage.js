import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Artwork from "./Artwork";
import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function ArtworksPage({ message = "No artworks found.", filter = "" }) {
  const currentUser = useCurrentUser();
  const [artworks, setArtworks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data } = await axiosReq.get(
          `/artworks/?${filter}search=${query}`
        );
        setArtworks(data);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchArtworks();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(evt) => evt.preventDefault()}
        >
          <Form.Control
            type="text"
            className="mr-sm-2"
            placeholder="Search Artworks"
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
          />
        </Form>
        {hasLoaded ? (
          <>
            {artworks.results.length ? (
              <InfiniteScroll
                dataLength={artworks.results.length}
                loader={<Asset spinner />}
                hasMore={!!artworks.next}
                next={() => fetchMoreData(artworks, setArtworks)}
              >
                <Row className="g-4">
                  {artworks.results.map((artwork) => (
                    <Col key={artwork.id} xs={12} md={6} lg={4}>
                      <Artwork {...artwork} setArtworks={setArtworks} />
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
  );
}

export default ArtworksPage;

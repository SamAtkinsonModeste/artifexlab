import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import Asset from "../../components/Asset";

import uniStyles from "../../styles/UniversalDesign.module.css";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

import InfiniteScroll from "react-infinite-scroll-component";
import Artwork from "../artworks/Artwork";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileArtworks, setProfileArtworks] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileArtworks }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/artworks/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileArtworks(profileArtworks);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Row className="px-3 text-center g-0">
        {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
        <Col lg={4} className="text-lg-left ">
          <div
            className={`${styles.ProfileImageWrapper} ${uniStyles.bgMainGradient}`}
          >
            <Image
              className={styles.ProfileImage}
              roundedCircle
              src={profile?.profile_image}
            />
          </div>
        </Col>
        <Col lg={5}>
          <h3 className={`${uniStyles.ProfileName} m-2`}>{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={4} className="my-2">
              <div className={uniStyles.ProfileInfoCount}>
                {profile?.artworks_count}
              </div>
              <div className={uniStyles.ProfileInfo}>artwork</div>
            </Col>
            <Col xs={4} className="my-2">
              <div className={uniStyles.ProfileInfoCount}>
                {profile?.followers_count}
              </div>
              <div className={uniStyles.ProfileInfo}>followers</div>
            </Col>
            <Col xs={4} className="my-2">
              <div className={uniStyles.ProfileInfoCount}>
                {profile?.following_count}
              </div>
              <div className={uniStyles.ProfileInfo}>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Unfollow} ${btnStyles.ProfileFollow}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Follow} ${btnStyles.ProfileFollow}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const mainProfileArtworks = (
    <>
      <hr className={uniStyles.CustomHr} />
      <p className={` ${uniStyles.ArtworkTitle}  text-center`}>
        {profile?.owner}'s Artworks
      </p>
      <hr className={uniStyles.CustomHr} />
      {profileArtworks.results.length ? (
        <InfiniteScroll
          children={profileArtworks.results.map((artwork) => (
            <Artwork
              key={artwork.id}
              {...artwork}
              setArtworks={setProfileArtworks}
            />
          ))}
          dataLength={profileArtworks.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileArtworks.next}
          next={() => fetchMoreData(profileArtworks, setProfileArtworks)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted artwork yet.`}
        />
      )}
    </>
  );

  return (
    <section className={uniStyles.RowWrapperBg}>
      <div className={uniStyles.pageShell}>
        <Row className="justify-content-lg-between position-relative">
          <Col className="py-2 p-0 p-lg-2" lg={8} xl={9}>
            <PopularProfiles mobile />
            <Container className={`${appStyles.Content} position-relative`}>
              {hasLoaded ? (
                <>
                  {mainProfile}

                  {mainProfileArtworks}
                </>
              ) : (
                <Asset spinner />
              )}
            </Container>
          </Col>

          <Col lg={4} xl={3} className="d-none d-lg-block p-0 p-lg-2">
            <PopularProfiles />
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default ProfilePage;

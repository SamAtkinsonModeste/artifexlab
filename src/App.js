import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import "./api/axiosDefaults";
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import Footer from "./components/Footer";
import HomePage from "./pages/home/HomePage";
import ArtUploadForm from "./pages/artworks/ArtUploadForm";
import ArtworkEditForm from "./pages/artworks/ArtworkEditForm";
import ArtworkPage from "./pages/artworks/ArtworkPage";
import ArtworksPage from "./pages/artworks/ArtworksPage";
import CreateTutorialForm from "./pages/tutorials/CreateTutorialForm";
import TutorialEditForm from "./pages/tutorials/TutorialEditForm ";
import TutorialPage from "./pages/tutorials/TutorialPage";
import TutorialsPage from "./pages/tutorials/TutorialsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <NavBar />
      </header>
      <Container fluid className={styles.Main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="/profiles/:id/edit" element={<ProfileEditForm />} />
          <Route
            path="/profiles/:id/edit/username"
            element={<UsernameForm />}
          />
          <Route
            path="/profiles/:id/edit/password"
            element={<UserPasswordForm />}
          />
          <Route path="/artworks/create" element={<ArtUploadForm />} />
          <Route path="/artworks/:id/edit" element={<ArtworkEditForm />} />
          <Route path="/artworks/:id" element={<ArtworkPage />} />
          <Route path="/artworks/" element={<ArtworksPage />} />
          <Route
            path="/artworks/liked"
            element={
              <ArtworksPage
                message="No liked artworks found."
                filter={`artwork_likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            }
          />
          <Route
            path="/artworks/following"
            element={
              <ArtworksPage
                message="No followed users artworks found."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            }
          />

          <Route path="/tutorials/create" element={<CreateTutorialForm />} />
          <Route path="/tutorials/:id/edit" element={<TutorialEditForm />} />
          <Route path="/tutorials/:id" element={<TutorialPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route
            path="/tutorials/liked"
            element={
              <TutorialsPage
                message="No liked tutorials found."
                filter={`tutorial_likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            }
          />
          <Route
            path="/tutorials/following"
            element={
              <TutorialsPage
                message="No followed users' tutorials found."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            }
          />
          <Route path="*" element={<p> Page Not Found </p>} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;

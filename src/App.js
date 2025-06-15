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
import CreateTutorialForm from "./pages/tutorials/CreateTutorialForm";

function App() {
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
          <Route path="/artworks/create" element={<ArtUploadForm />} />
          <Route path="/tutorials/create" element={<CreateTutorialForm />} />
          <Route path="*" element={<p> Page Not Found </p>} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;

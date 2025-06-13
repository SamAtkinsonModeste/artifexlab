import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <NavBar />
      </header>
      <Container fluid className={styles.Main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<h1>Sign In</h1>} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="artworks/" element={<h1>Artworks</h1>} />
          <Route path="profiles/" element={<h1>Profiles</h1>} />
          <Route path="*" element={<p> Page Not Found </p>} />
        </Routes>
      </Container>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;

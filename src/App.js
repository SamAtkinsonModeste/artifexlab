import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <NavBar />
      </header>
      <Container fluid className={styles.Main}>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/" element={<h1>Sign In</h1>} />
          <Route path="/" element={<h1>Register</h1>} />
          <Route path="artworks/" element={<h1>Artworks</h1>} />
          <Route path="*" element={<p> Page Not Found </p>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

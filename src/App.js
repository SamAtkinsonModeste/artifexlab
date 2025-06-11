import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <NavBar />
      </header>
      <Container fluid className={styles.Main}>
        <h1>Home Page</h1>
        <h1>Sign In</h1>
      </Container>
    </div>
  );
}

export default App;

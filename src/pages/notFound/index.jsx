import { Link } from "react-router-dom";
import notFoundImg from "../../assets/images/notFound-img.svg";
import styles from "./styles.module.css";

function NotFound() {
  return (
    <div className={styles.page}>
      <img src={notFoundImg} alt="404 Page Not Found" className={styles.img} />

      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.subtitle}>
        We're sorry, the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>

      <Link to="/" className={styles.btn}>
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;

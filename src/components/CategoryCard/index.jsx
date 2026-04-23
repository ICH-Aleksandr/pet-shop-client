import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function CategoryCard({ category }) {
  return (
    <Link to={`/categories/${category.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={`${BASE_URL}${category.image}`}
          alt={category.title}
          className={styles.image}
        />
      </div>
      <p className={styles.cardTitle}>{category.title}</p>
    </Link>
  );
}

export default CategoryCard;

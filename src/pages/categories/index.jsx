import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories/all`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {
        setError("Failed to load categories. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ marginBottom: "40px", fontSize: "16px", fontWeight: "500" }}
      >
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ color: "text.secondary", fontSize: "16px", fontWeight: "500" }}
        >
          Main page
        </MuiLink>
        <Typography
          sx={{ color: "text.primary", fontSize: "16px", fontWeight: "500" }}
        >
          Categories
        </Typography>
      </Breadcrumbs>

      <h1 className={styles.title}>Categories</h1>

      {loading && (
        <div className={styles.statusMessage}>Loading categories…</div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {!loading && !error && (
        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={`${BASE_URL}${cat.image}`}
                  alt={cat.title}
                  className={styles.image}
                />
              </div>
              <p className={styles.cardTitle}>{cat.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;

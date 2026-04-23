import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CategoryCard from "../../components/CategoryCard";
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
        separator={
          <span
            style={{
              width: "20px",
              height: "1px",
              background: "#d9d9d9",
              display: "block",
            }}
          />
        }
        sx={{
          marginBottom: "40px",
          "& .MuiBreadcrumbs-separator": {
            marginLeft: 0,
            marginRight: 0,
          },
        }}
      >
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{
            px: "16px",
            py: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            color: "#8b8b8b",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Main page
        </MuiLink>

        <Typography
          sx={{
            px: "16px",
            py: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            color: "#282828",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: 1,
          }}
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
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;

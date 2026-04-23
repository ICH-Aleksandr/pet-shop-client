import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ProductCard from "../../components/ProductCard";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function Sales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/all`)
      .then((res) => {
        const discounted = res.data.filter((p) => p.discont_price);
        setProducts(discounted);
      })
      .catch(() => {
        setError("Failed to load products. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (priceFrom !== "" && p.discont_price < Number(priceFrom)) return false;
      if (priceTo !== "" && p.discont_price > Number(priceTo)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.discont_price - b.discont_price;
      if (sortBy === "price-desc") return b.discont_price - a.discont_price;
      return 0;
    });

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
          "& .MuiBreadcrumbs-separator": { marginLeft: 0, marginRight: 0 },
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
            "&:hover": { backgroundColor: "#eaeaea" },
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
          All sales
        </Typography>
      </Breadcrumbs>

      <h1 className={styles.title}>Discounted items</h1>

      <div className={styles.filters}>
        <div className={styles.priceFilter}>
          <span className={styles.filterLabel}>Price</span>
          <input
            className={styles.priceInput}
            type="number"
            placeholder="from"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
          />
          <input
            className={styles.priceInput}
            type="number"
            placeholder="to"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
          />
        </div>

        <div className={styles.sortWrapper}>
          <span className={styles.filterLabel}>Sorted</span>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">by default</option>
            <option value="price-desc">price: high-low</option>
            <option value="price-asc">price: low-high</option>
          </select>
        </div>
      </div>

      {loading && <div className={styles.statusMessage}>Loading products…</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className={styles.statusMessage}>
              No discounted products match your filters.
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Sales;

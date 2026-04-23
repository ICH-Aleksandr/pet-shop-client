import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ProductCard from "../../components/ProductCard";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/all`)
      .then((res) => {
        setProducts(res.data);
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
      const effectivePrice = p.discont_price ?? p.price;
      if (priceFrom !== "" && effectivePrice < Number(priceFrom)) return false;
      if (priceTo !== "" && effectivePrice > Number(priceTo)) return false;
      if (discountOnly && !p.discont_price) return false;
      return true;
    })
    .sort((a, b) => {
      const pa = a.discont_price ?? a.price;
      const pb = b.discont_price ?? b.price;
      if (sortBy === "price-asc") return pa - pb;
      if (sortBy === "price-desc") return pb - pa;
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
          All products
        </Typography>
      </Breadcrumbs>

      <h1 className={styles.title}>All products</h1>

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

        <label className={styles.discountLabel}>
          <span className={styles.filterLabel}>Discounted items</span>
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
            className={styles.discountCheckbox}
          />
        </label>

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
              No products match your filters.
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

export default Products;

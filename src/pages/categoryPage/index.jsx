import { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

const initialFetchState = {
  loading: true,
  error: null,
  category: null,
  products: [],
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return initialFetchState;
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: null,
        category: action.category,
        products: action.products,
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        error: action.error,
        category: null,
        products: [],
      };
    default:
      return state;
  }
}

function CategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [{ loading, error, category, products }, fetchDispatch] = useReducer(
    fetchReducer,
    initialFetchState,
  );

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchDispatch({ type: "FETCH_START" });
    axios
      .get(`${BASE_URL}/categories/${id}`)
      .then((res) => {
        if (res.data.status === "ERR") {
          fetchDispatch({ type: "FETCH_ERROR", error: res.data.message });
        } else {
          fetchDispatch({
            type: "FETCH_SUCCESS",
            category: res.data.category,
            products: res.data.data,
          });
        }
      })
      .catch(() => {
        fetchDispatch({
          type: "FETCH_ERROR",
          error: "Failed to load products. Please try again later.",
        });
      });
  }, [id]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (cartItems.some((item) => item.id === product.id)) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discont_price ?? product.price,
        oldPrice: product.discont_price ? product.price : null,
        discount: product.discont_price
          ? Math.round((1 - product.discont_price / product.price) * 100)
          : null,
        image: product.image,
      }),
    );
  };

  const discountPercent = (product) =>
    Math.round((1 - product.discont_price / product.price) * 100);

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

        <MuiLink
          component={Link}
          to="/categories"
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
          Categories
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
          {category ? category.title : "…"}
        </Typography>
      </Breadcrumbs>

      <h1 className={styles.title}>{category ? category.title : ""}</h1>

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
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={styles.card}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.title}
                      className={styles.image}
                    />
                    {product.discont_price && (
                      <span className={styles.badge}>
                        -{discountPercent(product)}%
                      </span>
                    )}
                    {hoveredId === product.id && (
                      <button
                        className={`${styles.addBtn} ${cartItems.some((item) => item.id === product.id) ? styles.addBtnAdded : ""}`}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={cartItems.some(
                          (item) => item.id === product.id,
                        )}
                      >
                        {cartItems.some((item) => item.id === product.id)
                          ? "Added"
                          : "Add to cart"}
                      </button>
                    )}
                  </div>

                  <div className={styles.cardInfo}>
                    <p className={styles.cardTitle}>{product.title}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        ${product.discont_price ?? product.price}
                      </span>
                      {product.discont_price && (
                        <span className={styles.oldPrice}>
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryPage;

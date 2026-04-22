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
  product: null,
  category: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return initialFetchState;
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: null,
        product: action.product,
        category: null,
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        error: action.error,
        product: null,
        category: null,
      };
    case "SET_CATEGORY":
      return { ...state, category: action.category };
    default:
      return state;
  }
}

function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [{ loading, error, product, category }, fetchDispatch] = useReducer(
    fetchReducer,
    initialFetchState,
  );

  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchDispatch({ type: "FETCH_START" });

    axios
      .get(`${BASE_URL}/products/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!data) {
          fetchDispatch({ type: "FETCH_ERROR", error: "Product not found." });
          return;
        }
        fetchDispatch({ type: "FETCH_SUCCESS", product: data });

        if (data.categoryId) {
          axios
            .get(`${BASE_URL}/categories/${data.categoryId}`)
            .then((catRes) => {
              if (catRes.data && catRes.data.category) {
                fetchDispatch({
                  type: "SET_CATEGORY",
                  category: catRes.data.category,
                });
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetchDispatch({
          type: "FETCH_ERROR",
          error: "Failed to load product. Please try again later.",
        });
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
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
        quantity,
      }),
    );
  };

  const discountPercent = product?.discont_price
    ? Math.round((1 - product.discont_price / product.price) * 100)
    : null;

  const breadcrumbTitle = (title) => {
    if (!title) return "";
    const comma = title.indexOf(",");
    if (comma !== -1) return title.slice(comma + 2);
    const words = title.split(" ");
    const first = words[0];
    const rest = words.slice(1).join(" ");
    if (first.length > 1 && first === first.toUpperCase() && rest) {
      return rest;
    }
    return title;
  };

  const isInCart = cartItems.some((item) => item.id === product?.id);

  const breadcrumbLinkSx = {
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
  };

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
          sx={breadcrumbLinkSx}
        >
          Main page
        </MuiLink>

        <MuiLink
          component={Link}
          to="/categories"
          underline="hover"
          sx={breadcrumbLinkSx}
        >
          Categories
        </MuiLink>

        {category && (
          <MuiLink
            component={Link}
            to={`/categories/${category.id}`}
            underline="hover"
            sx={breadcrumbLinkSx}
          >
            {category.title}
          </MuiLink>
        )}

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
          {product ? breadcrumbTitle(product.title) : "…"}
        </Typography>
      </Breadcrumbs>

      {loading && <div className={styles.statusMessage}>Loading…</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {!loading && !error && product && (
        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <img
              src={`${BASE_URL}${product.image}`}
              alt={product.title}
              className={styles.image}
            />
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>
                ${product.discont_price ?? product.price}
              </span>
              {product.discont_price && (
                <>
                  <span className={styles.oldPrice}>${product.price}</span>
                  <span className={styles.badge}>-{discountPercent}%</span>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className={styles.counterValue}>{quantity}</span>
                <button
                  className={styles.counterBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                className={`${styles.addBtn} ${isInCart ? styles.addBtnAdded : ""}`}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? "Added to cart" : "Add to cart"}
              </button>
            </div>

            {product.description && (
              <div className={styles.description}>
                <p className={styles.descriptionLabel}>Description</p>
                <p
                  className={`${styles.descriptionText} ${
                    expanded ? styles.descriptionExpanded : ""
                  }`}
                >
                  {product.description}
                </p>
                {product.description.length > 300 && (
                  <button
                    className={styles.readMoreBtn}
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;

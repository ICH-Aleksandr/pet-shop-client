import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

const discountPct = (p) => Math.round((1 - p.discont_price / p.price) * 100);

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inCart = useSelector((s) => s.cart.items.some((i) => i.id === product.id));

  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (inCart) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discont_price ?? product.price,
        oldPrice: product.discont_price ? product.price : null,
        discount: product.discont_price ? discountPct(product) : null,
        image: product.image,
      }),
    );
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.title}
          className={styles.image}
        />

        {product.discont_price && (
          <span className={styles.badge}>-{discountPct(product)}%</span>
        )}

        {hovered && (
          <button
            className={`${styles.addBtn} ${inCart ? styles.addBtnAdded : ""}`}
            onClick={handleAdd}
            disabled={inCart}
          >
            {inCart ? "Added" : "Add to cart"}
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
            <span className={styles.oldPrice}>${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

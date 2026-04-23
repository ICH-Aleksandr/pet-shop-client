import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import TextField from "@mui/material/TextField";
import homeImg from "../../assets/images/home-img.png";
import firstOrderImg from "../../assets/images/first-order-image.png";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    backgroundColor: "transparent",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
    "&:hover fieldset": { borderColor: "#ffffff" },
    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
  },
  "& .MuiInputBase-input": {
    fontSize: "16px",
    color: "#ffffff",
    padding: "14px 16px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "20px",
    opacity: 1,
  },
};

const discountPct = (p) => Math.round((1 - p.discont_price / p.price) * 100);

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const [hoveredId, setHoveredId] = useState(null);

  const inCart = cartItems.some((i) => i.id === product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (inCart) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discont_price,
        oldPrice: product.price,
        discount: discountPct(product),
        image: product.image,
      }),
    );
  };

  return (
    <Link
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

        <span className={styles.badge}>-{discountPct(product)}%</span>

        {hoveredId === product.id && (
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
          <span className={styles.price}>${product.discont_price}</span>
          <span className={styles.oldPrice}>${product.price}</span>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories/all`)
      .then((r) => setCategories(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/all`)
      .then((r) => {
        const discounted = r.data.filter((p) => p.discont_price);
        const shuffled = [...discounted].sort(() => Math.random() - 0.5);
        setSaleProducts(shuffled.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Enter a valid email";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    axios
      .post(`${BASE_URL}/sale/send`, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      })
      .then(() => {
        setFormSent(true);
        setName("");
        setPhone("");
        setEmail("");
      })
      .catch(() => {
        setErrors({ submit: "Something went wrong. Please try again." });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Amazing Discounts <br /> on Pets Products!
          </h1>
          <button className={styles.heroBtn} onClick={() => navigate("/sales")}>
            Check out
          </button>
        </div>
        <img src={homeImg} alt="pets banner" className={styles.heroImg} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <Link to="/categories" className={styles.allLink}>
            All categories
          </Link>
        </div>

        <div className={styles.catGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className={styles.catCard}
            >
              <div className={styles.catImageWrapper}>
                <img
                  src={`${BASE_URL}${cat.image}`}
                  alt={cat.title}
                  className={styles.catImage}
                />
              </div>
              <p className={styles.catTitle}>{cat.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.firstOrder}>
        <h2 className={styles.firstOrderTitle}>5% off on the first order</h2>

        <div className={styles.firstOrderBody}>
          <img
            src={firstOrderImg}
            alt="5% off on first order"
            className={styles.firstOrderImg}
          />

          <div className={styles.firstOrderForm}>
            {formSent ? (
              <p className={styles.formSuccess}>Request Submitted</p>
            ) : (
              <>
                <TextField
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  sx={textFieldSx}
                />

                {errors.submit && (
                  <span className={styles.errorMsg}>{errors.submit}</span>
                )}

                <button
                  className={styles.discountBtn}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Get a discount"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sale</h2>
          <Link to="/sales" className={styles.allLink}>
            All sales
          </Link>
        </div>

        <div className={styles.grid}>
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

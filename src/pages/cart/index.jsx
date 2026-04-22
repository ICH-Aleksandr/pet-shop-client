import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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

  const handleOrder = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    axios
      .post(`${BASE_URL}/order/send`, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        products: cartItems,
      })
      .then(() => {
        dispatch(clearCart());
        setName("");
        setPhone("");
        setEmail("");
        setShowModal(true);
      })
      .catch(() => {
        setErrors({ submit: "Something went wrong. Please try again." });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      backgroundColor: "#ffffff",
      "& fieldset": { borderColor: "#d9d9d9" },
      "&:hover fieldset": { borderColor: "#8b8b8b" },
      "&.Mui-focused fieldset": { borderColor: "#282828" },
    },
    "& .MuiInputBase-input": {
      fontSize: "16px",
      color: "#282828",
      padding: "14px 16px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#8b8b8b",
      fontSize: "20px",
      opacity: 1,
    },
  };

  if (cartItems.length === 0 && !showModal) {
    return (
      <div className={styles.page}>
        <div className={styles.cartBox}>
          <div className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>Shopping cart</h1>
            <Link to="/products" className={styles.backBtn}>
              Back to the store
            </Link>
          </div>
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Looks like you have no items in your basket currently.
            </p>
            <Link to="/products" className={styles.continueBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.cartBox}>
        <div className={styles.cartHeader}>
          <h1 className={styles.cartTitle}>Shopping cart</h1>
          <Link to="/products" className={styles.backBtn}>
            Back to the store
          </Link>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={`${BASE_URL}${item.image}`}
                  alt={item.title}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <button
                      className={styles.removeBtn}
                      onClick={() => dispatch(removeFromCart(item.id))}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={styles.counter}>
                      <button
                        className={styles.counterBtn}
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        −
                      </button>
                      <span className={styles.counterValue}>
                        {item.quantity}
                      </span>
                      <button
                        className={styles.counterBtn}
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.itemPrice}>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderDetails}>
            <h2 className={styles.orderTitle}>Order details</h2>
            <p className={styles.orderCount}>{totalItems} items</p>
            <div className={styles.orderTotal}>
              <span className={styles.orderTotalLabel}>Total</span>
              <span className={styles.orderTotalPrice}>${totalPrice}</span>
            </div>

            <div className={styles.form}>
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
                className={styles.orderBtn}
                onClick={handleOrder}
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>
              ×
            </button>
            <h2 className={styles.modalTitle}>Congratulations!</h2>
            <p className={styles.modalText}>
              Your order has been successfully placed on the website.
            </p>
            <p className={styles.modalText}>
              A manager will contact you shortly to confirm your order.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

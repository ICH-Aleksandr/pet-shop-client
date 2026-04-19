import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import logo from "../../assets/logo/logo.png";
import basketIcon from "../../assets/icons/basket.svg";
import styles from "./styles.module.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="logo" className={styles.logo} />
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
          <NavLink
            to="/"
            end
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Main Page
          </NavLink>

          <NavLink
            to="/categories"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Categories
          </NavLink>

          <NavLink
            to="/products"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            All products
          </NavLink>

          <NavLink
            to="/sales"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            All sales
          </NavLink>

          <Link
            to="/cart"
            className={styles.cartInMenu}
            onClick={handleLinkClick}
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </nav>

        <Link to="/cart" className={styles.cartLink}>
          <img src={basketIcon} alt="cart" className={styles.cartIcon} />
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </Link>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;

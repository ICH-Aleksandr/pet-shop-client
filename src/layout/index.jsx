import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./styles.module.css";

function Layout() {
  const { pathname } = useLocation();

  return (
    <div className={styles.wrapper}>
      <Header />
      <main
        className={`${styles.main} ${pathname === "/" ? styles.mainHome : ""}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

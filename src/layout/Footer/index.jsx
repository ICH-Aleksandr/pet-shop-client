import instagramIcon from "../../assets/icons/ic-instagram.svg";
import whatsappIcon from "../../assets/icons/ic-whatsapp.svg";
import styles from "./styles.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Contact</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.label}>Phone</span>
            <a href="tel:+4930915884920" className={styles.phone}>
              +49 30 915-88492
            </a>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Socials</span>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a
                href="https://wa.me/4930915884920"
                target="_blank"
                rel="noreferrer"
              >
                <img src={whatsappIcon} alt="WhatsApp" />
              </a>
            </div>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Address</span>
            <p className={styles.address}>
              Wallstraße 9-13, 10179 Berlin, <br /> Deutschland
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Working Hours</span>
            <p className={styles.hours}>24 hours a day</p>
          </div>
        </div>

        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.2316267311066!2d13.401903675683318!3d52.511147136886194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e27db4748a5%3A0x1d538c01013c2c7!2sWallstra%C3%9Fe%209-13%2C%2010179%20Berlin!5e0!3m2!1sru!2sde!4v1776596057892!5m2!1sru!2sde"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="map"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;

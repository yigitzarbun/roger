import { Link } from "react-router-dom";

import paths from "../../routing/Paths";

import styles from "./styles.module.scss";
import Paths from "../../routing/Paths";

const Header = () => {
  const isLoggedIn = false;
  return (
    <div className={styles["header-container"]}>
      <Link to={paths.HOME} className={styles["logo-title"]}>
        Roger
      </Link>
      <nav className={styles["header-nav-container"]}>
        {isLoggedIn ? (
          <>
            <div className={styles["header-nav-sub-container"]}>
              <Link to={paths.TRAIN} className={styles["nav-link"]}>
                Antreman
              </Link>
              <Link to={paths.MATCH} className={styles["nav-link"]}>
                Maç
              </Link>
              <Link to={paths.LESSON} className={styles["nav-link"]}>
                Ders
              </Link>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <Link to={paths.CALENDAR} className={styles["nav-link"]}>
                Takvim
              </Link>

              <Link to={paths.REQUESTS} className={styles["nav-link"]}>
                Davetler
              </Link>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <Link to={paths.PROFILE} className={styles["nav-link"]}>
                Profil
              </Link>
              <Link to={paths.LOGIN} className={styles["logout-link"]}>
                Çıkış
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to={Paths.LOGIN} className={styles["nav-link"]}>
              Giriş
            </Link>
            <Link to={Paths.REGISTER} className={styles["nav-link"]}>
              Kayıt
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
export default Header;

import React from "react";
import styles from "./styles.module.scss";

interface PlayerProfileNavProps {
  handlePage: (page: string) => void;
  page: string;
}
const PlayerProfileNavigation = (props: PlayerProfileNavProps) => {
  const { handlePage, page } = props;
  return (
    <div className={styles.nav}>
      <h4
        onClick={() => handlePage("account")}
        className={page === "account" && styles["active-page"]}
      >
        Hesap
      </h4>
      <h4
        onClick={() => handlePage("payment")}
        className={page === "payment" && styles["active-page"]}
      >
        Ödeme
      </h4>
      <h4
        onClick={() => handlePage("other")}
        className={page === "other" && styles["active-page"]}
      >
        Diğer
      </h4>
    </div>
  );
};
export default PlayerProfileNavigation;

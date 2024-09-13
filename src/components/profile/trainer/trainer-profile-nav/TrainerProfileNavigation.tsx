import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface TrainerProfileNavProps {
  handlePage: (page: string) => void;
  page: string;
}
const TrainerProfileNavigation = (props: TrainerProfileNavProps) => {
  const { handlePage, page } = props;

  const { t } = useTranslation();

  return (
    <div className={styles.nav}>
      <h4
        onClick={() => handlePage("account")}
        className={page === "account" ? styles["active-page"] : ""}
      >
        {t("account")}
      </h4>
      <h4
        onClick={() => handlePage("payment")}
        className={page === "payment" ? styles["active-page"] : ""}
      >
        {t("payment")}
      </h4>
      <h4
        onClick={() => handlePage("other")}
        className={page === "other" ? styles["active-page"] : ""}
      >
        {t("other")}
      </h4>
    </div>
  );
};
export default TrainerProfileNavigation;

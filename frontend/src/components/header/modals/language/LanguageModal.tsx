import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface LanguageModalProps {
  isLanguageModalOpen: boolean;
  handleCloseLanguageModal: () => void;
}

const LanguageModal = (props: LanguageModalProps) => {
  const { isLanguageModalOpen, handleCloseLanguageModal } = props;

  const { i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "tr");

  const updateLanguage = (language) => {
    const storedData = localStorage.getItem("tennis_app_user");

    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        userData.language = language;
        localStorage.setItem("tennis_app_user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    } else {
      // Handle language change for non-logged-in users
      console.log(
        "No user data found. Setting default language in local storage."
      );
    }

    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    handleCloseLanguageModal();
  };

  useEffect(() => {
    const storedData = localStorage.getItem("tennis_app_user");
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        const lsLanguage = userData.language;
        setCurrentLanguage(lsLanguage || "tr");
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    } else {
      setCurrentLanguage(i18n.language || "tr"); // Default to 'tr' if no user data
    }
  }, [i18n.language]);

  return (
    <ReactModal
      isOpen={isLanguageModalOpen}
      onRequestClose={handleCloseLanguageModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseLanguageModal} />
      <div className={styles["modal-content"]}>
        <div
          onClick={() => updateLanguage("tr")}
          className={
            currentLanguage === "tr"
              ? styles["active-menu-item"]
              : styles["menu-item"]
          }
        >
          <h4>Türkçe</h4>
        </div>
        <div
          onClick={() => updateLanguage("en")}
          className={
            currentLanguage === "en"
              ? styles["active-menu-item"]
              : styles["menu-item"]
          }
        >
          <h4>English</h4>
        </div>
      </div>
    </ReactModal>
  );
};

export default LanguageModal;

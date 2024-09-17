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

  const updateLanguage = (language) => {
    const storedData = localStorage.getItem("tennis_app_user");

    if (storedData) {
      try {
        const userData = JSON.parse(storedData);

        userData.language = language;

        const updatedUserData = JSON.stringify(userData);

        localStorage.setItem("tennis_app_user", updatedUserData);

        i18n.changeLanguage(language);

        handleCloseLanguageModal();
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    } else {
      console.log('No data found in local storage for key "tennis_app_user"');
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState("");

  const storedData = localStorage.getItem("tennis_app_user");

  useEffect(() => {
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        const lsLanguage = userData.language;
        const language = lsLanguage ?? "tr";
        setCurrentLanguage(language);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    } else {
      console.log('No data found in local storage for key "tennis_app_user"');
    }
  }, []);

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

import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { LocalStorageKeys } from "../../../../common/constants/lsConstants";

interface LanguageModalProps {
  isLanguageModalOpen: boolean;
  handleCloseLanguageModal: () => void;
}
const LanguageModal = (props: LanguageModalProps) => {
  const { isLanguageModalOpen, handleCloseLanguageModal } = props;
  const { i18n } = useTranslation();

  const updateLanguage = (language: string) => {
    localStorage.setItem(LocalStorageKeys.language, language);
    i18n.changeLanguage(language);
    handleCloseLanguageModal();
  };
  const currentLanguage =
    localStorage.getItem(LocalStorageKeys.language) ?? "tr";

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

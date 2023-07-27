import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";

interface AddCourtButtonProps {
  openModal: () => void;
}

const AddCourtButton = (props: AddCourtButtonProps) => {
  const { openModal } = props;
  return (
    <div className={styles["add-court-container"]}>
      <button onClick={openModal} className={styles["add-court-button"]}>
        <FaPlusSquare className={styles["add-icon"]} />
        <h2 className={styles["add-title"]}>Yeni Kort Ekle</h2>
      </button>
    </div>
  );
};

export default AddCourtButton;

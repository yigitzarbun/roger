import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";

interface AddCourtButtonProps {
  openAddCourtModal: () => void;
}

const AddCourtButton = (props: AddCourtButtonProps) => {
  const { openAddCourtModal } = props;
  return (
    <div className={styles["add-court-container"]}>
      <button
        onClick={openAddCourtModal}
        className={styles["add-court-button"]}
      >
        <FaPlusSquare className={styles["add-icon"]} />
        <h2 className={styles["add-title"]}>Yeni Kort Ekle</h2>
      </button>
    </div>
  );
};

export default AddCourtButton;

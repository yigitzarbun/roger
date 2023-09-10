import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";

import { useGetClubByClubIdQuery } from "../../../api/endpoints/ClubsApi";
import { useAppSelector } from "../../../store/hooks";
import PageLoading from "../../../components/loading/PageLoading";

interface AddCourtButtonProps {
  openAddCourtModal: () => void;
}

const AddCourtButton = (props: AddCourtButtonProps) => {
  const { openAddCourtModal } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: currentClub, isLoading: isCurrentClubLoading } =
    useGetClubByClubIdQuery(user?.clubDetails?.club_id);

  const clubBankDetailsExist =
    currentClub?.[0]["iban"] &&
    currentClub?.[0]["bank_id"] &&
    currentClub?.[0]["name_on_bank_account"];

  if (isCurrentClubLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["add-court-container"]}>
      <button
        onClick={openAddCourtModal}
        className={styles["add-court-button"]}
        disabled={!clubBankDetailsExist}
      >
        <FaPlusSquare className={styles["add-icon"]} />
        <h2 className={styles["add-title"]}>
          {clubBankDetailsExist
            ? "Yeni Kort Ekle"
            : "Kort Eklemek İçin Banka Hesap Bilgilerinizi Ekleyin"}
        </h2>
      </button>
    </div>
  );
};

export default AddCourtButton;

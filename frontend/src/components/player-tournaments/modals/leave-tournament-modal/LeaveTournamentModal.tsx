import React, { useEffect } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useGetClubByUserIdQuery } from "../../../../../api/endpoints/ClubsApi";
import { imageUrl } from "../../../../common/constants/apiConstants";
import { useUpdateTournamentParticipantMutation } from "../../../../../api/endpoints/TournamentParticipantsApi";
import { useAppSelector } from "../../../../store/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PageLoading from "../../../../components/loading/PageLoading";

interface LeaveTournamentModalModalProps {
  leaveModal: boolean;
  closeLeaveTournamentModal: () => void;
  selectedTournament: any;
  refetchMyTournaments: () => void;
}
const LeaveTournamentModal = (props: LeaveTournamentModalModalProps) => {
  const {
    leaveModal,
    closeLeaveTournamentModal,
    selectedTournament,
    refetchMyTournaments,
  } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const date = new Date();

  const currentYear = date.getFullYear();

  const [
    updateTournamentParticipant,
    { isSuccess: isUpdateParticipantSuccess },
  ] = useUpdateTournamentParticipantMutation({});

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByUserIdQuery(selectedTournament?.club_user_id);

  const handleWithdrawParticipant = () => {
    const tournamentWithdrawData = {
      tournament_participant_id: selectedTournament?.tournament_participant_id,
      is_active: false,
      tournament_id: selectedTournament?.tournament_id,
      player_user_id: user?.user?.user_id,
      payment_id: selectedTournament?.payment_id,
    };
    updateTournamentParticipant(tournamentWithdrawData);
  };

  useEffect(() => {
    if (isUpdateParticipantSuccess) {
      toast.success("Turnuvadan ayrıldınız");
      refetchMyTournaments();
      closeLeaveTournamentModal();
    }
  }, [isUpdateParticipantSuccess]);

  if (isSelectedClubLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={leaveModal}
      onRequestClose={closeLeaveTournamentModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeLeaveTournamentModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>{t("leaveTournamentTitle")}</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              selectedClub?.[0]?.image
                ? `${imageUrl}/${selectedClub?.[0]?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p>{`${t("leaveTournamentText")} ${
            selectedTournament?.tournament_name
          }`}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t("userTypeClub")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("start")}</th>
              <th>{t("end")}</th>
              <th>{t("admissionFee")}</th>
              <th>{t("gender")}</th>
              <th>{t("ageGap")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles["tournament-row"]}>
              <td>{selectedTournament?.club_name}</td>
              <td>{selectedTournament?.location_name}</td>
              <td>{selectedTournament?.start_date?.slice(0, 10)}</td>
              <td>{selectedTournament?.end_date?.slice(0, 10)}</td>
              <td>{`${selectedTournament?.application_fee} TL`}</td>
              <td>
                {selectedTournament?.tournament_gender === "female"
                  ? t("female")
                  : t("male")}
              </td>
              <td>{`${currentYear - selectedTournament?.min_birth_year} - ${
                currentYear - selectedTournament?.max_birth_year
              }`}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeLeaveTournamentModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleWithdrawParticipant}
            className={styles["submit-button"]}
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default LeaveTournamentModal;

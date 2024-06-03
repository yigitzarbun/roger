import React, { useEffect } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useGetClubByUserIdQuery } from "../../../../api/endpoints/ClubsApi";
import { localUrl } from "../../../../common/constants/apiConstants";
import { useAddTournamentParticipantMutation } from "../../../../api/endpoints/TournamentParticipantsApi";
import { useAppSelector } from "../../../../store/hooks";
import { useAddPaymentMutation } from "../../../../api/endpoints/PaymentsApi";
import { toast } from "react-toastify";

interface AddTournamentParticipantModalProps {
  participateModal: boolean;
  closeAddTournamentParticipantModal: () => void;
  selectedTournament: any;
  selectedClubUserId: number;
  refetchMyTournaments: () => void;
}
export const AddTournamentParticipantModal = (
  props: AddTournamentParticipantModalProps
) => {
  const {
    participateModal,
    closeAddTournamentParticipantModal,
    selectedTournament,
    selectedClubUserId,
    refetchMyTournaments,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const [addTournamentParticipant, { isSuccess: isAddParticipantSuccess }] =
    useAddTournamentParticipantMutation({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByUserIdQuery(selectedClubUserId);

  console.log(selectedClub);

  const handleAddParticipant = () => {
    // validations
    // club subscription required?
    // player payment details exist
    // gender suitable
    // age suitable
    // max katılımcı sayısı

    // if validations pass, add payment
    const paymentData = {
      payment_amount: selectedTournament?.application_fee,
      payment_status: "success",
      payment_type_id: 6,
      recipient_club_id: selectedClubUserId,
      sender_tournament_participant_id: user?.user?.user_id,
    };

    addPayment(paymentData);
  };

  useEffect(() => {
    if (isPaymentSuccess) {
      const newParticipantData = {
        is_active: true,
        tournament_id: selectedTournament.tournament_id,
        player_user_id: user?.user?.user_id,
        payment_id: paymentData?.payment_id,
      };
      addTournamentParticipant(newParticipantData);
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isAddParticipantSuccess) {
      toast.success("Katılım başarılı");
      refetchMyTournaments();
      closeAddTournamentParticipantModal();
    }
  }, [isAddParticipantSuccess]);

  return (
    <ReactModal
      isOpen={participateModal}
      onRequestClose={closeAddTournamentParticipantModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeAddTournamentParticipantModal}
      />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Turnuvaya Katıl</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              selectedClub?.[0]?.image
                ? `${localUrl}/${selectedClub?.[0]?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p>{`${selectedTournament?.tournament_name} turnuvasına katılmayı onaylıyor musunuz?`}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Kulüp</th>
              <th>Konum</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Katılım Ücreti</th>
              <th>Cinsiyet</th>
              <th>Yaş Aralığı</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles["tournament-row"]}>
              <td>{selectedTournament?.club_name}</td>
              <td>{selectedTournament?.location_name}</td>
              <td>{selectedTournament?.start_date?.slice(0, 10)}</td>
              <td>{selectedTournament?.end_date?.slice(0, 10)}</td>
              <td>{`${selectedTournament?.application_fee} TL`}</td>
              <td>{selectedTournament?.tournament_gender}</td>
              <td>{`${selectedTournament?.min_birth_year} - ${selectedTournament?.max_birth_year}`}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeAddTournamentParticipantModal}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleAddParticipant}
            className={styles["submit-button"]}
          >
            Onayla
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

import React, { useEffect } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useGetClubByUserIdQuery } from "../../../../../api/endpoints/ClubsApi";
import { imageUrl } from "../../../../common/constants/apiConstants";
import {
  useAddTournamentParticipantMutation,
  useGetTournamentParticipantsByFilterQuery,
} from "../../../../../api/endpoints/TournamentParticipantsApi";
import { useAppSelector } from "../../../../store/hooks";
import { useAddPaymentMutation } from "../../../../../api/endpoints/PaymentsApi";
import { toast } from "react-toastify";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../../api/endpoints/ClubSubscriptionsApi";
import {
  useGetPlayerByUserIdQuery,
  useGetPlayerPaymentDetailsExistQuery,
} from "../../../../../api/endpoints/PlayersApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface AddTournamentParticipantModalProps {
  participateModal: boolean;
  closeAddTournamentParticipantModal: () => void;
  selectedTournament: any;
  selectedClubUserId: number;
  refetchMyTournaments: () => void;
  refetchPaginatedTournaments: () => void;
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
    refetchPaginatedTournaments,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const date = new Date();
  const currentYear = date.getFullYear();

  const applicationDeadline = new Date(
    selectedTournament?.application_deadline
  );

  function isSameOrBefore(date1, date2) {
    return (
      date1.getFullYear() < date2.getFullYear() ||
      (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() < date2.getMonth()) ||
      (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() <= date2.getDate())
    );
  }

  const canStillApply = isSameOrBefore(date, applicationDeadline);

  const [addTournamentParticipant, { isSuccess: isAddParticipantSuccess }] =
    useAddTournamentParticipantMutation({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByUserIdQuery(selectedClubUserId);

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const isSubscriptionRequired = selectedTournament?.club_subscription_required;

  const { data: isPlayerSubscribed, isLoading: isPlayerSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery({
      club_id: selectedClubUserId,
      player_id: user?.user?.user_id,
      is_active: true,
    });

  const {
    data: playerPaymentDetailsExist,
    isLoading: isPlayerPaymentDetailsExistLoading,
  } = useGetPlayerPaymentDetailsExistQuery(user?.user?.user_id);

  const {
    data: isPlayerAlreadyParticipant,
    isLoading: isPlayerAlreadyParticipantLoading,
  } = useGetTournamentParticipantsByFilterQuery({
    tournament_id: selectedTournament?.tournament_id,
    player_user_id: user?.user?.user_id,
    is_active: true,
  });

  const handleAddParticipant = () => {
    if (isSubscriptionRequired && isPlayerSubscribed?.length === 0) {
      toast.error("Katılım için kulübe üye olmanız gerekmektedir");
      return false;
    } else if (!playerPaymentDetailsExist) {
      toast.error("Ödeme bilgileriniz eksik");

      return false;
    } else if (
      currentPlayer?.[0]?.gender !== selectedTournament?.tournament_gender
    ) {
      toast.error("Turnuva cinsiyeti uygun değil");

      return false;
    } else if (
      Number(currentPlayer?.[0]?.birth_year) >
        Number(selectedTournament?.min_birth_year) ||
      Number(currentPlayer?.[0]?.birth_year) <
        Number(selectedTournament?.max_birth_year)
    ) {
      toast.error("Yaşınız turnuva için uygun değil");

      return false;
    } else if (
      Number(selectedTournament?.maxPlayers) -
        Number(selectedTournament?.participant_count) ===
      0
    ) {
      toast.error("Kontenjan yetersiz");

      return false;
    } else if (isPlayerAlreadyParticipant?.length > 0) {
      toast.error("Turnuvada zaten katılımcısınız");

      return false;
    } else if (!canStillApply) {
      toast.error("Başvuru tarihi geçti");
      return false;
    } else {
      const paymentData = {
        payment_amount: selectedTournament?.application_fee,
        payment_status: "success",
        payment_type_id: 6,
        recipient_club_id: selectedClubUserId,
        sender_tournament_participant_id: user?.user?.user_id,
      };

      addPayment(paymentData);
    }
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
      refetchPaginatedTournaments();
      closeAddTournamentParticipantModal();
    }
  }, [isAddParticipantSuccess]);

  if (
    isSelectedClubLoading ||
    isCurrentPlayerLoading ||
    isPlayerSubscribedLoading ||
    isPlayerPaymentDetailsExistLoading ||
    isPlayerAlreadyParticipantLoading
  ) {
    return <PageLoading />;
  }
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
                ? `${imageUrl}/${selectedClub?.[0]?.image}`
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
              <td>{`${currentYear - selectedTournament?.min_birth_year} - ${
                currentYear - selectedTournament?.max_birth_year
              }`}</td>
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

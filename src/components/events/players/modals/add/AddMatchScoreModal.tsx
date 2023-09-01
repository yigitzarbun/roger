import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";

import {
  useUpdateMatchScoreMutation,
  useGetMatchScoresQuery,
} from "../../../../../api/endpoints/MatchScoresApi";

import { useGetBookingsQuery } from "../../../../../api/endpoints/BookingsApi";

import { useGetPlayersQuery } from "../../../../../api/endpoints/PlayersApi";

import PageLoading from "../../../../../components/loading/PageLoading";

interface AddMatchScoreModalProps {
  isAddScoreModalOpen: boolean;
  closeAddScoreModal: () => void;
  selectedMatchScoreId: number;
}

type FormValues = {
  inviter_first_set_games_won: number;
  inviter_second_set_games_won: number;
  inviter_third_set_games_won: number;
  invitee_first_set_games_won: number;
  invitee_second_set_games_won: number;
  invitee_third_set_games_won: number;
  winner_id: number;
};

const AddMatchScoreModal = (props: AddMatchScoreModalProps) => {
  const { isAddScoreModalOpen, closeAddScoreModal, selectedMatchScoreId } =
    props;

  const user = useAppSelector((store) => store?.user?.user);

  const [updateMatchScore, { isSuccess: isUpdateMatchScoreSuccess }] =
    useUpdateMatchScoreMutation({});

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const {
    data: matchScores,
    isLoading: isMatchScoresLoading,
    refetch: refetchMatchScores,
  } = useGetMatchScoresQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const selectedMatch = matchScores?.find(
    (match) => match.match_score_id === selectedMatchScoreId
  );

  const selectedMatchBookingDetails = bookings?.find(
    (booking) => booking.booking_id === selectedMatch?.booking_id
  );

  const inviter = players?.find(
    (player) => player.user_id === selectedMatchBookingDetails?.inviter_id
  );

  const invitee = players?.find(
    (player) => player.user_id === selectedMatchBookingDetails?.invitee_id
  );

  const [firstSetInviter, setFirstSetInviter] = useState(null);
  const [firstSetInvitee, setFirstSetInvitee] = useState(null);
  const [secondSetInviter, setSecondSetInviter] = useState(null);
  const [secondSetInvitee, setSecondSetInvitee] = useState(null);

  const [thirdSetVisible, setThirdSetVisible] = useState(false);

  const [thirdSetInviter, setThirdSetInviter] = useState(null);
  const [thirdSetInvitee, setThirdSetInvitee] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const matchScore = {
        ...selectedMatch,
        inviter_first_set_games_won: Number(firstSetInviter),
        inviter_second_set_games_won: Number(secondSetInviter),
        inviter_third_set_games_won: Number(thirdSetInviter),
        invitee_first_set_games_won: Number(firstSetInvitee),
        invitee_second_set_games_won: Number(secondSetInvitee),
        invitee_third_set_games_won: Number(thirdSetInvitee),
        winner_id:
          firstSetInviter > firstSetInvitee &&
          secondSetInviter > secondSetInvitee
            ? inviter?.user_id
            : firstSetInviter < firstSetInvitee &&
              secondSetInviter < secondSetInvitee
            ? invitee?.user_id
            : thirdSetInviter > thirdSetInvitee
            ? inviter?.user_id
            : thirdSetInviter < thirdSetInvitee
            ? invitee?.user_id
            : null,
        match_score_status_type_id: 2,
        reporter_id: user?.user?.user_id,
      };
      updateMatchScore(matchScore);
      console.log(matchScore);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      firstSetInviter &&
      firstSetInvitee &&
      secondSetInviter &&
      secondSetInvitee
    ) {
      const firstSetWinner =
        firstSetInviter > firstSetInvitee ? inviter : invitee;

      const secondSetWinner =
        secondSetInviter > secondSetInvitee ? inviter : invitee;

      if (firstSetWinner?.user_id !== secondSetWinner?.user_id) {
        setThirdSetVisible(true);
      } else {
        setThirdSetVisible(false);
      }
    }
  }, [firstSetInvitee, firstSetInviter, secondSetInvitee, secondSetInviter]);

  useEffect(() => {
    if (isUpdateMatchScoreSuccess) {
      refetchMatchScores();
      reset({
        inviter_first_set_games_won: null,
        inviter_second_set_games_won: null,
        inviter_third_set_games_won: null,
        invitee_first_set_games_won: null,
        invitee_second_set_games_won: null,
        invitee_third_set_games_won: null,
        winner_id: null,
      });
      closeAddScoreModal();
    }
  }, [isUpdateMatchScoreSuccess, closeAddScoreModal]);

  if (isBookingsLoading || isMatchScoresLoading || isPlayersLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isAddScoreModalOpen}
      onRequestClose={closeAddScoreModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Maç Skoru Ekle</h1>
        <FaWindowClose
          onClick={closeAddScoreModal}
          className={styles["close-icon"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <h4>1. Set</h4>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>{`${inviter?.fname} ${inviter?.lname} 1. Set`}</label>
            <input
              {...register("inviter_first_set_games_won", {
                required: true,
                min: { value: 0, message: "En az 0 olabilir" },
                max: { value: 7, message: "En fazla 7 olabilir" },
              })}
              type="number"
              min="0"
              onChange={(e) => setFirstSetInviter(Number(e.target.value))}
            />
            {errors.inviter_first_set_games_won && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>{`${invitee?.fname} ${invitee?.lname} 1. Set`}</label>
            <input
              {...register("invitee_first_set_games_won", { required: true })}
              type="number"
              min="0"
              onChange={(e) => setFirstSetInvitee(Number(e.target.value))}
            />
            {errors.invitee_first_set_games_won && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <h4>2. Set</h4>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>{`${inviter?.fname} ${inviter?.lname} 2. Set`}</label>
            <input
              {...register("inviter_second_set_games_won", {
                min: { value: 0, message: "En az 0 olabilir" },
              })}
              type="number"
              min="0"
              onChange={(e) => setSecondSetInviter(Number(e.target.value))}
            />
            {errors.inviter_second_set_games_won && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>{`${invitee?.fname} ${invitee?.lname} 2. Set`}</label>
            <input
              {...register("invitee_second_set_games_won", {
                max: { value: 7, message: "En fazla 7 olabilir" },
              })}
              type="number"
              min="0"
              onChange={(e) => setSecondSetInvitee(Number(e.target.value))}
            />
            {errors.invitee_second_set_games_won && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        {thirdSetVisible && (
          <>
            <h4>3. Set</h4>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>{`${inviter?.fname} ${inviter?.lname} 3. Set`}</label>
                <input
                  {...register("inviter_third_set_games_won", {
                    min: { value: 0, message: "En az 0 olabilir" },
                  })}
                  type="number"
                  min="0"
                  onChange={(e) => setThirdSetInviter(Number(e.target.value))}
                />
                {errors.inviter_third_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>{`${invitee?.fname} ${invitee?.lname} 3. Set`}</label>
                <input
                  {...register("invitee_third_set_games_won", {
                    max: { value: 7, message: "En fazla 7 olabilir" },
                  })}
                  type="number"
                  min="0"
                  onChange={(e) => setThirdSetInvitee(Number(e.target.value))}
                />
                {errors.invitee_third_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </Modal>
  );
};

export default AddMatchScoreModal;

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

interface EditMatchScoreModalProps {
  isEditScoreModalOpen: boolean;
  closeEditScoreModal: () => void;
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

const EditMatchScoreModal = (props: EditMatchScoreModalProps) => {
  const { isEditScoreModalOpen, closeEditScoreModal, selectedMatchScoreId } =
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

  const inviter = players.find(
    (player) => player.user_id === selectedMatchBookingDetails?.inviter_id
  );

  const invitee = players.find(
    (player) => player.user_id === selectedMatchBookingDetails?.invitee_id
  );

  const [scoreConfirmDecision, setScoreConfirmDecision] = useState("");

  const [firstSetInviter, setFirstSetInviter] = useState(null);
  const [firstSetInvitee, setFirstSetInvitee] = useState(null);
  const [secondSetInviter, setSecondSetInviter] = useState(null);
  const [secondSetInvitee, setSecondSetInvitee] = useState(null);

  const [thirdSetVisible, setThirdSetVisible] = useState(false);

  const [thirdSetInviter, setThirdSetInviter] = useState(null);
  const [thirdSetInvitee, setThirdSetInvitee] = useState(null);

  const handleConfirmScore = () => {
    const score = {
      ...selectedMatch,
      match_score_status_type_id: 3,
      reporter_id: user?.user?.user_id,
    };
    updateMatchScore(score);
  };

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
        inviter_first_set_games_won: Number(
          formData?.inviter_first_set_games_won
        ),
        inviter_second_set_games_won: Number(
          formData?.inviter_second_set_games_won
        ),
        inviter_third_set_games_won: Number(
          formData?.inviter_third_set_games_won
        ),
        invitee_first_set_games_won: Number(
          formData?.invitee_first_set_games_won
        ),
        invitee_second_set_games_won: Number(
          formData?.invitee_second_set_games_won
        ),
        invitee_third_set_games_won: Number(
          formData?.invitee_third_set_games_won
        ),
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
      closeEditScoreModal();
      reset();
    }
  }, [isUpdateMatchScoreSuccess]);

  if (isBookingsLoading || isMatchScoresLoading || isPlayersLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <Modal
      isOpen={isEditScoreModalOpen}
      onRequestClose={closeEditScoreModal}
      className={styles["modal-container"]}
    >
      {scoreConfirmDecision === "" && (
        <div className={styles["decision-container"]}>
          <h2>Maç Skorunu Doğru Mu?</h2>
          <p>{`${
            players?.find(
              (player) => player.user_id === selectedMatch?.reporter_id
            )?.fname
          } ${
            players?.find(
              (player) => player.user_id === selectedMatch?.reporter_id
            )?.lname
          } maç skorunu şu şekilde kayıt etti:`}</p>
          <table>
            <thead>
              <tr>
                <th>Davet Eden</th>
                <th>Davet Edilen</th>
                <th>1. Set</th>
                <th>2. Set</th>
                <th>3. Set</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{`${inviter?.fname} ${inviter?.lname}`}</td>
                <td>{`${invitee?.fname} ${invitee?.lname}`}</td>
                <td>{`${selectedMatch?.inviter_first_set_games_won}-${selectedMatch?.invitee_first_set_games_won}`}</td>
                <td>{`${selectedMatch?.inviter_second_set_games_won}-${selectedMatch?.invitee_second_set_games_won}`}</td>
                {selectedMatch?.inviter_third_set_games_won &&
                selectedMatch?.invitee_third_set_games_won ? (
                  <td>{`${selectedMatch?.inviter_third_set_games_won}-${selectedMatch?.invitee_third_set_games_won}`}</td>
                ) : (
                  "-"
                )}
              </tr>
            </tbody>
          </table>
          <div className={styles["decision-buttons-container"]}>
            <button
              onClick={() => setScoreConfirmDecision("edit")}
              className={styles["decision-button"]}
            >
              Değişiklik Talep Et
            </button>
            <button
              onClick={handleConfirmScore}
              className={styles["decision-button"]}
            >
              Skoru Onayla
            </button>
          </div>
        </div>
      )}
      {scoreConfirmDecision === "edit" && (
        <>
          <div className={styles["top-container"]}>
            <h1 className={styles.title}>Maç Skoru Değiştir</h1>
            <FaWindowClose
              onClick={closeEditScoreModal}
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
                <label>
                  {`${inviter?.fname} ${inviter?.lname} 1. Set Kazandığı Oyun Adeti`}
                </label>
                <input
                  {...register("inviter_first_set_games_won", {
                    required: true,
                    min: { value: 0, message: "En az 0 olabilir" },
                    max: { value: 7, message: "En fazla 7 olabilir" },
                  })}
                  type="number"
                  min="0"
                  value={firstSetInviter || null}
                  onChange={(e) => setFirstSetInviter(Number(e.target.value))}
                />
                {errors.inviter_first_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>
                  {`${invitee?.fname} ${invitee?.lname} 1. Set Kazandığı Oyun Adeti`}
                </label>
                <input
                  {...register("invitee_first_set_games_won", {
                    required: true,
                  })}
                  type="number"
                  min="0"
                  value={firstSetInvitee || null}
                  onChange={(e) => setFirstSetInvitee(Number(e.target.value))}
                />
                {errors.invitee_first_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <h4>2. Set</h4>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>{`${inviter?.fname} ${inviter?.lname} 2. Set Kazandığı Oyun Adeti`}</label>
                <input
                  {...register("inviter_second_set_games_won", {
                    min: { value: 0, message: "En az 0 olabilir" },
                  })}
                  type="number"
                  min="0"
                  value={secondSetInviter || null}
                  onChange={(e) => setSecondSetInviter(Number(e.target.value))}
                />
                {errors.inviter_second_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>
                  {`${invitee?.fname} ${invitee?.lname} 2. Set Kazandığı Oyun Adeti`}
                </label>
                <input
                  {...register("invitee_second_set_games_won", {
                    max: { value: 7, message: "En fazla 7 olabilir" },
                  })}
                  type="number"
                  min="0"
                  value={secondSetInvitee || null}
                  onChange={(e) => setSecondSetInvitee(Number(e.target.value))}
                />
                {errors.invitee_second_set_games_won && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            {thirdSetVisible && (
              <>
                <h4>3. Set</h4>
                <div className={styles["input-outer-container"]}>
                  <div className={styles["input-container"]}>
                    <label>{`${inviter?.fname} ${inviter?.lname} 3. Set Kazandığı Oyun Adeti`}</label>
                    <input
                      {...register("inviter_third_set_games_won", {
                        min: { value: 0, message: "En az 0 olabilir" },
                      })}
                      type="number"
                      min="0"
                      value={thirdSetInviter || null}
                      onChange={(e) =>
                        setThirdSetInviter(Number(e.target.value))
                      }
                    />
                    {errors.inviter_third_set_games_won && (
                      <span className={styles["error-field"]}>
                        Bu alan zorunludur.
                      </span>
                    )}
                  </div>
                  <div className={styles["input-container"]}>
                    <label>
                      {`${invitee?.fname} ${invitee?.lname} 3. Set Kazandığı Oyun Adeti`}
                    </label>
                    <input
                      {...register("invitee_third_set_games_won", {
                        max: { value: 7, message: "En fazla 7 olabilir" },
                      })}
                      type="number"
                      min="0"
                      value={thirdSetInvitee || null}
                      onChange={(e) =>
                        setThirdSetInvitee(Number(e.target.value))
                      }
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
        </>
      )}
    </Modal>
  );
};

export default EditMatchScoreModal;

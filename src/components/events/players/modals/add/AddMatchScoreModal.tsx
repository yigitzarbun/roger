import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Modal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";

import {
  useUpdateMatchScoreMutation,
  useGetMatchScoresQuery,
} from "../../../../../api/endpoints/MatchScoresApi";

import { useGetPlayersByFilterQuery } from "../../../../../api/endpoints/PlayersApi";

import PageLoading from "../../../../../components/loading/PageLoading";

type FormValues = {
  inviter_first_set_games_won: number;
  inviter_second_set_games_won: number;
  inviter_third_set_games_won: number;
  invitee_first_set_games_won: number;
  invitee_second_set_games_won: number;
  invitee_third_set_games_won: number;
  winner_id: number;
};

const AddMatchScoreModal = (props) => {
  const { isAddScoreModalOpen, closeAddScoreModal, selectedMatchScore } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const [updateMatchScore, { isSuccess: isUpdateMatchScoreSuccess }] =
    useUpdateMatchScoreMutation({});

  const { refetch: refetchMatchScores } = useGetMatchScoresQuery({});

  const [playerSkip, setPlayerSkip] = useState(true);

  const { data: inviter, isLoading: isInviterLoading } =
    useGetPlayersByFilterQuery(
      {
        user_id: selectedMatchScore?.inviter_id,
      },
      { skip: playerSkip }
    );

  const { data: invitee, isLoading: isInviteeLoading } =
    useGetPlayersByFilterQuery(
      {
        user_id: selectedMatchScore?.invitee_id,
      },
      { skip: playerSkip }
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
        match_score_id: selectedMatchScore?.match_score_id,
        inviter_first_set_games_won: Number(firstSetInviter),
        inviter_second_set_games_won: Number(secondSetInviter),
        inviter_third_set_games_won: Number(thirdSetInviter),
        invitee_first_set_games_won: Number(firstSetInvitee),
        invitee_second_set_games_won: Number(secondSetInvitee),
        invitee_third_set_games_won: Number(thirdSetInvitee),
        winner_id:
          firstSetInviter > firstSetInvitee &&
          secondSetInviter > secondSetInvitee
            ? inviter?.[0]?.user_id
            : firstSetInviter < firstSetInvitee &&
              secondSetInviter < secondSetInvitee
            ? invitee?.[0]?.user_id
            : thirdSetInviter > thirdSetInvitee
            ? inviter?.[0]?.user_id
            : thirdSetInviter < thirdSetInvitee
            ? invitee?.[0]?.user_id
            : null,
        match_score_status_type_id: 2,
        reporter_id: user?.user?.user_id,
        booking_id: selectedMatchScore?.booking_id,
      };
      updateMatchScore(matchScore);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedMatchScore) {
      setPlayerSkip(false);
    }
  }, [selectedMatchScore]);

  useEffect(() => {
    if (
      firstSetInviter &&
      firstSetInvitee &&
      secondSetInviter &&
      secondSetInvitee
    ) {
      const firstSetWinner =
        firstSetInviter > firstSetInvitee ? inviter?.[0] : invitee?.[0];

      const secondSetWinner =
        secondSetInviter > secondSetInvitee ? inviter?.[0] : invitee?.[0];

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
      toast.success("Başarıyla gönderildi");
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
  }, [isUpdateMatchScoreSuccess]);

  if (isInviterLoading || isInviteeLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isAddScoreModalOpen}
      onRequestClose={closeAddScoreModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeAddScoreModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Maç Skoru Ekle</h1>
        <div className={styles["opponent-container"]}>
          {/* invitee mi inviter mi check? */}
          <img
            src={
              inviter?.[0]?.user_id === user?.user?.user_id &&
              invitee?.[0]?.image
                ? invitee?.[0]?.image
                : invitee?.[0]?.user_id === user?.user?.user_id &&
                  inviter?.[0]?.image
                ? inviter?.[0]?.image
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p
            className={styles["player-name"]}
          >{`${invitee?.[0].fname} ${invitee?.[0].lname}`}</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["top-row"]}>
            <div className={styles["set-container"]}>
              <h4>1. Set</h4>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{`${inviter?.[0]?.fname} ${inviter?.[0]?.lname}`}</label>
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
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
                <div className={styles["input-container"]}>
                  <label>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</label>
                  <input
                    {...register("invitee_first_set_games_won", {
                      required: true,
                    })}
                    type="number"
                    min="0"
                    onChange={(e) => setFirstSetInvitee(Number(e.target.value))}
                  />
                  {errors.invitee_first_set_games_won && (
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles["set-container"]}>
              <h4>2. Set</h4>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{`${inviter?.[0]?.fname} ${inviter?.[0]?.lname}`}</label>
                  <input
                    {...register("inviter_second_set_games_won", {
                      min: { value: 0, message: "En az 0 olabilir" },
                    })}
                    type="number"
                    min="0"
                    onChange={(e) =>
                      setSecondSetInviter(Number(e.target.value))
                    }
                  />
                  {errors.inviter_second_set_games_won && (
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
                <div className={styles["input-container"]}>
                  <label>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</label>
                  <input
                    {...register("invitee_second_set_games_won", {
                      max: { value: 7, message: "En fazla 7 olabilir" },
                    })}
                    type="number"
                    min="0"
                    onChange={(e) =>
                      setSecondSetInvitee(Number(e.target.value))
                    }
                  />
                  {errors.invitee_second_set_games_won && (
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {thirdSetVisible && (
            <div className={styles["top-row"]}>
              <div className={styles["set-container"]}>
                <h4>3. Set</h4>
                <div className={styles["input-outer-container"]}>
                  <div className={styles["input-container"]}>
                    <label>{`${inviter?.[0]?.fname} ${inviter?.[0]?.lname}`}</label>
                    <input
                      {...register("inviter_third_set_games_won", {
                        min: { value: 0, message: "En az 0 olabilir" },
                      })}
                      type="number"
                      min="0"
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
                    <label>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</label>
                    <input
                      {...register("invitee_third_set_games_won", {
                        max: { value: 7, message: "En fazla 7 olabilir" },
                      })}
                      type="number"
                      min="0"
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
              </div>
            </div>
          )}
          <div className={styles["buttons-container"]}>
            <button
              className={styles["discard-button"]}
              onClick={closeAddScoreModal}
            >
              İptal
            </button>
            <button type="submit" className={styles["submit-button"]}>
              Onayla
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddMatchScoreModal;

import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useUpdateMatchScoreMutation } from "../../../../../api/endpoints/MatchScoresApi";
import { useAppSelector } from "../../../../store/hooks";
import { useTranslation } from "react-i18next";

type FormValues = {
  inviter_first_set_games_won: number;
  inviter_second_set_games_won: number;
  inviter_third_set_games_won: number;
  invitee_first_set_games_won: number;
  invitee_second_set_games_won: number;
  invitee_third_set_games_won: number;
  winner_id: number;
};

interface AddTournamentMatchScoreModalProps {
  addTournamentMatchScoreModalOpen: boolean;
  closeAddTournamentMatchScoreModal: () => void;
  selectedMatchScore: any;
  refetchTournamentMatches: () => void;
}

const AddTournamentMatchScoreModal = (
  props: AddTournamentMatchScoreModalProps
) => {
  const {
    addTournamentMatchScoreModalOpen,
    closeAddTournamentMatchScoreModal,
    selectedMatchScore,
    refetchTournamentMatches,
  } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const [updateMatchScore, { isSuccess: isUpdateMatchScoreSuccess }] =
    useUpdateMatchScoreMutation({});

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
            ? selectedMatchScore.inviter_id
            : firstSetInviter < firstSetInvitee &&
              secondSetInviter < secondSetInvitee
            ? selectedMatchScore.invitee_id
            : thirdSetInviter > thirdSetInvitee
            ? selectedMatchScore.inviter_id
            : thirdSetInviter < thirdSetInvitee
            ? selectedMatchScore.invitee_id
            : null,
        match_score_status_type_id: 3,
        reporter_id: user?.user?.user_id,
        booking_id: selectedMatchScore?.booking_id,
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
        firstSetInviter > firstSetInvitee
          ? selectedMatchScore?.inviter_id
          : selectedMatchScore?.invitee_id;

      const secondSetWinner =
        secondSetInviter > secondSetInvitee
          ? selectedMatchScore?.inviter_id
          : selectedMatchScore?.invitee_id;

      if (firstSetWinner !== secondSetWinner) {
        setThirdSetVisible(true);
      } else {
        setThirdSetVisible(false);
      }
    }
  }, [firstSetInvitee, firstSetInviter, secondSetInvitee, secondSetInviter]);

  useEffect(() => {
    if (isUpdateMatchScoreSuccess) {
      toast.success("Başarıyla gönderildi");
      refetchTournamentMatches();
      reset({
        inviter_first_set_games_won: null,
        inviter_second_set_games_won: null,
        inviter_third_set_games_won: null,
        invitee_first_set_games_won: null,
        invitee_second_set_games_won: null,
        invitee_third_set_games_won: null,
        winner_id: null,
      });
      closeAddTournamentMatchScoreModal();
    }
  }, [isUpdateMatchScoreSuccess]);

  return (
    <ReactModal
      isOpen={addTournamentMatchScoreModalOpen}
      onRequestClose={closeAddTournamentMatchScoreModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeAddTournamentMatchScoreModal}
      />
      <div className={styles["top-container"]}>
        <div className={styles["modal-content"]}>
          <h1 className={styles.title}>{t("addScore")}</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["top-row"]}>
              <div className={styles["set-container"]}>
                <h4>{t("set1")}</h4>
                <div className={styles["input-outer-container"]}>
                  <div className={styles["input-container"]}>
                    <label>{selectedMatchScore?.invitername}</label>
                    <input
                      {...register("inviter_first_set_games_won", {
                        required: true,
                        min: { value: 0, message: "En az 0 olabilir" },
                        max: { value: 7, message: "En fazla 7 olabilir" },
                      })}
                      type="number"
                      min="0"
                      onChange={(e) =>
                        setFirstSetInviter(Number(e.target.value))
                      }
                    />
                    {errors.inviter_first_set_games_won && (
                      <span className={styles["error-field"]}>
                        {t("mandatoryField")}
                      </span>
                    )}
                  </div>
                  <div className={styles["input-container"]}>
                    <label>{selectedMatchScore?.inviteename}</label>
                    <input
                      {...register("invitee_first_set_games_won", {
                        required: true,
                      })}
                      type="number"
                      min="0"
                      onChange={(e) =>
                        setFirstSetInvitee(Number(e.target.value))
                      }
                    />
                    {errors.invitee_first_set_games_won && (
                      <span className={styles["error-field"]}>
                        {t("mandatoryField")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles["set-container"]}>
                <h4>{t("set2")}</h4>
                <div className={styles["input-outer-container"]}>
                  <div className={styles["input-container"]}>
                    <label>{selectedMatchScore?.invitername}</label>
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
                        {t("mandatoryField")}
                      </span>
                    )}
                  </div>
                  <div className={styles["input-container"]}>
                    <label>{selectedMatchScore?.inviteename}</label>
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
                        {t("mandatoryField")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {thirdSetVisible && (
              <div className={styles["top-row"]}>
                <div className={styles["set-container"]}>
                  <h4>{t("set3")}</h4>
                  <div className={styles["input-outer-container"]}>
                    <div className={styles["input-container"]}>
                      <label>{selectedMatchScore?.invitername}</label>
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
                          {t("mandatoryField")}
                        </span>
                      )}
                    </div>
                    <div className={styles["input-container"]}>
                      <label>{selectedMatchScore?.inviteename}</label>
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
                          {t("mandatoryField")}
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
                onClick={closeAddTournamentMatchScoreModal}
              >
                {t("discardButtonText")}
              </button>
              <button type="submit" className={styles["submit-button"]}>
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
};

export default AddTournamentMatchScoreModal;

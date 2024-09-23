import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../../store/hooks";
import { useUpdateMatchScoreMutation } from "../../../../../../api/endpoints/MatchScoresApi";
import { useGetPlayersByFilterQuery } from "../../../../../../api/endpoints/PlayersApi";
import PageLoading from "../../../../../components/loading/PageLoading";
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

const EditMatchScoreModal = (props) => {
  const { isEditScoreModalOpen, closeEditScoreModal, selectedMatchScore } =
    props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const [updateMatchScore, { isSuccess: isUpdateMatchScoreSuccess }] =
    useUpdateMatchScoreMutation({});

  const { data: inviter, isLoading: isInviterLoading } =
    useGetPlayersByFilterQuery({
      user_id: selectedMatchScore?.inviter_id,
    });

  const { data: invitee, isLoading: isInviteeLoading } =
    useGetPlayersByFilterQuery({
      user_id: selectedMatchScore?.invitee_id,
    });

  const { data: reporter, isLoading: isReporterLoading } =
    useGetPlayersByFilterQuery({
      user_id: selectedMatchScore?.reporter_id,
    });

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
      match_score_id: selectedMatchScore?.match_score_id,
      inviter_first_set_games_won:
        selectedMatchScore?.inviter_first_set_games_won,
      inviter_second_set_games_won:
        selectedMatchScore?.inviter_second_set_games_won,
      inviter_third_set_games_won:
        selectedMatchScore?.inviter_third_set_games_won,
      invitee_first_set_games_won:
        selectedMatchScore?.invitee_first_set_games_won,
      invitee_second_set_games_won:
        selectedMatchScore?.invitee_second_set_games_won,
      invitee_third_set_games_won:
        selectedMatchScore?.invitee_third_set_games_won,
      winner_id:
        selectedMatchScore?.inviter_third_set_games_won >
        selectedMatchScore?.invitee_third_set_games_won
          ? inviter?.[0]?.user_id
          : selectedMatchScore?.inviter_third_set_games_won <
            selectedMatchScore?.invitee_third_set_games_won
          ? invitee?.[0]?.user_id
          : selectedMatchScore?.inviter_first_set_games_won >
              selectedMatchScore?.invitee_first_set_games_won &&
            selectedMatchScore?.inviter_second_set_games_won >
              selectedMatchScore?.invitee_second_set_games_won
          ? inviter?.[0]?.user_id
          : selectedMatchScore?.inviter_first_set_games_won <
              selectedMatchScore?.invitee_first_set_games_won &&
            selectedMatchScore?.inviter_second_set_games_won <
              selectedMatchScore?.invitee_second_set_games_won
          ? invitee?.[0]?.user_id
          : null,
      booking_id: selectedMatchScore?.booking_id,
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
  } = useForm<FormValues>({ mode: "onChange" });

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
    if (
      firstSetInviter &&
      secondSetInviter &&
      firstSetInvitee &&
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
  }, [firstSetInviter, secondSetInviter, firstSetInvitee, secondSetInvitee]);

  useEffect(() => {
    if (isUpdateMatchScoreSuccess) {
      toast.success("Başarıyla gönderildi");
      closeEditScoreModal();
      reset();
    }
  }, [isUpdateMatchScoreSuccess]);

  useEffect(() => {
    setScoreConfirmDecision("");
    reset();
  }, [isEditScoreModalOpen]);

  if (isInviterLoading || isInviteeLoading || isReporterLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isEditScoreModalOpen}
      onRequestClose={closeEditScoreModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEditScoreModal} />
      <div className={styles["modal-content"]}>
        {scoreConfirmDecision === "" && (
          <div className={styles["decision-container"]}>
            <h2>{t("matchScoreCorrectTitle")}</h2>
            <p>{`${reporter?.[0]?.fname} ${reporter?.[0]?.lname} ${t(
              "matchScoreCorrectText"
            )}`}</p>
            <table>
              <thead>
                <tr>
                  <th>{t("inviter")}</th>
                  <th>{t("invitee")}</th>
                  <th>{t("set1")}</th>
                  <th>{t("set2")}</th>
                  <th>{t("set3")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{`${inviter?.[0]?.fname} ${inviter?.[0]?.lname}`}</td>
                  <td>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</td>
                  <td>{`${selectedMatchScore?.inviter_first_set_games_won}-${selectedMatchScore?.invitee_first_set_games_won}`}</td>
                  <td>{`${selectedMatchScore?.inviter_second_set_games_won}-${selectedMatchScore?.invitee_second_set_games_won}`}</td>
                  {selectedMatchScore?.inviter_third_set_games_won &&
                  selectedMatchScore?.invitee_third_set_games_won ? (
                    <td>{`${selectedMatchScore?.inviter_third_set_games_won}-${selectedMatchScore?.invitee_third_set_games_won}`}</td>
                  ) : (
                    "-"
                  )}
                </tr>
              </tbody>
            </table>
            <div className={styles["buttons-container"]}>
              <button
                onClick={() => setScoreConfirmDecision("edit")}
                className={styles["discard-button"]}
              >
                {t("askRevisionButtonText")}
              </button>
              <button
                onClick={handleConfirmScore}
                className={styles["submit-button"]}
              >
                {t("confirmScoreButtonText")}
              </button>
            </div>
          </div>
        )}
        {scoreConfirmDecision === "edit" && (
          <div className={styles["edit-container"]}>
            <div className={styles["top-container"]}>
              <h1 className={styles.title}>{t("updateMatchScoreTitle")}</h1>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles["form-container"]}
            >
              <div className={styles["top-row"]}>
                <div className={styles["set-container"]}>
                  <h4>{t("set1")}</h4>
                  <div className={styles["input-outer-container"]}>
                    <div className={styles["input-container"]}>
                      <label>
                        {`${inviter?.[0]?.fname} ${inviter?.[0]?.lname} ${t(
                          "set1"
                        )}`}
                      </label>
                      <input
                        {...register("inviter_first_set_games_won", {
                          required: true,
                          min: { value: 0, message: "En az 0 olabilir" },
                          max: { value: 7, message: "En fazla 7 olabilir" },
                        })}
                        type="number"
                        min="0"
                        value={firstSetInviter}
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
                      <label>
                        {`${invitee?.[0]?.fname} ${invitee?.[0]?.lname} ${t(
                          "set1"
                        )}`}
                      </label>
                      <input
                        {...register("invitee_first_set_games_won", {
                          required: true,
                        })}
                        type="number"
                        value={firstSetInvitee}
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
                      <label>{`${inviter?.[0]?.fname} ${
                        inviter?.[0]?.lname
                      } ${t("set2")}`}</label>
                      <input
                        {...register("inviter_second_set_games_won")}
                        type="number"
                        value={secondSetInviter}
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
                      <label>
                        {`${invitee?.[0]?.fname} ${invitee?.[0]?.lname} ${t(
                          "set2"
                        )}`}
                      </label>
                      <input
                        {...register("invitee_second_set_games_won")}
                        type="number"
                        value={secondSetInvitee}
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
                        <label>{`${inviter?.[0]?.fname} ${
                          inviter?.[0]?.lname
                        } ${t("set3")}`}</label>
                        <input
                          {...register("inviter_third_set_games_won")}
                          type="number"
                          value={thirdSetInviter}
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
                        <label>
                          {`${invitee?.[0]?.fname} ${invitee?.[0]?.lname} ${t(
                            "set3"
                          )}`}
                        </label>
                        <input
                          {...register("invitee_third_set_games_won")}
                          type="number"
                          value={thirdSetInvitee}
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
                  onClick={closeEditScoreModal}
                >
                  {t("discardButtonText")}
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditMatchScoreModal;

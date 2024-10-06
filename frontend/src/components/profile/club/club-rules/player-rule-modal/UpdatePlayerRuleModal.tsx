import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import {
  Club,
  useUpdateClubMutation,
} from "../../../../../../api/endpoints/ClubsApi";
import { useTranslation } from "react-i18next";

interface UpdatePlayerRuleModallProps {
  isPlayerRuleModalOpen: boolean;
  handleCloseModal: () => void;
  selectedClub: any;
  refetchClubDetails: () => void;
  clubHasSubscriptionPackages: any;
}

const UpdatePlayerRuleModal = (props: UpdatePlayerRuleModallProps) => {
  const {
    isPlayerRuleModalOpen,
    handleCloseModal,
    selectedClub,
    refetchClubDetails,
    clubHasSubscriptionPackages,
  } = props;

  const { t } = useTranslation();

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Club>({
    defaultValues: {
      is_player_subscription_required:
        selectedClub?.[0]?.is_player_subscription_required,
    },
  });

  const [selectedRule, setSelectedRule] = useState(
    selectedClub?.[0]?.is_player_subscription_required
  );

  const handleSelectedRule = (event) => {
    setSelectedRule(event.target.value);
  };

  let isButtonDisabled = false;

  if (selectedRule === "true" && clubHasSubscriptionPackages?.length === 0) {
    isButtonDisabled = true;
  }

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const updatedClubData = {
      ...selectedClub?.[0],
      is_player_subscription_required:
        String(formData.is_player_subscription_required) === "true"
          ? true
          : String(formData.is_player_subscription_required) === "false"
          ? false
          : "",
    };
    if (!isButtonDisabled) {
      updateClub(updatedClubData);
    } else {
      toast.error("Üyelik kuralı koymak için üyelik paketi eklemelisiniz");
    }
  };

  useEffect(() => {
    isButtonDisabled =
      selectedRule === "true" && clubHasSubscriptionPackages?.length === 0
        ? true
        : false;
  }, [selectedRule]);

  useEffect(() => {
    if (isSuccess) {
      refetchClubDetails();
      handleCloseModal();
      reset();
      toast.success("Kural güncellendi");
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isPlayerRuleModalOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseModal} />
      <div className={styles["modal-content"]}>
        <h1>{t("trainingMatchRuleTitle")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                {...register("is_player_subscription_required")}
                onChange={handleSelectedRule}
              >
                <option value="true">{t("playerSubscriptionRequired")}</option>
                <option value="false">
                  {t("playerSubscriptionNotRequired")}
                </option>
              </select>
              {errors.is_player_subscription_required && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={handleCloseModal}
              className={styles["discard-button"]}
            >
              {t("discardButtonText")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default UpdatePlayerRuleModal;

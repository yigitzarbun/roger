import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Club,
  useUpdateClubMutation,
} from "../../../../../api/endpoints/ClubsApi";

import { useAppSelector } from "../../../../../store/hooks";

interface UpdateLessonRuleModallProps {
  isLessonRuleModalOpen: boolean;
  handleCloseModal: () => void;
  selectedClub: any;
  refetchClubDetails: () => void;
  clubHasSubscriptionPackages: any;
}
const UpdateLessonRuleModal = (props: UpdateLessonRuleModallProps) => {
  const {
    isLessonRuleModalOpen,
    handleCloseModal,
    selectedClub,
    refetchClubDetails,
    clubHasSubscriptionPackages,
  } = props;
  const user = useAppSelector((store) => store?.user?.user?.user);
  const [updateClub, { data, isSuccess }] = useUpdateClubMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Club>({
    defaultValues: {
      is_trainer_subscription_required:
        selectedClub?.[0]?.is_trainer_subscription_required,
      is_player_lesson_subscription_required:
        selectedClub?.[0]?.is_player_lesson_subscription_required,
    },
  });

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const updatedClubData = {
      ...selectedClub?.[0],
      is_trainer_subscription_required:
        String(formData.is_trainer_subscription_required) === "true"
          ? true
          : String(formData.is_trainer_subscription_required === false)
          ? false
          : "",
      is_player_lesson_subscription_required:
        String(formData.is_player_lesson_subscription_required) === "true"
          ? true
          : String(formData.is_player_lesson_subscription_required === false)
          ? false
          : "",
    };
    if (!isButtonDisabled) {
      updateClub(updatedClubData);
    } else {
      toast.error("Üyelik kuralı koymak için üyelik paketi eklemelisiniz");
    }
  };

  const [selectedPlayerRule, setSelectedPlayerRule] = useState(
    selectedClub?.[0]?.is_player_subscription_required
  );

  const handleSelectedPlayerRule = (event) => {
    setSelectedPlayerRule(event.target.value);
  };

  const [selectedTrainerrRule, setSelectedTrainerrRule] = useState(
    selectedClub?.[0]?.is_trainer_subscription_required
  );

  const handleSelectedTrainerRule = (event) => {
    setSelectedTrainerrRule(event.target.value);
  };
  let isButtonDisabled = false;

  if (
    (selectedPlayerRule === "true" || selectedTrainerrRule === "true") &&
    clubHasSubscriptionPackages?.length === 0
  ) {
    isButtonDisabled = true;
  }

  useEffect(() => {
    isButtonDisabled =
      (selectedPlayerRule === "true" || selectedTrainerrRule === "true") &&
      clubHasSubscriptionPackages?.length === 0
        ? true
        : false;
  }, [selectedPlayerRule, selectedTrainerrRule]);

  useEffect(() => {
    if (isSuccess) {
      refetchClubDetails();
      handleCloseModal();
      reset({
        is_trainer_subscription_required:
          data?.is_trainer_subscription_required,
        is_player_lesson_subscription_required:
          data?.is_player_lesson_subscription_required,
      });
      toast.success("Kural güncellendi");
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isLessonRuleModalOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseModal} />
      <div className={styles["modal-content"]}>
        <h1>Ders Kuralları</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Oyuncu Üyelik Şartı</label>
              <select
                {...register("is_player_lesson_subscription_required")}
                onChange={handleSelectedPlayerRule}
              >
                <option value={"true"}>Oyuncunun üye olması zorunlu</option>
                <option value={"false"}>
                  Oyuncunun üye olmasına gerek yok
                </option>
              </select>
              {errors.is_player_lesson_subscription_required && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Eğitmen Personel Şartı</label>
              <select
                {...register("is_trainer_subscription_required")}
                onChange={handleSelectedTrainerRule}
              >
                <option value={"true"}>
                  Eğitmenin personel olması zorunlu
                </option>
                <option value={"false"}>
                  Eğitmenin personel olmasına gerek yok
                </option>
              </select>
              {errors.is_trainer_subscription_required && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={handleCloseModal}
              className={styles["discard-button"]}
            >
              İptal
            </button>
            <button type="submit" className={styles["delete-button"]}>
              Onayla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default UpdateLessonRuleModal;

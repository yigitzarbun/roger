import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Club,
  useGetClubsQuery,
  useUpdateClubMutation,
} from "../../../../../api/endpoints/ClubsApi";

import { useGetClubSubscriptionPackagesQuery } from "../../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useAppSelector } from "../../../../../store/hooks";

interface UpdateClubRulesModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const UpdateClubRulesModal = (props: UpdateClubRulesModallProps) => {
  const { isModalOpen, handleCloseModal } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: clubs,
    isLoading: isClubsLoading,
    refetch,
  } = useGetClubsQuery({});

  const selectedClub = clubs?.find((club) => club.user_id === user?.user_id);

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  let clubHasSubscriptionPackages = false;

  if (
    clubSubscriptionPackages?.find(
      (subscriptionPackage) => subscriptionPackage.club_id === user?.user_id
    )
  ) {
    clubHasSubscriptionPackages = true;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Club> = (formData) => {
    let trainerRequired = false;
    let playerLessonRequired = false;
    let playerRequired = false;

    if (Number(formData.lesson_rule_id) === 1) {
      trainerRequired = false;
      playerLessonRequired = false;
    } else if (Number(formData.lesson_rule_id) === 2) {
      trainerRequired = false;
      playerLessonRequired = true;
    } else if (Number(formData.lesson_rule_id) === 3) {
      trainerRequired = true;
      playerLessonRequired = false;
    } else if (Number(formData.lesson_rule_id) === 4) {
      trainerRequired = true;
      playerLessonRequired = true;
    }

    if (Number(formData.player_rule_id) === 1) {
      playerRequired = true;
    } else if (Number(formData.player_rule_id) === 2) {
      playerRequired = false;
    }

    const updatedClubData = {
      ...selectedClub,
      is_trainer_subscription_required: trainerRequired,
      is_player_lesson_subscription_required: playerLessonRequired,
      is_player_subscription_required: playerRequired,
    };
    updateClub(updatedClubData);
  };

  const [selectedLessonRule, setSelectedLessonRule] = useState(null);
  const handleSelectedLessonRule = (event) => {
    setSelectedLessonRule(event.target.value);
  };

  const [selectedPlayerRule, setSelectedPlayerRule] = useState(null);
  const handleSelectedPlayerRule = (event) => {
    setSelectedPlayerRule(event.target.value);
  };

  let isButtonDisabled = false;
  if (
    (Number(selectedLessonRule) === 2 ||
      Number(selectedLessonRule) === 4 ||
      Number(selectedPlayerRule) === 1) &&
    clubHasSubscriptionPackages === false
  ) {
    isButtonDisabled = true;
  }

  useEffect(() => {
    refetch();
    handleCloseModal();
  }, [isSuccess]);
  if (isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  if (isClubSubscriptionPackagesLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Kuralları Düzenle</h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Ders Amacıyla Kort Kiralama Kuralı</label>
            <select
              {...register("lesson_rule_id")}
              onChange={handleSelectedLessonRule}
            >
              <option value="">-- Seçim yapın --</option>
              <option value={1}>
                Eğtimen kulüp çalışanı veya oyuncunun üye olmasına gerek yok
              </option>
              <option value={2}>
                Eğitmen kulüp çalışanı değil, oyuncu üye ise kort kiralanabilir
              </option>
              <option value={3}>
                Eğitmen kulüp çalışanı, oyuncu üye değil ise kort kiralanabilir
              </option>
              <option value={4}>
                Eğitmenin kulüp çalışanı, oyuncunun üye olması zorunludur
              </option>
            </select>
            {errors.rule_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Antreman ve Maç Amacıyla Kort Kiralama Kuralı</label>
            <select
              {...register("player_rule_id")}
              onChange={handleSelectedPlayerRule}
            >
              <option value="">-- Seçim yapın --</option>
              <option value={1}>
                Oyuncuların kort kiralamak için üye olmaları gerekiyor
              </option>
              <option value={2}>
                Oyuncuların kort kiralamak için üye olmaları gerekmiyor
              </option>
            </select>
            {errors.rule_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled
            ? "Üyelik kuralı koymak için üyelik paketi eklemelisiniz"
            : "Onayla"}
        </button>
      </form>
    </ReactModal>
  );
};

export default UpdateClubRulesModal;
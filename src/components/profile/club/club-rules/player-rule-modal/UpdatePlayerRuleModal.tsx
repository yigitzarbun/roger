import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Club,
  useGetClubByUserIdQuery,
  useUpdateClubMutation,
} from "../../../../../api/endpoints/ClubsApi";

import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useAppSelector } from "../../../../../store/hooks";
import PageLoading from "../../../../../components/loading/PageLoading";

interface UpdatePlayerRuleModallProps {
  isPlayerRuleModalOpen: boolean;
  handleCloseModal: () => void;
}

const UpdatePlayerRuleModal = (props: UpdatePlayerRuleModallProps) => {
  const { isPlayerRuleModalOpen, handleCloseModal } = props;
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: selectedClub,
    isLoading: isSelectedClubLoading,
    refetch: refetchClub,
  } = useGetClubByUserIdQuery(user?.user_id);

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const {
    data: clubHasSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({ club_id: user?.user_id });

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
    updateClub(updatedClubData);
  };

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

  useEffect(() => {
    isButtonDisabled =
      selectedRule === "true" && clubHasSubscriptionPackages?.length === 0
        ? true
        : false;
  }, [selectedRule]);

  useEffect(() => {
    if (isSuccess) {
      refetchClub();
      handleCloseModal();
      reset();
      toast.success("Kural güncellendi");
    }
  }, [isSuccess]);

  if (isClubSubscriptionPackagesLoading || isSelectedClubLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isPlayerRuleModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Antreman ve Maç Kuralları</h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
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
              <option value="true">
                Oyuncuların kort kiralamak için üye olmalarına gerek var
              </option>
              <option value="false">
                Oyuncuların kort kiralamak için üye olmaları gerekmiyor
              </option>
            </select>
            {errors.is_player_subscription_required && (
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

export default UpdatePlayerRuleModal;

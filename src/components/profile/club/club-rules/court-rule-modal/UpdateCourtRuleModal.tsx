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

interface UpdateCourtRuleModallProps {
  isCourtRuleModalOpen: boolean;
  handleCloseModal: () => void;
}

const UpdateCourtRuleModal = (props: UpdateCourtRuleModallProps) => {
  const { isCourtRuleModalOpen, handleCloseModal } = props;
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
      higher_price_for_non_subscribers:
        selectedClub?.[0]?.higher_price_for_non_subscribers,
    },
  });

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const updatedClubData = {
      ...selectedClub?.[0],
      higher_price_for_non_subscribers:
        String(formData.higher_price_for_non_subscribers) === "true"
          ? true
          : String(formData.higher_price_for_non_subscribers) === "false"
          ? false
          : "",
    };
    updateClub(updatedClubData);
  };
  const [selectedCourtPriceRule, setSelectedCourtPriceRule] = useState(
    selectedClub?.[0]?.higher_price_for_non_subscribers
  );

  const handleSelectedCourtPriceRule = (event) => {
    setSelectedCourtPriceRule(event.target.value);
  };

  let isButtonDisabled = false;

  if (
    selectedCourtPriceRule === "true" &&
    clubHasSubscriptionPackages?.length === 0
  ) {
    isButtonDisabled = true;
  }

  useEffect(() => {
    isButtonDisabled =
      selectedCourtPriceRule === "true" &&
      clubHasSubscriptionPackages?.length === 0
        ? true
        : false;
  }, [selectedCourtPriceRule]);

  useEffect(() => {
    if (isSuccess) {
      refetchClub();
      handleCloseModal();
      reset();
      toast.success("Kural güncellendi");
    }
  }, [isSuccess]);

  if (isSelectedClubLoading || isClubSubscriptionPackagesLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isCourtRuleModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Kort Fiyatlandırma Kuralı</h1>
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
              {...register("higher_price_for_non_subscribers")}
              onChange={handleSelectedCourtPriceRule}
            >
              <option value="true">
                Üye olmayanlara farklı fiyat uygulanır
              </option>
              <option value="false">
                Üye olmayanlara farklı fiyat uygulanmaz
              </option>
            </select>
            {errors.higher_price_for_non_subscribers && (
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

export default UpdateCourtRuleModal;

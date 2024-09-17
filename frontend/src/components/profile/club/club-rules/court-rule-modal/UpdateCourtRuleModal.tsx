import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import {
  Club,
  useUpdateClubMutation,
} from "../../../../../../api/endpoints/ClubsApi";

interface UpdateCourtRuleModallProps {
  isCourtRuleModalOpen: boolean;
  handleCloseModal: () => void;
  selectedClub: any;
  refetchClubDetails: () => void;
  clubHasSubscriptionPackages: any;
}

const UpdateCourtRuleModal = (props: UpdateCourtRuleModallProps) => {
  const {
    isCourtRuleModalOpen,
    handleCloseModal,
    selectedClub,
    refetchClubDetails,
    clubHasSubscriptionPackages,
  } = props;

  const [selectedCourtPriceRule, setSelectedCourtPriceRule] = useState(
    selectedClub?.[0]?.higher_price_for_non_subscribers
  );
  let isButtonDisabled = false;

  if (
    selectedCourtPriceRule === "true" &&
    clubHasSubscriptionPackages?.length === 0
  ) {
    isButtonDisabled = true;
  }

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

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

    if (!isButtonDisabled) {
      updateClub(updatedClubData);
    } else {
      toast.error("Üyelik kuralı koymak için üyelik paketi eklemelisiniz");
    }
  };

  const handleSelectedCourtPriceRule = (event) => {
    setSelectedCourtPriceRule(event.target.value);
  };

  useEffect(() => {
    isButtonDisabled =
      selectedCourtPriceRule === "true" &&
      clubHasSubscriptionPackages?.length === 0
        ? true
        : false;
  }, [selectedCourtPriceRule]);

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
      isOpen={isCourtRuleModalOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseModal} />
      <div className={styles["modal-content"]}>
        <h1>Kort Fiyatlandırma Kuralı</h1>
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
            <button type="submit" className={styles["submit-button"]}>
              Onayla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default UpdateCourtRuleModal;

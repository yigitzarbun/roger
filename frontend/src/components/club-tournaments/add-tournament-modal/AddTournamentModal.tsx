import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAddTournamentMutation } from "../../../../api/endpoints/TournamentsApi";

interface AddTournamentModalProps {
  addTournamentModal: boolean;
  closeAddTournamentModal: () => void;
  clubUserId: number;
  clubBankDetailsExist: boolean;
  clubCourts: any[];
  clubSubscriptionPackages: any[];
  refetchClubTournaments: () => void;
}

type FormValues = {
  tournament_name: string;
  start_date: string;
  end_date: string;
  application_deadline: string;
  min_birth_year: string;
  max_birth_year: string;
  tournament_gender: string;
  application_fee: number;
  club_subscription_required: boolean;
  max_players: number;
};

const AddTournamentModal = (props: AddTournamentModalProps) => {
  const {
    addTournamentModal,
    closeAddTournamentModal,
    clubUserId,
    clubBankDetailsExist,
    clubCourts,
    clubSubscriptionPackages,
    refetchClubTournaments,
  } = props;

  const [addTournament, { isSuccess: isAddTournamentSuccess }] =
    useAddTournamentMutation({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const date = new Date();
  const currentYear = date.getFullYear();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const newTournamentData = {
        is_active: true,
        tournament_name: formData.tournament_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        application_deadline: formData.application_deadline,
        min_birth_year: String(currentYear - Number(formData.min_birth_year)),
        max_birth_year: String(currentYear - Number(formData.max_birth_year)),
        tournament_gender: formData.tournament_gender,
        application_fee: formData.application_fee,
        club_subscription_required:
          clubSubscriptionPackages?.length > 0
            ? formData.club_subscription_required
            : false,
        max_players: formData.max_players,
        club_user_id: clubUserId,
      };
      if (clubBankDetailsExist && clubCourts?.length > 0) {
        addTournament(newTournamentData);
      } else if (!clubBankDetailsExist && clubCourts?.length > 0) {
        toast.error("Ödeme bilgilerinizi ekleyin");
      } else if (clubBankDetailsExist && clubCourts?.length === 0) {
        toast.error("Kort ekleyin");
      } else {
        toast.error("Beklenmedik bir hata oluştu. Daha sonra tekrar deneyin");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAddTournamentSuccess) {
      refetchClubTournaments();
      closeAddTournamentModal();
    }
  }, [isAddTournamentSuccess]);
  return (
    <ReactModal
      isOpen={addTournamentModal}
      onRequestClose={closeAddTournamentModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeAddTournamentModal} />
      <div className={styles["top-container"]}>
        <div className={styles["modal-content"]}>
          <h1 className={styles.title}>Turnuva Ekle</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            {(errors.tournament_name ||
              errors.start_date ||
              errors.end_date ||
              errors.application_deadline ||
              errors.min_birth_year ||
              errors.tournament_gender ||
              errors.application_fee ||
              errors.club_subscription_required ||
              errors.max_players) && (
              <span className={styles["error-field"]}>
                Tüm alanları doldurduğunuzdan emin olun
              </span>
            )}
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Turnuva Adı</label>
                <input
                  {...register("tournament_name", { required: true })}
                  type="text"
                  placeholder="örn. 40 Yaş+ Erkekler"
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Başlangıç</label>
                <input
                  {...register("start_date", { required: true })}
                  type="date"
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Bitiş</label>
                <input
                  {...register("end_date", { required: true })}
                  type="date"
                />
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Son Başvuru Tarihi</label>
                <input
                  {...register("application_deadline", { required: true })}
                  type="date"
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Katılımcı Min. Yaş</label>
                <input
                  {...register("min_birth_year", {
                    required: true,
                    min: 6,
                    max: 100,
                  })}
                  type="number"
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Katılımcı Max. Yaş</label>
                <input
                  {...register("max_birth_year", {
                    required: true,
                    min: 6,
                    max: 100,
                  })}
                  type="number"
                />
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Katılımcı Cinsiyet</label>
                <select {...register("tournament_gender", { required: true })}>
                  <option value="">-- Cinsiyet --</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </select>
              </div>
              <div className={styles["input-container"]}>
                <label>Katılım Ücret (TL)</label>
                <input
                  {...register("application_fee", { required: true, min: 1 })}
                  type="number"
                />
              </div>

              <div className={styles["input-container"]}>
                <label>Max. Katılımcı Sayısı</label>
                <input
                  {...register("max_players", { required: true, min: 2 })}
                  type="number"
                />
              </div>
            </div>
            {clubSubscriptionPackages?.length > 0 && (
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>Katılımcı Üyelik Şartı</label>
                  <select
                    {...register("club_subscription_required", {
                      required: true,
                    })}
                  >
                    <option value="">-- Üyelik Şartı --</option>
                    <option value="true">
                      Katılımcıların kulübe üye olmasına gerek var
                    </option>
                    <option value="false">
                      Katılımcıların kulübe üye olmasına gerek yok
                    </option>
                  </select>
                </div>
              </div>
            )}

            <div className={styles["buttons-container"]}>
              <button
                onClick={closeAddTournamentModal}
                className={styles["discard-button"]}
              >
                İptal Et
              </button>
              <button type="submit" className={styles["submit-button"]}>
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
};
export default AddTournamentModal;

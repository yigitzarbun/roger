import React, { useEffect } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useUpdateTournamentMutation } from "../../../api/endpoints/TournamentsApi";

interface EditTournamentModalProps {
  updateTournamentModal: boolean;
  closeUpdateTournamentModal: () => void;
  clubUserId: number;
  clubBankDetailsExist: boolean;
  clubCourts: any[];
  refetchClubTournaments: () => void;
  selectedTournament: any;
}

type FormValues = {
  tournament_name: string;
  start_date: string;
  end_date: string;
  application_deadline: string;
  max_players: number;
  is_active: boolean;
};

const EditTournamentModal = (props: EditTournamentModalProps) => {
  const {
    updateTournamentModal,
    closeUpdateTournamentModal,
    clubUserId,
    clubBankDetailsExist,
    clubCourts,
    refetchClubTournaments,
    selectedTournament,
  } = props;

  const [
    updateTournament,
    {
      data: updatedTournament,
      isSuccess: isUpdateTournamentSuccess,
      error: updateError,
    },
  ] = useUpdateTournamentMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      is_active: selectedTournament?.is_active,
      start_date: selectedTournament?.start_date
        ? new Date(selectedTournament?.start_date)
            .toISOString()
            .substring(0, 10)
        : "",
      end_date: selectedTournament?.start_date
        ? new Date(selectedTournament?.end_date).toISOString().substring(0, 10)
        : "",
      application_deadline: selectedTournament?.start_date
        ? new Date(selectedTournament?.application_deadline)
            .toISOString()
            .substring(0, 10)
        : "",
      max_players: selectedTournament?.max_players,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedTournament) {
      reset({
        tournament_name: selectedTournament.tournament_name,
        is_active: selectedTournament.is_active,
        start_date: selectedTournament?.start_date
          ? new Date(selectedTournament?.start_date)
              .toISOString()
              .substring(0, 10)
          : "",
        end_date: selectedTournament?.start_date
          ? new Date(selectedTournament?.end_date)
              .toISOString()
              .substring(0, 10)
          : "",
        application_deadline: selectedTournament?.start_date
          ? new Date(selectedTournament?.application_deadline)
              .toISOString()
              .substring(0, 10)
          : "",
        max_players: selectedTournament.max_players,
      });
    }
  }, [selectedTournament, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const updatedTournamentData = {
        tournament_id: selectedTournament?.tournament_id, // Ensure tournament_id is included
        is_active: formData.is_active,
        tournament_name: formData.tournament_name,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        application_deadline: new Date(
          formData.application_deadline
        ).toISOString(),
        min_birth_year: selectedTournament?.min_birth_year,
        max_birth_year: selectedTournament?.max_birth_year,
        tournament_gender: selectedTournament?.tournament_gender,
        application_fee: selectedTournament?.application_fee,
        club_subscription_required:
          selectedTournament?.club_subscription_required,
        max_players: formData.max_players,
        club_user_id: clubUserId,
      };

      if (clubBankDetailsExist && clubCourts?.length > 0) {
        await updateTournament(updatedTournamentData);
      } else if (!clubBankDetailsExist && clubCourts?.length > 0) {
        toast.error("Ödeme bilgilerinizi ekleyin");
      } else if (clubBankDetailsExist && clubCourts?.length === 0) {
        toast.error("Kort ekleyin");
      } else {
        toast.error("Beklenmedik bir hata oluştu. Daha sonra tekrar deneyin");
      }
    } catch (error) {
      console.log("Error during form submission:", error);
    }
  };

  useEffect(() => {
    if (isUpdateTournamentSuccess) {
      refetchClubTournaments();
      closeUpdateTournamentModal();
      reset();
    }
  }, [isUpdateTournamentSuccess]);

  return (
    <ReactModal
      isOpen={updateTournamentModal}
      onRequestClose={closeUpdateTournamentModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeUpdateTournamentModal} />
      <div className={styles["top-container"]}>
        <div className={styles["modal-content"]}>
          <h1 className={styles.title}>Turnuva Düzenle</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            {(errors.tournament_name ||
              errors.start_date ||
              errors.end_date ||
              errors.application_deadline ||
              errors.is_active ||
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
                  defaultValue={
                    selectedTournament?.start_date
                      ? new Date(selectedTournament.start_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Bitiş</label>
                <input
                  {...register("end_date", { required: true })}
                  type="date"
                  defaultValue={
                    selectedTournament?.end_date
                      ? new Date(selectedTournament.end_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Son Başvuru Tarihi</label>
                <input
                  {...register("application_deadline", { required: true })}
                  type="date"
                  defaultValue={
                    selectedTournament?.application_deadline
                      ? new Date(selectedTournament.application_deadline)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Turnuva Aktiflik</label>
                <select {...register("is_active", { required: true })}>
                  <option value="true">Turnuva Aktif</option>
                  <option value="false">Turnuvayı Sil</option>
                </select>
              </div>
              <div className={styles["input-container"]}>
                <label>Max. Katılımcı Sayısı</label>
                <input
                  {...register("max_players", { required: true, min: 2 })}
                  type="number"
                />
              </div>
            </div>
            <div className={styles["buttons-container"]}>
              <button
                onClick={closeUpdateTournamentModal}
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
export default EditTournamentModal;

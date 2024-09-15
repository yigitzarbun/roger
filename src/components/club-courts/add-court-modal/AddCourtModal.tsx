import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import PageLoading from "../../../components/loading/PageLoading";
import {
  useAddCourtMutation,
  useGetCourtsByFilterQuery,
  useGetCourtsQuery,
} from "../../../api/endpoints/CourtsApi";
import { CourtStructureType } from "../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../api/endpoints/CourtSurfaceTypesApi";
import { generateTimesArray } from "../../../common/util/TimeFunctions";
import { User } from "../../../store/slices/authSlice";

interface AddCourtModalProps {
  isAddCourtModalOpen: boolean;
  closeAddCourtModal: () => void;
  refetchMyCourts: () => void;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  currentClub: any;
  user: User;
}

type FormValues = {
  court_name: string;
  opening_time: number;
  closing_time: number;
  price_hour: number;
  court_structure_type_id: number;
  court_surface_type_id: number;
  club_id: number;
  price_hour_non_subscriber?: number;
  image?: string;
};

const AddCourtModal = (props: AddCourtModalProps) => {
  const {
    isAddCourtModalOpen,
    closeAddCourtModal,
    courtStructureTypes,
    courtSurfaceTypes,
    currentClub,
    user,
    refetchMyCourts,
  } = props;

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    setValue("image", imageFile);
  };

  const clubBankDetailsExist =
    currentClub?.[0]["iban"] &&
    currentClub?.[0]["bank_id"] &&
    currentClub?.[0]["name_on_bank_account"];

  const [addCourt, { isSuccess }] = useAddCourtMutation({});

  const { refetch: refetchClubCourts } = useGetCourtsByFilterQuery({
    club_id: user?.clubDetails?.club_id,
  });
  const [openingTime, setOpeningTime] = useState<string>("00:00");

  const handleOpeningTime = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOpeningTime(event.target.value);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const newCourtData = {
        court_name: formData.court_name,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        price_hour: Number(formData.price_hour),
        court_structure_type_id: Number(formData.court_structure_type_id),
        court_surface_type_id: Number(formData.court_surface_type_id),
        is_active: true,
        club_id: user?.clubDetails?.club_id,
        price_hour_non_subscriber: formData.price_hour_non_subscriber
          ? Number(formData.price_hour_non_subscriber)
          : null,
        image: selectedImage ? selectedImage : null,
      };
      if (clubBankDetailsExist) {
        addCourt(newCourtData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetchMyCourts();
      refetchClubCourts();
      toast.success("Kort eklendi");
      reset();
      closeAddCourtModal();
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isAddCourtModalOpen}
      onRequestClose={closeAddCourtModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeAddCourtModal} />
      <div className={styles["top-container"]}>
        <div className={styles["modal-content"]}>
          <h1 className={styles.title}>Kort Ekle</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Kort Adı</label>
                <input
                  {...register("court_name", { required: true })}
                  type="text"
                  placeholder="örn. Merkez Kort"
                />
                {errors.court_name && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Fiyat (TL / saat)</label>
                <input
                  {...register("price_hour", { required: true })}
                  type="number"
                  min="0"
                />
                {errors.price_hour && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Kort Yüzeyi</label>
                <select
                  {...register("court_surface_type_id", { required: true })}
                >
                  <option value="">-- Kort Yüzeyi --</option>
                  {courtSurfaceTypes?.map((surface) => (
                    <option
                      key={surface.court_surface_type_id}
                      value={surface.court_surface_type_id}
                    >
                      {surface.court_surface_type_name}
                    </option>
                  ))}
                </select>
                {errors.court_surface_type_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Mekan Tipi</label>
                <select
                  {...register("court_structure_type_id", { required: true })}
                >
                  <option value="">-- Mekan Tipi --</option>
                  {courtStructureTypes?.map((structure) => (
                    <option
                      key={structure.court_structure_type_id}
                      value={structure.court_structure_type_id}
                    >
                      {structure.court_structure_type_name}
                    </option>
                  ))}
                </select>
                {errors.court_structure_type_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Açılış Saati</label>
                <select
                  {...register("opening_time", { required: true })}
                  onChange={handleOpeningTime}
                >
                  <option value="">-- Açılış Saati --</option>
                  {generateTimesArray(24).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.opening_time && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Kapanış Saati</label>
                <select
                  {...register("closing_time", {
                    required: true,
                    validate: (value) => {
                      const closing = Number(String(value).slice(0, 2));
                      const opening = Number(String(openingTime).slice(0, 2));

                      return closing > opening;
                    },
                  })}
                >
                  <option value="">-- Kapanış Saati --</option>
                  {generateTimesArray(24).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.closing_time?.type === "required" && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
                {errors.closing_time?.type === "validate" && (
                  <span className={styles["error-field"]}>
                    Kapanış saati açılış saatinden en az 1 saat sonra olmalıdır.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              {currentClub?.[0]["higher_price_for_non_subscribers"] && (
                <div className={styles["input-container"]}>
                  <label>Üye Olmayanlar İçin Fiyat (TL / saat)</label>

                  <input
                    {...register("price_hour_non_subscriber", {
                      required: true,
                    })}
                    type="number"
                    min="0"
                  />
                  {errors.price_hour_non_subscriber && (
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
              )}
              <div className={styles["input-container"]}>
                <label>Kort Resmi</label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {currentClub?.[0]["higher_price_for_non_subscribers"] && (
              <p className={styles["description-text"]}>
                Eğer kort kiralamak için üyelik şartı eklerseniz, üye olmayan
                kullanıcılar bu fiyat üzerinden ücretlendirilir. Üyelik şartı
                eklemek için profilinizdeki kurallar bölümünü ziyaret edin.
              </p>
            )}
            <div className={styles["buttons-container"]}>
              <button
                onClick={closeAddCourtModal}
                className={styles["discard-button"]}
              >
                İptal Et
              </button>
              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={!clubBankDetailsExist}
              >
                {clubBankDetailsExist
                  ? "Tamamla"
                  : "Banka Hesap Bilgilerinizi Ekleyin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
};

export default AddCourtModal;

import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import { useAppSelector } from "../../../store/hooks";

import { generateTimesArray } from "../../../common/util/TimeFunctions";

import styles from "./styles.module.scss";

import { CourtStructureType } from "../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import {
  useGetCourtByIdQuery,
  useGetCourtsByFilterQuery,
  useUpdateCourtMutation,
} from "../../../../api/endpoints/CourtsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface EditCourtModalProps {
  isEditCourtModalOpen: boolean;
  closeEditCourtModal: () => void;
  court_id: number;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  currentClub: any;
}

type FormValues = {
  court_name: string;
  opening_time: string;
  closing_time: string;
  price_hour: number;
  court_structure_type_id: number;
  court_surface_type_id: number;
  club_id: number;
  is_active: boolean;
  price_hour_non_subscriber?: number;
  image?: string;
};

const EditCourtModal = (props: EditCourtModalProps) => {
  const {
    isEditCourtModalOpen,
    closeEditCourtModal,
    court_id,
    courtStructureTypes,
    courtSurfaceTypes,
    currentClub,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const [updateCourt, { isSuccess }] = useUpdateCourtMutation({});

  const { refetch: refetchCourts } = useGetCourtsByFilterQuery({
    club_id: user?.clubDetails?.club_id,
  });

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtByIdQuery(court_id);

  const existingImage = selectedCourt?.[0]["image"]
    ? selectedCourt?.[0]["image"]
    : null;

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    setValue("image", imageFile);
  };

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
      const updatedCourtData = {
        court_id: court_id,
        court_name: formData.court_name,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        price_hour: Number(formData.price_hour),
        court_structure_type_id: Number(formData.court_structure_type_id),
        court_surface_type_id: Number(formData.court_surface_type_id),
        is_active: formData.is_active,
        club_id: user?.clubDetails.club_id,
        image: selectedImage ? selectedImage : existingImage,
        price_hour_non_subscriber: formData?.price_hour_non_subscriber
          ? Number(formData.price_hour_non_subscriber)
          : null,
      };
      updateCourt(updatedCourtData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedCourt) {
      const openingTimePart =
        selectedCourt?.[0]["opening_time"]?.substring(0, 5) || "00:00";
      const closingTimePart =
        selectedCourt?.[0]["closing_time"]?.substring(0, 5) || "00:00";
      reset({
        court_name: selectedCourt?.[0]["court_name"] || "",
        opening_time: openingTimePart,
        closing_time: closingTimePart,
        price_hour: selectedCourt?.[0]["price_hour"] || 0,
        court_structure_type_id:
          selectedCourt?.[0]["court_structure_type_id"] || 0,
        court_surface_type_id: selectedCourt?.[0]["court_surface_type_id"] || 0,
        is_active: selectedCourt?.[0]["is_active"] ? true : false,
        price_hour_non_subscriber:
          selectedCourt?.[0]["price_hour_non_subscriber"] || 0,
      });
    }
  }, [selectedCourt, reset]);

  useEffect(() => {
    if (isSuccess) {
      refetchCourts();
      toast.success("Kort güncellendi");
      reset();
      closeEditCourtModal();
    }
  }, [isSuccess]);

  if (isSelectedCourtLoading) {
    <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isEditCourtModalOpen}
      onRequestClose={closeEditCourtModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEditCourtModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Kort Düzenle</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Kort Adı</label>
              <input
                {...register("court_name", { required: true })}
                type="text"
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
          <div className={styles["input-outer-container"]}></div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Kort Statüsü</label>
              <select
                {...register("is_active", {
                  required: "Bu alan zorunludur.",
                })}
              >
                <option value="true">Aktif</option>
                <option value="false">Bloke</option>
              </select>
              {errors.is_active?.type === "required" && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            {currentClub?.[0]["higher_price_for_non_subscribers"] && (
              <div className={styles["input-container"]}>
                <label>Fiyat - Üye Olmayanlar (TL / saat)</label>
                <input
                  {...register("price_hour_non_subscriber", { required: true })}
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
              <div className={styles["court-picture-container"]}>
                <img
                  src={
                    existingImage ? existingImage : "/images/icons/avatar.jpg"
                  }
                  className={styles["court-image"]}
                />
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeEditCourtModal}
              className={styles["discard-button"]}
            >
              İptal Et
            </button>
            <button type="submit" className={styles["submit-button"]}>
              Tamamla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};
export default EditCourtModal;

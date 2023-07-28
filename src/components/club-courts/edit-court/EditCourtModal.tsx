import React, { useEffect } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useGetCourtStructureTypesQuery } from "../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../api/endpoints/CourtSurfaceTypesApi";
import {
  useGetCourtsQuery,
  useUpdateCourtMutation,
} from "../../../api/endpoints/CourtsApi";

import { useAppSelector } from "../../../store/hooks";

interface EditCourtModalProps {
  isEditCourtModalOpen: boolean;
  closeEditCourtModal: () => void;
  court_id: number;
}

type FormValues = {
  court_name: string;
  opening_time: string;
  closing_time: string;
  price_hour: number;
  court_structure_type_id: number;
  court_surface_type_id: number;
  club_id: number;
};

// TO DO: set selectedCourtId to null after editing court

const EditCourtModal = (props: EditCourtModalProps) => {
  const { isEditCourtModalOpen, closeEditCourtModal, court_id } = props;

  const { user } = useAppSelector((store) => store.user);

  const [updateCourt, { data, isSuccess }] = useUpdateCourtMutation({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const {
    data: courts,
    isLoading: isCourtsLoading,
    refetch,
  } = useGetCourtsQuery({});

  const selectedCourt = courts?.find((court) => court.court_id === court_id);

  const {
    register,
    handleSubmit,
    reset,
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
        club_id: user.clubDetails.club_id,
      };
      console.log(updatedCourtData);
      updateCourt(updatedCourtData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (courts && selectedCourt) {
      reset({
        court_name: selectedCourt.court_name || "",
        opening_time: selectedCourt.opening_time || "",
        closing_time: selectedCourt.closing_time || "",
        price_hour: selectedCourt.price_hour || 0,
        court_structure_type_id: selectedCourt.court_structure_type_id || 0,
        court_surface_type_id: selectedCourt.court_surface_type_id || 0,
      });
    }
  }, [selectedCourt, courts, reset]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
      closeEditCourtModal();
    }
  }, [isSuccess]);

  return (
    <Modal
      isOpen={isEditCourtModalOpen}
      onRequestClose={closeEditCourtModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Kort Düzenle</h1>
        <FaWindowClose
          onClick={closeEditCourtModal}
          className={styles["close-icon"]}
        />
      </div>
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
            />
            {errors.court_name && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Kort Yüzeyi</label>
            <select {...register("court_surface_type_id", { required: true })}>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Açılış Saati</label>
            <input
              {...register("opening_time", { required: true })}
              type="time"
              min="00:00"
              max="24:00"
            />
            {errors.opening_time && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kapanış Saati</label>
            <input
              {...register("closing_time", { required: true })}
              type="time"
              min="00:00"
              max="24:00"
            />
            {errors.closing_time && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Tamamla
        </button>
      </form>
    </Modal>
  );
};
export default EditCourtModal;

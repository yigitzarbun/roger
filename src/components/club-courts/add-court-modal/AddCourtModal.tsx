import React from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useAddCourtMutation } from "../../../api/endpoints/CourtsApi";
import { useGetCourtStructureTypesQuery } from "../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../api/endpoints/CourtSurfaceTypesApi";

interface AddCourtModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

type FormValues = {
  court_name: string;
  opening_time: number;
  closing_time: number;
  price_hour: number;
  court_structure_type_id: number;
  court_surface_type_id: number;
  club_id: number;
};

const AddCourtModal = (props: AddCourtModalProps) => {
  const { isModalOpen, closeModal } = props;
  const { user } = useAppSelector((store) => store.user);
  const [addCourt, { data, isSuccess }] = useAddCourtMutation();

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const {
    register,
    handleSubmit,
    reset,
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
        club_id: user.clubDetails.club_id,
      };
      console.log(newCourtData);
      addCourt(newCourtData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Kort Ekle</h1>
        <FaWindowClose onClick={closeModal} />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-container"]}>
          <label>Kort Adı</label>
          <input {...register("court_name", { required: true })} type="text" />
          {errors.court_name && (
            <span className={styles["error-field"]}>Bu alan zorunludur.</span>
          )}
        </div>
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
          <select {...register("court_structure_type_id", { required: true })}>
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
        <button type="submit">Tamamla</button>
      </form>
    </Modal>
  );
};

export default AddCourtModal;

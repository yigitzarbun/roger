import React from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";
import InviteModal from "../../invite-modal/InviteModal";
import { useState } from "react";

import { FormValues } from "../../invite-modal/InviteModal";

const MatchInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const player = location.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const bookingData = {
      event_date: formData.event_date,
      event_time: formData.event_time,
      // get from api
      booking_status_type_id: 1,
      // get from api
      event_type_id: 2,
      club_id: formData.club_id,
      court_id: formData.court_id,
      inviter_id: 1111111,
      invitee_id: player.user_id,
      lesson_price: null,
      court_price: null,
    };
    console.log(bookingData);
    setFormData(bookingData);
    setModal(true);
  };

  const handleModalSubmit = () => {
    setModal(false);
    handleSubmit((data) => {
      console.log(data);
      reset();
      navigate(paths.MATCH);
    })();
  };

  const handleCloseModal = () => {
    setModal(false);
  };
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Maç Davet</h1>
        <Link to={paths.MATCH}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <p
        className={styles["player-name"]}
      >{`Rakip: ${player.fname} ${player.lname}`}</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Tarih</label>
            <input
              {...register("event_date", {
                required: "Bu alan zorunludur",
              })}
              type="date"
            />
            {errors.event_date && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Saat</label>
            <input
              {...register("event_time", {
                required: "Bu alan zorunludur",
              })}
              type="time"
            />
            {errors.event_time && (
              <span className={styles["error-field"]}>
                {errors.event_time.message}
              </span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Konum</label>
            <select {...register("club_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="enka">Enka</option>
              <option value="ted">TED</option>
              <option value="antuka">Antuka</option>
            </select>
            {errors.club_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kort</label>
            <select {...register("court_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            {errors.court_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Davet et
        </button>
      </form>
      <InviteModal
        modal={modal}
        handleModalSubmit={handleModalSubmit}
        formData={formData}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default MatchInviteForm;

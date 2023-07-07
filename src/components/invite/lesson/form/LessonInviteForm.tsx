import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";
import InviteModal from "../../invite-modal/InviteModal";
import { useState } from "react";

export type FormValues = {
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  court_name: string;
  fname: string;
  lname: string;
  lesson_price: number;
  court_price: number;
  image: string;
};

const LessonInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coach = location.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    formData.event_type = "lesson";
    formData.fname = coach.fname;
    formData.lname = coach.lname;
    formData.lesson_price = coach.lesson_price;
    formData.court_price = coach.court_price;
    formData.image = coach.image;
    console.log(formData);
    setFormData(formData);
    setModal(true);
  };

  const handleModalSubmit = () => {
    setModal(false); // Close the modal
    handleSubmit((data) => {
      console.log(data);
      reset();
      navigate(paths.LESSON);
    })();
  };

  const handleCloseModal = () => {
    setModal(false);
  };
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Ders Davet</h1>
        <Link to={paths.LESSON}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <p
        className={styles["coach-name"]}
      >{`Eğitmen: ${coach.fname} ${coach.lname}`}</p>
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
            <select {...register("location", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="enka">Enka</option>
              <option value="ted">TED</option>
              <option value="antuka">Antuka</option>
            </select>
            {errors.location && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kort</label>
            <select {...register("court_name", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            {errors.court_name && (
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

export default LessonInviteForm;

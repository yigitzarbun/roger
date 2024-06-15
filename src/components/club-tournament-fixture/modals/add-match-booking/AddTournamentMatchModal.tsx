import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import {
  useAddBookingMutation,
  useGetBookedCourtHoursQuery,
} from "../../../../api/endpoints/BookingsApi";
import {
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";
import { useAddTournamentMatchMutation } from "../../../../api/endpoints/TournamentMatchesApi";
import { useAddMatchScoreMutation } from "../../../../api/endpoints/MatchScoresApi";

interface AddTournamentMatchModalProps {
  addTournamentMatchModalOpen: boolean;
  closeAddTournamentMatchModal: () => void;
  courts: any[];
  tournamentParticipants: any[];
  user: any;
  matchRound: number;
  tournamentId: number;
  refetchTournamentMatches: () => void;
}

export type FormValues = {
  event_type_id: number;
  event_date: string;
  event_time: string;
  booking_status_type_id: number;
  club_id: number;
  court_id: number;
  court_price: number;
  lesson_price: number | null;
  invitee_id: number;
  inviter_id: number;
  payment_id: number;
  invitation_note?: string;
};

const AddTournamentMatchModal = (props: AddTournamentMatchModalProps) => {
  const {
    addTournamentMatchModalOpen,
    closeAddTournamentMatchModal,
    courts,
    tournamentParticipants,
    user,
    matchRound,
    tournamentId,
    refetchTournamentMatches,
  } = props;

  const [addBooking, { data: bookingData, isSuccess: isBookingSuccess }] =
    useAddBookingMutation({});

  const [addTournamentMatch, { isSuccess: isAddTournamentMatchSuccess }] =
    useAddTournamentMatchMutation({});

  const [addMatchScore, { isSuccess: isAddMatchScoreSuccess }] =
    useAddMatchScoreMutation({});
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const today = new Date();
  let day = String(today.getDate());
  let month = String(today.getMonth() + 1);
  const year = today.getFullYear();

  day = String(day).length === 1 ? String(day).padStart(2, "0") : day;
  month = String(month).length === 1 ? String(month).padStart(2, "0") : month;
  const currentDay = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState("");
  const handleSelectedDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const [selectedTime, setSelectedTime] = useState("");
  const handleSelectedTime = (event) => {
    setSelectedTime(event.target.value);
  };
  const [selectedCourt, setSelectedCourt] = useState(null);
  const handleSelectedCourt = (event) => {
    setSelectedCourt(Number(event.target.value));
  };

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const bookingData = {
      event_date: formData.event_date,
      event_time: formData.event_time,
      court_price: 0,
      booking_status_type_id: 2,
      event_type_id: 7,
      club_id: Number(user?.clubDetails?.club_id),
      court_id: Number(formData.court_id),
      inviter_id: Number(formData.inviter_id),
      invitee_id: Number(formData.invitee_id),
    };

    addBooking(bookingData);
  };

  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );
  const [skipBookedHours, setSkipBookedHours] = useState(true);

  const {
    data: bookedHours,
    isLoading: isBookedHourssLoading,
    refetch: refetchBookedHours,
  } = useGetBookedCourtHoursQuery(
    {
      courtId: selectedCourt,
      eventDate: selectedDate,
    },
    { skip: skipBookedHours }
  );

  let availableTimeSlots = generateAvailableTimeSlots(
    selectedCourt,
    selectedDate,
    courts,
    bookedHoursForSelectedCourtOnSelectedDate
  );

  useEffect(() => {
    availableTimeSlots = generateAvailableTimeSlots(
      selectedCourt,
      selectedDate,
      courts,
      bookedHoursForSelectedCourtOnSelectedDate
    );
  }, [addTournamentMatchModalOpen]);

  useEffect(() => {
    if (bookedHours) {
      setBookedHours(bookedHours);
    } else {
      setBookedHours([]);
    }
  }, [bookedHours]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      setSkipBookedHours(false);
    }
  }, [selectedCourt, selectedDate]);

  useEffect(() => {
    if (isBookingSuccess) {
      const matchData = {
        booking_id: bookingData.booking_id,
        tournament_match_round_id: matchRound,
        tournament_id: tournamentId,
      };
      addTournamentMatch(matchData);
    }
  }, [isBookingSuccess]);

  useEffect(() => {
    if (isAddTournamentMatchSuccess) {
      const matchScoreData = {
        match_score_status_type_id: 1,
        booking_id: bookingData?.booking_id,
      };
      addMatchScore(matchScoreData);
    }
  }, [isAddTournamentMatchSuccess]);

  useEffect(() => {
    if (isAddMatchScoreSuccess) {
      refetchTournamentMatches();
      toast.success("Maç eklendi");
      reset();
      closeAddTournamentMatchModal();
    }
  }, [isAddMatchScoreSuccess]);

  return (
    <ReactModal
      isOpen={addTournamentMatchModalOpen}
      onRequestClose={closeAddTournamentMatchModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeAddTournamentMatchModal}
      />
      <div className={styles["top-container"]}>
        <div className={styles["modal-content"]}>
          <h1 className={styles.title}>Maç Ekle</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Oyuncu 1</label>
                <select {...register("inviter_id", { required: true })}>
                  <option value="">-- Seçim yapın --</option>
                  {tournamentParticipants.map((player) => (
                    <option key={player.user_id} value={player.user_id}>
                      {`${player.fname} ${player.lname}`}
                    </option>
                  ))}
                </select>
                {errors.inviter_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Oyuncu 2</label>
                <select {...register("invitee_id", { required: true })}>
                  <option value="">-- Seçim yapın --</option>
                  {tournamentParticipants.map((player) => (
                    <option key={player.user_id} value={player.user_id}>
                      {`${player.fname} ${player.lname}`}
                    </option>
                  ))}
                </select>
                {errors.invitee_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Tarih</label>
                <input
                  {...register("event_date", {
                    required: "Bu alan zorunludur",
                  })}
                  type="date"
                  onChange={handleSelectedDate}
                  min={currentDay}
                />
                {errors.event_date && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Kort</label>
                <select
                  {...register("court_id", { required: true })}
                  onChange={handleSelectedCourt}
                  disabled={!selectedDate}
                >
                  <option value="">-- Seçim yapın --</option>
                  {courts.map((court) => (
                    <option key={court.court_id} value={court.court_id}>
                      {court.court_name}
                    </option>
                  ))}
                </select>
                {errors.court_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Saat</label>
                <select
                  {...register("event_time", {
                    required: "Bu alan zorunludur",
                  })}
                  onChange={handleSelectedTime}
                  value={selectedTime}
                  disabled={!selectedDate}
                >
                  <option value="">-- Seçim yapın --</option>
                  {availableTimeSlots.map((timeSlot) => (
                    <option key={timeSlot.start} value={timeSlot.start}>
                      {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
                    </option>
                  ))}
                </select>
                {errors.event_time && (
                  <span className={styles["error-field"]}>
                    {errors.event_time.message}
                  </span>
                )}
              </div>
            </div>
            <div className={styles["buttons-container"]}>
              <button
                onClick={closeAddTournamentMatchModal}
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
      </div>
    </ReactModal>
  );
};
export default AddTournamentMatchModal;

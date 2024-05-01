import React, { useEffect } from "react";
import ReactModal from "react-modal";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import { useState } from "react";
import { localUrl } from "../../../../common/constants/apiConstants";
import {
  useGetClubByClubIdQuery,
  useGetClubsQuery,
} from "../../../../api/endpoints/ClubsApi";

import {
  useGetCourtByIdQuery,
  useGetCourtsQuery,
} from "../../../../api/endpoints/CourtsApi";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddBookingMutation,
  useGetBookedCourtHoursQuery,
  useGetPlayerOutgoingRequestsQuery,
  useGetTrainerOutgoingRequestsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffByFilterQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainerByUserIdQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";

import {
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";
import LessonInviteConfirmation from "../confirmation/LessonInviteConfirmation";

interface LessonInviteModalProps {
  opponentUserId: number;
  isInviteModalOpen: boolean;
  handleCloseInviteModal: () => void;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
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

const LessonInviteFormModal = (props: LessonInviteModalProps) => {
  const {
    opponentUserId,
    isInviteModalOpen,
    handleCloseInviteModal,
    isUserPlayer,
    isUserTrainer,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const navigate = useNavigate();

  const [confirmation, setConfirmation] = useState(false);
  const handleCloseConfirmation = () => {
    setConfirmation(false);
  };

  const { data: selectedTrainer, isLoading: isSelectedTrainerLoading } =
    useGetTrainerByUserIdQuery(
      isUserPlayer ? opponentUserId : isUserTrainer ? user?.user?.user_id : null
    );
  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerByUserIdQuery(
      isUserPlayer ? user?.user?.user_id : isUserTrainer ? opponentUserId : null
    );
  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const { refetch: refetchBookings } = useGetPlayerOutgoingRequestsQuery(
    user?.user?.user_id
  );
  const { refetch: refetchTrainerBookings } =
    useGetTrainerOutgoingRequestsQuery(user?.user?.user_id);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

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
  const [selectedClub, setSelectedClub] = useState(null);
  const handleSelectedClub = (event) => {
    setSelectedClub(Number(event.target.value));
  };

  const [selectedCourt, setSelectedCourt] = useState(null);
  const handleSelectedCourt = (event) => {
    setSelectedCourt(Number(event.target.value));
  };

  let trainerBankDetailsExist = false;
  let playerPaymentDetailsExist = false;

  if (
    selectedTrainer?.[0]?.iban &&
    selectedTrainer?.[0]?.bank_id &&
    selectedTrainer?.[0]?.name_on_bank_account
  ) {
    trainerBankDetailsExist = true;
  }

  if (
    selectedPlayer?.[0]?.name_on_card &&
    selectedPlayer?.[0]?.card_number &&
    selectedPlayer?.[0]?.cvc &&
    selectedPlayer?.[0]?.card_expiry
  ) {
    playerPaymentDetailsExist = true;
  }

  const [skipClubDetails, setSkipClubDetails] = useState(true);
  const { data: selectedClubDetails, isLoading: isSelectedClubDetailsLoading } =
    useGetClubByClubIdQuery(selectedClub, { skip: skipClubDetails });

  const [skipCourtDetails, setSkipCourtDetails] = useState(true);

  const {
    data: selectedCourtDetails,
    isLoading: isSelectedCourtDetailsLoading,
  } = useGetCourtByIdQuery(selectedCourt, { skip: skipCourtDetails });

  const [skipPlayerSubscribed, setSkipPlayerSubscribed] = useState(true);

  const { data: isPlayerSubscribed, isLoading: isPlayerSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery(
      {
        club_id: selectedClubDetails?.[0]?.user_id,
        player_id: user?.user?.user_id,
        is_active: true,
      },
      { skip: skipPlayerSubscribed }
    );
  const [skipTrainerStaff, setSkipTrainerStaff] = useState(true);

  const { data: isTrainerStaff, isLoading: isTrainerStaffLoading } =
    useGetClubStaffByFilterQuery(
      {
        user_id: isUserPlayer
          ? opponentUserId
          : isUserTrainer
          ? user?.user?.user_id
          : null,
        club_id: selectedClubDetails?.[0]?.club_id,
        employment_status: "accepted",
      },
      { skip: skipTrainerStaff }
    );

  // booking hours check
  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );
  const [skipBookedHours, setSkipBookedHours] = useState(true);
  const {
    data: bookedHours,
    isLoading: isBookedHoursLoading,
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    setConfirmation(true);
    const bookingData = {
      event_date: new Date(formData.event_date).toISOString(),
      event_time: formData.event_time,
      booking_status_type_id: 1,
      event_type_id: 3,
      club_id: formData.club_id,
      court_id: formData.court_id,
      inviter_id: user?.user.user_id,
      invitee_id: opponentUserId,
      lesson_price: selectedTrainer?.[0]?.price_hour,
      court_price:
        selectedClubDetails?.[0]?.higher_price_for_non_subscribers &&
        selectedCourtDetails?.[0]?.price_hour_non_subscriber &&
        !isPlayerSubscribed
          ? selectedCourtDetails?.[0]?.price_hour_non_subscriber
          : selectedCourtDetails?.[0]?.price_hour,
      payment_id: null,
      invitation_note: formData?.invitation_note
        ? formData?.invitation_note
        : "",
    };
    setBookingFormData(bookingData);
  };

  const handleModalSubmit = () => {
    if (playerPaymentDetailsExist && trainerBankDetailsExist) {
      const paymentDetails = {
        payment_amount:
          bookingFormData?.lesson_price + bookingFormData?.court_price,
        court_price: bookingFormData?.court_price,
        lesson_price: bookingFormData?.lesson_price,
        payment_status: "pending",
        payment_type_id: 3,
        sender_inviter_id: selectedPlayer?.[0]?.user_id,
        sender_invitee_id: null,
        recipient_club_id: selectedClubDetails?.[0]?.user_id,
        recipient_trainer_id: isUserPlayer
          ? opponentUserId
          : isUserTrainer
          ? user?.user?.user_id
          : null,
      };
      addPayment(paymentDetails);
    }
  };
  useEffect(() => {
    availableTimeSlots = generateAvailableTimeSlots(
      selectedCourt,
      selectedDate,
      courts,
      bookedHoursForSelectedCourtOnSelectedDate
    );
  }, [isInviteModalOpen]);

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
    if (selectedClub) {
      setSkipClubDetails(false);
    } else {
      setSkipClubDetails(true);
    }
  }, [selectedClub]);

  useEffect(() => {
    if (selectedCourt) {
      setSkipCourtDetails(false);
    } else {
      setSkipCourtDetails(true);
    }
  }, [selectedCourt]);

  useEffect(() => {
    if (selectedClubDetails?.length > 0) {
      setSkipPlayerSubscribed(false);
    } else {
      setSkipPlayerSubscribed(true);
    }
  }, [selectedClubDetails]);

  useEffect(() => {
    if (selectedTrainer?.length > 0 && selectedClubDetails?.length > 0) {
      setSkipTrainerStaff(false);
    } else {
      setSkipTrainerStaff(true);
    }
  }, [selectedClubDetails]);

  useEffect(() => {
    if (isPaymentSuccess) {
      refetchPayments();
      bookingFormData.payment_id = paymentData?.payment_id;
      addBooking(bookingFormData);
      reset();
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isBookingSuccess) {
      refetchBookings();
      refetchBookedHours();
      refetchTrainerBookings();
      availableTimeSlots = generateAvailableTimeSlots(
        selectedCourt,
        selectedDate,
        courts,
        bookedHoursForSelectedCourtOnSelectedDate
      );
      toast.success("Başarıyla gönderildi");
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess, refetchBookings, navigate]);

  return (
    <ReactModal
      isOpen={isInviteModalOpen}
      onRequestClose={handleCloseInviteModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseInviteModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h3>Ders Davet</h3>
        </div>
        <div className={styles["opponent-container"]}>
          <img
            src={
              isUserPlayer && selectedTrainer?.[0]?.image
                ? `${localUrl}/${selectedTrainer?.[0]?.image}`
                : isUserTrainer && selectedPlayer?.[0]?.image
                ? `${localUrl}/${selectedPlayer?.[0]?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["trainer-name"]}>
            {isUserPlayer
              ? `${selectedTrainer?.[0]?.fname} ${selectedTrainer?.[0]?.lname}`
              : isUserTrainer
              ? `${selectedPlayer?.[0]?.fname} ${selectedPlayer?.[0]?.lname}`
              : ""}
          </p>
        </div>
        {confirmation ? (
          <LessonInviteConfirmation
            handleCloseConfirmation={handleCloseConfirmation}
            handleModalSubmit={handleModalSubmit}
            selectedClubName={selectedClubDetails?.[0]?.club_name}
            selectedCourtName={selectedCourtDetails?.[0]?.court_name}
            selectedCourtPrice={selectedCourtDetails?.[0]?.price_hour}
            selectedTrainerPrice={selectedTrainer?.[0]?.price_hour}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            isUserPlayer={isUserPlayer}
            isUserTrainer={isUserTrainer}
          />
        ) : (
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
                <label>Kulüp</label>
                <select
                  {...register("club_id", { required: true })}
                  onChange={handleSelectedClub}
                >
                  <option value="">--Seçim yapın--</option>
                  {clubs?.map((club) => (
                    <option key={club.user_id} value={club.club_id}>
                      {club.club_name}
                    </option>
                  ))}
                </select>
                {errors.club_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Kort</label>
                <select
                  {...register("court_id", { required: true })}
                  onChange={handleSelectedCourt}
                  disabled={!selectedClub || !selectedDate}
                >
                  <option value="">-- Seçim yapın --</option>
                  {selectedClub &&
                    courts
                      ?.filter(
                        (court) =>
                          court.club_id === selectedClub &&
                          court.is_active === true
                      )
                      .map((court) => (
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
              <div className={styles["input-container"]}>
                <label>Saat</label>
                <select
                  {...register("event_time", {
                    required: "Bu alan zorunludur",
                  })}
                  onChange={handleSelectedTime}
                  value={selectedTime}
                  disabled={!selectedClub || !selectedDate}
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
            <div className={styles["input-outer-container"]}>
              <div className={styles["message-container"]}>
                <label>Not</label>
                <textarea
                  {...register("invitation_note")}
                  placeholder="Karşı tarafa davetinizle ilgili eklemek istediğiniz not"
                />
              </div>
            </div>
            <div className={styles["buttons-container"]}>
              <button
                onClick={handleCloseInviteModal}
                className={styles["discard-button"]}
              >
                İptal
              </button>
              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={
                  (selectedClubDetails?.[0]
                    ?.is_player_lesson_subscription_required &&
                    isPlayerSubscribed?.length === 0) ||
                  (selectedClubDetails?.[0]?.is_trainer_subscription_required &&
                    isTrainerStaff?.length === 0) ||
                  !playerPaymentDetailsExist ||
                  !trainerBankDetailsExist ||
                  !selectedClub ||
                  !selectedCourt ||
                  !selectedTime ||
                  !selectedDate
                }
              >
                Davet Gönder
              </button>
            </div>
            {isUserPlayer &&
              selectedClubDetails?.[0]
                ?.is_player_lesson_subscription_required &&
              isPlayerSubscribed?.length === 0 && (
                <p className={styles["validation-text"]}>
                  Bu kortu kiralayabilmek için kulüp üyeliği gerekmektedir
                </p>
              )}
            {isUserPlayer &&
              selectedClubDetails?.[0]?.is_trainer_subscription_required &&
              isTrainerStaff?.length === 0 && (
                <p className={styles["validation-text"]}>
                  Bu kulüpte ders alabilmek için eğitmenin kulüp çalışanı olması
                  gerekmektedir.
                </p>
              )}
            {isUserTrainer &&
              selectedClubDetails?.[0]?.is_trainer_subscription_required &&
              isTrainerStaff?.length === 0 && (
                <p className={styles["validation-text"]}>
                  Bu kulüpte ders verebilmek için kulüp çalışanı olmanız
                  gerekmektedir.
                </p>
              )}
            {isUserTrainer && !playerPaymentDetailsExist && (
              <p className={styles["validation-text"]}>
                Kort kiralamak içi öğrencinin ödeme bilgilerini eklemesi
                gerekmektedir.
              </p>
            )}
            {isUserPlayer && !playerPaymentDetailsExist && (
              <p className={styles["validation-text"]}>
                Kort kiralamak içi ödeme bilgilerinizi eklemeniz gerekmektedir.
              </p>
            )}
            {isUserTrainer && !trainerBankDetailsExist && (
              <p className={styles["validation-text"]}>
                Kort kiralamak içi ödeme bilgilerinizi eklemeniz gerekmektedir.
              </p>
            )}
            {isUserPlayer && !trainerBankDetailsExist && (
              <p className={styles["validation-text"]}>
                Seçtiğiniz eğitmenin henüz banka bilgileri mevcut değildir.
              </p>
            )}
          </form>
        )}
      </div>
    </ReactModal>
  );
};

export default LessonInviteFormModal;

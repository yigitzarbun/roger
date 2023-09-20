import React, { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import InviteModal, { FormValues } from "../../modals/invite-modal/InviteModal";

import { useState } from "react";

import {
  useGetClubByClubIdQuery,
  useGetClubsQuery,
} from "../../../../api/endpoints/ClubsApi";

import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffByFilterQuery } from "../../../../api/endpoints/ClubStaffApi";
import {
  useGetTrainerByUserIdQuery,
  useGetTrainersQuery,
} from "../../../../api/endpoints/TrainersApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";

import {
  currentDay,
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";
import PageLoading from "../../../../components/loading/PageLoading";

const LeesonInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const user = useAppSelector((store) => store?.user?.user);

  const isUserTrainer = user?.user?.user_type_id === 2;
  const isUserPlayer = user?.user?.user_type_id === 1;

  let trainer;
  let player;
  let trainerUserId;
  let playerUserId;

  let trainerBankDetailsExist = false;
  let playerPaymentDetailsExist = false;

  if (user && isUserTrainer) {
    player = location.state;
    trainerUserId = user?.user?.user_id;
    playerUserId = player?.user_id;
    trainer = user;
  }

  if (user && isUserPlayer) {
    trainer = location.state;
    trainerUserId = trainer?.user_id;
    player = user;
    playerUserId = user?.user?.user_id;
  }

  const { data: selectedTrainer, isLoading: isSelectedTrainerLoading } =
    useGetTrainerByUserIdQuery(trainerUserId);
  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerByUserIdQuery(playerUserId);

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

  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

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

  // subscription check
  let isPlayerSubscribed = false;
  let isTrainerStaff = false;

  let playerSubscriptionRequired = false;
  let trainerStaffRequired = false;

  const [skip, setSkip] = useState(true);

  const { data: selectedClubDetails, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(selectedClub, { skip: skip });

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffByFilterQuery(
      {
        user_id: trainerUserId,
        club_id: selectedClub,
        employment_status: "accepted",
      },
      { skip: skip }
    );

  const {
    data: selectedClubSubscriptions,
    isLoading: isClubSubscriptionsLoading,
  } = useGetClubSubscriptionsByFilterQuery(
    {
      club_id: clubs?.find((club) => club.club_id === selectedClub)?.user_id,
      player_id: playerUserId,
      is_active: true,
    },
    { skip: skip }
  );

  // booking hours check
  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );

  useEffect(() => {
    if (selectedCourt && selectedDate && bookings) {
      const filteredBookings = bookings.filter(
        (booking) =>
          booking.court_id === Number(selectedCourt) &&
          booking.event_date.slice(0, 10) === selectedDate &&
          (booking.booking_status_type_id === 1 ||
            booking.booking_status_type_id === 2)
      );
      setBookedHours(filteredBookings);
    }
  }, [selectedCourt, selectedDate, bookings]);

  const availableTimeSlots = generateAvailableTimeSlots(
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

  const [modal, setModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const bookingData = {
      event_date: new Date(formData.event_date).toISOString(),
      event_time: formData.event_time,
      booking_status_type_id: 1,
      event_type_id: 3,
      club_id: selectedClub,
      court_id: formData.court_id,
      inviter_id: user?.user?.user_id,
      invitee_id: isUserTrainer
        ? playerUserId
        : isUserPlayer
        ? trainerUserId
        : null,
      lesson_price: trainers?.find(
        (trainer) => trainer.user_id === trainerUserId
      )?.price_hour,
      court_price:
        clubs?.find(
          (club) =>
            club.club_id ===
            courts?.find((court) => court.court_id === selectedCourt)?.club_id
        )?.higher_price_for_non_subscribers &&
        courts.find((court) => court.court_id === selectedCourt)
          ?.price_hour_non_subscriber &&
        (!isPlayerSubscribed || !isTrainerStaff)
          ? courts.find((court) => court.court_id === selectedCourt)
              ?.price_hour_non_subscriber
          : courts?.find((court) => court.court_id === selectedCourt)
              ?.price_hour,
      payment_id: null,
      invitation_note: formData?.invitation_note
        ? formData?.invitation_note
        : "",
    };
    setBookingFormData(bookingData);
    setModal(true);
  };

  // disabled button

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("");

  const handleModalSubmit = () => {
    setModal(false);

    if (playerPaymentDetailsExist && trainerBankDetailsExist) {
      const paymentDetails = {
        payment_amount:
          bookingFormData?.court_price +
          trainers?.find((trainer) => trainer.user_id === trainerUserId)
            ?.price_hour,
        court_price: bookingFormData?.court_price,
        lesson_price: trainers?.find(
          (trainer) => trainer.user_id === trainerUserId
        )?.price_hour,
        payment_status: "pending",
        payment_type_id: 3,
        sender_inviter_id: playerUserId,
        recipient_trainer_id: trainerUserId,
        recipient_club_id: clubs?.find(
          (club) => club.club_id === Number(bookingFormData?.club_id)
        )?.user_id,
      };
      addPayment(paymentDetails);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  useEffect(() => {
    reset({
      club_id: selectedClub || "",
      event_date: selectedDate || "",
    });
  }, [selectedClub, reset]);

  useEffect(() => {
    if (selectedClub) {
      setSkip(false);
    }
  }, [selectedClub]);

  useEffect(() => {
    playerSubscriptionRequired =
      selectedClubDetails?.[0]?.is_player_lesson_subscription_required;

    trainerStaffRequired =
      selectedClubDetails?.[0]?.is_trainer_subscription_required;

    isPlayerSubscribed = selectedClubSubscriptions?.length > 0;

    isTrainerStaff = clubStaff?.length > 0 ? true : false;

    if (
      playerSubscriptionRequired === true &&
      trainerStaffRequired === true &&
      (isPlayerSubscribed === false || isTrainerStaff === false)
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için oyuncunun kulübe üye, eğitmenin kulüp çalışanı olması gerekmektedir"
      );
    } else if (
      playerSubscriptionRequired === false &&
      trainerStaffRequired === true &&
      isTrainerStaff === false
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için eğitmenin kulüp çalışanı olması gerekmektedir"
      );
    } else if (
      playerSubscriptionRequired === true &&
      trainerStaffRequired === false &&
      isPlayerSubscribed === false
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için oyuncunun kulüp üyesi olması gerekmektedir"
      );
    } else {
      setIsButtonDisabled(false);
      setButtonText("");
    }
  }, [selectedClubDetails, selectedClubSubscriptions, clubStaff]);

  useEffect(() => {
    if (selectedPlayer && selectedTrainer) {
      if (!trainerBankDetailsExist || !playerPaymentDetailsExist) {
        setIsButtonDisabled(true);
        setButtonText(
          "Kort kiralamak için oyuncu ve eğitmenin banka bilgilerinin mevcut olması gerekmektedir"
        );
      }
    }
  }, [selectedPlayer, selectedTrainer]);

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
      toast.success("Başarıyla gönderildi");
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess]);

  if (
    isBookingsLoading ||
    isClubStaffLoading ||
    isClubSubscriptionsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isTrainersLoading ||
    isSelectedTrainerLoading ||
    isSelectedPlayerLoading ||
    isSelectedClubLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Ders Davet</h1>
        <img
          src="/images/icons/prev.png"
          className={styles["prev-button"]}
          onClick={navigateToPreviousPage}
        />
      </div>

      {isUserPlayer && (
        <div className={styles["opponent-container"]}>
          <img
            src={trainer?.image ? trainer?.image : "/images/icons/avatar.png"}
            className={styles["opponent-image"]}
          />
          <p
            className={styles["player-name"]}
          >{`${trainer.fname} ${trainer.lname}`}</p>
          <p>{selectedClub}</p>
        </div>
      )}
      {isUserTrainer && (
        <div className={styles["opponent-container"]}>
          <img
            src={player?.image ? player?.image : "/images/icons/avatar.png"}
            className={styles["opponent-image"]}
          />
          <p
            className={styles["player-name"]}
          >{`${player.fname} ${player.lname}`}</p>
        </div>
      )}
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
                      court.club_id === selectedClub && court.is_active === true
                  )
                  .map((court) => (
                    <option key={court.court_id} value={court.court_id}>
                      {court.court_name}
                    </option>
                  ))}
            </select>
            {errors.court_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
          <div className={styles["input-container"]}>
            <label>Not</label>
            <textarea
              {...register("invitation_note")}
              placeholder="Karşı tarafa davetinizle ilgili eklemek istediğiniz not"
            />
          </div>
        </div>
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? buttonText : "Davet et"}
        </button>
      </form>
      <InviteModal
        modal={modal}
        handleModalSubmit={handleModalSubmit}
        formData={bookingFormData}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default LeesonInviteForm;

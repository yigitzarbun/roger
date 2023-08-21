import React, { useState, useEffect } from "react";

import { useLocation, Link, useNavigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import InviteModal, { FormValues } from "../../modals/invite-modal/InviteModal";

import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";

import { useAppSelector } from "../../../../store/hooks";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";

const CourtBookingForm = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const courtBookingDetails = location?.state;

  const user = useAppSelector((store) => store?.user?.user?.user);
  const isUserPlayer = user?.user_type_id === 1;
  const isUserTrainer = user?.user_type_id === 2;

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const { isLoading: isBookingsLoading, refetch: refetchBookings } =
    useGetBookingsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [selectedEventType, setSelectedEventType] = useState(null);
  const handleSelectedEvent = (event) => {
    setSelectedEventType(Number(event.target.value));
  };

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const handleSelectedPlayer = (event) => {
    setSelectedPlayer(Number(event.target.value));
  };

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const handleSelectedTrainer = (event) => {
    setSelectedTrainer(Number(event.target.value));
  };

  const selectedClub = clubs?.find(
    (club) => club.club_id === courtBookingDetails?.club_id
  );

  let playerSubscriptionRequired =
    selectedClub?.is_player_subscription_required;

  let playerLessonSubscriptionRequired =
    selectedClub?.is_player_lesson_subscription_required;

  let trainerStaffRequired = selectedClub?.is_trainer_subscription_required;

  let isTrainerStaff = false;
  let isPlayerSubscribed = false;

  let isButtonDisabled = false;
  let buttonText = "";

  let playerPaymentDetailsExist = false;
  let trainerPaymentDetailsExist = false;

  if (selectedEventType === 1 || selectedEventType === 2) {
    if (playerSubscriptionRequired) {
      const inviterPlayerSubscribed = clubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === user?.user_id &&
          subscription.club_id === selectedClub?.user_id &&
          subscription.is_active === true
      )
        ? true
        : false;
      const inviteePlayerSubscribed = clubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === selectedPlayer &&
          subscription.club_id === selectedClub?.user_id &&
          subscription.is_active === true
      )
        ? true
        : false;
      if (
        inviterPlayerSubscribed === false ||
        inviteePlayerSubscribed === false
      ) {
        isButtonDisabled = true;
        buttonText =
          "Kort kiralayabilmek için oyuncuların kulübe üye olması gerekmetkedir";
      }
    }

    const inviterPlayer = players?.find(
      (player) => player.user_id === user?.user_id
    );
    const inviteePlayer = players?.find(
      (player) => player.user_id === selectedPlayer
    );

    let inviterPlayerPaymentDetailsExist = false;
    if (
      inviterPlayer?.name_on_card &&
      inviterPlayer?.card_number &&
      inviterPlayer?.cvc &&
      inviterPlayer?.card_expiry
    ) {
      inviterPlayerPaymentDetailsExist = true;
    }

    let inviteePlayerPaymentDetailsExist = false;
    if (
      inviteePlayer?.name_on_card &&
      inviteePlayer?.card_number &&
      inviteePlayer?.cvc &&
      inviteePlayer?.card_expiry
    ) {
      inviteePlayerPaymentDetailsExist = true;
    }
    if (inviterPlayerPaymentDetailsExist && inviteePlayerPaymentDetailsExist) {
      playerPaymentDetailsExist = true;
    }

    if (playerPaymentDetailsExist === false) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralamak için oyuncuların kart bilgilerini eklemeleri gerekmektedir";
    }
  }

  if (selectedEventType === 3) {
    if (isUserPlayer) {
      isPlayerSubscribed = clubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === user?.user_id &&
          subscription.club_id === selectedClub?.user_id &&
          subscription.is_active === true
      )
        ? true
        : false;

      isTrainerStaff = clubStaff?.find(
        (staff) =>
          staff.user_id === selectedTrainer &&
          staff.club_id === selectedClub?.club_id &&
          staff.employment_status === "accepted"
      )
        ? true
        : false;

      const selectedPlayer = players?.find(
        (player) => player.user_id === user?.user_id
      );
      if (
        selectedPlayer?.name_on_card &&
        selectedPlayer?.card_number &&
        selectedPlayer?.cvc &&
        selectedPlayer?.card_expiry
      ) {
        playerPaymentDetailsExist = true;
      }

      const selectedTrainerDetails = trainers?.find(
        (trainer) => trainer.user_id === selectedTrainer
      );
      if (
        selectedTrainerDetails?.iban &&
        selectedTrainerDetails?.name_on_bank_account &&
        selectedTrainerDetails?.bank_id
      ) {
        trainerPaymentDetailsExist = true;
      }
    } else if (isUserTrainer) {
      isPlayerSubscribed = clubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === selectedPlayer &&
          subscription.club_id === selectedClub?.user_id &&
          subscription.is_active === true
      )
        ? true
        : false;

      isTrainerStaff = clubStaff?.find(
        (staff) =>
          staff.user_id === user?.user_id &&
          staff.club_id === selectedClub?.club_id &&
          staff.employment_status === "accepted"
      )
        ? true
        : false;

      const selectedTrainer = trainers?.find(
        (trainer) => trainer.user_id === user?.user_id
      );
      if (
        selectedTrainer?.iban &&
        selectedTrainer?.name_on_bank_account &&
        selectedTrainer?.bank_id
      ) {
        trainerPaymentDetailsExist = true;
      }
    }

    const selectedPlayerDetails = players?.find(
      (player) => player.user_id === selectedPlayer
    );
    if (
      selectedPlayerDetails?.name_on_card &&
      selectedPlayerDetails?.card_number &&
      selectedPlayerDetails?.cvc &&
      selectedPlayerDetails?.card_expiry
    ) {
      playerPaymentDetailsExist = true;
    }
    if (
      playerPaymentDetailsExist === false ||
      trainerPaymentDetailsExist === false
    ) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralamak için oyuncu ve eğitmenin kart bilgilerini eklemeleri gerekmektedir";
    }

    if (
      playerLessonSubscriptionRequired === true &&
      trainerStaffRequired === true &&
      (isPlayerSubscribed === false || isTrainerStaff === false)
    ) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralamak için oyuncunun kulübe üye olması, eğitmenin kulüp çalışanı olması gerekmektedir";
    } else if (
      playerLessonSubscriptionRequired === false &&
      trainerStaffRequired === true &&
      isTrainerStaff === false
    ) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralamak için eğitmenin kulüp çalışanı olması gerekmektedir";
    } else if (
      playerLessonSubscriptionRequired === true &&
      trainerStaffRequired === false &&
      isPlayerSubscribed === false
    ) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralamak için oyuncunun kulübe üye olması gerekmektedir";
    }
  }

  const [modal, setModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const eventDate = new Date(courtBookingDetails?.event_date);
    const eventTime = courtBookingDetails?.event_time;
    const hours = Math.floor(eventTime / 100);
    const minutes = eventTime % 100;

    const parsedEventDate = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      hours,
      minutes
    );

    const timeZoneOffset = parsedEventDate.getTimezoneOffset();
    parsedEventDate.setMinutes(parsedEventDate.getMinutes() + timeZoneOffset);

    const bookingData = {
      event_date: parsedEventDate.toISOString(),
      event_time: `${String(courtBookingDetails?.event_time).slice(
        0,
        2
      )}:${String(courtBookingDetails?.event_time).slice(2)}`,
      booking_status_type_id: 1,
      event_type_id: Number(formData?.event_type_id),
      club_id: Number(courtBookingDetails?.club_id),
      court_id: Number(courtBookingDetails?.club_id),
      inviter_id: user?.user_id,
      invitee_id: Number(formData?.invitee_id),
      lesson_price: null,
      court_price: Number(courtBookingDetails?.court_price),
      payment_id: null,
    };

    setBookingFormData(bookingData);
    setModal(true);
  };

  const handleModalSubmit = () => {
    setModal(false);
    const paymentDetails = {
      payment_amount:
        bookingFormData?.event_type_id === 3 && isUserPlayer
          ? trainers?.find((trainer) => trainer.user_id === selectedTrainer)
              ?.price_hour + bookingFormData?.court_price
          : bookingFormData?.event_type_id === 3 && isUserTrainer
          ? trainers?.find((trainer) => trainer.user_id === user?.user_id)
              ?.price_hour + bookingFormData?.court_price
          : bookingFormData?.event_type_id === 1 ||
            bookingFormData?.event_type_id === 2
          ? bookingFormData?.court_price
          : null,
      lesson_price:
        bookingFormData?.event_type_id === 3 && isUserPlayer
          ? trainers?.find((trainer) => trainer.user_id === selectedTrainer)
              ?.price_hour
          : bookingFormData?.event_type_id === 3 && isUserTrainer
          ? trainers?.find((trainer) => trainer.user_id === user?.user_id)
              ?.price_hour
          : null,
      court_price: bookingFormData?.court_price,
      payment_status: "pending",
      payment_type_id:
        bookingFormData?.event_type_id === 1
          ? 1
          : bookingFormData?.event_type_id === 2
          ? 2
          : bookingFormData?.event_type_id === 3
          ? 3
          : null,
      sender_inviter_id:
        bookingFormData?.event_type_id === 1 ||
        bookingFormData?.event_type_id === 2
          ? user?.user_id
          : bookingFormData?.event_type_id === 3 && isUserPlayer
          ? user?.user_id
          : null,
      sender_invitee_id:
        bookingFormData?.event_type_id === 1 ||
        bookingFormData?.event_type_id === 2
          ? selectedPlayer
          : bookingFormData?.event_type_id === 3 && isUserTrainer
          ? selectedPlayer
          : null,
      recipient_club_id: clubs?.find(
        (club) => club.club_id === Number(bookingFormData?.club_id)
      )?.user_id,
      recipient_trainer_id:
        bookingFormData?.event_type_id === 3 && isUserTrainer
          ? user?.user_id
          : bookingFormData?.event_type_id === 3 && isUserPlayer
          ? selectedTrainer
          : null,
    };
    if (
      ((bookingFormData?.event_type_id === 1 ||
        bookingFormData?.event_type_id === 2) &&
        playerPaymentDetailsExist) ||
      (bookingFormData?.event_type_id === 3 &&
        playerPaymentDetailsExist &&
        trainerPaymentDetailsExist)
    ) {
      addPayment(paymentDetails);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

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
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess, refetchBookings, navigate]);

  if (
    isBookingsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isEventTypesLoading ||
    isClubSubscriptionsLoading ||
    isClubStaffLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Kort Kiralama</h1>
        <Link to={paths.EXPLORE}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>

      <p className={styles["court-name"]}>{`Kort: ${
        courts?.find(
          (court) => court.court_id === courtBookingDetails?.court_id
        )?.court_name
      } - Kulüp: ${
        clubs?.find((club) => club.club_id === courtBookingDetails?.club_id)
          ?.club_name
      }`}</p>
      <p className={styles["court-name"]}>{`Tarih: ${
        courtBookingDetails?.event_date
      } - Saat: ${String(courtBookingDetails?.event_time).slice(0, 2)}:${String(
        courtBookingDetails?.event_time
      ).slice(2)}`}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        {
          <div className={styles["input-container"]}>
            <label>Etkinlik Türü</label>
            <select
              {...register("event_type_id", { required: true })}
              onChange={handleSelectedEvent}
            >
              <option value="">-- Seçim yapın --</option>
              {isUserPlayer &&
                eventTypes
                  ?.filter((type) => type.event_type_name !== "external")
                  .map((type) => (
                    <option key={type.event_type_id} value={type.event_type_id}>
                      {type.event_type_name}
                    </option>
                  ))}
              {isUserTrainer &&
                eventTypes
                  ?.filter((type) => type.event_type_name === "lesson")
                  .map((type) => (
                    <option key={type.event_type_id} value={type.event_type_id}>
                      {type.event_type_name}
                    </option>
                  ))}
            </select>
            {errors.event_type_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        }
        {isUserPlayer &&
          (selectedEventType === 1 || selectedEventType === 2) && (
            <div className={styles["input-container"]}>
              <label>Oyuncu Seçimi</label>
              <select
                {...register("invitee_id", { required: true })}
                onChange={handleSelectedPlayer}
              >
                <option value="">-- Seçim yapın --</option>
                {players
                  ?.filter((player) => player.user_id !== user?.user_id)
                  .map((player) => (
                    <option key={player.user_id} value={player.user_id}>
                      {`${player.fname} ${player.lname} - ${player.gender}`}
                    </option>
                  ))}
              </select>
              {errors.invitee_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          )}
        {selectedEventType === 3 && (
          <div className={styles["input-container"]}>
            <label>
              {isUserPlayer
                ? "Eğitmen Seçimi"
                : isUserTrainer
                ? "Oyuncu Seçimi"
                : ""}
            </label>
            <select
              {...register("invitee_id", { required: true })}
              onChange={
                isUserPlayer
                  ? handleSelectedTrainer
                  : isUserTrainer
                  ? handleSelectedPlayer
                  : null
              }
            >
              <option value="">-- Seçim yapın --</option>
              {isUserPlayer &&
                trainers.map((trainer) => (
                  <option key={trainer.user_id} value={trainer.user_id}>
                    {`${trainer.fname} ${trainer.lname} - ${trainer.price_hour} TL / Saat`}
                  </option>
                ))}
              {isUserTrainer &&
                players.map((player) => (
                  <option key={player.user_id} value={player.user_id}>
                    {`${player.fname} ${player.lname}`}
                  </option>
                ))}
            </select>
            {errors.invitee_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        )}
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={isButtonDisabled}
        >
          {(selectedPlayer || selectedTrainer) && isButtonDisabled
            ? buttonText
            : "Davet Gönder"}
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

export default CourtBookingForm;

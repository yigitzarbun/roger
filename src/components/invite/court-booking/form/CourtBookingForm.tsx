import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

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
import {
  useGetClubByClubIdQuery,
  useGetClubsQuery,
} from "../../../../api/endpoints/ClubsApi";
import {
  useGetPlayerByUserIdQuery,
  useGetPlayersQuery,
} from "../../../../api/endpoints/PlayersApi";
import {
  useGetTrainerByUserIdQuery,
  useGetTrainersQuery,
} from "../../../../api/endpoints/TrainersApi";
import {
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../../api/endpoints/ClubSubscriptionsApi";
import {
  useGetClubStaffByFilterQuery,
  useGetClubStaffQuery,
} from "../../../../api/endpoints/ClubStaffApi";

import { useAppSelector } from "../../../../store/hooks";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";
import PageLoading from "../../../../components/loading/PageLoading";

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

  const userGender = players?.find(
    (player) => player?.user_id === user?.user_id
  )?.gender;

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(courtBookingDetails?.club_id);

  let playerSubscriptionRequired =
    selectedClub?.[0]?.is_player_subscription_required;

  let playerLessonSubscriptionRequired =
    selectedClub?.[0]?.is_player_lesson_subscription_required;

  let trainerStaffRequired =
    selectedClub?.[0]?.is_trainer_subscription_required;

  let isTrainerStaff = false;
  let isPlayerSubscribed = false;

  let isButtonDisabled = false;
  let buttonText = "";

  let playerPaymentDetailsExist = false;
  let trainerPaymentDetailsExist = false;

  let inviterPlayerSubscribed = false;
  let inviteePlayerSubscribed = false;

  const [trainingMatchSkip, setTrainingMatchSkip] = useState(true);
  const [lessonSkipPlayer, setLessonSkipPlayer] = useState(true);
  const [lessonSkipTrainer, setLessonSkipTrainer] = useState(true);

  const {
    data: isInviterPlayerSubscribed,
    isLoading: isInviterPlayerSubscribedLoading,
  } = useGetClubSubscriptionsByFilterQuery(
    {
      player_id: user?.user_id,
      club_id: selectedClub?.[0]?.user_id,
      is_active: true,
    },
    { skip: trainingMatchSkip }
  );

  const {
    data: isInviteePlayerSubscribed,
    isLoading: isInviteePlayerSubscribedLoading,
  } = useGetClubSubscriptionsByFilterQuery(
    {
      player_id: selectedPlayer,
      club_id: selectedClub?.[0]?.user_id,
      is_active: true,
    },
    { skip: trainingMatchSkip }
  );

  const { data: inviterPlayer, isLoading: isInviterPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user_id, { skip: trainingMatchSkip });

  const { data: inviteePlayer, isLoading: isInviteePlayerLoading } =
    useGetPlayerByUserIdQuery(selectedPlayer, { skip: trainingMatchSkip });

  if (selectedEventType === 1 || selectedEventType === 2) {
    // subscription
    inviterPlayerSubscribed =
      isInviterPlayerSubscribed?.length > 0 ? true : false;
    inviteePlayerSubscribed =
      isInviteePlayerSubscribed?.length > 0 ? true : false;

    if (
      (inviterPlayerSubscribed === false ||
        inviteePlayerSubscribed === false) &&
      playerSubscriptionRequired
    ) {
      isButtonDisabled = true;
      buttonText =
        "Kort kiralayabilmek için oyuncuların kulübe üye olması gerekmetkedir";
    }

    // payment details

    let inviterPlayerPaymentDetailsExist = false;
    if (
      inviterPlayer?.[0]?.name_on_card &&
      inviterPlayer?.[0]?.card_number &&
      inviterPlayer?.[0]?.cvc &&
      inviterPlayer?.[0]?.card_expiry
    ) {
      inviterPlayerPaymentDetailsExist = true;
    }

    let inviteePlayerPaymentDetailsExist = false;
    if (
      inviteePlayer?.[0]?.name_on_card &&
      inviteePlayer?.[0]?.card_number &&
      inviteePlayer?.[0]?.cvc &&
      inviteePlayer?.[0]?.card_expiry
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

  const { data: lessonPlayerDetails, isLoading: isLessonPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id, { skip: lessonSkipPlayer });

  const { data: playerSubscribed, isLoading: isPlayerSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery(
      {
        player_id: user?.user_id,
        club_id: selectedClub?.[0]?.user_id,
        is_active: true,
      },
      { skip: lessonSkipPlayer }
    );

  const { data: trainerStaff, isLoading: isTrainerStaffLoading } =
    useGetClubStaffByFilterQuery(
      {
        user_id: selectedTrainer,
        club_id: selectedClub?.[0]?.club_id,
        employment_status: "accepted",
      },
      { skip: lessonSkipPlayer }
    );

  const { data: selectedTrainerDetails, isLoading: isSelectedTrainerLoading } =
    useGetTrainerByUserIdQuery(selectedTrainer, { skip: lessonSkipPlayer });

  const {
    data: lessonPlayerSubscription,
    isLoading: isLessonPlayerSubscription,
  } = useGetClubSubscriptionsByFilterQuery(
    {
      player_id: selectedPlayer,
      club_id: selectedClub?.[0]?.user_id,
      is_active: true,
    },
    { skip: lessonSkipTrainer }
  );

  const { data: lessonTrainerStaff, isLoading: isLessonTrainerStaff } =
    useGetClubStaffByFilterQuery(
      {
        user_id: user?.user_id,
        club_id: selectedClub?.[0]?.club_id,
        employment_status: "accepted",
      },
      { skip: lessonSkipTrainer }
    );

  const {
    data: lessonSelectedTrainer,
    isLoading: isLessonSelectedTrainerLoading,
  } = useGetTrainerByUserIdQuery(user?.user_id, { skip: lessonSkipTrainer });

  const {
    data: lessonSelectedPlayer,
    isLoading: isLessonSelectedPlayerLoading,
  } = useGetPlayerByUserIdQuery(selectedPlayer, { skip: lessonSkipTrainer });

  if (selectedEventType === 3) {
    if (isUserPlayer) {
      // subscription & staff
      isPlayerSubscribed = playerSubscribed?.length > 0 ? true : false;

      isTrainerStaff = trainerStaff?.length > 0 ? true : false;

      // payment details

      if (
        lessonPlayerDetails?.[0]?.name_on_card &&
        lessonPlayerDetails?.[0]?.card_number &&
        lessonPlayerDetails?.[0]?.cvc &&
        lessonPlayerDetails?.[0]?.card_expiry
      ) {
        playerPaymentDetailsExist = true;
      }

      if (
        selectedTrainerDetails?.[0]?.iban &&
        selectedTrainerDetails?.[0]?.name_on_bank_account &&
        selectedTrainerDetails?.[0]?.bank_id
      ) {
        trainerPaymentDetailsExist = true;
      }
    } else if (isUserTrainer) {
      // subscription & staff
      isPlayerSubscribed = lessonPlayerSubscription?.length > 0 ? true : false;

      isTrainerStaff = lessonTrainerStaff?.length > 0 ? true : false;

      // payment details

      if (
        lessonSelectedTrainer?.[0]?.iban &&
        lessonSelectedTrainer?.[0]?.name_on_bank_account &&
        lessonSelectedTrainer?.[0]?.bank_id
      ) {
        trainerPaymentDetailsExist = true;
      }
      if (
        lessonSelectedPlayer?.[0]?.name_on_card &&
        lessonSelectedPlayer?.[0]?.card_number &&
        lessonSelectedPlayer?.[0]?.cvc &&
        lessonSelectedPlayer?.[0]?.card_expiry
      ) {
        playerPaymentDetailsExist = true;
      }
    }

    if (
      (playerPaymentDetailsExist === false ||
        trainerPaymentDetailsExist === false) &&
      (selectedPlayer || selectedTrainer)
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
      court_id: Number(courtBookingDetails?.court_id),
      inviter_id: user?.user_id,
      invitee_id: Number(formData?.invitee_id),
      lesson_price: null,
      court_price:
        (Number(formData?.event_type_id) === 1 ||
          Number(formData?.event_type_id) === 2) &&
        selectedClub?.[0]?.higher_price_for_non_subscribers &&
        courts.find(
          (court) => court.court_id === Number(courtBookingDetails?.court_id)
        )?.price_hour_non_subscriber &&
        (!inviterPlayerSubscribed || !inviteePlayerSubscribed)
          ? courts.find(
              (court) =>
                court.court_id === Number(courtBookingDetails?.court_id)
            )?.price_hour_non_subscriber
          : Number(formData?.event_type_id) === 3 &&
            selectedClub?.[0]?.higher_price_for_non_subscribers &&
            courts.find(
              (court) =>
                court.court_id === Number(courtBookingDetails?.court_id)
            )?.price_hour_non_subscriber &&
            (!isPlayerSubscribed || !isTrainerStaff)
          ? courts.find(
              (court) =>
                court.court_id === Number(courtBookingDetails?.court_id)
            )?.price_hour_non_subscriber
          : courts.find(
              (court) =>
                court.court_id === Number(courtBookingDetails?.court_id)
            )?.price_hour,
      payment_id: null,
      invitation_note: formData?.invitation_note
        ? formData?.invitation_note
        : "",
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
      toast.success("Davet gönderildi");
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess, refetchBookings, navigate]);

  useEffect(() => {
    if (
      (selectedEventType === 1 || selectedEventType === 2) &&
      selectedPlayer
    ) {
      setTrainingMatchSkip(false);
    }
    if (selectedEventType === 3 && isUserPlayer && selectedTrainer) {
      setLessonSkipPlayer(false);
    }
    if (selectedEventType === 3 && isUserTrainer && selectedPlayer) {
      setLessonSkipTrainer(false);
    }
  }, [selectedEventType, selectedPlayer, selectedTrainer]);

  if (
    isBookingsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isEventTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Kort Kiralama</h1>
        <Link to={paths.EXPLORE}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <div className={styles["court-container"]}>
        <img
          src={
            courts?.find(
              (court) => court.court_id === courtBookingDetails?.court_id
            )?.image
              ? courts?.find(
                  (court) => court.court_id === courtBookingDetails?.court_id
                )?.image
              : clubs?.find(
                  (club) => club.club_id === courtBookingDetails?.club_id
                )?.image
              ? clubs?.find(
                  (club) => club.club_id === courtBookingDetails?.club_id
                )?.image
              : "/images/icons/avatar.png"
          }
          className={styles["court-image"]}
        />
        <p className={styles["court-name"]}>{`Kort: ${
          courts?.find(
            (court) => court.court_id === courtBookingDetails?.court_id
          )?.court_name
        } - Kulüp: ${
          clubs?.find((club) => club.club_id === courtBookingDetails?.club_id)
            ?.club_name
        }`}</p>
      </div>
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
                  ?.filter(
                    (type) =>
                      type.event_type_id === 1 ||
                      type.event_type_id === 2 ||
                      type.event_type_id === 3
                  )
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
        {isUserPlayer && selectedEventType === 1 && (
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        )}
        {isUserPlayer && selectedEventType === 2 && (
          <div className={styles["input-container"]}>
            <label>Oyuncu Seçimi</label>
            <select
              {...register("invitee_id", { required: true })}
              onChange={handleSelectedPlayer}
            >
              <option value="">-- Seçim yapın --</option>
              {players
                ?.filter(
                  (player) =>
                    player.user_id !== user?.user_id &&
                    player.gender === userGender
                )
                .map((player) => (
                  <option key={player.user_id} value={player.user_id}>
                    {`${player.fname} ${player.lname} - ${player.gender}`}
                  </option>
                ))}
            </select>
            {errors.invitee_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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

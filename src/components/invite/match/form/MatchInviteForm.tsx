import React, { useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import InviteModal from "../../modals/invite-modal/InviteModal";

import { useState } from "react";

import {
  useGetClubByClubIdQuery,
  useGetClubsQuery,
} from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import { useAppSelector } from "../../../../store/hooks";

import { FormValues } from "../../modals/invite-modal/InviteModal";

import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
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

const MatchInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlayer = location.state;

  const user = useAppSelector((store) => store?.user?.user);

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

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

  // payment method check
  let isButtonDisabled = false;
  let buttonText = "";

  const { data: inviterPlayer, isLoading: isInviterPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  let inviterPlayerPaymentMethodExists = false;

  const { data: inviteePlayer, isLoading: isInviteePlayerLoading } =
    useGetPlayerByUserIdQuery(selectedPlayer?.user_id);

  let inviteePlayerPaymentMethodExists = false;

  if (
    inviterPlayer?.[0]?.name_on_card &&
    inviterPlayer?.[0]?.card_number &&
    inviterPlayer?.[0]?.cvc &&
    inviterPlayer?.[0]?.card_expiry
  ) {
    inviterPlayerPaymentMethodExists = true;
  }
  if (
    inviteePlayer?.[0]?.name_on_card &&
    inviteePlayer?.[0]?.card_number &&
    inviteePlayer?.[0]?.cvc &&
    inviteePlayer?.[0]?.card_expiry
  ) {
    inviteePlayerPaymentMethodExists = true;
  }

  if (!inviterPlayerPaymentMethodExists || !inviteePlayerPaymentMethodExists) {
    isButtonDisabled = true;
    buttonText =
      "Her iki oyuncunun da ödeme bilgilerini eklemesi gerekmektedir";
  }

  // subscription check
  let isPlayersSubscribed = false;
  let clubSubscriptionRequired = false;

  const [skip, setSkip] = useState(true);
  const { data: selectedClubDetails, isLoading: isSelectedClubDetailsLoading } =
    useGetClubByClubIdQuery(selectedClub, { skip: skip });

  const { data: inviterSubscribed, isLoading: isInviterSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery(
      {
        club_id: clubs?.find((club) => club.club_id === selectedClub)?.user_id,
        is_active: true,
        player_id: user?.user?.user_id,
      },
      { skip: skip }
    );

  const { data: inviteeSubscribed, isLoading: isInviteeSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery(
      {
        club_id: clubs?.find((club) => club.club_id === selectedClub)?.user_id,
        is_active: true,
        player_id: selectedPlayer?.user_id,
      },
      { skip: skip }
    );

  if (selectedClubDetails?.[0]?.is_player_subscription_required) {
    clubSubscriptionRequired = true;
  }

  if (inviterSubscribed?.length > 0 && inviteeSubscribed?.length > 0) {
    isPlayersSubscribed = true;
  }

  if (clubSubscriptionRequired && !isPlayersSubscribed) {
    isButtonDisabled = true;
    buttonText =
      "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir";
  }

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
      event_type_id: 2,
      club_id: formData.club_id,
      court_id: formData.court_id,
      inviter_id: user?.user.user_id,
      invitee_id: selectedPlayer?.user_id,
      lesson_price: null,
      court_price:
        clubs?.find(
          (club) =>
            club.club_id ===
            courts?.find((court) => court.court_id === selectedCourt)?.club_id
        )?.higher_price_for_non_subscribers &&
        courts.find((court) => court.court_id === selectedCourt)
          ?.price_hour_non_subscriber &&
        !isPlayersSubscribed
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

  const handleModalSubmit = () => {
    setModal(false);

    if (inviterPlayerPaymentMethodExists && inviteePlayerPaymentMethodExists) {
      const paymentDetails = {
        payment_amount: bookingFormData?.court_price,
        court_price: bookingFormData?.court_price,
        payment_status: "pending",
        payment_type_id: 2,
        sender_inviter_id: user?.user.user_id,
        sender_invitee_id: selectedPlayer?.user_id,
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
    if (selectedClubDetails) {
      if (selectedClubDetails?.[0]?.is_player_subscription_required) {
        clubSubscriptionRequired = true;
      }

      if (inviterSubscribed?.length > 0 && inviteeSubscribed?.length > 0) {
        isPlayersSubscribed = true;
      }

      if (clubSubscriptionRequired && !isPlayersSubscribed) {
        isButtonDisabled = true;
        buttonText =
          "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir";
      }
    }
  }, [selectedClubDetails]);

  useEffect(() => {
    if (inviteePlayer && inviterPlayer) {
      if (
        !inviterPlayerPaymentMethodExists ||
        !inviteePlayerPaymentMethodExists
      ) {
        isButtonDisabled = true;
        buttonText =
          "Her iki oyuncunun da ödeme bilgilerini eklemesi gerekmektedir";
      }
    }
  }, [inviterPlayer, inviteePlayer]);

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
  }, [isBookingSuccess, refetchBookings, navigate]);

  if (
    isBookingsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isInviteePlayerLoading ||
    isInviterPlayerLoading ||
    isSelectedClubDetailsLoading ||
    isInviterSubscribedLoading ||
    isInviteeSubscribedLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Maç Davet</h1>
        <Link to={paths.MATCH}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <div className={styles["opponent-container"]}>
        <img
          src={
            selectedPlayer?.image
              ? selectedPlayer?.image
              : "/images/icons/avatar.png"
          }
          className={styles["opponent-image"]}
        />
        <p
          className={styles["player-name"]}
        >{`${selectedPlayer.fname} ${selectedPlayer.lname}`}</p>
      </div>
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
                <option key={club.club_id} value={club.club_id}>
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
      {modal && (
        <InviteModal
          modal={modal}
          handleModalSubmit={handleModalSubmit}
          formData={bookingFormData}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MatchInviteForm;

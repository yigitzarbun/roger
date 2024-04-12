import React, { useState, useEffect, ChangeEvent } from "react";
import ReactModal from "react-modal";
import { localUrl } from "../../../../common/constants/apiConstants";

import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";
import { IoListOutline } from "react-icons/io5";

import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineMessage } from "react-icons/md";

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
  useGetPaginatedPlayersQuery,
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
import PageLoading from "../../../loading/PageLoading";
import CourtBookingConfirmation from "../confirmation/CourtBookingConfirmation";

interface CourtBookingFormModalProps {
  isCourtBookingModalOpen: boolean;
  closeCourtBookingInviteModal: () => void;
  event_date: string;
  event_time: string;
  selectedCourt: any;
}
const CourtBookingFormModal = (props: CourtBookingFormModalProps) => {
  const {
    isCourtBookingModalOpen,
    closeCourtBookingInviteModal,
    event_date,
    event_time,
    selectedCourt,
  } = props;

  const navigate = useNavigate();

  const user = useAppSelector((store) => store?.user?.user?.user);

  const isUserPlayer = user?.user_type_id === 1;
  const isUserTrainer = user?.user_type_id === 2;

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useGetPlayerByUserIdQuery(user?.user_id);

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const { isLoading: isBookingsLoading, refetch: refetchBookings } =
    useGetBookingsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [playerSkip, setPlayerSkip] = useState(true);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchedPlayer(event.target.value);
  };

  const {
    data: suggestedPlayers,
    isLoading: isSuggestedPlayersLoading,
    refetch: refetchSuggestedPlayers,
  } = useGetPaginatedPlayersQuery(
    {
      currentPage: 1,
      playerLevelId: null,
      selectedGender: "",
      locationId: null,
      currentUserId: user?.user_id,
      textSearch: searchedPlayer,
    },
    { skip: playerSkip }
  );

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
  const handleSelectedPlayer = (id: number) => {
    setSelectedPlayer(id);
  };

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const handleSelectedTrainer = (event) => {
    setSelectedTrainer(Number(event.target.value));
  };

  const userGender = currentUser?.[0]?.gender;

  let playerSubscriptionRequired =
    selectedCourt?.[0]?.is_player_subscription_required;

  let playerLessonSubscriptionRequired =
    selectedCourt?.[0]?.is_player_lesson_subscription_required;

  let trainerStaffRequired =
    selectedCourt?.[0]?.is_trainer_subscription_required;

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

  // TRAINING AND MATCH
  // player  subscription control
  const {
    data: isInviterPlayerSubscribed,
    isLoading: isInviterPlayerSubscribedLoading,
  } = useGetClubSubscriptionsByFilterQuery(
    {
      player_id: user?.user_id,
      club_id: selectedCourt?.[0]?.clubUserId,
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
      club_id: selectedCourt?.[0]?.clubUserId,
      is_active: true,
    },
    { skip: trainingMatchSkip }
  );

  // invitee and inviter player
  const { data: inviterPlayer, isLoading: isInviterPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user_id, { skip: trainingMatchSkip });

  const { data: inviteePlayer, isLoading: isInviteePlayerLoading } =
    useGetPlayerByUserIdQuery(selectedPlayer, { skip: trainingMatchSkip });

  //player subscription and payment details control
  if (selectedEventType === 1 || selectedEventType === 2) {
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

  // LESSON
  const { data: lessonPlayerDetails, isLoading: isLessonPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id, { skip: lessonSkipPlayer });

  const { data: playerSubscribed, isLoading: isPlayerSubscribedLoading } =
    useGetClubSubscriptionsByFilterQuery(
      {
        player_id: user?.user_id,
        club_id: selectedCourt?.[0]?.clubUserId,
        is_active: true,
      },
      { skip: lessonSkipPlayer }
    );

  const { data: trainerStaff, isLoading: isTrainerStaffLoading } =
    useGetClubStaffByFilterQuery(
      {
        user_id: selectedTrainer,
        club_id: selectedCourt?.[0]?.clubUserId,
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
      club_id: selectedCourt?.[0]?.clubUserId,
      is_active: true,
    },
    { skip: lessonSkipTrainer }
  );

  const { data: lessonTrainerStaff, isLoading: isLessonTrainerStaff } =
    useGetClubStaffByFilterQuery(
      {
        user_id: user?.user_id,
        club_id: selectedCourt?.[0]?.clubUserId,
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

  const [confirmation, setConfirmation] = useState(false);
  const handleCloseConfirmation = () => {
    setConfirmation(false);
  };
  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const eventDate = new Date(event_date);
    const eventTime = event_time;
    const hours = Math.floor(Number(event_time) / 100);
    const minutes = Number(event_time) % 100;

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
      event_time: `${String(eventTime).slice(0, 2)}:${String(eventTime).slice(
        2
      )}`,
      booking_status_type_id: 1,
      event_type_id: Number(formData?.event_type_id),
      club_id: Number(selectedCourt?.[0]?.club_id),
      court_id: Number(selectedCourt?.[0]?.court_id),
      inviter_id: user?.user_id,
      invitee_id: Number(selectedPlayer),
      lesson_price: null,
      court_price:
        (Number(formData?.event_type_id) === 1 ||
          Number(formData?.event_type_id) === 2) &&
        selectedCourt?.[0]?.higher_price_for_non_subscribers &&
        selectedCourt?.[0]?.price_hour_non_subscriber &&
        (!inviterPlayerSubscribed || !inviteePlayerSubscribed)
          ? selectedCourt?.[0]?.price_hour_non_subscriber
          : Number(formData?.event_type_id) === 3 &&
            selectedCourt?.[0]?.higher_price_for_non_subscribers &&
            selectedCourt?.[0]?.price_hour_non_subscriber &&
            (!isPlayerSubscribed || !isTrainerStaff)
          ? selectedCourt?.[0]?.price_hour_non_subscriber
          : selectedCourt?.[0]?.price_hour,
      payment_id: null,
      invitation_note: formData?.invitation_note
        ? formData?.invitation_note
        : "",
    };
    setBookingFormData(bookingData);
    setConfirmation(true);
  };

  const handleModalSubmit = () => {
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
      recipient_club_id: selectedCourt?.[0]?.clubUserId,
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
    setConfirmation(false);
    closeCourtBookingInviteModal();
  };

  const [searchOption, setSearchOption] = useState("list");
  const toggleSearchOption = (option: string) => {
    setSearchOption(option);
  };

  const [inviteMessageArea, setInviteMessageArea] = useState(false);
  const toggleInviteMessageArea = () => {
    setInviteMessageArea((curr) => !curr);
  };

  useEffect(() => {
    if (searchedPlayer !== "") {
      setPlayerSkip(false);
    }
    if (searchedPlayer === "") {
      setPlayerSkip(true);
    }
  }, [searchedPlayer]);

  useEffect(() => {
    if (playerSkip === false) refetchSuggestedPlayers();
  }, [setPlayerSkip]);
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
    isPlayersLoading ||
    isTrainersLoading ||
    isEventTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isCourtBookingModalOpen}
      onRequestClose={closeCourtBookingInviteModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeCourtBookingInviteModal}
      />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1 className={styles["invite-title"]}>Kort Rezervasyon</h1>
        </div>

        <div className={styles["table-container"]}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Kort</th>
                <th>Kulüp</th>
                <th>Tarih</th>
                <th>Saat</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.row}>
                <td>
                  <img
                    src={
                      selectedCourt?.[0]?.courtImage
                        ? `${localUrl}/${selectedCourt?.[0]?.courtImage}`
                        : "/images/icons/avatar.jpg"
                    }
                    className={styles["court-image"]}
                  />
                </td>
                <td>{selectedCourt?.[0]?.court_name}</td>
                <td>{selectedCourt?.[0]?.club_name}</td>
                <td>{event_date}</td>
                <td>{`${event_time.slice(0, 2)}:${event_time.slice(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {confirmation === false ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["input-outer-container"]}>
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
                          <option
                            key={type.event_type_id}
                            value={type.event_type_id}
                          >
                            {type.event_type_name}
                          </option>
                        ))}
                    {isUserTrainer &&
                      eventTypes
                        ?.filter((type) => type.event_type_name === "lesson")
                        .map((type) => (
                          <option
                            key={type.event_type_id}
                            value={type.event_type_id}
                          >
                            {type.event_type_name}
                          </option>
                        ))}
                  </select>
                  {errors.event_type_id && (
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
              }
              {isUserPlayer && selectedEventType === 1 && (
                <div className={styles["input-container"]}>
                  <div className={styles["search-option-container"]}>
                    <label>Oyuncu Seçimi</label>
                    <div className={styles.options}>
                      <IoListOutline
                        className={
                          searchOption === "list"
                            ? styles["active-option"]
                            : styles["inactive-option"]
                        }
                        onClick={() => toggleSearchOption("list")}
                      />
                      <IoIosSearch
                        className={
                          searchOption === "textSearch"
                            ? styles["active-option"]
                            : styles["inactive-option"]
                        }
                        onClick={() => toggleSearchOption("textSearch")}
                      />
                    </div>
                  </div>
                  {searchOption === "list" ? (
                    <select
                      {...register("invitee_id", { required: true })}
                      onChange={(e) =>
                        handleSelectedPlayer(Number(e.target.value))
                      }
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
                  ) : (
                    <input
                      onChange={handleTextSearch}
                      placeholder="Oyuncu adı ile arama"
                    />
                  )}
                  {searchOption === "textSearch" &&
                  searchedPlayer !== "" &&
                  suggestedPlayers?.players?.length > 0 ? (
                    <div className={styles["suggested-list"]}>
                      {suggestedPlayers?.players?.map((player) => (
                        <div key={player.user_id} className={styles.suggestion}>
                          <p>{`${player.fname} ${player.lname}`}</p>
                          <button
                            onClick={() =>
                              handleSelectedPlayer(Number(player.user_id))
                            }
                          >
                            Seç
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    searchOption === "textSearch" &&
                    searchedPlayer !== "" &&
                    suggestedPlayers?.players?.length === 0 && (
                      <p>Oyuncu bulunamadı</p>
                    )
                  )}
                </div>
              )}
              {isUserPlayer && selectedEventType === 2 && (
                <div className={styles["input-container"]}>
                  <label>Oyuncu Seçimi</label>
                  <select
                    {...register("invitee_id", { required: true })}
                    onChange={(e) =>
                      handleSelectedPlayer(Number(e.target.value))
                    }
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
                        ? (e) => handleSelectedPlayer(Number(e.target.value))
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
                    <span className={styles["error-field"]}>
                      Bu alan zorunludur.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles["text-area-container"]}>
              <label>Not</label>
              <textarea
                {...register("invitation_note")}
                placeholder="Karşı tarafa davetinizle ilgili eklemek istediğiniz not"
              />
            </div>

            <div className={styles["buttons-container"]}>
              <button
                onClick={closeCourtBookingInviteModal}
                className={styles["discard-button"]}
              >
                İptal et
              </button>

              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={isButtonDisabled}
              >
                {(selectedPlayer || selectedTrainer) && isButtonDisabled
                  ? buttonText
                  : "Davet Gönder"}
              </button>
            </div>
          </form>
        ) : (
          <CourtBookingConfirmation
            handleCloseConfirmation={handleCloseConfirmation}
            handleModalSubmit={handleModalSubmit}
            eventType={
              bookingFormData?.event_type_id === 1
                ? "Antreman"
                : bookingFormData?.event_type_id === 2
                ? "Maç"
                : bookingFormData?.event_type_id === 3
                ? "Ders"
                : ""
            }
            selectedCourtPrice={bookingFormData?.court_price}
            invitee={
              selectedEventType === 1 || selectedEventType === 2
                ? inviteePlayer
                : selectedEventType === 3 && isUserTrainer
                ? lessonSelectedPlayer
                : selectedEventType === 3 && isUserPlayer
                ? selectedTrainerDetails
                : ""
            }
            isUserPlayer={isUserPlayer}
            isUserTrainer={isUserTrainer}
          />
        )}
      </div>
    </ReactModal>
  );
};

export default CourtBookingFormModal;

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { CgTennis } from "react-icons/cg";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { localUrl } from "../../../../common/constants/apiConstants";

import { useAppSelector } from "../../../../store/hooks";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetMatchScoresQuery } from "../../../../api/endpoints/MatchScoresApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";
import ExplorePlayerEventsModal from "./modals/events/ExplorePlayerEventsModal";
import ExplorePlayerReviewsModal from "./modals/reviews/ExplorePlayerReviewsModal";

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: matchScores, isLoading: isMatchScoresLoading } =
    useGetMatchScoresQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: groups, isLoading: isGroupsLoading } = useGetStudentGroupsQuery(
    {}
  );

  const selectedPlayer = players?.find(
    (player) => player.user_id === Number(user_id)
  );

  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const playerGroups = groups?.filter(
    (group) =>
      group.is_active === true &&
      (group.first_student_id === selectedPlayer?.user_id ||
        group.second_student_id === selectedPlayer?.user_id ||
        group.third_student_id === selectedPlayer?.user_id ||
        group.fourth_student_id === selectedPlayer?.user_id)
  );

  const playerBookings = bookings?.filter(
    (booking) =>
      booking.booking_status_type_id === 5 &&
      (booking.inviter_id === selectedPlayer?.user_id ||
        booking.invitee_id === selectedPlayer?.user_id ||
        booking.invitee_id ===
          playerGroups?.find((group) => group.user_id === booking.invitee_id)
            ?.user_id)
  );

  const playerReviewsReceived = eventReviews?.filter(
    (review) =>
      review.booking_id ===
        playerBookings?.find(
          (booking) => booking.booking_id === review.booking_id
        )?.booking_id && review.reviewer_id !== selectedPlayer?.user_id
  );

  const userGender = players?.find(
    (player) => player.user_id === user?.user?.user_id
  )?.gender;

  const selectedPlayerSubscriptions = clubSubscriptions?.filter(
    (subscription) =>
      subscription.player_id === selectedPlayer?.user_id &&
      subscription.is_active === true
  );

  const selectedPlayerSubscriptionClubNames = [];

  if (selectedPlayerSubscriptions?.length > 0) {
    selectedPlayerSubscriptions.forEach((subscription) => {
      const clubName = clubs?.find(
        (club) => club.user_id === subscription.club_id
      )?.club_name;
      selectedPlayerSubscriptionClubNames.push(clubName);
    });
  }

  const playerFavouriters = favourites?.filter(
    (favourite) =>
      favourite.favouritee_id === Number(user_id) &&
      favourite.is_active === true
  )?.length;

  const myFavouritePlayers = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );

  const isPlayerInMyFavourites = (user_id: number) => {
    if (
      myFavouritePlayers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouritePlayers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === true
      )
    ) {
      return true;
    }
    return false;
  };

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const handleUpdateFavourite = (userId: number) => {
    const selectedFavourite = myFavouritePlayers?.find(
      (favourite) => favourite.favouritee_id === userId
    );
    const favouriteData = {
      favourite_id: selectedFavourite.favourite_id,
      registered_at: selectedFavourite.registered_at,
      is_active: selectedFavourite.is_active === true ? false : true,
      favouriter_id: selectedFavourite.favouriter_id,
      favouritee_id: selectedFavourite.favouritee_id,
    };
    updateFavourite(favouriteData);
  };

  const handleToggleFavourite = (userId: number) => {
    if (isPlayerInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const profileImage = selectedPlayer?.image;

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const openReviewsModal = () => {
    setIsReviewsModalOpen(true);
  };
  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };

  const [isEventsModalOpen, setIsEventModalOpen] = useState(false);
  const openEventsModal = () => {
    setIsEventModalOpen(true);
  };
  const closeEventsModal = () => {
    setIsEventModalOpen(false);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (
    isLocationsLoading ||
    isLocationsLoading ||
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isFavouritesLoading ||
    isClubSubscriptionsLoading ||
    isClubsLoading ||
    isEventReviewsLoading ||
    isBookingsLoading ||
    isTrainersLoading ||
    isMatchScoresLoading ||
    isEventTypesLoading ||
    isUsersLoading ||
    isGroupsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h2>Oyuncu</h2>
          <div className={styles["profile-data-container"]}>
            <img
              src={
                profileImage
                  ? `${localUrl}/${profileImage}`
                  : "/images/icons/avatar.png"
              }
              alt="player picture"
              className={styles["profile-image"]}
            />
            <div className={styles["secondary-profile-data-container"]}>
              <h2>{`${selectedPlayer?.fname} ${selectedPlayer?.lname}`}</h2>

              <div className={styles["profile-info"]}>
                <FaGenderless className={styles.icon} />
                <p className={styles["info-text"]}>{selectedPlayer?.gender}</p>
              </div>
              <div className={styles["profile-info"]}>
                <FaCalendarDays className={styles.icon} />
                <p className={styles["info-text"]}>
                  {selectedPlayer?.birth_year}
                </p>
              </div>
              <div className={styles["profile-info"]}>
                <CgTennis className={styles.icon} />
                <p className={styles["info-text"]}>
                  {
                    playerLevels?.find(
                      (level) =>
                        level.player_level_id ===
                        selectedPlayer?.player_level_id
                    )?.player_level_name
                  }
                </p>
              </div>
              <div className={styles["profile-info"]}>
                <FaLocationDot className={styles.icon} />
                <p className={styles["info-text"]}>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id === selectedPlayer?.location_id
                    )?.location_name
                  }
                </p>
              </div>
              <div className={styles["profile-info"]}>
                <FaUserFriends className={styles.icon} />
                <p className={styles["info-text"]}>
                  {selectedPlayerSubscriptions?.length > 0
                    ? selectedPlayerSubscriptionClubNames?.map((clubName) => (
                        <span key={clubName}>{clubName}</span>
                      ))
                    : "Oyuncunun kulüp üyeliği bulunmamaktadır."}
                </p>
              </div>
              <p>{selectedPlayer?.player_bio_description}</p>
            </div>
          </div>
        </div>
        <div className={styles["interaction-section"]}>
          <h2>Etkileşim</h2>
          <p>{`${playerFavouriters} kişi favorilere ekledi`}</p>
          <div className={styles["buttons-container"]}>
            <button
              onClick={() => handleToggleFavourite(selectedPlayer?.user_id)}
              className={styles["interaction-button"]}
            >
              {isPlayerInMyFavourites(selectedPlayer?.user_id) === true
                ? "Favorilerden çıkar"
                : "Favorilere ekle"}
            </button>
            {isUserPlayer && (
              <Link
                to={paths.TRAIN_INVITE}
                state={{
                  fname: selectedPlayer.fname,
                  lname: selectedPlayer.lname,
                  image: selectedPlayer.image,
                  court_price: "",
                  user_id: selectedPlayer.user_id,
                }}
              >
                <button className={styles["interaction-button"]}>
                  Antreman yap
                </button>
              </Link>
            )}
            {isUserPlayer && selectedPlayer?.gender === userGender && (
              <Link
                to={paths.MATCH_INVITE}
                state={{
                  fname: selectedPlayer.fname,
                  lname: selectedPlayer.lname,
                  image: selectedPlayer.image,
                  court_price: "",
                  user_id: selectedPlayer.user_id,
                }}
              >
                <button className={styles["interaction-button"]}>
                  Maç yap
                </button>
              </Link>
            )}
            {isUserTrainer && (
              <Link
                to={paths.LESSON_INVITE}
                state={{
                  fname: selectedPlayer.fname,
                  lname: selectedPlayer.lname,
                  image: selectedPlayer.image,
                  court_price: "",
                  user_id: selectedPlayer.user_id,
                }}
              >
                <button className={styles["interaction-button"]}>
                  Derse davet et
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles["middle-sections-container"]}>
        <div className={styles["reviews-section"]}>
          <h2>Değerlendirmeler</h2>
          <div className={styles["reviews-container"]}>
            {playerReviewsReceived?.length > 0 ? (
              playerReviewsReceived
                ?.slice(playerReviewsReceived.length - 2)
                ?.map((review) => (
                  <div
                    className={styles["review-container"]}
                    key={review.event_review_id}
                  >
                    <h4>{review.event_review_title}</h4>
                    <p>{review.event_review_description}</p>
                    <p>{`${review.review_score}/10`}</p>
                    {bookings?.find(
                      (booking) =>
                        booking.booking_id === review.booking_id &&
                        (booking.event_type_id === 1 ||
                          booking.event_type_id === 2 ||
                          booking.event_type_id === 3)
                    ) && (
                      <div className={styles["reviewer-container"]}>
                        <img
                          src={
                            users?.find(
                              (user) => user.user_id === review.reviewer_id
                            )?.user_type_id === 1 &&
                            players?.find(
                              (player) => player.user_id === review.reviewer_id
                            )?.image
                              ? `${localUrl}/${
                                  players.find(
                                    (player) =>
                                      player.user_id === review.reviewer_id
                                  )?.image
                                }`
                              : users?.find(
                                  (user) => user.user_id === review.reviewer_id
                                )?.user_type_id === 2 &&
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id === review.reviewer_id
                                )?.image
                              ? `${localUrl}/${
                                  trainers.find(
                                    (trainer) =>
                                      trainer.user_id === review.reviewer_id
                                  )?.image
                                }`
                              : "/images/icons/avatar.png"
                          }
                          className={styles["reviewer-image"]}
                        />
                        <Link
                          to={
                            users?.find(
                              (user) => user.user_id === review.reviewer_id
                            )?.user_type_id === 1
                              ? `${paths.EXPLORE_PROFILE}1/${review.reviewer_id} `
                              : users?.find(
                                  (user) => user.user_id === review.reviewer_id
                                )?.user_type_id === 2
                              ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                              : ""
                          }
                          className={styles["reviewer-name"]}
                        >
                          {users?.find(
                            (user) => user.user_id === review.reviewer_id
                          )?.user_type_id === 1
                            ? `${
                                players?.find(
                                  (player) =>
                                    player.user_id === review.reviewer_id
                                )?.fname
                              } ${
                                players.find(
                                  (player) =>
                                    player.user_id === review.reviewer_id
                                )?.lname
                              }`
                            : users?.find(
                                (user) => user.user_id === review.reviewer_id
                              )?.user_type_id === 2
                            ? `${
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id === review.reviewer_id
                                )?.fname
                              } ${
                                trainers.find(
                                  (trainer) =>
                                    trainer.user_id === review.reviewer_id
                                )?.lname
                              }`
                            : ""}
                        </Link>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p>Henüz oyuncu hakkında değerlendirme yapılmamıştır.</p>
            )}
          </div>
          <button onClick={openReviewsModal}>Tümünü Görüntüle</button>
        </div>
      </div>
      <div className={styles["bottom-sections-container"]}>
        <div className={styles["events-section"]}>
          <h2>Geçmiş Etkinlikler</h2>
          {playerBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Oyuncu</th>
                  <th>Eğitmen</th>
                  <th>Tür</th>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Skor</th>
                  <th>Kazanan</th>
                </tr>
              </thead>
              <tbody>
                {playerBookings
                  ?.slice(playerBookings.length - 4)
                  ?.map((booking) => (
                    <tr key={booking.booking_id}>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}${
                            booking.event_type_id === 1
                              ? 1
                              : booking.event_type_id === 2
                              ? 1
                              : booking.event_type_id === 3
                              ? 2
                              : booking.event_type_id === 6
                              ? 3
                              : ""
                          }/${
                            users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 6
                              ? playerGroups?.find(
                                  (group) =>
                                    group.user_id === booking.invitee_id
                                )?.club_id
                              : booking.inviter_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.invitee_id
                                )?.user_id
                              : booking.invitee_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.inviter_id
                                )?.user_id
                              : ""
                          }`}
                        >
                          <img
                            src={
                              (booking.event_type_id === 1 ||
                                booking.event_type_id === 2) &&
                              booking.inviter_id === selectedPlayer?.user_id &&
                              players?.find(
                                (player) =>
                                  player.user_id === booking.invitee_id
                              )?.image
                                ? `${localUrl}/${
                                    players?.find(
                                      (player) =>
                                        player.user_id === booking.invitee_id
                                    )?.image
                                  }`
                                : (booking.event_type_id === 1 ||
                                    booking.event_type_id === 2) &&
                                  booking.invitee_id ===
                                    selectedPlayer?.user_id &&
                                  players?.find(
                                    (player) =>
                                      player.user_id === booking.inviter_id
                                  )?.image
                                ? `${localUrl}/${
                                    players?.find(
                                      (player) =>
                                        player.user_id === booking.inviter_id
                                    )?.image
                                  }`
                                : booking.event_type_id === 3 &&
                                  booking.inviter_id ===
                                    selectedPlayer?.user_id &&
                                  trainers?.find(
                                    (trainer) =>
                                      trainer.user_id === booking.invitee_id
                                  )?.image
                                ? `${localUrl}/${
                                    trainers?.find(
                                      (trainer) =>
                                        trainer.user_id === booking.invitee_id
                                    )?.image
                                  }`
                                : booking.event_type_id === 3 &&
                                  booking.invitee_id ===
                                    selectedPlayer?.user_id &&
                                  trainers?.find(
                                    (trainer) =>
                                      trainer.user_id === booking.inviter_id
                                  )?.image
                                ? `${localUrl}/${
                                    trainers?.find(
                                      (trainer) =>
                                        trainer.user_id === booking.inviter_id
                                    )?.image
                                  }`
                                : booking.event_type_id === 6 &&
                                  clubs?.find(
                                    (club) =>
                                      club.user_id ===
                                      playerGroups?.find(
                                        (group) =>
                                          group.user_id === booking.invitee_id
                                      )?.club_id
                                  )?.image
                                ? `${localUrl}/${
                                    clubs?.find(
                                      (club) =>
                                        club.user_id ===
                                        playerGroups?.find(
                                          (group) =>
                                            group.user_id === booking.invitee_id
                                        )?.club_id
                                    )?.image
                                  }`
                                : "/images/icons/avatar.png"
                            }
                            className={styles["event-image"]}
                          />
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}${
                            booking.event_type_id === 1
                              ? 1
                              : booking.event_type_id === 2
                              ? 1
                              : booking.event_type_id === 3
                              ? 2
                              : booking.event_type_id === 6
                              ? 3
                              : ""
                          }/${
                            users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 6
                              ? playerGroups?.find(
                                  (group) =>
                                    group.user_id === booking.invitee_id
                                )?.club_id
                              : booking.inviter_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.invitee_id
                                )?.user_id
                              : booking.invitee_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.inviter_id
                                )?.user_id
                              : ""
                          }`}
                          className={styles["opponent-name"]}
                        >
                          {(booking.event_type_id === 1 ||
                            booking.event_type_id === 2) &&
                          booking.inviter_id === selectedPlayer?.user_id
                            ? `${
                                players?.find(
                                  (player) =>
                                    player.user_id === booking.invitee_id
                                )?.fname
                              } ${
                                players?.find(
                                  (player) =>
                                    player.user_id === booking.invitee_id
                                )?.lname
                              }`
                            : (booking.event_type_id === 1 ||
                                booking.event_type_id === 2) &&
                              booking.invitee_id === selectedPlayer?.user_id
                            ? `${
                                players?.find(
                                  (player) =>
                                    player.user_id === booking.inviter_id
                                )?.fname
                              } ${
                                players?.find(
                                  (player) =>
                                    player.user_id === booking.inviter_id
                                )?.lname
                              }`
                            : booking.event_type_id === 6
                            ? playerGroups?.find(
                                (group) => group.user_id === booking.invitee_id
                              )?.student_group_name
                            : "-"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}${
                            booking.event_type_id === 1
                              ? 1
                              : booking.event_type_id === 2
                              ? 1
                              : booking.event_type_id === 3
                              ? 2
                              : booking.event_type_id === 6
                              ? 2
                              : ""
                          }/${
                            users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 6
                              ? playerGroups?.find(
                                  (group) =>
                                    group.user_id === booking.invitee_id
                                )?.trainer_id
                              : booking.inviter_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.invitee_id
                                )?.user_id
                              : booking.invitee_id === selectedPlayer?.user_id
                              ? users?.find(
                                  (user) => user.user_id === booking.inviter_id
                                )?.user_id
                              : ""
                          }`}
                          className={styles["opponent-name"]}
                        >
                          {booking.event_type_id === 3 &&
                          booking.inviter_id === selectedPlayer?.user_id
                            ? `${
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id === booking.invitee_id
                                )?.fname
                              }
                      ${
                        trainers?.find(
                          (trainer) => trainer.user_id === booking.invitee_id
                        )?.lname
                      }
                      `
                            : booking.event_type_id === 3 &&
                              booking.invitee_id === selectedPlayer?.user_id
                            ? `${
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id === booking.inviter_id
                                )?.fname
                              }
                      ${
                        trainers?.find(
                          (trainer) => trainer.user_id === booking.inviter_id
                        )?.lname
                      }
                      `
                            : booking.event_type_id === 6
                            ? `${
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id ===
                                    playerGroups?.find(
                                      (group) =>
                                        group.user_id === booking.invitee_id
                                    )?.trainer_id
                                )?.fname
                              } ${
                                trainers?.find(
                                  (trainer) =>
                                    trainer.user_id ===
                                    playerGroups?.find(
                                      (group) =>
                                        group.user_id === booking.invitee_id
                                    )?.trainer_id
                                )?.lname
                              }`
                            : "-"}
                        </Link>
                      </td>
                      <td>
                        {
                          eventTypes?.find(
                            (type) =>
                              type.event_type_id === booking.event_type_id
                          )?.event_type_name
                        }
                      </td>
                      <td>
                        {new Date(booking.event_date).toLocaleDateString()}
                      </td>
                      <td>{booking.event_time.slice(0, 5)}</td>

                      <td>
                        {booking.event_type_id === 2 &&
                        matchScores?.find(
                          (score) =>
                            score.booking_id === booking.booking_id &&
                            score.match_score_status_type_id === 3
                        )
                          ? `${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.inviter_first_set_games_won
                            }/${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.invitee_first_set_games_won
                            } ${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.inviter_second_set_games_won
                            }/${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.invitee_second_set_games_won
                            } ${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.inviter_third_set_games_won
                                ? matchScores?.find(
                                    (score) =>
                                      score.booking_id === booking.booking_id
                                  )?.inviter_third_set_games_won + "/"
                                : ""
                            }${
                              matchScores?.find(
                                (score) =>
                                  score.booking_id === booking.booking_id
                              )?.invitee_third_set_games_won
                                ? matchScores?.find(
                                    (score) =>
                                      score.booking_id === booking.booking_id
                                  )?.invitee_third_set_games_won
                                : ""
                            }`
                          : "-"}
                      </td>
                      <td>
                        {booking.event_type_id === 2 &&
                        matchScores?.find(
                          (score) =>
                            score.booking_id === booking.booking_id &&
                            score.match_score_status_type_id === 3
                        )
                          ? `${
                              players?.find(
                                (player) =>
                                  player.user_id ===
                                  matchScores?.find(
                                    (score) =>
                                      score.booking_id === booking.booking_id &&
                                      score.match_score_status_type_id === 3
                                  )?.winner_id
                              )?.fname
                            } ${
                              players?.find(
                                (player) =>
                                  player.user_id ===
                                  matchScores?.find(
                                    (score) =>
                                      score.booking_id === booking.booking_id &&
                                      score.match_score_status_type_id === 3
                                  )?.winner_id
                              )?.lname
                            }`
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz tamamlanan etkinlik bulunmamaktadır.</p>
          )}
          <button onClick={openEventsModal}>Tümünü Görüntüle</button>
        </div>
      </div>
      <ExplorePlayerEventsModal
        isEventsModalOpen={isEventsModalOpen}
        closeEventsModal={closeEventsModal}
        playerBookings={playerBookings}
        playerGroups={playerGroups}
        selectedPlayer={selectedPlayer}
        players={players}
        trainers={trainers}
        clubs={clubs}
      />
      <ExplorePlayerReviewsModal
        isReviewsModalOpen={isReviewsModalOpen}
        closeReviewsModal={closeReviewsModal}
        playerReviewsReceived={playerReviewsReceived}
        bookings={bookings}
        players={players}
        trainers={trainers}
      />
    </div>
  );
};
export default ExplorePlayerProfile;

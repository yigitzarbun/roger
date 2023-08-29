import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

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

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});
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

  const playerBookings = bookings?.filter(
    (booking) =>
      booking.booking_status_type_id === 5 &&
      (booking.inviter_id === selectedPlayer.user_id ||
        booking.invitee_id === selectedPlayer.user_id)
  );

  const playerReviewsReceived = eventReviews?.filter(
    (review) =>
      review.booking_id ===
        playerBookings.find(
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
    isBookingsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Oyuncu</h3>
          <img
            src={
              selectedPlayer?.picture
                ? selectedPlayer?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{`${selectedPlayer?.fname} ${selectedPlayer.lname}`}</h2>
          <p>{selectedPlayer?.player_bio_description}</p>
          <p>{selectedPlayer?.gender}</p>
          <p>{selectedPlayer?.birth_year}</p>
          <p>
            {
              playerLevels?.find(
                (level) =>
                  level.player_level_id === selectedPlayer?.player_level_id
              )?.player_level_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) =>
                  location.location_id === selectedPlayer?.location_id
              )?.location_name
            }
          </p>
          <p>
            {selectedPlayerSubscriptions?.length > 0
              ? selectedPlayerSubscriptionClubNames?.map((clubName) => (
                  <span key={clubName}>{clubName}</span>
                ))
              : "Oyuncunun kulüp üyeliği bulunmamaktadır."}
          </p>
        </div>
        <div className={styles["subscription-section"]}>
          <h3>Etkileşim</h3>
          <p>{`${playerFavouriters} kişi favorilere ekledi`}</p>
          <button
            onClick={() => handleToggleFavourite(selectedPlayer?.user_id)}
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
              className={styles["accept-button"]}
            >
              <button> Antreman yap</button>
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
              className={styles["accept-button"]}
            >
              <button> Maç yap</button>
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
              <button>Derse davet et</button>
            </Link>
          )}
        </div>
      </div>
      <div className={styles["middle-sections-container"]}>
        <div className={styles["reviews-section"]}>
          <h3>Oyuncu Hakkında Değerlendirmeler</h3>
          {playerReviewsReceived?.map((review) => (
            <div className={styles["review-container"]}>
              <h4>{review.event_review_title}</h4>
              <p>{review.event_review_description}</p>
              <p>{`${review.review_score}/10`}</p>
              <Link to={`${paths.EXPLORE_PROFILE}1/${review.reviewer_id}`}>{`${
                players.find((player) => player.user_id === review.reviewer_id)
                  ?.fname
              } ${
                players.find((player) => player.user_id === review.reviewer_id)
                  ?.lname
              }`}</Link>
            </div>
          ))}
        </div>
      </div>
      <div className={styles["bottom-sections-container"]}>
        <div className={styles["events-sections"]}>
          <h3>Oyuncu Geçmiş Etkinlikler</h3>
          {playerBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Tür</th>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Oyuncu</th>
                  <th>Eğitmen</th>
                  <th>Skor</th>
                </tr>
              </thead>
            </table>
          ) : (
            <p>Henüz tamamlanan etkinlik bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ExplorePlayerProfile;

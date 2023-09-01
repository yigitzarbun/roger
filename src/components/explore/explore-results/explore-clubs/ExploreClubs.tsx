import React, { useEffect, useState } from "react";

import { AiOutlineEye, AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { ClubType } from "../../../../api/endpoints/ClubTypesApi";
import { Court } from "../../../../api/endpoints/CourtsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import {
  useGetClubStaffQuery,
  useAddClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";

interface ExploreClubsProps {
  user: User;
  clubs: Club[];
  locations: Location[];
  clubTypes: ClubType[];
  courts: Court[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isClubTypesLoading: boolean;
  isCourtsLoading: boolean;
}
const ExploreClubs = (props: ExploreClubsProps) => {
  const {
    user,
    clubs,
    locations,
    clubTypes,
    courts,
    isClubsLoading,
    isLocationsLoading,
    isClubTypesLoading,
    isCourtsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
  }
  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackageLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const [addClubStaff, { isSuccess: isAddClubStaffSuccess }] =
    useAddClubStaffMutation({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  let playerPaymentDetailsExist = false;

  if (isUserPlayer) {
    const currentPlayer = players?.find(
      (player) => player.user_id === user?.user?.user_id
    );
    if (
      currentPlayer?.name_on_card &&
      currentPlayer?.card_number &&
      currentPlayer?.cvc &&
      currentPlayer?.card_expiry
    ) {
      playerPaymentDetailsExist = true;
    }
  }
  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch: clubStaffRefetch,
  } = useGetClubStaffQuery({});

  // add club staff

  const handleAddClubStaff = (club_id: number) => {
    if (isUserTrainer) {
      const clubStaffData = {
        fname: user?.trainerDetails?.fname,
        lname: user?.trainerDetails?.lname,
        birth_year: user?.trainerDetails?.birth_year,
        gender: user?.trainerDetails?.gender,
        employment_status: "pending",
        gross_salary_month: null,
        iban: null,
        bank_id: null,
        phone_number: null,
        image: null,
        club_id: club_id,
        club_staff_role_type_id: 2,
        user_id: user?.user?.user_id,
      };
      addClubStaff(clubStaffData);
    }
  };

  // favourites
  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch: favouritesRefetch,
  } = useGetFavouritesQuery({});

  const myFavouriteClubs = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );

  const isClubInMyFavourites = (user_id: number) => {
    if (
      myFavouriteClubs.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouriteClubs.find(
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
    const selectedFavourite = myFavouriteClubs?.find(
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
    if (isClubInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  // subscription
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const [selectedClubId, setSelectedClubId] = useState(null);

  const handleOpenSubscribeModal = (value: number) => {
    setOpenSubscribeModal(true);
    setSelectedClubId(value);
  };
  const handleCloseSubscribeModal = () => {
    setOpenSubscribeModal(false);
    setSelectedClubId(null);
  };

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const isUserSubscribedToClub = (club_id: number) => {
    const activeSubscription = clubSubscriptions?.find(
      (subscription) =>
        subscription.club_id === club_id &&
        subscription.player_id === user?.user?.user_id &&
        subscription.is_active === true
    );
    return activeSubscription ? true : false;
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      favouritesRefetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    if (isAddClubStaffSuccess) {
      clubStaffRefetch();
    }
  }, [isAddClubStaffSuccess]);
  if (
    isClubsLoading ||
    isLocationsLoading ||
    isClubTypesLoading ||
    isCourtsLoading ||
    isFavouritesLoading ||
    isClubSubscriptionsLoading ||
    isClubSubscriptionPackageLoading ||
    isClubStaffLoading ||
    isPlayersLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kulüpleri Keşfet</h2>
      </div>
      {clubs && clubs.length === 0 && (
        <p>
          Aradığınız kritere göre kulüp bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {clubs && clubs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Kulüp</th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort Adet</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.club_id} className={styles["club-row"]}>
                <td className={styles["vertical-center"]}>
                  <img
                    src={club.image ? club.image : "/images/icons/avatar.png"}
                    alt={"club-iamge"}
                    className={styles["club-image"]}
                  />
                </td>
                <td>{`${club.club_name}`}</td>
                <td>
                  {
                    clubTypes?.find(
                      (type) => type.club_type_id === club.club_type_id
                    )?.club_type_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === club.location_id
                    ).location_name
                  }
                </td>
                <td>
                  {
                    courts?.filter((court) => court.club_id === club.club_id)
                      ?.length
                  }
                </td>
                {
                  <td onClick={() => handleToggleFavourite(club.user_id)}>
                    {isClubInMyFavourites(club.user_id) === true ? (
                      <AiFillStar className={styles["remove-fav-icon"]} />
                    ) : (
                      <AiOutlineStar className={styles["add-fav-icon"]} />
                    )}
                  </td>
                }
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}
                    className={styles["view-icon"]}
                  >
                    <AiOutlineEye />
                  </Link>
                </td>
                {isUserPlayer && (
                  <td>
                    {clubSubscriptionPackages?.find(
                      (subscriptionPackage) =>
                        subscriptionPackage.club_id === club.user_id
                    ) && isUserSubscribedToClub(club.user_id) === true ? (
                      <p className={styles["subscribed-text"]}>Üyelik Var</p>
                    ) : clubSubscriptionPackages?.find(
                        (subscriptionPackage) =>
                          subscriptionPackage.club_id === club.user_id
                      ) ? (
                      playerPaymentDetailsExist ? (
                        <button
                          onClick={() => handleOpenSubscribeModal(club.user_id)}
                          disabled={!playerPaymentDetailsExist}
                          className={styles["subscribe-button"]}
                        >
                          Üye Ol
                        </button>
                      ) : (
                        <p className={styles["add-payment-details-text"]}>
                          Üye olmak için ödeme bilgilerini ekle
                        </p>
                      )
                    ) : (
                      <p className={styles["no-subscription-text"]}>
                        Kulübün üyelik paketi bulunmamaktadır
                      </p>
                    )}
                  </td>
                )}
                {isUserTrainer &&
                clubStaff?.find(
                  (staff) =>
                    staff.club_id === club.club_id &&
                    staff.user_id === user?.user?.user_id &&
                    staff.employment_status === "accepted"
                )
                  ? "Bu kulüpte çalışıyorsun"
                  : isUserTrainer &&
                    clubStaff?.find(
                      (staff) =>
                        staff.club_id === club.club_id &&
                        staff.user_id === user?.user?.user_id &&
                        staff.employment_status === "pending"
                    )
                  ? "Başvurun henüz yanıtlanmadı"
                  : isUserTrainer && (
                      <button onClick={() => handleAddClubStaff(club.club_id)}>
                        Bu kulüpte çalıştığına dair kulübe başvur
                      </button>
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <SubscribeToClubModal
        openSubscribeModal={openSubscribeModal}
        handleCloseSubscribeModal={handleCloseSubscribeModal}
        selectedClubId={selectedClubId}
      />
    </div>
  );
};

export default ExploreClubs;

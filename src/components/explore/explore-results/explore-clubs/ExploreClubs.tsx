import React, { useEffect, useState } from "react";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Club, PaginatedClubs } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { ClubType } from "../../../../api/endpoints/ClubTypesApi";
import { Court } from "../../../../api/endpoints/CourtsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import {
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { ClubStaff } from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";

import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";
import ClubEmploymentModal from "./employment-modal/ClubEmploymentModal";

interface ExploreClubsProps {
  user: User;
  clubs: PaginatedClubs;
  locations: Location[];
  clubTypes: ClubType[];
  courts: Court[];
  clubStaff: ClubStaff[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isClubTypesLoading: boolean;
  isCourtsLoading: boolean;
  isClubStaffLoading: boolean;
  page: number;
  setClubsPage: (page: number) => void;
}
const ExploreClubs = (props: ExploreClubsProps) => {
  const {
    user,
    clubs,
    locations,
    clubTypes,
    courts,
    clubStaff,
    isClubsLoading,
    isLocationsLoading,
    isClubTypesLoading,
    isCourtsLoading,
    isClubStaffLoading,
    page,
    setClubsPage,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
  }

  const pageNumbers = [];
  for (let i = 1; i <= clubs?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleClubPage = (e) => {
    setClubsPage(e.target.value);
  };

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  // player payment details
  let playerPaymentDetailsExist = false;

  if (isUserPlayer) {
    if (
      currentPlayer?.[0]?.name_on_card &&
      currentPlayer?.[0]?.card_number &&
      currentPlayer?.[0]?.cvc &&
      currentPlayer?.[0]?.card_expiry
    ) {
      playerPaymentDetailsExist = true;
    }
  }

  // add club staff
  const [trainerEmploymentClubId, setTrainerEmploymentClubId] = useState(null);
  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);

  const openEmploymentModal = (club_id: number) => {
    setTrainerEmploymentClubId(club_id);
    setEmploymentModalOpen(true);
  };

  const closeEmploymentModal = () => {
    setEmploymentModalOpen(false);
  };

  // favourites
  const { refetch: refetchFavourites } = useGetFavouritesQuery({});

  const {
    data: myFavouriteClubs,
    isLoading: isMyFavouriteClubsLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({ favouriter_id: user?.user?.user_id });

  const isClubInMyFavourites = (user_id: number) => {
    return myFavouriteClubs?.find(
      (favourite) => favourite.favouritee_id === user_id
    );
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

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackageLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const {
    data: mySubscriptions,
    isLoading: isMySubscriptionsLoading,
    refetch: refetchMySubscriptions,
  } = useGetClubSubscriptionsByFilterQuery({
    is_active: true,
    player_id: user?.user?.user_id,
  });

  const isUserSubscribedToClub = (club_id: number) => {
    const activeSubscription = mySubscriptions?.find(
      (subscription) =>
        subscription.club_id === club_id &&
        subscription.player_id === user?.user?.user_id &&
        subscription.is_active === true
    );
    return activeSubscription ? true : false;
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
      refetchFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchMyFavourites();
    refetchMySubscriptions();
  }, []);

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isClubTypesLoading ||
    isCourtsLoading ||
    isClubSubscriptionsLoading ||
    isClubSubscriptionPackageLoading ||
    isClubStaffLoading ||
    isMyFavouriteClubsLoading ||
    isCurrentPlayerLoading ||
    isMySubscriptionsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kulüpleri Keşfet</h2>
      </div>
      {clubs?.clubs && clubs?.clubs.length === 0 && (
        <p>
          Aradığınız kritere göre kulüp bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {clubs?.clubs && clubs?.clubs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Eğitmen</th>
              <th>Üye</th>
            </tr>
          </thead>
          <tbody>
            {clubs?.clubs.map((club) => (
              <tr key={club.club_id} className={styles["club-row"]}>
                <td onClick={() => handleToggleFavourite(club.user_id)}>
                  {isClubInMyFavourites(club.user_id)?.is_active === true ? (
                    <AiFillStar className={styles["remove-fav-icon"]} />
                  ) : (
                    <AiOutlineStar className={styles["add-fav-icon"]} />
                  )}
                </td>

                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}>
                    <img
                      src={club.image ? club.image : "/images/icons/avatar.png"}
                      alt={"club-iamge"}
                      className={styles["club-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}
                    className={styles["club-name"]}
                  >
                    {`${club.club_name}`}
                  </Link>
                </td>
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
                <td>
                  {
                    clubStaff?.filter(
                      (staff) =>
                        staff.employment_status === "accepted" &&
                        staff.club_id === club.club_id
                    ).length
                  }
                </td>
                <td>
                  {
                    clubSubscriptions.filter(
                      (subscription) =>
                        subscription.is_active === true &&
                        subscription.club_id === club.club_id
                    )?.length
                  }
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
                <td>
                  {isUserTrainer &&
                  clubStaff?.find(
                    (staff) =>
                      staff.club_id === club.club_id &&
                      staff.user_id === user?.user?.user_id &&
                      staff.employment_status === "accepted"
                  ) ? (
                    <p className={styles["employed-text"]}>
                      Bu kulüpte çalışıyorsun
                    </p>
                  ) : isUserTrainer &&
                    clubStaff?.find(
                      (staff) =>
                        staff.club_id === club.club_id &&
                        staff.user_id === user?.user?.user_id &&
                        staff.employment_status === "pending"
                    ) ? (
                    <p className={styles["employment-pending-text"]}>
                      Başvurun henüz yanıtlanmadı
                    </p>
                  ) : (
                    isUserTrainer && (
                      <button
                        onClick={() => openEmploymentModal(club.club_id)}
                        className={styles["subscribe-button"]}
                      >
                        Bu kulüpte çalıştığına dair kulübe başvur
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button key={pageNumber} value={pageNumber} onClick={handleClubPage}>
            {pageNumber}
          </button>
        ))}
      </div>
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClubId}
        />
      )}
      {employmentModalOpen && (
        <ClubEmploymentModal
          employmentModalOpen={employmentModalOpen}
          closeEmploymentModal={closeEmploymentModal}
          trainerEmploymentClubId={trainerEmploymentClubId}
        />
      )}
    </div>
  );
};

export default ExploreClubs;

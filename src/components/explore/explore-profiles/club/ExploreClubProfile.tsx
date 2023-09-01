import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import {
  useGetClubStaffQuery,
  useAddClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

import { useAppSelector } from "../../../../store/hooks";

import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";

interface ExploreClubProfileProps {
  user_id: string;
}
const ExploreClubProfile = (props: ExploreClubProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch: clubStaffRefetch,
  } = useGetClubStaffQuery({});

  const [addClubStaff, { isSuccess: isAddClubStaffSuccess }] =
    useAddClubStaffMutation({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

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

  const selectedClub = clubs?.find((club) => club.user_id === Number(user_id));

  // club trainers
  const clubStaffTrainers = clubStaff?.filter(
    (staff) =>
      staff.club_id === Number(user_id) &&
      staff.employment_status === "accepted" &&
      staff.club_staff_role_type_id === 2
  );

  let confirmedClubTrainers = [];
  clubStaffTrainers?.forEach((clubTrainer) => {
    const trainerDetails = trainers?.find(
      (trainer) => trainer.user_id === clubTrainer.user_id
    );
    if (trainerDetails) {
      confirmedClubTrainers.push(trainerDetails);
    }
  });

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

  const clubFavouriters = favourites?.filter(
    (favourite) =>
      favourite.favouritee_id === Number(user_id) &&
      favourite.is_active === true
  )?.length;

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

  // subscriptions
  const selectedClubSubscriptionPackages = clubSubscriptionPackages?.filter(
    (subscriptionPackage) =>
      subscriptionPackage.club_id === selectedClub?.user_id
  );

  const selectedClubSubscribers = clubSubscriptions?.filter(
    (subscription) => subscription.club_id === selectedClub?.user_id
  ).length;

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

  const isUserSubscribedToClub = () => {
    const activeSubscription = clubSubscriptions?.find(
      (subscription) =>
        subscription.club_id === selectedClub?.user_id &&
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
    isCourtsLoading ||
    isClubTypesLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading ||
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isFavouritesLoading ||
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionPackagesLoading ||
    isClubSubscriptionsLoading ||
    isClubStaffLoading ||
    isPlayersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Kulüp</h3>
          <img
            src={
              selectedClub?.picture
                ? selectedClub?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{selectedClub?.club_name}</h2>
          <p>{selectedClub?.club_bio_description}</p>
          <p>
            {
              clubTypes?.find(
                (type) => type.club_type_id === selectedClub?.club_type_id
              )?.club_type_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) => location.location_id === selectedClub?.location_id
              )?.location_name
            }
          </p>
          <address>{selectedClub?.club_address}</address>
          <p>{`Antreman ve Maç kuralı: ${
            selectedClub?.is_player_subscription_required
              ? "Oyuncuların kort kiralamak için kulübe üye olmaları gerekir"
              : "Oyuncuların kort kiralamak için kulübe üye olmalarına gerek yoktur"
          } `}</p>
          <p>{`Ders kuralı: ${
            selectedClub?.is_player_lesson_subscription_required &&
            selectedClub?.is_trainer_subscription_required
              ? "Kort kiralamak için eğitmenin kulüp çalışanı, oyuncunun kulüp üyesi olması gerekir"
              : selectedClub?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.is_trainer_subscription_required === true
              ? "Kort kiralamak için eğitmenin kulüp çalışanı olması yeterlidir"
              : selectedClub?.is_player_lesson_subscription_required === true &&
                selectedClub?.is_trainer_subscription_required === false
              ? "Kort kiralamak için oyuncunun kulüp üyesi olması yeterlidir"
              : selectedClub?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.is_trainer_subscription_required === false
              ? "Kort kiralamak için oyuncunun üye olmasına veya eğitmenin kulüp çalışanı olmasına gerek yoktur"
              : ""
          } `}</p>
        </div>
        <div className={styles["courts-section"]}>
          <h3>Kortlar</h3>
          {courts?.filter((court) => court.club_id === selectedClub?.club_id)
            .length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Kort</th>
                  <th>Yüzey</th>
                  <th>Mekan</th>
                  <th>Fiyat (TL / Saat)</th>
                </tr>
              </thead>
              <tbody>
                {courts
                  ?.filter((court) => court.club_id === selectedClub?.club_id)
                  .map((court) => (
                    <tr key={court.court_id}>
                      <td>{court.court_name}</td>
                      <td>
                        {
                          courtSurfaceTypes?.find(
                            (type) =>
                              type.court_surface_type_id ===
                              court.court_surface_type_id
                          )?.court_surface_type_name
                        }
                      </td>
                      <td>
                        {
                          courtStructureTypes?.find(
                            (type) =>
                              type.court_structure_type_id ===
                              court.court_structure_type_id
                          )?.court_structure_type_name
                        }
                      </td>
                      <td>{court.price_hour}</td>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                        >
                          Görüntüle
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe ait kort bulunmamaktadır</p>
          )}
        </div>
      </div>
      <div className={styles["mid-sections-container"]}>
        <div className={styles["favourites-section"]}>
          <h3>Favoriler</h3>
          <p>{`${clubFavouriters} kişi favorilere ekledi`}</p>
          <button onClick={() => handleToggleFavourite(selectedClub?.user_id)}>
            {isClubInMyFavourites(selectedClub?.user_id) === true
              ? "Favorilerden çıkar"
              : "Favorilere ekle"}
          </button>
        </div>
        <div className={styles["trainers-section"]}>
          <div className={styles["trainers-section-title-container"]}>
            <h3>Eğitmenler</h3>
            {isUserTrainer &&
            clubStaff?.find(
              (staff) =>
                staff.club_id === selectedClub.club_id &&
                staff.user_id === user?.user?.user_id &&
                staff.employment_status === "accepted"
            )
              ? "Bu kulüpte çalışıyorsun"
              : isUserTrainer &&
                clubStaff?.find(
                  (staff) =>
                    staff.club_id === selectedClub.club_id &&
                    staff.user_id === user?.user?.user_id &&
                    staff.employment_status === "pending"
                )
              ? "Başvurun henüz yanıtlanmadı"
              : isUserTrainer && (
                  <button
                    onClick={() => handleAddClubStaff(selectedClub.club_id)}
                  >
                    Bu kulüpte çalıştığına dair kulübe başvur
                  </button>
                )}
          </div>
          {confirmedClubTrainers?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Soyisim</th>
                  <th>Cinsiyet</th>
                  <th>Tecrübe</th>
                  <th>Fiyat (TL / Saat)</th>
                </tr>
              </thead>
              <tbody>
                {confirmedClubTrainers?.map((trainer) => (
                  <tr key={trainer.user_id}>
                    <td>{trainer.fname}</td>
                    <td>{trainer.lname}</td>
                    <td>{trainer.gender}</td>
                    <td>
                      {
                        trainerExperienceTypes?.find(
                          (type) =>
                            type.trainer_experience_type_id ===
                            trainer.trainer_experience_type_id
                        )?.trainer_experience_type_name
                      }
                    </td>
                    <td>{trainer.price_hour}</td>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}
                      >
                        Görüntüle
                      </Link>
                    </td>
                    {isUserPlayer && (
                      <td>
                        <Link
                          to={paths.LESSON_INVITE}
                          state={{
                            fname: trainer.fname,
                            lname: trainer.lname,
                            image: trainer.image,
                            court_price: "",
                            user_id: trainer.user_id,
                          }}
                        >
                          Derse davet et
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe bağlı çalışan eğitmen bulunmamaktadır</p>
          )}
        </div>
      </div>
      <div className={styles["bottom-sections-container"]}>
        <div className={styles["subscribers-section"]}>
          <h3>Üyeler</h3>
          <p>{`${selectedClubSubscribers} kişi abone oldu`}</p>
        </div>
        <div className={styles["subscriptions-section"]}>
          <h3>Üyelikler</h3>
          {selectedClubSubscriptionPackages?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Abonelik Türü</th>
                  <th>Abonelik Süresi</th>
                  <th>Fiyat (TL)</th>
                </tr>
              </thead>
              <tbody>
                {selectedClubSubscriptionPackages?.map((clubPackage) => (
                  <tr key={clubPackage.club_subscription_package_id}>
                    <td>
                      {
                        clubSubscriptionTypes?.find(
                          (type) =>
                            type.club_subscription_type_id ===
                            clubPackage.club_subscription_type_id
                        )?.club_subscription_type_name
                      }
                    </td>
                    <td>
                      {
                        clubSubscriptionTypes?.find(
                          (type) =>
                            type.club_subscription_type_id ===
                            clubPackage.club_subscription_type_id
                        )?.club_subscription_duration_months
                      }
                    </td>
                    <td>{clubPackage.price}</td>
                    {isUserPlayer && (
                      <td>
                        {isUserSubscribedToClub() === true ? (
                          ""
                        ) : (
                          <button
                            onClick={() =>
                              handleOpenSubscribeModal(selectedClub?.user_id)
                            }
                            disabled={!playerPaymentDetailsExist}
                          >
                            {playerPaymentDetailsExist
                              ? "Üye Ol"
                              : "Üye olmak için ödeme bilgilerini ekle"}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe ait abonelik paketi bulunmamaktadır</p>
          )}
        </div>
      </div>
      <SubscribeToClubModal
        openSubscribeModal={openSubscribeModal}
        handleCloseSubscribeModal={handleCloseSubscribeModal}
        selectedClubId={selectedClubId}
      />
    </div>
  );
};
export default ExploreClubProfile;

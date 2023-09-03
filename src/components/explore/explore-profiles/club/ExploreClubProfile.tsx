import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { AiOutlineEye } from "react-icons/ai";

import { FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";

import paths from "../../../../routing/Paths";

import { localUrl } from "../../../../common/constants/apiConstants";

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
import ExploreClubCourtsModal from "./modals/courts/ExploreClubCourtsModal";
import ExploreClubTrainerModal from "./modals/trainers/ExploreClubTrainersModal";
import ExploreClubSubscribersModal from "./modals/subscribers/ExploreClubSubscribersModal";
import ExploreClubSubscriptionsModal from "./modals/subscriptions/ExploreClubSubscriptionsModal";

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

  const profileImage = selectedClub?.image;

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
      subscriptionPackage.club_id === selectedClub?.user_id &&
      subscriptionPackage.is_active === true
  );

  const selectedClubSubscribers = clubSubscriptions?.filter(
    (subscription) =>
      subscription.club_id === selectedClub?.user_id &&
      subscription.is_active === true
  );

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const [selectedClubId, setSelectedClubId] = useState(null);

  const handleOpenSubscribeModal = (value: number) => {
    setOpenSubscribeModal(true);
    setIsSubscriptionsModalOpen(false);
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

  const [isCourtsModalOpen, setIsCourtsModalOpen] = useState(false);
  const openCourtsModal = () => {
    setIsCourtsModalOpen(true);
  };
  const closeCourtsModal = () => {
    setIsCourtsModalOpen(false);
  };

  const [isTrainersModalOpen, setIsTrainersModalOpen] = useState(false);
  const openTrainersModal = () => {
    setIsTrainersModalOpen(true);
  };
  const closeTrainersModal = () => {
    setIsTrainersModalOpen(false);
  };

  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);
  const openSubscribersModal = () => {
    setIsSubscribersModalOpen(true);
  };
  const closeSubscribersModal = () => {
    setIsSubscribersModalOpen(false);
  };

  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] =
    useState(false);
  const openSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(true);
  };
  const closeSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(false);
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
          <h2>Kulüp</h2>
          <div className={styles["profile-data-container"]}>
            <img
              src={
                profileImage
                  ? `${localUrl}/${profileImage}`
                  : "/images/icons/avatar.png"
              }
              alt="club picture"
              className={styles["profile-image"]}
            />
            <div className={styles["secondary-profile-data-container"]}>
              <h3>{selectedClub?.club_name}</h3>
              <div className={styles["profile-info"]}>
                <CgTennis className={styles.icon} />
                <p className={styles["info-text"]}>
                  {
                    clubTypes?.find(
                      (type) => type.club_type_id === selectedClub?.club_type_id
                    )?.club_type_name
                  }
                </p>
              </div>
              <div className={styles["profile-info"]}>
                <FaLocationDot className={styles.icon} />
                <p className={styles["info-text"]}>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id === selectedClub?.location_id
                    )?.location_name
                  }
                </p>
              </div>
              <div className={styles["profile-info"]}>
                <FaLocationDot className={styles.icon} />
                <address className={styles["info-text"]}>
                  {selectedClub?.club_address}
                </address>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["courts-section"]}>
          <h2>Kortlar</h2>
          {courts?.filter((court) => court.club_id === selectedClub?.club_id)
            .length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Kort</th>
                  <th>Yüzey</th>
                  <th>Mekan</th>
                  {selectedClub?.higher_price_for_non_subscribers && (
                    <th>Fiyat (Üye değil)</th>
                  )}
                  <th>Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {courts
                  ?.filter((court) => court.club_id === selectedClub?.club_id)
                  .slice(
                    courts?.filter(
                      (court) => court.club_id === selectedClub?.club_id
                    ).length - 3
                  )
                  .map((court) => (
                    <tr key={court.court_id}>
                      <td>
                        {
                          <img
                            src={
                              court.image
                                ? `${localUrl}/${court.image}`
                                : "/images/icons/avatar.png"
                            }
                            alt="court picture"
                            className={styles["court-image"]}
                          />
                        }
                      </td>
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
                      {selectedClub?.higher_price_for_non_subscribers &&
                      court.price_hour_non_subscriber ? (
                        <td>{court.price_hour_non_subscriber}</td>
                      ) : (
                        selectedClub?.higher_price_for_non_subscribers &&
                        court.price_hour_non_subscriber &&
                        "-"
                      )}

                      <td>{court.price_hour}</td>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                          className={styles["view-icon"]}
                        >
                          <AiOutlineEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe ait kort bulunmamaktadır</p>
          )}
          <button onClick={openCourtsModal}>Tümünü Görüntüle</button>
        </div>
      </div>
      <div className={styles["mid-top-sections-container"]}>
        <div className={styles["favourites-section"]}>
          <h2>Favoriler</h2>
          <p>{`${clubFavouriters} kişi favorilere ekledi`}</p>
          <button onClick={() => handleToggleFavourite(selectedClub?.user_id)}>
            {isClubInMyFavourites(selectedClub?.user_id) === true
              ? "Favorilerden çıkar"
              : "Favorilere ekle"}
          </button>
        </div>
        <div className={styles["trainers-section"]}>
          <div className={styles["trainers-section-title-container"]}>
            <h2>Eğitmenler</h2>
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
                  <th></th>
                  <th>İsim</th>
                  <th>Soyisim</th>
                  <th>Cinsiyet</th>
                  <th>Tecrübe</th>
                  <th>Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {confirmedClubTrainers
                  ?.slice(confirmedClubTrainers.length - 3)
                  ?.map((trainer) => (
                    <tr key={trainer.user_id}>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}
                        >
                          <img
                            src={
                              trainer.image
                                ? `${localUrl}/${trainer.image}`
                                : "/images/icons/avatar.png"
                            }
                            alt="trainer picture"
                            className={styles["trainer-image"]}
                          />
                        </Link>
                      </td>
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
                          className={styles["view-icon"]}
                        >
                          <AiOutlineEye />
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
                            className={styles["lesson-button"]}
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
          <button onClick={openTrainersModal}>Tümünü Görüntüle</button>
        </div>
      </div>
      <div className={styles["mid-bottom-sections-container"]}>
        <div className={styles["subscribers-section"]}>
          <h2>Üyeler</h2>
          <p>{`${selectedClubSubscribers?.length} kişi abone oldu`}</p>
          <button onClick={openSubscribersModal}>Tümünü Gör</button>
        </div>
        <div className={styles["subscriptions-section"]}>
          <h2>Üyelikler</h2>
          {selectedClubSubscriptionPackages?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Abonelik Türü</th>
                  <th>Abonelik Süresi</th>
                  <th>Fiyat (TL)</th>
                  <th>Üyelik</th>
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
                          <p className={styles["subscribed-text"]}>
                            Üyelik var
                          </p>
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
          <button onClick={openSubscriptionsModal}>Tümünü Görüntüle</button>
        </div>
      </div>
      <div className={styles["bottom-section-container"]}>
        <h2>Kurallar</h2>
        <div className={styles["rules-container"]}>
          <div className={styles["rule-container"]}>
            <h4>Antreman / Maç</h4>
            <p className={styles["rule-text"]}>{`${
              selectedClub?.is_player_subscription_required
                ? "Oyuncuların kort kiralamak için kulübe üye olmaları gerekir"
                : "Oyuncuların kort kiralamak için kulübe üye olmalarına gerek yoktur"
            } `}</p>
          </div>
          <div className={styles["rule-container"]}>
            <h4>Ders</h4>
            <p className={styles["rule-text"]}>{`${
              selectedClub?.is_player_lesson_subscription_required &&
              selectedClub?.is_trainer_subscription_required
                ? "Eğitmenin kulüp çalışanı, oyuncunun kulüp üyesi olması gerekir"
                : selectedClub?.is_player_lesson_subscription_required ===
                    false &&
                  selectedClub?.is_trainer_subscription_required === true
                ? "Eğitmenin kulüp çalışanı olması yeterlidir"
                : selectedClub?.is_player_lesson_subscription_required ===
                    true &&
                  selectedClub?.is_trainer_subscription_required === false
                ? "Oyuncunun kulüp üyesi olması yeterlidir"
                : selectedClub?.is_player_lesson_subscription_required ===
                    false &&
                  selectedClub?.is_trainer_subscription_required === false
                ? "Oyuncunun üye olmasına veya eğitmenin kulüp çalışanı olmasına gerek yoktur"
                : ""
            } `}</p>
          </div>
          <div className={styles["rule-container"]}>
            <h4>Ücret</h4>
            <p className={styles["rule-text"]}>
              {selectedClub?.higher_price_for_non_subscribers
                ? "Üyelere farklı fiyat uygulanır"
                : "Üyelere farklı fiyat uygulanmaz"}
            </p>
          </div>
        </div>
      </div>
      <SubscribeToClubModal
        openSubscribeModal={openSubscribeModal}
        handleCloseSubscribeModal={handleCloseSubscribeModal}
        selectedClubId={selectedClubId}
      />
      <ExploreClubCourtsModal
        isCourtsModalOpen={isCourtsModalOpen}
        closeCourtsModal={closeCourtsModal}
        selectedClub={selectedClub}
      />
      <ExploreClubTrainerModal
        isTrainersModalOpen={isTrainersModalOpen}
        closeTrainersModal={closeTrainersModal}
        selectedClub={selectedClub}
        confirmedClubTrainers={confirmedClubTrainers}
      />
      <ExploreClubSubscribersModal
        isSubscribersModalOpen={isSubscribersModalOpen}
        closeSubscribersModal={closeSubscribersModal}
        selectedClub={selectedClub}
        selectedClubSubscribers={selectedClubSubscribers}
      />
      <ExploreClubSubscriptionsModal
        isSubscriptionsModalOpen={isSubscriptionsModalOpen}
        closeSubscriptionsModal={closeSubscriptionsModal}
        selectedClub={selectedClub}
        selectedClubSubscriptionPackages={selectedClubSubscriptionPackages}
        playerPaymentDetailsExist={playerPaymentDetailsExist}
        handleOpenSubscribeModal={handleOpenSubscribeModal}
      />
    </div>
  );
};
export default ExploreClubProfile;

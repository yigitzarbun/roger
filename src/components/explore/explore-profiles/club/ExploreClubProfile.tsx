import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { AiOutlineEye } from "react-icons/ai";

import paths from "../../../../routing/Paths";

import { localUrl } from "../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import { useGetClubByUserIdQuery } from "../../../../api/endpoints/ClubsApi";

import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffByFilterQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";

import { useAppSelector } from "../../../../store/hooks";

import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";
import ExploreClubCourtsModal from "./modals/courts/ExploreClubCourtsModal";
import ExploreClubTrainerModal from "./modals/trainers/ExploreClubTrainersModal";
import ExploreClubSubscribersModal from "./modals/subscribers/ExploreClubSubscribersModal";
import ExploreClubSubscriptionsModal from "./modals/subscriptions/ExploreClubSubscriptionsModal";
import ClubEmploymentModal from "../../../../components/explore/explore-results/explore-clubs/employment-modal/ClubEmploymentModal";
import ExploreClubsProfileSection from "./sections/profile/ExploreClubsProfileSection";
import ExploreClubsCourtsSection from "./sections/courts/ExploreClubsCourtsSection";
import ExploreClubsFavouritesSection from "./sections/favourites/ExploreClubsFavouritesSection";

interface ExploreClubProfileProps {
  user_id: string;
}
const ExploreClubProfile = (props: ExploreClubProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByUserIdQuery(user_id);

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubStaffTrainers, isLoading: isClubStaffLoading } =
    useGetClubStaffByFilterQuery({
      club_id: selectedClub?.[0]?.club_id,
      employment_status: "accepted",
      club_staff_role_type_id: 2,
    });

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: selectedClubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    club_id: selectedClub?.[0]?.user_id,
    is_active: true,
  });

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: currentPlayer, isLoading: isPlayersLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

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

  let confirmedClubTrainers = [];
  clubStaffTrainers?.forEach((clubTrainer) => {
    const trainerDetails = trainers?.find(
      (trainer) => trainer.user_id === clubTrainer.user_id
    );
    if (trainerDetails) {
      confirmedClubTrainers.push(trainerDetails);
    }
  });

  // subscriptions

  const {
    data: selectedClubSubscribers,
    isLoading: isSelectedClubSubscriptionsLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    is_active: true,
    club_id: selectedClub?.[0]?.user_id,
  });

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

  const isUserSubscribedToClub = (club_subscription_package_id: number) => {
    return selectedClubSubscribers?.find(
      (subscription) =>
        subscription.player_id === user?.user?.user_id &&
        subscription.club_subscription_package_id ===
          club_subscription_package_id
    )
      ? true
      : false;
  };

  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);
  const [trainerEmploymentClubId, setTrainerEmploymentClubId] = useState(null);
  const openEmploymentModal = (club_id: number) => {
    setTrainerEmploymentClubId(club_id);
    setEmploymentModalOpen(true);
  };
  const closeEmploymentModal = () => {
    setEmploymentModalOpen(false);
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

  if (
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionPackagesLoading ||
    isSelectedClubSubscriptionsLoading ||
    isClubStaffLoading ||
    isPlayersLoading ||
    isSelectedClubLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExploreClubsProfileSection selectedClub={selectedClub} />
        <ExploreClubsCourtsSection
          selectedClub={selectedClub}
          openCourtsModal={openCourtsModal}
        />
      </div>
      <div className={styles["mid-top-sections-container"]}>
        <ExploreClubsFavouritesSection
          user_id={Number(user_id)}
          selectedClub={selectedClub}
        />
        <div className={styles["trainers-section"]}>
          <div className={styles["trainers-section-title-container"]}>
            <h2>Eğitmenler</h2>
            {isUserTrainer &&
            clubStaffTrainers?.find(
              (staff) =>
                staff.club_id === selectedClub?.[0]?.club_id &&
                staff.user_id === user?.user?.user_id &&
                staff.employment_status === "accepted"
            ) ? (
              <p className={styles["employed-text"]}>Bu kulüpte çalışıyorsun</p>
            ) : isUserTrainer &&
              clubStaffTrainers?.find(
                (staff) =>
                  staff.club_id === selectedClub?.[0]?.club_id &&
                  staff.user_id === user?.user?.user_id &&
                  staff.employment_status === "pending"
              ) ? (
              <p className={styles["employment-pending-text"]}>
                Başvurun henüz yanıtlanmadı
              </p>
            ) : (
              isUserTrainer && (
                <button
                  onClick={() =>
                    openEmploymentModal(selectedClub?.[0]?.club_id)
                  }
                >
                  Bu kulüpte çalıştığına dair kulübe başvur
                </button>
              )
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
                  ?.slice(confirmedClubTrainers.length - 2)
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
                {selectedClubSubscriptionPackages
                  ?.slice(selectedClubSubscriptionPackages?.length - 2)
                  ?.map((clubPackage) => (
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
                          {isUserSubscribedToClub(
                            clubPackage.club_subscription_package_id
                          ) === true ? (
                            <p className={styles["subscribed-text"]}>
                              Üyelik var
                            </p>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpenSubscribeModal(
                                  selectedClub?.[0]?.user_id
                                )
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
              selectedClub?.[0]?.is_player_subscription_required
                ? "Oyuncuların kort kiralamak için kulübe üye olmaları gerekir"
                : "Oyuncuların kort kiralamak için kulübe üye olmalarına gerek yoktur"
            } `}</p>
          </div>
          <div className={styles["rule-container"]}>
            <h4>Ders</h4>
            <p className={styles["rule-text"]}>{`${
              selectedClub?.[0]?.is_player_lesson_subscription_required &&
              selectedClub?.[0]?.is_trainer_subscription_required
                ? "Eğitmenin kulüp çalışanı, oyuncunun kulüp üyesi olması gerekir"
                : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                    false &&
                  selectedClub?.[0]?.is_trainer_subscription_required === true
                ? "Eğitmenin kulüp çalışanı olması yeterlidir"
                : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                    true &&
                  selectedClub?.[0]?.is_trainer_subscription_required === false
                ? "Oyuncunun kulüp üyesi olması yeterlidir"
                : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                    false &&
                  selectedClub?.[0]?.is_trainer_subscription_required === false
                ? "Oyuncunun üye olmasına veya eğitmenin kulüp çalışanı olmasına gerek yoktur"
                : ""
            } `}</p>
          </div>
          <div className={styles["rule-container"]}>
            <h4>Ücret</h4>
            <p className={styles["rule-text"]}>
              {selectedClub?.[0]?.higher_price_for_non_subscribers
                ? "Üyelere farklı fiyat uygulanır"
                : "Üyelere farklı fiyat uygulanmaz"}
            </p>
          </div>
        </div>
      </div>
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClubId}
        />
      )}
      {isCourtsModalOpen && (
        <ExploreClubCourtsModal
          isCourtsModalOpen={isCourtsModalOpen}
          closeCourtsModal={closeCourtsModal}
          selectedClub={selectedClub}
        />
      )}
      {isTrainersModalOpen && (
        <ExploreClubTrainerModal
          isTrainersModalOpen={isTrainersModalOpen}
          closeTrainersModal={closeTrainersModal}
          confirmedClubTrainers={confirmedClubTrainers}
        />
      )}
      {isSubscribersModalOpen && (
        <ExploreClubSubscribersModal
          isSubscribersModalOpen={isSubscribersModalOpen}
          closeSubscribersModal={closeSubscribersModal}
          selectedClub={selectedClub}
          selectedClubSubscribers={selectedClubSubscribers}
        />
      )}
      {isSubscriptionsModalOpen && (
        <ExploreClubSubscriptionsModal
          isSubscriptionsModalOpen={isSubscriptionsModalOpen}
          closeSubscriptionsModal={closeSubscriptionsModal}
          selectedClub={selectedClub}
          selectedClubSubscriptionPackages={selectedClubSubscriptionPackages}
          playerPaymentDetailsExist={playerPaymentDetailsExist}
          handleOpenSubscribeModal={handleOpenSubscribeModal}
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
export default ExploreClubProfile;

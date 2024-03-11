import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

import { FaCircle } from "react-icons/fa";

import { useAppSelector } from "../../store/hooks";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useGetPlayerProfileDetailsQuery } from "../../api/endpoints/PlayersApi";
import { MdOutlineLanguage } from "react-icons/md";
import { localUrl } from "../../common/constants/apiConstants";
import { useGetPlayerIncomingRequestsQuery } from "../../api/endpoints/BookingsApi";
import { useGetMissingMatchScoresNumberQuery } from "../../api/endpoints/MatchScoresApi";
import { useGetPlayerMissingEventReviewsNumberQuery } from "../../api/endpoints/EventReviewsApi";

import PlayerHeader from "./player/PlayerHeader";
import TrainerHeader from "./trainer/TrainerHeader";
import ClubHeader from "./club/ClubHeader";
import ProfileModal from "./modals/profile/ProfileModal";
import PageLoading from "../../components/loading/PageLoading";
import LanguageModal from "./modals/language/LanguageModal";
import NotificationsModal from "./modals/notifications/NotificationsModal";
import { useGetTrainerByUserIdQuery } from "../../api/endpoints/TrainersApi";
import { useGetClubByUserIdQuery } from "../../api/endpoints/ClubsApi";

const Header = () => {
  const user = useAppSelector((store) => store?.user);
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleOpenLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const handleCloseLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);

  const handleOpenNotificationsModal = () => {
    setIsNotificationsModalOpen(true);
  };
  const handleCloseNotificationsModal = () => {
    setIsNotificationsModalOpen(false);
  };
  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerProfileDetailsQuery(user?.user?.user?.user_id);

  const { data: trainerDetails, isLoading: isTrainerDetailsLoading } =
    useGetTrainerByUserIdQuery(user?.user?.user?.user_id);
  const { data: clubDetails, isLoading: isClubDetailsLoading } =
    useGetClubByUserIdQuery(user?.user?.user?.user_id);

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  const navigateUser = (path: string) => {
    navigate(paths[path]);
    handleCloseProfileModal();
  };
  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user && user.user && user.user.user) {
    isUserPlayer = user?.user.user.user_type_id === 1;
    isUserTrainer = user?.user.user.user_type_id === 2;
    isUserClub = user?.user.user.user_type_id === 3;
  }

  const hasBankDetails =
    isUserPlayer &&
    playerDetails?.[0]?.card_expiry &&
    playerDetails?.[0]?.card_number &&
    playerDetails?.[0]?.cvc &&
    playerDetails?.[0]?.name_on_card
      ? true
      : isUserTrainer &&
        trainerDetails?.[0]?.iban &&
        trainerDetails?.[0]?.name_on_bank_account &&
        trainerDetails?.[0]?.bank_id
      ? true
      : isUserClub &&
        clubDetails?.[0]?.iban &&
        clubDetails?.[0]?.name_on_bank_account &&
        clubDetails?.[0]?.bank_id
      ? true
      : false;

  const { data: incomingRequests, isLoading: isIncomingRequestsLoading } =
    useGetPlayerIncomingRequestsQuery(user?.user?.user?.user_id);

  const {
    data: missingScores,
    isLoading: isScoresLoading,
    refetch: refetchMissingScores,
  } = useGetMissingMatchScoresNumberQuery(user?.user?.user?.user_id);

  const missingScoresLength = missingScores?.length;

  const {
    data: missingReviews,
    isLoading: isReviewsLoading,
    refetch: refetchMissingReviews,
  } = useGetPlayerMissingEventReviewsNumberQuery(user?.user?.user?.user_id);

  const isLoggedIn = user?.token ? true : false;

  if (
    isPlayerDetailsLoading ||
    isIncomingRequestsLoading ||
    isScoresLoading ||
    isReviewsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["header-container"]}>
      <div className={styles["top-container"]}>
        <NavLink
          to={paths.HOME}
          onClick={() => navigateUser("HOME")}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-logo-title"]}`
              : `${styles["logo-title"]}`
          }
        >
          Raket
        </NavLink>
        {isLoggedIn ? (
          <div className={styles["user-nav"]}>
            <div className={styles["notification-container"]}>
              {(!hasBankDetails ||
                incomingRequests?.length > 0 ||
                missingScoresLength > 0 ||
                missingReviews > 0) && (
                <FaCircle className={styles["circle"]} />
              )}
              <IoIosNotificationsOutline
                onClick={handleOpenNotificationsModal}
                className={styles.notification}
              />
            </div>
            <MdOutlineLanguage
              className={styles.language}
              onClick={handleOpenLanguageModal}
            />
            {isLoggedIn && (
              <img
                src={
                  isUserPlayer && playerDetails?.[0]?.image
                    ? `${localUrl}/${playerDetails?.[0]?.image}`
                    : //: isUserTrainer && trainerDetails?.[0]?.image
                      //? trainerDetails?.[0]?.image
                      //: isUserClub && clubDetails?.[0]?.image
                      //? clubDetails?.[0]?.image
                      "/images/icons/avatar.jpg"
                }
                alt="avatar"
                className={styles["profile-image"]}
                onClick={handleOpenProfileModal}
              />
            )}
          </div>
        ) : (
          <div className={styles["user-nav"]}>
            <NavLink
              to={paths.LOGIN}
              onClick={() => navigateUser("LOGIN")}
              className={({ isActive }) =>
                isActive
                  ? `${styles["active-nav-link"]}`
                  : `${styles["nav-link"]}`
              }
            >
              Giriş
            </NavLink>
            <NavLink
              to={paths.REGISTER}
              onClick={() => navigateUser("REGISTER")}
              className={({ isActive }) =>
                isActive
                  ? `${styles["active-nav-link"]}`
                  : `${styles["nav-link"]}`
              }
            >
              Kayıt
            </NavLink>
            <MdOutlineLanguage
              className={styles.notification}
              onClick={handleOpenLanguageModal}
            />
          </div>
        )}
      </div>
      {isUserPlayer && (
        <PlayerHeader
          navigateUser={navigateUser}
          handleCloseProfileModal={handleCloseProfileModal}
        />
      )}
      {isUserTrainer && <TrainerHeader />}
      {isUserClub && <ClubHeader />}
      {isProfileModalOpen && (
        <ProfileModal
          isProfileModalOpen={isProfileModalOpen}
          handleCloseProfileModal={handleCloseProfileModal}
          email={user?.user?.user?.email}
        />
      )}
      {isLanguageModalOpen && (
        <LanguageModal
          isLanguageModalOpen={isLanguageModalOpen}
          handleCloseLanguageModal={handleCloseLanguageModal}
        />
      )}
      {isNotificationsModalOpen && (
        <NotificationsModal
          isNotificationsModalOpen={isNotificationsModalOpen}
          handleCloseNotificationsModal={handleCloseNotificationsModal}
          user={user}
          hasBankDetails={hasBankDetails}
          incomingRequests={incomingRequests}
          missingScoresLength={missingScoresLength}
          missingReviews={missingReviews}
        />
      )}
    </div>
  );
};

export default Header;

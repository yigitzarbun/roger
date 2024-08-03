import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { CgMenuGridR } from "react-icons/cg";
import styles from "./styles.module.scss";
import paths from "../../routing/Paths";
import { IoMdSunny } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { MdOutlineNotifications } from "react-icons/md";
import { useGetPlayerProfileDetailsQuery } from "../../api/endpoints/PlayersApi";
import { IoLanguageSharp } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { localUrl } from "../../common/constants/apiConstants";
import {
  useGetPlayerIncomingRequestsQuery,
  useGetTrainerIncomingRequestsQuery,
} from "../../api/endpoints/BookingsApi";
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
import { useGetClubNewStaffRequestsQuery } from "../../api/endpoints/ClubStaffApi";
import { useGetTrainerNewStudentRequestsListQuery } from "../../api/endpoints/StudentsApi";
import { LocalStorageKeys } from "../../common/constants/lsConstants";
import MenuModal from "./menu-modal/MenuModal";

const Header = () => {
  const user = useAppSelector((store) => store?.user);
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem(LocalStorageKeys.theme) ?? "dark"
  );
  const updateTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);
    localStorage.setItem(LocalStorageKeys.theme, newTheme);
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
    if (
      !hasBankDetails ||
      playerIncomingRequests?.length > 0 ||
      trainerIncomingRequests?.length > 0 ||
      missingScoresLength > 0 ||
      missingReviews > 0 ||
      myStaffRequests?.length > 0
    ) {
      setIsNotificationsModalOpen(true);
    }
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
    playerDetails?.card_expiry &&
    playerDetails?.card_number &&
    playerDetails?.cvc &&
    playerDetails?.name_on_card
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

  const { data: playerIncomingRequests, isLoading: isIncomingRequestsLoading } =
    useGetPlayerIncomingRequestsQuery(user?.user?.user?.user_id);

  const {
    data: trainerIncomingRequests,
    isLoading: isTrainerIncomingRequestsLoading,
  } = useGetTrainerIncomingRequestsQuery(user?.user?.user?.user_id);

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

  const {
    data: myStaffRequests,
    isLoading: isMyStaffRequestsLoading,
    refetch: refetchMyRequests,
  } = useGetClubNewStaffRequestsQuery(
    user?.user?.user?.user_type_id === 3 ? user?.user?.clubDetails?.club_id : 0
  );

  const { data: newStudentRequests, isLoading: isNewStudentRequestsLoading } =
    useGetTrainerNewStudentRequestsListQuery(user?.user?.user?.user_id);

  const isLoggedIn = user?.token ? true : false;

  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const handleOpenMenuModal = () => {
    setMenuModalOpen(true);
  };

  const handleCloseMenuModal = () => {
    setMenuModalOpen(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  if (
    isPlayerDetailsLoading ||
    isIncomingRequestsLoading ||
    isScoresLoading ||
    isReviewsLoading ||
    isMyStaffRequestsLoading ||
    isTrainerIncomingRequestsLoading ||
    isNewStudentRequestsLoading ||
    isTrainerDetailsLoading ||
    isClubDetailsLoading
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
            <FiMessageSquare
              className={styles.messages}
              onClick={() => navigateUser("MESSAGES")}
            />

            {currentTheme === "dark" ? (
              <IoMdSunny className={styles.theme} onClick={updateTheme} />
            ) : (
              <FiMoon className={styles.theme} onClick={updateTheme} />
            )}
            <MdOutlineNotifications
              onClick={handleOpenNotificationsModal}
              className={
                !hasBankDetails ||
                playerIncomingRequests?.length > 0 ||
                trainerIncomingRequests?.length > 0 ||
                missingScoresLength > 0 ||
                missingReviews > 0 ||
                newStudentRequests?.length > 0 ||
                myStaffRequests?.length > 0
                  ? styles["active-notification"]
                  : styles["passive-notification"]
              }
            />
            <IoLanguageSharp
              className={styles.language}
              onClick={handleOpenLanguageModal}
            />
            {isLoggedIn && (
              <img
                src={
                  isUserPlayer && playerDetails?.image
                    ? `${localUrl}/${playerDetails?.image}`
                    : isUserTrainer && trainerDetails?.[0]?.image
                    ? `${localUrl}/${trainerDetails?.[0]?.image}`
                    : isUserClub && clubDetails?.[0]?.image
                    ? `${localUrl}/${clubDetails?.[0]?.image}`
                    : "/images/icons/avatar.jpg"
                }
                alt="avatar"
                className={styles["profile-image"]}
                onClick={handleOpenProfileModal}
              />
            )}
          </div>
        ) : (
          <div className={styles["user-nav"]}>
            <div className={styles["not-logged-icons"]}>
              {currentTheme === "dark" ? (
                <IoMdSunny className={styles.theme} onClick={updateTheme} />
              ) : (
                <FiMoon className={styles.theme} onClick={updateTheme} />
              )}
              <IoLanguageSharp
                className={styles.language}
                onClick={handleOpenLanguageModal}
              />
            </div>
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
              className={styles.register}
            >
              Kayıt
            </NavLink>
          </div>
        )}
      </div>
      <CgMenuGridR className={styles.menu} onClick={handleOpenMenuModal} />
      {isUserPlayer && (
        <PlayerHeader
          navigateUser={navigateUser}
          handleCloseProfileModal={handleCloseProfileModal}
        />
      )}
      {isUserTrainer && (
        <TrainerHeader
          trainerIncomingRequests={trainerIncomingRequests}
          newStudentRequests={newStudentRequests}
        />
      )}
      {isUserClub && <ClubHeader myStaffRequests={myStaffRequests} />}
      {isProfileModalOpen && (
        <ProfileModal
          isProfileModalOpen={isProfileModalOpen}
          handleCloseProfileModal={handleCloseProfileModal}
          handleCloseMenuModal={handleCloseMenuModal}
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
          handleCloseMenuModal={handleCloseMenuModal}
          user={user}
          hasBankDetails={hasBankDetails}
          playerIncomingRequests={playerIncomingRequests}
          trainerIncomingRequests={trainerIncomingRequests}
          missingScoresLength={missingScoresLength}
          missingReviews={missingReviews}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
          isUserClub={isUserClub}
          myStaffRequests={myStaffRequests}
          newStudentRequests={newStudentRequests}
        />
      )}
      {menuModalOpen && (
        <MenuModal
          menuModalOpen={menuModalOpen}
          handleCloseMenuModal={handleCloseMenuModal}
        />
      )}
    </div>
  );
};

export default Header;

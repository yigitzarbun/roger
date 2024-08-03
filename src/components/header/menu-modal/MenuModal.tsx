import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import paths from "../../../routing/Paths";
import { IoMdSunny } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { useAppSelector } from "../../../store/hooks";
import { MdOutlineNotifications } from "react-icons/md";
import { useGetPlayerProfileDetailsQuery } from "../../../api/endpoints/PlayersApi";
import { IoLanguageSharp } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { localUrl } from "../../../common/constants/apiConstants";
import {
  useGetPlayerIncomingRequestsQuery,
  useGetTrainerIncomingRequestsQuery,
} from "../../../api/endpoints/BookingsApi";
import { useGetMissingMatchScoresNumberQuery } from "../../../api/endpoints/MatchScoresApi";
import { useGetPlayerMissingEventReviewsNumberQuery } from "../../../api/endpoints/EventReviewsApi";
import PlayerHeader from "../player/PlayerHeader";
import TrainerHeader from "../trainer/TrainerHeader";
import ClubHeader from "../club/ClubHeader";
import ProfileModal from "../modals/profile/ProfileModal";
import PageLoading from "../../../components/loading/PageLoading";
import LanguageModal from "../modals/language/LanguageModal";
import NotificationsModal from "../modals/notifications/NotificationsModal";
import { useGetTrainerByUserIdQuery } from "../../../api/endpoints/TrainersApi";
import { useGetClubByUserIdQuery } from "../../../api/endpoints/ClubsApi";
import { useGetClubNewStaffRequestsQuery } from "../../../api/endpoints/ClubStaffApi";
import { useGetTrainerNewStudentRequestsListQuery } from "../../../api/endpoints/StudentsApi";
import { LocalStorageKeys } from "../../../common/constants/lsConstants";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";

interface MenuModalProps {
  menuModalOpen: boolean;
  handleCloseMenuModal: () => void;
}

const MenuModal = (props: MenuModalProps) => {
  const { menuModalOpen, handleCloseMenuModal } = props;

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
    handleCloseMenuModal();
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

  const { t } = useTranslation();

  const {
    data: incomingBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerIncomingRequestsQuery(user?.user?.user?.user_id);

  useEffect(() => {
    refetchBookings();
  }, []);

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
    <ReactModal
      isOpen={menuModalOpen}
      onRequestClose={handleCloseMenuModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseMenuModal} />
      <div className={styles["modal-content"]}>
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
        <div className={styles["icons-row"]}>
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
        </div>

        <NavLink
          to={paths.EXPLORE}
          onClick={() => navigateUser("EXPLORE")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerExploreTitle")}
        </NavLink>
        <NavLink
          to={paths.TRAIN}
          onClick={() => navigateUser("TRAIN")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerTrainingTitle")}
        </NavLink>
        <NavLink
          to={paths.MATCH}
          onClick={() => navigateUser("MATCH")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerMatchTitle")}
        </NavLink>
        <NavLink
          to={paths.LESSON}
          onClick={() => navigateUser("LESSON")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerLessonTitle")}
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          onClick={() => navigateUser("CALENDAR")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerCalendarTitle")}
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          onClick={() => navigateUser("REQUESTS")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerInvitesTitle")}

          {incomingBookings?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          onClick={() => navigateUser("PERFORMANCE")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          {t("headerPerformanceTitle")}
        </NavLink>
        <NavLink
          to={paths.PLAYER_TOURNAMENTS}
          onClick={() => navigateUser("PLAYER_TOURNAMENTS")}
          className={({ isActive }) =>
            isActive ? `${styles["active-nav-link"]}` : `${styles["nav-link"]}`
          }
        >
          Turnuvalar
        </NavLink>
      </div>
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
    </ReactModal>
  );
};

export default MenuModal;

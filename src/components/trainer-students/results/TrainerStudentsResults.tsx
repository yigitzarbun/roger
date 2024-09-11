import React, { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import PageLoading from "../../../components/loading/PageLoading";
import DeleteTrainerStudentModal from "./delete-student-modal/DeleteTrainerStudentModal";
import { getAge } from "../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../components/invite/lesson/form/LessonInviteFormModal";
import TrainerStudentsFilterModal from "./trainer-students-filter-modal/TrainerStudentsFilterModal";

interface TrainerStudentsProps {
  playerLevelId: number;
  textSearch: string;
  locationId: number;
  gender: string;
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  paginatedTrainerStudents: any;
  handlePlayerPage: (e) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  user: any;
  refetchStudents: () => void;
}
const TrainerStudentsResults = (props: TrainerStudentsProps) => {
  const {
    playerLevelId,
    textSearch,
    locationId,
    gender,
    handleLevel,
    handleTextSearch,
    handleGender,
    handleLocation,
    handleClear,
    paginatedTrainerStudents,
    handlePlayerPage,
    handleNextPage,
    handlePrevPage,
    user,
    refetchStudents,
  } = props;

  const { t } = useTranslation();

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const pageNumbers = [];

  for (let i = 1; i <= paginatedTrainerStudents?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const [opponentUserId, setOpponentUserId] = useState(null);

  const handleOpenLessonModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const [isPlayerFilterModalOpen, setIsPlayerFilterModalOpen] = useState(false);

  const handleOpenPlayerFilterModal = () => {
    setIsPlayerFilterModalOpen(true);
  };

  const handleClosePlayerFilterModal = () => {
    setIsPlayerFilterModalOpen(false);
  };

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [student, setStudent] = useState(null);

  const openDeleteModal = (student) => {
    setStudent(student);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  if (isPlayerLevelsLoading || isLocationsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>
            {t("trainerStudentsTitle")}
          </h2>
          {paginatedTrainerStudents?.students?.length > 0 && (
            <FaFilter
              onClick={handleOpenPlayerFilterModal}
              className={
                playerLevelId > 0 ||
                gender !== "" ||
                locationId > 0 ||
                textSearch !== ""
                  ? styles["active-filter"]
                  : styles.filter
              }
            />
          )}
        </div>
        {paginatedTrainerStudents?.totalPages > 1 && (
          <div className={styles["navigation-container"]}>
            <FaAngleLeft
              onClick={handlePrevPage}
              className={styles["nav-arrow"]}
            />

            <FaAngleRight
              onClick={handleNextPage}
              className={styles["nav-arrow"]}
            />
          </div>
        )}
      </div>
      {paginatedTrainerStudents?.students?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("student")}</th>
              <th>{t("leaderboardTablePlayerNameHeader")}</th>
              <th>{t("leaderboardTableAgeHeader")}</th>
              <th>{t("leaderboardTableGenderHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("leaderboardTableLevelHeader")}</th>
              <th>{t("lessonCount")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrainerStudents?.students?.map((student) => (
              <tr key={student.student_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${student.playerUserId}`}
                  >
                    <img
                      src={
                        student?.playerImage
                          ? student?.playerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={student.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${student.playerUserId}`}
                    className={styles["player-name"]}
                  >
                    {`${student?.playerFname} ${student?.playerLname}`}
                  </Link>
                </td>
                <td>{getAge(student?.playerBirthYear)}</td>
                <td>
                  {student?.gender === "female" ? t("female") : t("male")}
                </td>
                <td>{student?.location_name}</td>
                <td>
                  {student.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : student?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : student?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : t("playerLevelProfessinal")}
                </td>
                <td>{student?.lessoncount}</td>
                <td>
                  <button
                    onClick={() => openDeleteModal(student)}
                    className={styles["delete-button"]}
                  >
                    {t("deleteStudent")}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenLessonModal(student.playerUserId)}
                    className={styles["invite-button"]}
                  >
                    {t("tableLessonButtonText")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("noStudentsText")}</p>
      )}
      {deleteModalOpen && (
        <DeleteTrainerStudentModal
          deleteModalOpen={deleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          student={student}
          refetchStudents={refetchStudents}
        />
      )}

      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {isPlayerFilterModalOpen && (
        <TrainerStudentsFilterModal
          isPlayerFilterModalOpen={isPlayerFilterModalOpen}
          handleClosePlayerFilterModal={handleClosePlayerFilterModal}
          locations={locations}
          handleLocation={handleLocation}
          handleClear={handleClear}
          locationId={locationId}
          handleTextSearch={handleTextSearch}
          textSearch={textSearch}
          handleLevel={handleLevel}
          playerLevelId={playerLevelId}
          playerLevels={playerLevels}
          handleGender={handleGender}
        />
      )}
    </div>
  );
};

export default TrainerStudentsResults;

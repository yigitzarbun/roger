import React, { useState, ChangeEvent } from "react";

import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import { useAppSelector } from "../../../store/hooks";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPaginatedTrainerStudentsQuery } from "../../../api/endpoints/StudentsApi";
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
  } = props;
  const user = useAppSelector((store) => store?.user?.user);
  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedTrainerStudents,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetPaginatedTrainerStudentsQuery({
    perPage: 4,
    currentPage: currentPage,
    playerLevelId: playerLevelId,
    textSearch: textSearch,
    locationId: locationId,
    gender: gender,
    trainerUserId: user?.user?.user_id,
    studentStatus: "accepted",
  });

  const pageNumbers = [];
  for (let i = 1; i <= paginatedTrainerStudents?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % paginatedTrainerStudents?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedTrainerStudents?.totalPages) %
        paginatedTrainerStudents?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

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

  if (isPlayerLevelsLoading || isLocationsLoading || isStudentsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Öğrenciler</h2>
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
              <th>Öğrenci</th>
              <th>İsim</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Konum</th>
              <th>Seviye</th>
              <th>Antreman Sayısı</th>
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
                <td>{student?.gender}</td>
                <td>{student?.location_name}</td>
                <td>{student?.player_level_name}</td>
                <td>{student?.lessoncount}</td>
                <td>
                  <button
                    onClick={() => openDeleteModal(student)}
                    className={styles["delete-button"]}
                  >
                    Öğrenciyi Sil
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenLessonModal(student.playerUserId)}
                    className={styles["invite-button"]}
                  >
                    Derse davet et
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz aktif öğrenci bulunmamaktadır</p>
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

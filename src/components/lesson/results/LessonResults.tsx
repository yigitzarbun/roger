import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsSortDown } from "react-icons/bs";
import { BsClockHistory } from "react-icons/bs";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../store/hooks";
import { useGetPaginatedTrainersQuery } from "../../../api/endpoints/TrainersApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../api/endpoints/FavouritesApi";
import {
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
  useUpdateStudentMutation,
} from "../../../api/endpoints/StudentsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../components/invite/lesson/form/LessonInviteFormModal";
import LessonSortModal from "../lesson-sort/LessonSortModal";
import StudentApplicationModal from "../studentship-modal/StudentApplicationModal";
import { FaFilter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface TrainSearchProps {
  trainerLevelId: number;
  gender: string;
  locationId: number;
  clubId: number;
  favourite: boolean;
  textSearch: string;
  handleOpenFilter: () => void;
}

const LessonResults = (props: TrainSearchProps) => {
  const {
    trainerLevelId,
    gender,
    locationId,
    clubId,
    favourite,
    textSearch,
    handleOpenFilter,
  } = props;
  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const {
    data: playerStudentships,
    isLoading: isPlayerStudentshipsLoading,
    refetch: refetchStudents,
  } = useGetStudentsByFilterQuery({
    player_id: user?.user?.user_id,
  });

  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const [selectedTrainerId, setSelectedTrainerId] = useState(null);

  const [trainerName, setTrainerName] = useState("");

  const [selectedTrainerImage, setSelectedTrainerImage] = useState("");

  const [studentApplicationModalOpen, setStudentApplicationModalOpen] =
    useState(false);

  const handleOpenStudentApplicationModal = (
    trainerId: number,
    fname: string,
    lname: string,
    image: string
  ) => {
    setSelectedTrainerId(trainerId);
    setTrainerName(`${fname} ${lname}`);
    setSelectedTrainerImage(image);
    setStudentApplicationModalOpen(true);
  };

  const handleCloseStudentApplicationModal = () => {
    setTrainerName("");
    setSelectedTrainerId(null);
    setStudentApplicationModalOpen(false);
  };

  const handleAddStudent = () => {
    const selectedStudent = playerStudentships?.find(
      (student) =>
        student.trainer_id === selectedTrainerId &&
        student.player_id === user?.user?.user_id
    );

    if (!selectedStudent) {
      const newStudent = {
        student_status: "pending",
        trainer_id: selectedTrainerId,
        player_id: user?.user?.user_id,
      };
      addStudent(newStudent);
    } else if (selectedStudent?.student_status === "declined") {
      const updatedStudentData = {
        ...selectedStudent,
        student_status: "pending",
      };
      updateStudent(updatedStudentData);
    }
  };

  const handleDeclineStudent = (selectedTrainerId: number) => {
    const selectedStudent = playerStudentships?.find(
      (student) =>
        student.trainer_id === selectedTrainerId &&
        student.player_id === user?.user?.user_id &&
        student.student_status === "accepted"
    );
    if (selectedStudent) {
      const updatedStudentData = {
        ...selectedStudent,
        student_status: "declined",
      };
      updateStudent(updatedStudentData);
    }
  };

  const {
    data: myFavourites,
    isLoading: isMyFavouritesLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

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
    const selectedFavourite = myFavourites?.find(
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
    if (myFavourites?.find((favourite) => favourite.favouritee_id === userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const trainerLevelValue = Number(trainerLevelId) ?? null;

  const selectedGenderValue = gender ?? "";

  const locationIdValue = Number(locationId) ?? null;

  const clubIdValue = Number(clubId) ?? null;

  const logicLoadingId = user?.playerDetails?.location_id;

  const [orderByDirection, setOrderByDirection] = useState("desc");

  const [orderByColumn, setOrderByColumn] = useState("");

  const handleOrderBy = (orderByColumn: string, orderByDirection: string) => {
    setOrderByColumn(orderByColumn);
    setOrderByDirection(orderByDirection);
  };

  const handleClearOrderBy = () => {
    setOrderByColumn("");
  };

  const [sortModalOpen, setSortModalOpen] = useState(false);

  const handleOpenSortModal = () => {
    setSortModalOpen(true);
  };

  const handleCloseSortModal = () => {
    setSortModalOpen(false);
  };

  const {
    data: trainers,
    isLoading: isTrainersLoading,
    refetch: refetchPaginatedTrainers,
  } = useGetPaginatedTrainersQuery({
    currentPage: currentPage,
    trainerExperienceTypeId: trainerLevelValue,
    selectedGender: selectedGenderValue,
    locationId: locationIdValue,
    clubId: clubIdValue,
    currentUserId: user?.user?.user_id,
    textSearch: textSearch,
    proximityLocationId: logicLoadingId,
    column: orderByColumn,
    direction: orderByDirection,
  });

  const [opponentUserId, setOpponentUserId] = useState(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleOpenInviteModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsInviteModalOpen(true);
  };
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const pageNumbers = [];
  for (let i = 1; i <= trainers?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % trainers?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + trainers?.totalPages) % trainers?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const filteredTrainers = trainers?.trainers
    ?.filter((trainer) => trainer.user_id !== user.user.user_id)
    .filter((trainer) => {
      if (favourite !== true) {
        return trainer;
      } else if (
        (favourite === true &&
          myFavourites.find(
            (favourite) =>
              favourite.favouritee_id === trainer.user_id &&
              favourite.is_active === true
          )) ||
        favourite !== true
      ) {
        return trainer;
      }
    });

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      handleCloseStudentApplicationModal();
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchPaginatedTrainers();
  }, [
    trainerLevelValue,
    selectedGenderValue,
    locationIdValue,
    clubIdValue,
    currentPage,
    textSearch,
  ]);

  if (isMyFavouritesLoading || isPlayerStudentshipsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <div className={styles["title-left"]}>
          <h2 className={styles.title}>{t("headerLessonTitle")}</h2>
          <FaFilter
            onClick={handleOpenFilter}
            className={
              locationId > 0 ||
              trainerLevelId > 0 ||
              textSearch !== "" ||
              clubId > 0 ||
              gender !== "" ||
              favourite
                ? styles["active-filter"]
                : styles.filter
            }
          />
          <BsSortDown
            className={
              orderByColumn === ""
                ? styles["passive-sort"]
                : styles["active-sort"]
            }
            onClick={handleOpenSortModal}
          />
        </div>
        {trainers?.totalPages > 1 && (
          <div className={styles["nav-container"]}>
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
      {isTrainersLoading && <p>Yükleniyor...</p>}
      {trainers && filteredTrainers.length === 0 && (
        <p>{t("trainersEmptyText")}</p>
      )}
      {trainers && filteredTrainers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("tableFavouriteHeader")}</th>
              <th>{t("tableTrainerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableAgeHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tablePriceHeader")}</th>
              <th>{t("tableLessonHeader")}</th>
              <th>{t("tableStudentshipHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  {myFavourites?.find(
                    (favourite) =>
                      favourite.favouritee_id === trainer.trainerUserId &&
                      favourite.is_active === true
                  ) && trainer.trainerUserId !== user?.user?.user_id ? (
                    <AiFillStar
                      onClick={() =>
                        handleToggleFavourite(trainer.trainerUserId)
                      }
                      className={styles["remove-fav-icon"]}
                    />
                  ) : (
                    trainer.trainerUserId !== user?.user?.user_id &&
                    !myFavourites?.find(
                      (favourite) =>
                        favourite.favouritee_id === trainer.trainerUserId &&
                        favourite.is_active === true
                    ) && (
                      <AiOutlineStar
                        onClick={() =>
                          handleToggleFavourite(trainer.trainerUserId)
                        }
                        className={styles["add-fav-icon"]}
                      />
                    )
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId}`}
                  >
                    <img
                      src={
                        trainer.image
                          ? trainer.image
                          : "/images/icons/avatar.jpg"
                      }
                      alt={trainer.name}
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer?.trainerUserId}`}
                    className={styles["trainer-name"]}
                  >{`${trainer.fname} ${trainer.lname}`}</Link>
                </td>
                <td>
                  {trainer?.employment_status === "accepted"
                    ? trainer?.club_name
                    : t("trainerIndependent")}
                </td>
                <td>
                  {trainer?.trainer_experience_type_id === 1
                    ? t("trainerLevelBeginner")
                    : trainer?.trainer_experience_type_id === 2
                    ? t("trainerLevelIntermediate")
                    : trainer?.trainer_experience_type_id === 3
                    ? t("trainerLevelAdvanced")
                    : t("trainerLevelProfessional")}
                </td>
                <td>{trainer.gender === "female" ? t("female") : t("male")}</td>
                <td>{getAge(trainer.birth_year)}</td>
                <td>{trainer?.location_name}</td>
                <td>{parseFloat(trainer.price_hour).toFixed(2)} TL</td>
                <td>
                  <button
                    onClick={() =>
                      handleOpenInviteModal(trainer?.trainerUserId)
                    }
                    className={styles["lesson-button"]}
                  >
                    {t("tableLessonInviteButtonText")}
                  </button>
                </td>
                <td>
                  {playerStudentships?.find(
                    (student) =>
                      student.trainer_id === trainer.trainerUserId &&
                      student.student_status === "pending"
                  ) ? (
                    <BsClockHistory
                      className={styles["pending-confirmation-text"]}
                    />
                  ) : playerStudentships?.find(
                      (student) =>
                        student.trainer_id === trainer.trainerUserId &&
                        student.student_status === "accepted"
                    ) ? (
                    <button
                      onClick={() =>
                        handleDeclineStudent(trainer.trainerUserId)
                      }
                      className={styles["cancel-student-button"]}
                    >
                      {t("tableDeleteStudentshipButtonText")}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleOpenStudentApplicationModal(
                          trainer.trainerUserId,
                          trainer.fname,
                          trainer.lname,
                          trainer.image
                        )
                      }
                      className={styles["add-student-button"]}
                    >
                      {t("tableStudentshipButtonText")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handlePlayerPage}
            className={
              pageNumber === Number(currentPage)
                ? styles["active-page"]
                : styles["passive-page"]
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>
      {isInviteModalOpen && (
        <LessonInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {sortModalOpen && (
        <LessonSortModal
          sortModalOpen={sortModalOpen}
          handleCloseSortModal={handleCloseSortModal}
          handleOrderBy={handleOrderBy}
          handleClearOrderBy={handleClearOrderBy}
          orderByDirection={orderByDirection}
          orderByColumn={orderByColumn}
        />
      )}
      {studentApplicationModalOpen && (
        <StudentApplicationModal
          studentApplicationModalOpen={studentApplicationModalOpen}
          handleCloseStudentApplicationModal={
            handleCloseStudentApplicationModal
          }
          trainerName={trainerName}
          handleAddStudent={handleAddStudent}
          trainerImage={selectedTrainerImage}
        />
      )}
    </div>
  );
};

export default LessonResults;

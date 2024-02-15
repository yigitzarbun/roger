import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetPaginatedTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetFavouritesByFilterQuery } from "../../../api/endpoints/FavouritesApi";
import {
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
  useUpdateStudentMutation,
} from "../../../api/endpoints/StudentsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../components/invite/lesson/form/LessonInviteFormModal";

interface TrainSearchProps {
  trainerLevelId: number;
  gender: string;
  locationId: number;
  clubId: number;
  favourite: boolean;
  textSearch: string;
}

const LessonResults = (props: TrainSearchProps) => {
  const { trainerLevelId, gender, locationId, clubId, favourite, textSearch } =
    props;
  const user = useAppSelector((store) => store?.user?.user);

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

  const handleAddStudent = (selectedTrainerId: number) => {
    const selectedStudent = playerStudentships?.find(
      (student) =>
        student.trainer_id === selectedTrainerId &&
        student.player_id === user?.user?.user_id
    );

    if (!selectedStudent) {
      const newStudentData = {
        student_status: "pending",
        trainer_id: selectedTrainerId,
        player_id: user?.user?.user_id,
      };
      addStudent(newStudentData);
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
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const trainerLevelValue = Number(trainerLevelId) ?? null;
  const selectedGenderValue = gender ?? "";
  const locationIdValue = Number(locationId) ?? null;
  const clubIdValue = Number(clubId) ?? null;

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
            (favourite) => favourite.favouritee_id === trainer.user_id
          )) ||
        favourite !== true
      ) {
        return trainer;
      }
    });

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  useEffect(() => {
    refetchFavourites();
  }, []);

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

  if (isFavouritesLoading || isPlayerStudentshipsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Ders</h2>
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
      </div>
      {isTrainersLoading && <p>Yükleniyor...</p>}
      {trainers && filteredTrainers.length === 0 && (
        <p>
          Aradığınız kritere göre eğitmen bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {trainers && filteredTrainers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Kulüp</th>
              <th>Tecrübe</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th>Fiyat (saat)</th>
              <th>Ders</th>
              <th>Öğrencilik</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id}`}>
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
                    to={`${paths.EXPLORE_PROFILE}2/${trainer?.user_id}`}
                    className={styles["trainer-name"]}
                  >{`${trainer.fname} ${trainer.lname}`}</Link>
                </td>
                <td>
                  {trainer?.employment_status === "accepted"
                    ? trainer?.club_name
                    : "Bağımsız"}
                </td>
                <td>{trainer?.trainer_experience_type_name}</td>
                <td>{trainer.gender}</td>
                <td>{getAge(trainer.birth_year)}</td>
                <td>{trainer?.location_name}</td>
                <td>{parseFloat(trainer.price_hour).toFixed(2)} TL</td>
                <td>
                  <button
                    onClick={() => handleOpenInviteModal(trainer?.user_id)}
                    className={styles["lesson-button"]}
                  >
                    Ders al
                  </button>
                </td>
                <td>
                  {playerStudentships?.find(
                    (student) =>
                      student.trainer_id === trainer.user_id &&
                      student.student_status === "pending"
                  ) ? (
                    <p className={styles["pending-confirmation-text"]}>
                      Onayı bekleniyor
                    </p>
                  ) : playerStudentships?.find(
                      (student) =>
                        student.trainer_id === trainer.user_id &&
                        student.student_status === "accepted"
                    ) ? (
                    <button
                      onClick={() => handleDeclineStudent(trainer.user_id)}
                      className={styles["cancel-student-button"]}
                    >
                      Öğrenciliği sil
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddStudent(trainer.user_id)}
                      className={styles["add-student-button"]}
                    >
                      Öğrenci Ol
                    </button>
                  )}
                </td>
                <td>
                  <SlOptions className={styles.icon} />
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
        />
      )}
    </div>
  );
};

export default LessonResults;

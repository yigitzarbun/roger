import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";
import { IoStar } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";

import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";

import {
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
  useUpdateStudentMutation,
} from "../../../../../../api/endpoints/StudentsApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";

interface ExploreTrainersInteractionSectionProps {
  user_id: number;
  selectedTrainer: Trainer;
}
export const ExploreTrainersInteractionSection = (
  props: ExploreTrainersInteractionSectionProps
) => {
  const { user_id, selectedTrainer } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const profileImage = selectedTrainer?.[0]?.trainerImage;

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const handleOpenLessonModal = (userId: number) => {
    setIsLessonModalOpen(true);
  };
  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < 10; i++) {
      if (i < count) {
        stars.push(<IoStar className={styles["active-star"]} key={i} />);
      } else {
        stars.push(<IoStar className={styles["empty-star"]} key={i} />);
      }
    }
    return stars;
  };

  const {
    data: trainerStudents,
    isLoading: isTrainerStudentsLoading,
    refetch: refetchTrainerStudents,
  } = useGetStudentsByFilterQuery({
    trainer_id: user_id,
    student_status: "accepted",
  });

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsByFilterQuery({ trainer_id: user_id });

  // student
  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const handleAddStudent = (selectedTrainerId: number) => {
    const selectedStudent = students?.find(
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
    } else {
      const updatedStudent = {
        student_id: selectedStudent.student_id,
        registered_at: selectedStudent.registeret_at,
        student_status: "pending",
        trainer_id: selectedStudent.trainer_id,
        player_id: selectedStudent.player_id,
      };
      updateStudent(updatedStudent);
    }
  };

  const handleDeclineStudent = (selectedTrainerId: number) => {
    const selectedStudent = trainerStudents?.find(
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
    data: myFavouriteTrainers,
    isLoading: isMyFavouriteTrainersLoading,
    refetch: refetchMyFavouriteTrainers,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

  const isTrainerInMyFavourites = (user_id: number) => {
    return myFavouriteTrainers?.find(
      (favourite) => favourite.favouritee_id === user_id
    );
  };

  // favourite
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
    const selectedFavourite = myFavouriteTrainers?.find(
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
    if (isTrainerInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const isStudentPending = () => {
    const student = students?.find(
      (student) =>
        student.player_id === user?.user?.user_id &&
        student.student_status === "pending"
    );
    return student ? student : false;
  };

  const isStudentAccepted = () => {
    const student = students?.find(
      (student) =>
        student.player_id === user?.user?.user_id &&
        student.student_status === "accepted"
    );
    return student ? student : false;
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavouriteTrainers();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      refetchTrainerStudents();
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  if (
    isStudentsLoading ||
    isTrainerStudentsLoading ||
    isMyFavouriteTrainersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["interaction-section"]}>
      <div className={styles["image-container"]}>
        <img
          src={
            profileImage
              ? `${localUrl}/${profileImage}`
              : "/images/icons/avatar.jpg"
          }
          alt="player picture"
          className={styles["profile-image"]}
        />

        <div className={styles["name-container"]}>
          <h2>{`${selectedTrainer?.[0]?.fname} ${selectedTrainer?.[0]?.lname}`}</h2>
          <h4>Eğitmen</h4>
          <div className={styles.reviews}>
            {Number(selectedTrainer?.[0]?.averagereviewscore) > 0 &&
              generateStars(selectedTrainer?.[0]?.averagereviewscore).map(
                (star, index) => <span key={index}>{star}</span>
              )}
            {Number(selectedTrainer?.[0]?.averagereviewscore) > 0 && (
              <p className={styles["reviews-text"]}>
                {selectedTrainer?.[0]?.reviewscorecount} değerlendirme
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Yaş</th>
                  <th>Cinsiyet</th>
                  <th>Konum</th>
                  <th>Kulüp</th>
                  <th>Seviye</th>
                  <th>Ders</th>
                  <th>Öğrenci</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles["player-row"]}>
                  <td>{getAge(Number(selectedTrainer?.[0]?.birth_year))}</td>
                  <td>{selectedTrainer?.[0]?.gender}</td>
                  <td>{selectedTrainer?.[0]?.location_name}</td>
                  <td>
                    {selectedTrainer?.[0]?.employment_status === "accepted"
                      ? selectedTrainer?.[0]?.club_name
                      : "Bağımsız"}
                  </td>
                  <td>{selectedTrainer?.[0]?.trainer_experience_type_name}</td>
                  <td>{selectedTrainer?.[0]?.lessoncount}</td>
                  <td>{selectedTrainer?.[0]?.studentcount}</td>
                </tr>
              </tbody>
            </table>
            <div className={styles["buttons-container"]}>
              <button
                onClick={() =>
                  handleToggleFavourite(selectedTrainer?.[0]?.user_id)
                }
                className={styles["interaction-button"]}
              >
                {isTrainerInMyFavourites(selectedTrainer?.[0]?.user_id)
                  ?.is_active === true
                  ? "Favorilerden çıkar"
                  : "Favorilere ekle"}
              </button>
              {isUserPlayer && (
                <button
                  onClick={() =>
                    handleOpenLessonModal(selectedTrainer?.[0]?.user_id)
                  }
                  className={styles["interaction-button"]}
                >
                  Ders al
                </button>
              )}
              {isUserPlayer && (
                <p>
                  {isStudentPending() ? (
                    ""
                  ) : isStudentAccepted() ? (
                    <button
                      onClick={() =>
                        handleDeclineStudent(selectedTrainer?.[0]?.user_id)
                      }
                      className={styles["cancel-student-button"]}
                    >
                      Öğrenciliği sil
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleAddStudent(selectedTrainer?.[0]?.user_id)
                      }
                      className={styles["interaction-button"]}
                    >
                      Öğrenci Ol
                    </button>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        {isStudentPending() && (
          <p className={styles["pending-confirmation-text"]}>
            Öğrencilik için eğitmen onayı bekleniyor
          </p>
        )}
      </div>

      <SlOptions className={styles.icon} />
      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={user_id}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
    </div>
  );
};
export default ExploreTrainersInteractionSection;

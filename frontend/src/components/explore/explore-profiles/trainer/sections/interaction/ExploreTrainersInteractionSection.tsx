import React, { useEffect, useState } from "react";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import styles from "./styles.module.scss";
import PageLoading from "../../../../../../components/loading/PageLoading";
import { useAppSelector } from "../../../../../../store/hooks";
import { IoStar } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../../api/endpoints/FavouritesApi";
import {
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
  useUpdateStudentMutation,
} from "../../../../../../../api/endpoints/StudentsApi";
import { Trainer } from "../../../../../../../api/endpoints/TrainersApi";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";
import MessageModal from "../../../../../messages/modals/message-modal/MessageModal";
import StudentApplicationModal from "../../../../../../components/lesson/studentship-modal/StudentApplicationModal";
import { useTranslation } from "react-i18next";

interface ExploreTrainersInteractionSectionProps {
  user_id: number;
  selectedTrainer: Trainer;
}
export const ExploreTrainersInteractionSection = (
  props: ExploreTrainersInteractionSectionProps
) => {
  const { user_id, selectedTrainer } = props;

  const { t } = useTranslation();

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

  const [messageModal, setMessageModal] = useState(false);

  const handleOpenMessageModal = () => {
    setMessageModal(true);
  };

  const closeMessageModal = () => {
    setMessageModal(false);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavouriteTrainers();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      handleCloseStudentApplicationModal();
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
          <h4>{t("userTypeTrainer")}</h4>
          <div className={styles.reviews}>
            {Number(selectedTrainer?.[0]?.averagereviewscore) > 0 &&
              generateStars(selectedTrainer?.[0]?.averagereviewscore).map(
                (star, index) => <span key={index}>{star}</span>
              )}
            {Number(selectedTrainer?.[0]?.averagereviewscore) > 0 && (
              <p className={styles["reviews-text"]}>
                {selectedTrainer?.[0]?.reviewscorecount} {t("reviews")}
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
                  <th>{t("tableAgeHeader")}</th>
                  <th>{t("tableGenderHeader")}</th>
                  <th>{t("tableLocationHeader")}</th>
                  <th>{t("tableClubHeader")}</th>
                  <th>{t("tableLevelHeader")}</th>
                  <th>{t("tableLessonHeader")}</th>
                  <th>{t("students")}</th>
                  <th>{t("tablePriceHeader")}</th>
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
                      : t("trainerIndependent")}
                  </td>
                  <td>
                    {selectedTrainer?.[0]?.trainer_experience_type_id === 1
                      ? t("trainerLevelBeginner")
                      : selectedTrainer?.[0]?.trainer_experience_type_id === 2
                      ? t("trainerLevelIntermediate")
                      : selectedTrainer?.[0]?.trainer_experience_type_id === 3
                      ? t("trainerLevelAdvanced")
                      : t("trainerLevelProfessional")}
                  </td>
                  <td>{selectedTrainer?.[0]?.lessoncount}</td>
                  <td>{selectedTrainer?.[0]?.studentcount}</td>
                  <td>
                    {selectedTrainer?.[0]?.price_hour
                      ? `${selectedTrainer?.[0]?.price_hour} TL`
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles["buttons-container"]}>
              <div className={styles.icons}>
                {isTrainerInMyFavourites(selectedTrainer?.[0]?.user_id)
                  ?.is_active === true ? (
                  <AiFillStar
                    className={styles["remove-fav-icon"]}
                    onClick={() =>
                      handleToggleFavourite(selectedTrainer?.[0]?.user_id)
                    }
                  />
                ) : (
                  <AiOutlineStar
                    className={styles["add-fav-icon"]}
                    onClick={() =>
                      handleToggleFavourite(selectedTrainer?.[0]?.user_id)
                    }
                  />
                )}
                <FiMessageSquare
                  className={styles.message}
                  onClick={handleOpenMessageModal}
                />
              </div>
              <div className={styles["interaction-buttons"]}>
                {isUserPlayer && (
                  <button
                    onClick={() =>
                      handleOpenLessonModal(selectedTrainer?.[0]?.user_id)
                    }
                    className={styles["interaction-button"]}
                  >
                    {t("tableLessonInviteButtonText")}
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
                        className={styles["interaction-button"]}
                      >
                        {t("tableDeleteStudentshipButtonText")}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleOpenStudentApplicationModal(
                            selectedTrainer?.[0]?.user_id,
                            selectedTrainer?.[0]?.fname,
                            selectedTrainer?.[0]?.lname,
                            selectedTrainer?.[0]?.image
                          )
                        }
                        className={styles["interaction-button"]}
                      >
                        {t("studentshipApply")}
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {isStudentPending() && (
          <p className={styles["pending-confirmation-text"]}>
            {t("studentshipApprovalAwaiting")}
          </p>
        )}
      </div>
      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={user_id}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {messageModal && (
        <MessageModal
          messageModal={messageModal}
          closeMessageModal={closeMessageModal}
          recipient_id={selectedTrainer?.[0]?.user_id}
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
export default ExploreTrainersInteractionSection;

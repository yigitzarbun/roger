import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../api/endpoints/FavouritesApi";
import { handleToggleFavourite } from "../../../common/util/UserDataFunctions";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import paths from "../../../routing/Paths";
import { getAge } from "../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../components/invite/lesson/form/LessonInviteFormModal";
import { useUpdateStudentMutation } from "../../../api/endpoints/StudentsApi";
import { useTranslation } from "react-i18next";

interface PlayerTrainersResultsProps {
  playerTrainers: any;
  handleTrainerPage: (e: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  user: any;
  currentPage: number;
  refetchPlayerTrainers: () => void;
}
const PlayerTrainersResults = (props: PlayerTrainersResultsProps) => {
  const {
    playerTrainers,
    handleTrainerPage,
    handleNextPage,
    handlePrevPage,
    user,
    currentPage,
    refetchPlayerTrainers,
  } = props;
  const { t } = useTranslation();
  console.log(playerTrainers);
  const {
    data: myFavouriteTrainers,
    isLoading: isMyFavouritesLoading,
    refetch,
  } = useGetFavouritesByFilterQuery({ favouriter_id: user?.user?.user_id });

  const isTrainerInMyFavourites = (user_id: number) => {
    return myFavouriteTrainers?.find(
      (trainer) => trainer.favouritee_id === user_id
    );
  };
  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const pageNumbers = [];

  for (let i = 1; i <= playerTrainers?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const [opponentUserId, setOpponentUserId] = useState(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const handleOpenLessonModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const handleDeclineStudent = (
    selectedTrainerId: number,
    studentId: number
  ) => {
    const updatedStudentData = {
      student_id: studentId,
      student_status: "declined",
      trainer_id: selectedTrainerId,
      player_id: user?.user?.user_id,
    };
    updateStudent(updatedStudentData);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    if (isUpdateStudentSuccess) {
      refetchPlayerTrainers();
    }
  }, [isUpdateStudentSuccess]);
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>{t("myTrainersTitle")}</h2>
        </div>
        {playerTrainers?.totalPages > 1 && (
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

      {playerTrainers?.trainers?.length === 0 && (
        <p>
          Aradığınız kritere göre eğitmen bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}

      {playerTrainers?.trainers?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("tableFavouriteHeader")}</th>
              <th>{t("tableTrainerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tablePriceHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableAgeHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableStudentshipHeader")}</th>
              <th>{t("tableLessonHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {playerTrainers?.trainers?.map((trainer) => (
              <tr
                key={trainer.trainer_user_id}
                className={styles["trainer-row"]}
              >
                <td
                  onClick={() =>
                    handleToggleFavourite(
                      trainer.trainer_user_id,
                      isTrainerInMyFavourites,
                      updateFavourite,
                      myFavouriteTrainers,
                      user,
                      addFavourite
                    )
                  }
                >
                  {isTrainerInMyFavourites(trainer.trainer_user_id)
                    ?.is_active === true ? (
                    <AiFillStar className={styles["remove-fav-icon"]} />
                  ) : (
                    <AiOutlineStar className={styles["add-fav-icon"]} />
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer.trainer_user_id} `}
                  >
                    <img
                      src={
                        trainer.trainerImage
                          ? trainer.trainerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={trainer.trainer_fname}
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer.trainer_user_id} `}
                    className={styles["trainer-name"]}
                  >
                    <p>{`${trainer.trainer_fname} ${trainer.trainer_lname}`}</p>
                  </Link>
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
                <td>
                  {trainer?.employment_status === "accepted" &&
                  trainer?.club_name
                    ? trainer?.club_name
                    : "Bağımsız"}
                </td>
                <td>{trainer?.price_hour} TL</td>
                <td>{trainer.gender === "female" ? t("female") : t("male")}</td>
                <td>{getAge(trainer.trainer_birth_year)}</td>
                <td>{trainer?.location_name}</td>
                <td>
                  <button
                    onClick={() =>
                      handleDeclineStudent(
                        trainer.trainer_user_id,
                        trainer.student_id
                      )
                    }
                    className={styles["cancel-student-button"]}
                  >
                    {t("tableDeleteStudentshipButtonText")}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleOpenLessonModal(trainer?.trainer_user_id)
                    }
                    className={styles["lesson-button"]}
                  >
                    {t("tableLessonInviteButtonText")}
                  </button>
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
            onClick={() => handleTrainerPage(pageNumber)}
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
      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={true}
          isUserTrainer={false}
        />
      )}
    </div>
  );
};
export default PlayerTrainersResults;

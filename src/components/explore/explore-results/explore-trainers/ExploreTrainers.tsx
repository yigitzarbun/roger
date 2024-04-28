import React, { useEffect, useState, ChangeEvent } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaFilter } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import PageLoading from "../../../../components/loading/PageLoading";

import { getAge } from "../../../../common/util/TimeFunctions";

import { User } from "../../../../store/slices/authSlice";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { useGetPaginatedTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { TrainerExperienceType } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import {
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
  useUpdateStudentMutation,
} from "../../../../api/endpoints/StudentsApi";
import { ClubStaff } from "../../../../api/endpoints/ClubStaffApi";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { handleToggleFavourite } from "../../../../common/util/UserDataFunctions";
import LessonInviteFormModal from "../../../../components/invite/lesson/form/LessonInviteFormModal";
import ExploreTrainersFilterModal from "./explore-trainers-filter/ExploreTrainersFilterModal";

interface ExploreTrainersProps {
  user: User;
  locations: Location[];
  trainerExperienceTypes: TrainerExperienceType[];
  clubStaff: ClubStaff[];
  clubs: Club[];
  isLocationsLoading: boolean;
  isTrainerExperienceTypesLoading: boolean;
  isClubStaffLoading: boolean;
  isClubsLoading: boolean;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTrainerExperience: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClubId: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  locationId: number;
  textSearch: string;
  gender: string;
  trainerExperienceTypeId: number;
  clubId: number;
}
const ExploreTrainers = (props: ExploreTrainersProps) => {
  const {
    user,
    locations,
    trainerExperienceTypes,
    clubs,
    isLocationsLoading,
    isTrainerExperienceTypesLoading,
    isClubStaffLoading,
    isClubsLoading,
    handleTextSearch,
    handleLocation,
    handleGender,
    handleTrainerExperience,
    handleClubId,
    handleClear,
    locationId,
    textSearch,
    gender,
    trainerExperienceTypeId,
    clubId,
  } = props;

  const [opponentUserId, setOpponentUserId] = useState(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const handleOpenLessonModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsLessonModalOpen(true);
  };
  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const [isTrainerFilterModalOpen, setIsTrainerFilterModalOpen] =
    useState(false);
  const handleOpenTrainerFilterModal = () => {
    setIsTrainerFilterModalOpen(true);
  };
  const handleCloseTrainerFilterModal = () => {
    setIsTrainerFilterModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedTrainers,
    isLoading: isPaginatedTrainersLoading,
    refetch: refetchPaginatedTrainers,
  } = useGetPaginatedTrainersQuery({
    currentPage: currentPage,
    trainerExperienceTypeId: trainerExperienceTypeId,
    textSearch: textSearch,
    selectedGender: gender,
    locationId: locationId,
    clubId: clubId,
    currentUserId: user?.user?.user_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= paginatedTrainers?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleTrainerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % paginatedTrainers?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedTrainers?.totalPages) %
        paginatedTrainers?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

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

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

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
  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchPaginatedTrainers();
  }, [
    currentPage,
    locationId,
    textSearch,
    gender,
    trainerExperienceTypeId,
    clubId,
  ]);
  console.log(paginatedTrainers);
  if (
    isLocationsLoading ||
    isTrainerExperienceTypesLoading ||
    isMyFavouritesLoading ||
    isClubStaffLoading ||
    isClubsLoading ||
    isPaginatedTrainersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Eğitmenleri Keşfet</h2>
          {paginatedTrainers?.trainers?.length > 0 && (
            <FaFilter
              onClick={handleOpenTrainerFilterModal}
              className={
                trainerExperienceTypeId > 0 ||
                textSearch !== "" ||
                gender !== "" ||
                locationId > 0 ||
                clubId > 0
                  ? styles["active-filter"]
                  : styles.filter
              }
            />
          )}
        </div>
        {paginatedTrainers?.totalPages > 1 && (
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

      {paginatedTrainers?.trainers?.length === 0 && (
        <p>
          Aradığınız kritere göre eğitmen bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}

      {paginatedTrainers?.trainers?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Kulüp</th>
              <th>Ücret</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th>{isUserPlayer ? "Ders" : ""}</th>
              <th>{isUserPlayer ? "Öğrencilik" : ""}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrainers?.trainers?.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td
                  onClick={() =>
                    handleToggleFavourite(
                      trainer.user_id,
                      isTrainerInMyFavourites,
                      updateFavourite,
                      myFavouriteTrainers,
                      user,
                      addFavourite
                    )
                  }
                >
                  {isTrainerInMyFavourites(trainer.user_id)?.is_active ===
                  true ? (
                    <AiFillStar className={styles["remove-fav-icon"]} />
                  ) : (
                    <AiOutlineStar className={styles["add-fav-icon"]} />
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                  >
                    <img
                      src={
                        trainer.trainerImage
                          ? trainer.trainerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={trainer.fname}
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                    className={styles["trainer-name"]}
                  >
                    <p> {`${trainer.fname} ${trainer.lname}`}</p>
                  </Link>
                </td>
                <td>{trainer?.trainer_experience_type_name}</td>
                <td>
                  {trainer?.employment_status === "accepted" &&
                  trainer?.club_name
                    ? trainer?.club_name
                    : "Bağımsız"}
                </td>
                <td>{trainer?.price_hour} TL</td>
                <td>{trainer.gender}</td>
                <td>{getAge(trainer.birth_year)}</td>
                <td>{trainer?.location_name}</td>

                <td>
                  {isUserPlayer && (
                    <button
                      onClick={() => handleOpenLessonModal(trainer?.user_id)}
                      className={styles["lesson-button"]}
                    >
                      Ders al
                    </button>
                  )}
                </td>
                {isUserPlayer && (
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
                )}

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
            onClick={handleTrainerPage}
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
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {isTrainerFilterModalOpen && (
        <ExploreTrainersFilterModal
          isTrainerFilterModalOpen={isTrainerFilterModalOpen}
          handleCloseTrainerFilterModal={handleCloseTrainerFilterModal}
          locations={locations}
          handleLocation={handleLocation}
          handleClear={handleClear}
          locationId={locationId}
          handleTextSearch={handleTextSearch}
          textSearch={textSearch}
          handleTrainerExperience={handleTrainerExperience}
          trainerExperienceTypeId={trainerExperienceTypeId}
          trainerExperienceTypes={trainerExperienceTypes}
          handleGender={handleGender}
          gender={gender}
          handleClubId={handleClubId}
          clubId={clubId}
          clubs={clubs}
        />
      )}
    </div>
  );
};

export default ExploreTrainers;

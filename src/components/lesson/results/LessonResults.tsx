import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetFavouritesQuery } from "../../../api/endpoints/FavouritesApi";
import { useGetClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import {
  useAddStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../api/endpoints/StudentsApi";

interface TrainSearchProps {
  trainerLevelId: number;
  trainerPrice: number;
  gender: string;
  locationId: number;
  clubId: number;
  favourite: boolean;
}

const LessonResults = (props: TrainSearchProps) => {
  const {
    trainerLevelId,
    trainerPrice,
    gender,
    locationId,
    clubId,
    favourite,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: trainers,
    isLoading: isTrainersLoading,
    isError,
  } = useGetTrainersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: istrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: favourites, isLoading: isFavouritesLoading } =
    useGetFavouritesQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsQuery({});

  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const handleAddStudent = (selectedTrainerId: number) => {
    const selectedStudent = students?.find(
      (student) =>
        student.trainer_id === selectedTrainerId &&
        student.player_id === user?.user?.user_id &&
        (student.student_status === "pending" ||
          student.student_status === "accepted")
    );
    if (!selectedStudent) {
      const newStudentData = {
        student_status: "pending",
        trainer_id: selectedTrainerId,
        player_id: user?.user?.user_id,
      };
      addStudent(newStudentData);
    }
  };

  const handleDeclineStudent = (selectedTrainerId: number) => {
    const selectedStudent = students?.find(
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
  const myFavourites = favourites?.filter(
    (favourite) =>
      favourite.favouriter_id === user?.user?.user_id &&
      favourite.is_active === true
  );

  const trainerLevelValue = Number(trainerLevelId) ?? null;
  const selectedGenderValue = gender ?? "";
  const locationIdValue = Number(locationId) ?? null;
  const clubIdValue = Number(clubId) ?? null;
  const trainerPriceValue = Number(trainerPrice) ?? null;

  const today = new Date();
  const year = today.getFullYear();

  const filteredTrainers =
    trainers &&
    trainers
      .filter((trainer) => trainer.user_id !== user.user.user_id)
      .filter((trainer) => {
        if (
          trainerLevelValue === 0 &&
          selectedGenderValue === "" &&
          locationIdValue === 0 &&
          clubIdValue === 0 &&
          trainerPriceValue === 0 &&
          favourite !== true
        ) {
          return trainer;
        } else if (
          (trainerLevelValue === trainer.trainer_experience_type_id ||
            trainerLevelValue === 0) &&
          (selectedGenderValue === trainer.gender ||
            selectedGenderValue === "") &&
          (locationIdValue === trainer.location_id || locationIdValue === 0) &&
          ((clubIdValue === trainer.club_id &&
            clubStaff?.find((staff) => staff.user_id === trainer.user_id) &&
            clubStaff?.find((staff) => staff.user_id === trainer.user_id)
              ?.employment_status === "accepted") ||
            clubIdValue === 0) &&
          (trainerPriceValue <= trainer.price_hour ||
            trainerPriceValue === 100) &&
          ((favourite === true &&
            myFavourites.find(
              (favourite) => favourite.favouritee_id === trainer.user_id
            )) ||
            favourite !== true)
        ) {
          return trainer;
        }
      });

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  if (
    isLocationsLoading ||
    istrainerExperienceTypesLoading ||
    isClubsLoading ||
    isFavouritesLoading ||
    isClubStaffLoading ||
    isStudentsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Ders</h2>
      </div>
      {isTrainersLoading && <p>Yükleniyor...</p>}
      {isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}
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
              <th>Fiyat (saat / TL)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  <img
                    src={
                      trainer.image ? trainer.image : "/images/icons/avatar.png"
                    }
                    alt={trainer.name}
                    className={styles["trainer-image"]}
                  />
                </td>
                <td>{`${trainer.fname} ${trainer.lname}`}</td>
                <td>
                  {clubStaff?.find(
                    (staff) =>
                      staff.user_id === trainer.user_id &&
                      staff.employment_status === "accepted"
                  )
                    ? clubs?.find((club) => club.club_id === trainer.club_id)
                        ?.club_name
                    : "Bağımsız"}
                </td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (trainer_experience_type) =>
                        trainer_experience_type.trainer_experience_type_id ===
                        trainer.trainer_experience_type_id
                    ).trainer_experience_type_name
                  }
                </td>
                <td>{trainer.gender}</td>
                <td>{year - Number(trainer.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === trainer.location_id
                    ).location_name
                  }
                </td>
                <td>{parseFloat(trainer.price_hour).toFixed(2)}</td>
                <td>
                  <Link
                    to={paths.LESSON_INVITE}
                    state={{
                      fname: trainer.fname,
                      lname: trainer.lname,
                      image: trainer.image,
                      court_price: "",
                      user_id: trainer.user_id,
                    }}
                    className={styles["accept-button"]}
                  >
                    Davet gönder
                  </Link>
                </td>
                <td>
                  {students?.find(
                    (student) =>
                      student.player_id === user?.user?.user_id &&
                      student.trainer_id === trainer.user_id &&
                      student.student_status === "pending"
                  ) ? (
                    "Öğrencilik için eğitmen onayı bekleniyor"
                  ) : students?.find(
                      (student) =>
                        student.player_id === user?.user?.user_id &&
                        student.trainer_id === trainer.user_id &&
                        student.student_status === "accepted"
                    ) ? (
                    <button
                      onClick={() => handleDeclineStudent(trainer.user_id)}
                    >
                      Öğrenciliği sil
                    </button>
                  ) : (
                    <button onClick={() => handleAddStudent(trainer.user_id)}>
                      Öğrenci Ol
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LessonResults;

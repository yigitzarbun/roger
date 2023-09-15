import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";

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

  const {
    data: trainerFavouriters,
    isLoading: isTrainerFavouritersLoading,
    refetch: refetchTrainerFavourites,
  } = useGetFavouritesByFilterQuery({
    favouritee_id: Number(user_id),
    is_active: true,
  });

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
      refetchTrainerFavourites();
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
    isTrainerFavouritersLoading ||
    isStudentsLoading ||
    isTrainerStudentsLoading ||
    isMyFavouriteTrainersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["interaction-section"]}>
      <h2>Favoriler ve Öğrenciler</h2>
      <p>{`${trainerFavouriters?.length} kişi favorilere ekledi`}</p>
      <p>{`${trainerStudents?.length} öğrencisi var`}</p>
      <div className={styles["buttons-container"]}>
        <button
          onClick={() => handleToggleFavourite(selectedTrainer?.[0]?.user_id)}
          className={styles["interaction-button"]}
        >
          {isTrainerInMyFavourites(selectedTrainer?.[0]?.user_id)?.is_active ===
          true
            ? "Favorilerden çıkar"
            : "Favorilere ekle"}
        </button>
        {isUserPlayer && (
          <Link
            to={paths.LESSON_INVITE}
            state={{
              fname: selectedTrainer?.[0]?.fname,
              lname: selectedTrainer?.[0]?.lname,
              image: selectedTrainer?.[0]?.image,
              court_price: "",
              user_id: selectedTrainer?.[0]?.user_id,
            }}
            className={styles["accept-button"]}
          >
            <button className={styles["interaction-button"]}>Ders al</button>
          </Link>
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
                onClick={() => handleAddStudent(selectedTrainer?.[0]?.user_id)}
                className={styles["interaction-button"]}
              >
                Öğrenci Ol
              </button>
            )}
          </p>
        )}
      </div>
      {isStudentPending() && (
        <p className={styles["pending-confirmation-text"]}>
          Öğrencilik için eğitmen onayı bekleniyor
        </p>
      )}
    </div>
  );
};
export default ExploreTrainersInteractionSection;

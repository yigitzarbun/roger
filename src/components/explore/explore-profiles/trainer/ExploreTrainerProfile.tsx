import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import {
  useAddStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../../api/endpoints/StudentsApi";
import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

interface ExploreTrainerProfileProps {
  user_id: string;
}
const ExploreTrainerProfile = (props: ExploreTrainerProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const selectedTrainer = trainers?.find(
    (trainer) => trainer.user_id === Number(user_id)
  );

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsQuery({});

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const trainerBookings = bookings?.filter(
    (booking) =>
      booking.booking_status_type_id === 5 &&
      (booking.inviter_id === selectedTrainer.user_id ||
        booking.invitee_id === selectedTrainer.user_id)
  );

  const trainerReviewsReceived = eventReviews?.filter(
    (review) =>
      review.booking_id ===
        trainerBookings.find(
          (booking) => booking.booking_id === review.booking_id
        )?.booking_id && review.reviewer_id !== selectedTrainer?.user_id
  );

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

  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

  const trainerFavouriters = favourites?.filter(
    (favourite) =>
      favourite.favouritee_id === Number(user_id) &&
      favourite.is_active === true
  )?.length;

  const myFavouriteTrainers = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );

  const isTrainerInMyFavourites = (user_id: number) => {
    if (
      myFavouriteTrainers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouriteTrainers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === true
      )
    ) {
      return true;
    }
    return false;
  };

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

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    if (isAddStudentSuccess || isUpdateStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess, isUpdateStudentSuccess]);

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isTrainerEmploymentTypesLoading ||
    isFavouritesLoading ||
    isClubStaffLoading ||
    isStudentsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Eğitmen</h3>
          <img
            src={
              selectedTrainer?.picture
                ? selectedTrainer?.picture
                : "/images/icons/avatar.png"
            }
            alt="trainer_picture"
            className={styles["trainer-image"]}
          />
          <h2>{`${selectedTrainer?.fname} ${selectedTrainer.lname}`}</h2>
          <p>{selectedTrainer?.trainer_bio_description}</p>
          <p>{selectedTrainer?.gender}</p>
          <p>{selectedTrainer?.birth_year}</p>
          <p>
            {
              trainerExperienceTypes?.find(
                (type) =>
                  type.trainer_experience_type_id ===
                  selectedTrainer?.trainer_experience_type_id
              )?.trainer_experience_type_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) =>
                  location.location_id === selectedTrainer?.location_id
              )?.location_name
            }
          </p>
          <p>
            {
              trainerEmploymentTypes?.find(
                (type) =>
                  type.trainer_employment_type_id ===
                  selectedTrainer?.trainer_employment_type_id
              )?.trainer_employment_type_name
            }
          </p>
          <p>
            {trainerEmploymentTypes?.find(
              (type) =>
                type.trainer_employment_type_id ===
                selectedTrainer?.trainer_employment_type_id
            )?.trainer_employment_type_id !== 1 &&
            clubStaff?.find(
              (staff) =>
                staff.user_id === selectedTrainer?.user_id &&
                staff.employment_status === "accepted"
            )
              ? clubs?.find((club) => club.club_id === selectedTrainer?.club_id)
                  ?.club_name
              : "Bağlı olduğu kulüp bulunmamaktadır."}
          </p>
          <p>{`${selectedTrainer?.price_hour} TL / Saat`}</p>
        </div>
        <div className={styles["subscription-section"]}>
          <h3>Favoriler</h3>
          <p>{`${trainerFavouriters} kişi favorilere ekledi`}</p>
          <button
            onClick={() => handleToggleFavourite(selectedTrainer?.user_id)}
          >
            {isTrainerInMyFavourites(selectedTrainer?.user_id) === true
              ? "Favorilerden çıkar"
              : "Favorilere ekle"}
          </button>
          {isUserPlayer && (
            <Link
              to={paths.LESSON_INVITE}
              state={{
                fname: selectedTrainer.fname,
                lname: selectedTrainer.lname,
                image: selectedTrainer.image,
                court_price: "",
                user_id: selectedTrainer.user_id,
              }}
              className={styles["accept-button"]}
            >
              <button>Ders al</button>
            </Link>
          )}
          {students?.find(
            (student) =>
              student.player_id === user?.user?.user_id &&
              student.trainer_id === selectedTrainer.user_id &&
              student.student_status === "pending"
          ) ? (
            "Öğrencilik için eğitmen onayı bekleniyor"
          ) : students?.find(
              (student) =>
                student.player_id === user?.user?.user_id &&
                student.trainer_id === selectedTrainer.user_id &&
                student.student_status === "accepted"
            ) ? (
            <button
              onClick={() => handleDeclineStudent(selectedTrainer.user_id)}
            >
              Öğrenciliği sil
            </button>
          ) : (
            <button onClick={() => handleAddStudent(selectedTrainer.user_id)}>
              Öğrenci Ol
            </button>
          )}
        </div>
      </div>
      <div className={styles["middle-sections-container"]}>
        <div className={styles["reviews-section"]}>
          <h3>Oyuncu Hakkında Değerlendirmeler</h3>
          {trainerReviewsReceived?.map((review) => (
            <div
              className={styles["review-container"]}
              key={review.event_review_id}
            >
              <h4>{review.event_review_title}</h4>
              <p>{review.event_review_description}</p>
              <p>{`${review.review_score}/10`}</p>
              <Link to={`${paths.EXPLORE_PROFILE}1/${review.reviewer_id}`}>{`${
                players.find((player) => player.user_id === review.reviewer_id)
                  ?.fname
              } ${
                players.find((player) => player.user_id === review.reviewer_id)
                  ?.lname
              }`}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ExploreTrainerProfile;

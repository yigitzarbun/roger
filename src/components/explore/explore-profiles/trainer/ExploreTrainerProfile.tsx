import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

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

import { useAppSelector } from "../../../../store/hooks";

interface ExploreTrainerProfileProps {
  user_id: string;
}
const ExploreTrainerProfile = (props: ExploreTrainerProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

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
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

  const trainerFavouriters = favourites?.filter(
    (favourite) =>
      favourite.favouritee_id === Number(user_id) && favourite.isActive === true
  )?.length;

  const myFavouriteTrainers = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );

  const isTrainerInMyFavourites = (user_id: number) => {
    if (
      myFavouriteTrainers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.isActive === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouriteTrainers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.isActive === true
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
      isActive: true,
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
      isActive: selectedFavourite.isActive === true ? false : true,
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

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isTrainerEmploymentTypesLoading ||
    isFavouritesLoading ||
    isClubStaffLoading
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
        </div>
      </div>
    </div>
  );
};
export default ExploreTrainerProfile;

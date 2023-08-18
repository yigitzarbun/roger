import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { Trainer } from "../../../../api/endpoints/TrainersApi";
import { TrainerExperienceType } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { ClubStaff } from "../../../../api/endpoints/ClubStaffApi";
import { Club } from "../../../../api/endpoints/ClubsApi";

interface ExploreTrainersProps {
  user: User;
  trainers: Trainer[];
  locations: Location[];
  trainerExperienceTypes: TrainerExperienceType[];
  clubStaff: ClubStaff[];
  clubs: Club[];
  isTrainersLoading: boolean;
  isLocationsLoading: boolean;
  isTrainerExperienceTypesLoading: boolean;
  isClubStaffLoading: boolean;
  isClubsLoading: boolean;
}
const ExploreTrainers = (props: ExploreTrainersProps) => {
  const {
    user,
    trainers,
    locations,
    trainerExperienceTypes,
    clubStaff,
    clubs,
    isTrainersLoading,
    isLocationsLoading,
    isTrainerExperienceTypesLoading,
    isClubStaffLoading,
    isClubsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
    isUserClub = user.user.user_type_id === 3;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

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

  if (
    isTrainersLoading ||
    isLocationsLoading ||
    isTrainerExperienceTypesLoading ||
    isFavouritesLoading ||
    isClubStaffLoading ||
    isClubsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Eğitmenleri Keşfet</h2>
      </div>
      {trainers && trainers.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {trainers && trainers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Kulüp</th>
              <th>Ücret (Saat / TL)</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  <img
                    src={
                      trainer.image ? trainer.image : "/images/icons/avatar.png"
                    }
                    alt={trainer.fname}
                    className={styles["trainer-image"]}
                  />
                </td>
                <td>{`${trainer.fname} ${trainer.lname}`}</td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (type) =>
                        type.trainer_experience_type_id ===
                        trainer.trainer_experience_type_id
                    ).trainer_experience_type_name
                  }
                </td>
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
                <td>{trainer?.price_hour}</td>
                <td>{trainer.gender}</td>
                <td>{year - Number(trainer.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === trainer.location_id
                    ).location_name
                  }
                </td>
                {isUserPlayer && (
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
                    >
                      Derse davet et
                    </Link>
                  </td>
                )}
                {trainer.user_id !== user?.user?.user_id ? (
                  <td onClick={() => handleToggleFavourite(trainer.user_id)}>
                    {isTrainerInMyFavourites(trainer.user_id) === true
                      ? "Favorilerden çıkar"
                      : "Favorilere ekle"}
                  </td>
                ) : (
                  "(Kendi profilim)"
                )}
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}>
                    Görüntüle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExploreTrainers;

import React, { useEffect } from "react";

import styles from "./styles.module.scss";

import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";

import { useAppSelector } from "../../../../../../store/hooks";
import PageLoading from "../../../../../../components/loading/PageLoading";

interface ExploreClubsFavouritesSectionProps {
  user_id: number;
  selectedClub: Club[];
}
const ExploreClubsFavouritesSection = (
  props: ExploreClubsFavouritesSectionProps
) => {
  const { user_id, selectedClub } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubFavouriters,
    isLoading: isClubFavouritersLoading,
    refetch: favouritesRefetch,
  } = useGetFavouritesByFilterQuery({
    favouritee_id: selectedClub?.[0]?.user_id,
    is_active: true,
  });

  const { refetch: refetchAllFavourites } = useGetFavouritesQuery({});

  const {
    data: myFavouriteClubs,
    isLoading: isMyFavouriteClubsLoading,
    refetch: refetchMyFavouriteClubs,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
    favouritee_id: Number(selectedClub?.[0]?.user_id),
  });

  const isClubInMyFavourites = myFavouriteClubs?.find(
    (club) =>
      club.favouritee_id === Number(selectedClub?.[0]?.user_id) &&
      club.favouriter_id === user?.user?.user_id
  );
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
    const selectedFavourite = myFavouriteClubs?.find(
      (favourite) => favourite.favouritee_id === userId
    );
    const favouriteData = {
      favourite_id: selectedFavourite?.favourite_id,
      registered_at: selectedFavourite?.registered_at,
      is_active: selectedFavourite?.is_active === true ? false : true,
      favouriter_id: selectedFavourite?.favouriter_id,
      favouritee_id: selectedFavourite?.favouritee_id,
    };
    updateFavourite(favouriteData);
  };

  const handleToggleFavourite = (userId: number) => {
    if (isClubInMyFavourites) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      favouritesRefetch();
      refetchMyFavouriteClubs();
      refetchAllFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (isClubFavouritersLoading || isMyFavouriteClubsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["favourites-section"]}>
      <h2>Favoriler</h2>
      <p>{`${clubFavouriters?.length} kişi favorilere ekledi`}</p>
      <button onClick={() => handleToggleFavourite(selectedClub?.[0]?.user_id)}>
        {isClubInMyFavourites?.is_active === true
          ? "Favorilerden çıkar"
          : "Favorilere ekle"}
      </button>
    </div>
  );
};
export default ExploreClubsFavouritesSection;

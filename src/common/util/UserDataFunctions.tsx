export const handleUpdateFavourite = (
  userId: number,
  updateFavourite,
  myFavouritePlayers
) => {
  const selectedFavourite = myFavouritePlayers?.find(
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

export const handleAddFavourite = (
  favouritee_id: number,
  user,
  addFavourite
) => {
  const favouriteData = {
    is_active: true,
    favouriter_id: user?.user?.user_id,
    favouritee_id: favouritee_id,
  };
  addFavourite(favouriteData);
};

export const handleToggleFavourite = (
  userId: number,
  isPlayerInMyFavourites,
  updateFavourite,
  myFavouritePlayers,
  user,
  addFavourite
) => {
  if (isPlayerInMyFavourites(userId)) {
    handleUpdateFavourite(userId, updateFavourite, myFavouritePlayers);
  } else {
    handleAddFavourite(userId, user, addFavourite);
  }
};

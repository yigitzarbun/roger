import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";
import { SlOptions } from "react-icons/sl";
import { IoIosCheckmarkCircle } from "react-icons/io";

import { localUrl } from "../../../../../../common/constants/apiConstants";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";

import { useAppSelector } from "../../../../../../store/hooks";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetPlayerByUserIdQuery } from "../../../../../../api/endpoints/PlayersApi";
import SubscribeToClubModal from "../../../../../../components/explore/subscribe-club-modal/SubscribeToClubModal";
import { useNavigate } from "react-router-dom";
import Paths from "../../../../../../routing/Paths";

interface ExploreClubsProfileSectionProps {
  selectedClub: any;
}
const ExploreClubsProfileSection = (props: ExploreClubsProfileSectionProps) => {
  const { selectedClub } = props;
  const navigate = useNavigate();
  const user = useAppSelector((store) => store?.user?.user);
  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const profileImage = selectedClub?.[0]?.clubImage;

  const {
    data: isUserSubscribedToClub,
    isLoading: isUserSubscribedLoading,
    refetch: refetchIsSubscribed,
  } = useGetClubSubscriptionsByFilterQuery({
    club_id: selectedClub?.[0]?.user_id,
    is_active: true,
    player_id: user?.user?.user_id,
  });

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const playerPaymentDetailsExist =
    currentPlayer?.[0]?.name_on_card &&
    currentPlayer?.[0]?.card_number &&
    currentPlayer?.[0]?.cvc &&
    currentPlayer?.[0]?.card_expiry;

  const navigateToPayment = () => {
    navigate(Paths.PROFILE);
  };
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const handleOpenSubscribeModal = () => {
    setOpenSubscribeModal(true);
  };
  const handleCloseSubscribeModal = () => {
    setOpenSubscribeModal(false);
  };

  const { refetch: refetchAllFavourites } = useGetFavouritesQuery({});

  const {
    data: myFavouriteClubs,
    isLoading: isMyFavouriteClubsLoading,
    refetch: refetchMyFavouriteClubs,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
    favouritee_id: Number(selectedClub?.[0]?.user_id),
  });

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
    if (myFavouriteClubs?.length > 0) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavouriteClubs();
      refetchAllFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchIsSubscribed();
  }, [openSubscribeModal]);

  useEffect(() => {
    refetchAllFavourites();
    refetchMyFavouriteClubs();
  }, []);

  if (
    isMyFavouriteClubsLoading ||
    isUserSubscribedLoading ||
    isCurrentPlayerLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["profile-section"]}>
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
          <h2>{selectedClub?.[0]?.club_name} </h2>
          <h4>Kulüp</h4>
          <address>{selectedClub?.[0]?.club_address}</address>
        </div>
      </div>
      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Konum</th>
                  <th>Tür</th>
                  <th>Kort</th>
                  <th>Eğitmen</th>
                  <th>Üye</th>
                  <th>Üyelik Paketi</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles["player-row"]}>
                  <td>{selectedClub?.[0]?.location_name}</td>
                  <td>{selectedClub?.[0]?.club_type_name}</td>
                  <td>{selectedClub?.[0]?.courtcount}</td>
                  <td>{selectedClub?.[0]?.staffcount}</td>
                  <td>{selectedClub?.[0]?.subscriberscount}</td>
                  <td>{selectedClub?.[0]?.subscriptionpackagecount}</td>
                </tr>
              </tbody>
            </table>
            <div className={styles["buttons-container"]}>
              {selectedClub?.[0]?.user_id !== user?.user?.user_id && (
                <button
                  onClick={() =>
                    handleToggleFavourite(selectedClub?.[0]?.user_id)
                  }
                  className={styles["interaction-button"]}
                  disabled={selectedClub?.[0]?.user_id === user?.user?.user_id}
                >
                  {myFavouriteClubs?.[0]?.is_active === true
                    ? "Favorilerden çıkar"
                    : "Favorilere ekle"}
                </button>
              )}

              {isUserPlayer &&
                selectedClub?.[0]?.subscriptionpackagecount > 0 &&
                isUserSubscribedToClub?.length === 0 &&
                playerPaymentDetailsExist && (
                  <button
                    onClick={handleOpenSubscribeModal}
                    className={styles["interaction-button"]}
                  >
                    Üye Ol
                  </button>
                )}
              {isUserPlayer &&
                selectedClub?.[0]?.subscriptionpackagecount > 0 &&
                isUserSubscribedToClub?.length === 0 &&
                !playerPaymentDetailsExist && (
                  <button
                    onClick={navigateToPayment}
                    className={styles["interaction-button"]}
                  >
                    Üye olmak için kart bilgilerini ekle
                  </button>
                )}
              {isUserTrainer && (
                <button className={styles["interaction-button"]}>
                  İş Başvurusu Yap
                </button>
              )}
            </div>
            {isUserPlayer && isUserSubscribedToClub?.length > 0 && (
              <div className={styles["subscribed-container"]}>
                <IoIosCheckmarkCircle className={styles.done} />
                <p className={styles["subscribed-text"]}>Üyelik var</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <SlOptions className={styles.icon} />
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClub?.[0]?.user_id}
        />
      )}
    </div>
  );
};

export default ExploreClubsProfileSection;

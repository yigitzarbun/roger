import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { FiMessageSquare } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import PageLoading from "../../../../../../components/loading/PageLoading";
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
import {
  useGetPlayerByUserIdQuery,
  useGetPlayerProfileDetailsQuery,
} from "../../../../../../api/endpoints/PlayersApi";
import SubscribeToClubModal from "../../../../../../components/explore/subscribe-club-modal/SubscribeToClubModal";
import { useNavigate } from "react-router-dom";
import Paths from "../../../../../../routing/Paths";
import { useGetIsTrainerClubStaffQuery } from "../../../../../../api/endpoints/ClubStaffApi";
import ClubEmploymentModal from "../../../../../../components/explore/explore-results/explore-clubs/employment-modal/ClubEmploymentModal";
import MessageModal from "../../../../../messages/modals/message-modal/MessageModal";
import AddPlayerCardDetails from "../../../../../../components/profile/player/card-payments/add-card-details/AddPlayerCardDetails";

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
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

  const [paymentModal, setPaymentModal] = useState(false);

  const handleOpenPaymentModal = () => {
    setPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModal(false);
  };

  const {
    data: isTrainerStaff,
    isLoading: isTrainerStaffLoading,
    refetch: refetchIsTrainerStaff,
  } = useGetIsTrainerClubStaffQuery({
    clubId: selectedClub?.[0]?.club_id,
    trainerUserId: user?.user?.user_id,
  });

  const {
    data: isUserSubscribedToClub,
    isLoading: isUserSubscribedLoading,
    refetch: refetchIsSubscribed,
  } = useGetClubSubscriptionsByFilterQuery({
    club_id: selectedClub?.[0]?.user_id,
    is_active: true,
    player_id: user?.user?.user_id,
  });

  const {
    data: currentPlayer,
    isLoading: isCurrentPlayerLoading,
    refetch: refetchCurrentPlayer,
  } = useGetPlayerByUserIdQuery(user?.user?.user_id);

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
  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);

  const openEmploymentModal = () => {
    setEmploymentModalOpen(true);
  };

  const closeEmploymentModal = () => {
    setEmploymentModalOpen(false);
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

  const isClublayerInMyFavourites = (user_id: number) => {
    return myFavouriteClubs?.find((club) => club.favouritee_id === user_id);
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
    if (isClublayerInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const [messageModal, setMessageModal] = useState(false);
  const handleOpenMessageModal = () => {
    setMessageModal(true);
  };
  const closeMessageModal = () => {
    setMessageModal(false);
  };

  useEffect(() => {
    refetchCurrentPlayer();
  }, [paymentModal]);

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
    refetchIsTrainerStaff();
  }, [employmentModalOpen]);

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
              <div className={styles.icons}>
                {isClublayerInMyFavourites(selectedClub?.[0]?.user_id)
                  ?.is_active === true ? (
                  <AiFillStar
                    className={styles["remove-fav-icon"]}
                    onClick={() =>
                      handleToggleFavourite(selectedClub?.[0]?.user_id)
                    }
                  />
                ) : (
                  <AiOutlineStar
                    className={styles["add-fav-icon"]}
                    onClick={() =>
                      handleToggleFavourite(selectedClub?.[0]?.user_id)
                    }
                  />
                )}
                <FiMessageSquare
                  className={styles.message}
                  onClick={handleOpenMessageModal}
                />
              </div>
              <div className={styles["interaction-buttons"]}>
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
                      onClick={handleOpenPaymentModal}
                      className={styles["interaction-button"]}
                    >
                      Üye olmak için kart bilgilerini ekle
                    </button>
                  )}
                {(isUserTrainer &&
                  (!isTrainerStaff ||
                    isTrainerStaff?.length === 0 ||
                    isTrainerStaff?.[0]?.employment_status === "declined")) ||
                isTrainerStaff?.[0]?.employment_status ===
                  "terminated_by_club" ? (
                  <button
                    onClick={openEmploymentModal}
                    className={styles["interaction-button"]}
                  >
                    İş Başvurusu Yap
                  </button>
                ) : isUserTrainer &&
                  isTrainerStaff?.[0]?.employment_status === "accepted" ? (
                  <p className={styles.accepted}>Bu kulüpte çalışıyorsun</p>
                ) : isUserTrainer &&
                  isTrainerStaff?.[0]?.employment_status === "pending" ? (
                  <p className={styles.pending}>Başvurun henüz yanıtlanmadı</p>
                ) : (
                  ""
                )}
              </div>
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
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClub?.[0]?.user_id}
        />
      )}
      {openEmploymentModal && (
        <ClubEmploymentModal
          employmentModalOpen={employmentModalOpen}
          closeEmploymentModal={closeEmploymentModal}
          selectedClub={selectedClub?.[0]}
        />
      )}
      {messageModal && (
        <MessageModal
          messageModal={messageModal}
          closeMessageModal={closeMessageModal}
          recipient_id={selectedClub?.[0]?.user_id}
        />
      )}
      {paymentModal && (
        <AddPlayerCardDetails
          isModalOpen={paymentModal}
          handleCloseModal={handleClosePaymentModal}
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={playerPaymentDetailsExist}
        />
      )}
    </div>
  );
};

export default ExploreClubsProfileSection;

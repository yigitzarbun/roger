import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { Club } from "../../../../../../api/endpoints/ClubsApi";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";
import {
  Player,
  useGetPlayersQuery,
} from "../../../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../../../../api/endpoints/LocationsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";
import { useGetClubExternalMembersByFilterQuery } from "../../../../../../api/endpoints/ClubExternalMembersApi";
import { useGetUsersQuery } from "../../../../../../store/auth/apiSlice";
import { currentYear } from "../../../../../../common/util/TimeFunctions";

interface ExploreClubSubscribersModalProps {
  isSubscribersModalOpen: boolean;
  closeSubscribersModal: () => void;
  selectedClub: Club;
  selectedClubSubscribers: Player[];
}

const ExploreClubSubscribersModal = (
  props: ExploreClubSubscribersModalProps
) => {
  const {
    isSubscribersModalOpen,
    closeSubscribersModal,
    selectedClub,
    selectedClubSubscribers,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: clubExternalMembers, isLoading: isClubExternalMembersLoading } =
    useGetClubExternalMembersByFilterQuery({
      is_active: true,
      club_id: selectedClub?.[0]?.club_id,
    });

  const {
    data: myFavourites,
    isLoading: isMyFavouritesLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
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
    const selectedFavourite = myFavourites?.find(
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
    if (myFavourites?.find((favourite) => favourite.favouritee_id === userId)) {
      console.log("update");
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
      console.log("add");
    }
  };

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const isSubscriberPlayer = (user_id: number) => {
    return users?.find((user) => user.user_id === user_id)?.user_type_id === 1
      ? true
      : false;
  };

  const isSubscriberExternalMember = (user_id: number) => {
    return users?.find((user) => user.user_id === user_id)?.user_type_id === 5
      ? true
      : false;
  };

  const selectedPlayer = (user_id: number) => {
    return players?.find((player) => player.user_id === user_id);
  };

  const selectedExternalMember = (user_id: number) => {
    return clubExternalMembers?.find((member) => member.user_id === user_id);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isLocationsLoading ||
    isMyFavouritesLoading ||
    isClubExternalMembersLoading ||
    isUsersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isSubscribersModalOpen}
      onRequestClose={closeSubscribersModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Üyeler</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeSubscribersModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["table-container"]}>
        {(selectedClubSubscribers + clubExternalMembers)?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>İsim</th>
                <th>Yaş</th>
                <th>Cinsiyet</th>
                <th>Seviye</th>
                <th>Konum</th>
                <th>Üye Türü</th>
              </tr>
            </thead>
            <tbody>
              {selectedClubSubscribers?.map((subscriber) => (
                <tr key={subscriber.player_id}>
                  <td>
                    {myFavourites?.find(
                      (favourite) =>
                        favourite.favouritee_id === subscriber.player_id &&
                        favourite.is_active === true
                    ) &&
                    subscriber.player_id !== user?.user?.user_id &&
                    isSubscriberPlayer(subscriber.player_id) ? (
                      <AiFillStar
                        onClick={() =>
                          handleToggleFavourite(subscriber.player_id)
                        }
                        className={styles["remove-fav-icon"]}
                      />
                    ) : subscriber.player_id !== user?.user?.user_id &&
                      !myFavourites?.find(
                        (favourite) =>
                          favourite.favouritee_id === subscriber.player_id &&
                          favourite.is_active === true
                      ) &&
                      isSubscriberPlayer(subscriber.player_id) ? (
                      <AiOutlineStar
                        onClick={() =>
                          handleToggleFavourite(subscriber.player_id)
                        }
                        className={styles["add-fav-icon"]}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {selectedPlayer(subscriber.player_id) ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${subscriber.player_id}`}
                      >
                        <img
                          src={
                            selectedPlayer(subscriber.player_id)?.image
                              ? `${localUrl}/${
                                  selectedPlayer(subscriber.player_id)?.image
                                }`
                              : "/images/icons/avatar.png"
                          }
                          alt="subscriber picture"
                          className={styles["subscriber-image"]}
                        />
                      </Link>
                    ) : (
                      <img
                        src="/images/icons/avatar.png"
                        alt="subscriber picture"
                        className={styles["subscriber-image"]}
                      />
                    )}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id) ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${subscriber.player_id}`}
                        className={styles["subscriber-name"]}
                      >
                        {`${selectedPlayer(subscriber.player_id)?.fname}
                        ${selectedPlayer(subscriber.player_id)?.lname}`}
                      </Link>
                    ) : (
                      `${selectedExternalMember(subscriber.player_id)?.fname} ${
                        selectedExternalMember(subscriber.player_id)?.lname
                      }`
                    )}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id)
                      ? currentYear -
                        selectedPlayer(subscriber.player_id)?.birth_year
                      : isSubscriberExternalMember(subscriber.player_id)
                      ? currentYear -
                        selectedExternalMember(subscriber.player_id)?.birth_year
                      : ""}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id)
                      ? selectedPlayer(subscriber.player_id)?.gender
                      : isSubscriberExternalMember(subscriber.player_id)
                      ? selectedExternalMember(subscriber.player_id)?.gender
                      : ""}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id)
                      ? playerLevels?.find(
                          (level) =>
                            level.player_level_id ===
                            selectedPlayer(subscriber.player_id)
                              ?.player_level_id
                        )?.player_level_name
                      : isSubscriberExternalMember(subscriber.player_id)
                      ? playerLevels?.find(
                          (level) =>
                            level.player_level_id ===
                            selectedExternalMember(subscriber.player_id)
                              ?.player_level_id
                        )?.player_level_name
                      : ""}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id)
                      ? locations?.find(
                          (location) =>
                            location.location_id ===
                            selectedPlayer(subscriber.player_id)?.location_id
                        )?.location_name
                      : isSubscriberExternalMember(subscriber.player_id)
                      ? locations?.find(
                          (location) =>
                            location.location_id ===
                            selectedExternalMember(subscriber.player_id)
                              ?.location_id
                        )?.location_name
                      : ""}
                  </td>
                  <td>
                    {isSubscriberPlayer(subscriber.player_id)
                      ? "Oyuncu"
                      : isSubscriberExternalMember(subscriber.player_id)
                      ? "Harici Üye"
                      : "Diğer"}
                  </td>
                  {isUserPlayer && isSubscriberPlayer(subscriber.player_id) && (
                    <td>
                      {subscriber.player_id !== user?.user?.user_id && (
                        <Link
                          to={paths.TRAIN_INVITE}
                          state={{
                            fname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.fname,
                            lname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.lname,
                            image: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.image,
                            court_price: "",
                            user_id: subscriber?.user_id,
                          }}
                          className={styles["training-button"]}
                        >
                          Antreman yap
                        </Link>
                      )}
                    </td>
                  )}
                  {isUserPlayer && isSubscriberPlayer(subscriber.player_id) && (
                    <td>
                      {subscriber.player_id !== user?.user?.user_id && (
                        <Link
                          to={paths.MATCH_INVITE}
                          state={{
                            fname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.fname,
                            lname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.lname,
                            image: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.image,
                            court_price: "",
                            user_id: subscriber?.user_id,
                          }}
                          className={styles["match-button"]}
                        >
                          Maç yap
                        </Link>
                      )}
                    </td>
                  )}
                  {isUserTrainer &&
                    isSubscriberPlayer(subscriber.player_id) && (
                      <td>
                        <Link
                          to={paths.LESSON_INVITE}
                          state={{
                            fname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.fname,
                            lname: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.lname,
                            image: players?.find(
                              (player) =>
                                player.user_id === subscriber.player_id
                            )?.image,
                            court_price: "",
                            user_id: subscriber?.user_id,
                          }}
                          className={styles["match-button"]}
                        >
                          Derse davet et
                        </Link>
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz kulübe ait kort bulunmamaktadır</p>
        )}
      </div>
    </ReactModal>
  );
};

export default ExploreClubSubscribersModal;

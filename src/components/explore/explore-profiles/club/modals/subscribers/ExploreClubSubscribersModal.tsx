import React from "react";

import ReactModal from "react-modal";

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

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const date = new Date();
  const currentYear = date.getFullYear();

  if (isPlayersLoading || isPlayerLevelsLoading || isLocationsLoading) {
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
        {selectedClubSubscribers?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>İsim</th>
                <th>Yaş</th>
                <th>Cinsiyet</th>
                <th>Seviye</th>
                <th>Konum</th>
              </tr>
            </thead>
            <tbody>
              {selectedClubSubscribers.map((subscriber) => (
                <tr key={subscriber.user_id}>
                  <td>
                    <img
                      src={
                        players?.find(
                          (player) => player.user_id === subscriber.player_id
                        )?.image
                          ? `${localUrl}/${
                              players?.find(
                                (player) =>
                                  player.user_id === subscriber.player_id
                              )?.image
                            }`
                          : "/images/icons/avatar.png"
                      }
                      alt="subscriber picture"
                      className={styles["subscriber-image"]}
                    />
                  </td>
                  <td>{`${
                    players?.find(
                      (player) => player.user_id === subscriber.player_id
                    )?.fname
                  } ${
                    players?.find(
                      (player) => player.user_id === subscriber.player_id
                    )?.lname
                  }`}</td>
                  <td>
                    {currentYear -
                      players.find(
                        (player) => player.user_id === subscriber.player_id
                      )?.birth_year}
                  </td>
                  <td>
                    {
                      players?.find(
                        (player) => player.user_id === subscriber.player_id
                      )?.gender
                    }
                  </td>
                  <td>
                    {
                      playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.player_level_id
                      )?.player_level_name
                    }
                  </td>
                  <td>
                    {
                      locations?.find(
                        (location) =>
                          location.location_id ===
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.location_id
                      )?.location_name
                    }
                  </td>
                  <td>
                    <button>Anterman Yap</button>
                  </td>
                  <td>
                    <button>Maç Yap</button>
                  </td>
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

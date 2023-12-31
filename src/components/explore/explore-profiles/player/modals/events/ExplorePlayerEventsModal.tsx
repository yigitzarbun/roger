import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../loading/PageLoading";

import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import { StudentGroup } from "../../../../../../api/endpoints/StudentGroupsApi";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../../../api/endpoints/EventTypesApi";
import { useGetMatchScoresQuery } from "../../../../../../api/endpoints/MatchScoresApi";
import { useGetUsersQuery } from "../../../../../../store/auth/apiSlice";

interface ExplorePlayerEventsModalProps {
  isEventsModalOpen: boolean;
  closeEventsModal: () => void;
  playerBookings: Booking[];
  playerGroups: StudentGroup[];
  selectedPlayer: Player;
  players: Player[];
  trainers: Trainer[];
  clubs: Club[];
}

const ExplorePlayerEventsModal = (props: ExplorePlayerEventsModalProps) => {
  const {
    isEventsModalOpen,
    closeEventsModal,
    playerBookings,
    playerGroups,
    selectedPlayer,
    players,
    trainers,
    clubs,
  } = props;

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: matchScores, isLoading: isMatchScoresLoading } =
    useGetMatchScoresQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const player = (user_id: number) => {
    return players?.find((player) => player.user_id === user_id);
  };

  const trainer = (user_id: number) => {
    return trainers?.find((trainer) => trainer.user_id === user_id);
  };

  const club = (user_id: number) => {
    return clubs?.find((club) => club.user_id === user_id);
  };

  const playerGroup = (user_id: number) => {
    return playerGroups?.find((group) => group.user_id === user_id);
  };
  const matchScore = (booking_id: number) => {
    return matchScores?.find((score) => score.booking_id === booking_id);
  };

  const matchWinner = (booking_id: number) => {
    return matchScores?.find(
      (score) =>
        score.booking_id === booking_id &&
        score.match_score_status_type_id === 3
    );
  };

  if (isEventTypesLoading || isMatchScoresLoading || isUsersLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isEventsModalOpen}
      onRequestClose={closeEventsModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Geçmiş Etkinlikler</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeEventsModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["table-container"]}>
        {playerBookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Oyuncu</th>
                <th>Eğitmen</th>
                <th>Tür</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Skor</th>
                <th>Kazanan</th>
              </tr>
            </thead>
            <tbody>
              {playerBookings?.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1
                          ? 1
                          : booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : booking.event_type_id === 6
                          ? 3
                          : ""
                      }/${
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 6
                          ? playerGroup(booking.invitee_id)?.club_id
                          : booking.inviter_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_id
                          : booking.invitee_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.inviter_id
                            )?.user_id
                          : ""
                      }`}
                      onClick={closeEventsModal}
                    >
                      <img
                        src={
                          (booking.event_type_id === 1 ||
                            booking.event_type_id === 2) &&
                          booking.inviter_id === selectedPlayer?.[0]?.user_id &&
                          player(booking.invitee_id)?.image
                            ? `${localUrl}/${player(booking.invitee_id)?.image}`
                            : (booking.event_type_id === 1 ||
                                booking.event_type_id === 2) &&
                              booking.invitee_id ===
                                selectedPlayer?.[0]?.user_id &&
                              player(booking.inviter_id)?.image
                            ? `${localUrl}/${player(booking.inviter_id)?.image}`
                            : booking.event_type_id === 3 &&
                              booking.inviter_id ===
                                selectedPlayer?.[0]?.user_id &&
                              trainer(booking.invitee_id)?.image
                            ? `${localUrl}/${
                                trainer(booking.invitee_id)?.image
                              }`
                            : booking.event_type_id === 3 &&
                              booking.invitee_id ===
                                selectedPlayer?.[0]?.user_id &&
                              trainer(booking.inviter_id)?.image
                            ? `${localUrl}/${
                                trainer(booking.inviter_id)?.image
                              }`
                            : booking.event_type_id === 6 &&
                              club(playerGroup(booking.invitee_id)?.club_id)
                                ?.image
                            ? `${localUrl}/${
                                club(playerGroup(booking.invitee_id)?.club_id)
                                  ?.image
                              }`
                            : "/images/icons/avatar.png"
                        }
                        className={styles["event-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1
                          ? 1
                          : booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : booking.event_type_id === 6
                          ? 3
                          : ""
                      }/${
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 6
                          ? playerGroup(booking.invitee_id)?.club_id
                          : booking.inviter_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_id
                          : booking.invitee_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.inviter_id
                            )?.user_id
                          : ""
                      }`}
                      className={styles["opponent-name"]}
                    >
                      {(booking.event_type_id === 1 ||
                        booking.event_type_id === 2) &&
                      booking.inviter_id === selectedPlayer?.[0]?.user_id
                        ? `${player(booking.invitee_id)?.fname} ${
                            player(booking.invitee_id)?.lname
                          }`
                        : (booking.event_type_id === 1 ||
                            booking.event_type_id === 2) &&
                          booking.invitee_id === selectedPlayer?.[0]?.user_id
                        ? `${player(booking.inviter_id)?.fname} ${
                            player(booking.inviter_id)?.lname
                          }`
                        : booking.event_type_id === 6
                        ? playerGroup(booking.invitee_id)?.student_group_name
                        : "-"}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1
                          ? 1
                          : booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : booking.event_type_id === 6
                          ? 2
                          : ""
                      }/${
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 6
                          ? playerGroup(booking.invitee_id)?.trainer_id
                          : booking.inviter_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_id
                          : booking.invitee_id === selectedPlayer?.[0]?.user_id
                          ? users?.find(
                              (user) => user.user_id === booking.inviter_id
                            )?.user_id
                          : ""
                      }`}
                      className={styles["opponent-name"]}
                    >
                      {booking.event_type_id === 3 &&
                      booking.inviter_id === selectedPlayer?.[0]?.user_id
                        ? `${trainer(booking.invitee_id)?.fname}
                      ${trainer(booking.invitee_id)?.lname}
                      `
                        : booking.event_type_id === 3 &&
                          booking.invitee_id === selectedPlayer?.[0]?.user_id
                        ? `${trainer(booking.inviter_id)?.fname}
                      ${trainer(booking.inviter_id)?.lname}
                      `
                        : booking.event_type_id === 6
                        ? `${
                            trainer(playerGroup(booking.invitee_id)?.trainer_id)
                              ?.fname
                          } ${
                            trainer(playerGroup(booking.invitee_id)?.trainer_id)
                              ?.lname
                          }`
                        : "-"}
                    </Link>
                  </td>
                  <td>
                    {
                      eventTypes?.find(
                        (type) => type.event_type_id === booking.event_type_id
                      )?.event_type_name
                    }
                  </td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>
                    {booking.event_type_id === 2 &&
                    matchWinner(booking.booking_id)
                      ? `${
                          matchScore(booking.booking_id)
                            ?.inviter_first_set_games_won
                        }/${
                          matchScore(booking.booking_id)
                            ?.invitee_first_set_games_won
                        } ${
                          matchScore(booking.booking_id)
                            ?.inviter_second_set_games_won
                        }/${
                          matchScore(booking.booking_id)
                            ?.invitee_second_set_games_won
                        } ${
                          matchScore(booking.booking_id)
                            ?.inviter_third_set_games_won
                            ? matchScore(booking.booking_id)
                                ?.inviter_third_set_games_won + "/"
                            : ""
                        }${
                          matchScore(booking.booking_id)
                            ?.invitee_third_set_games_won
                            ? matchScore(booking.booking_id)
                                ?.invitee_third_set_games_won
                            : ""
                        }`
                      : "-"}
                  </td>
                  <td>
                    {booking.event_type_id === 2 &&
                    matchWinner(booking.booking_id)
                      ? `${
                          player(matchWinner(booking.booking_id)?.winner_id)
                            ?.fname
                        } ${
                          player(matchWinner(booking.booking_id)?.winner_id)
                            ?.lname
                        }`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz tamamlanan etkinlik bulunmamaktadır.</p>
        )}
      </div>
    </ReactModal>
  );
};
export default ExplorePlayerEventsModal;

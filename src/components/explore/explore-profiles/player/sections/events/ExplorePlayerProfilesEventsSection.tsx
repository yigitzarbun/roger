import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import ExplorePlayerEventsModal from "../../modals/events/ExplorePlayerEventsModal";

import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../../../api/endpoints/EventTypesApi";
import { useGetTrainersQuery } from "../../../../../../api/endpoints/TrainersApi";
import { useGetMatchScoresQuery } from "../../../../../../api/endpoints/MatchScoresApi";
import { useGetUsersQuery } from "../../../../../../store/auth/apiSlice";
import {
  Player,
  useGetPlayersQuery,
} from "../../../../../../api/endpoints/PlayersApi";
import { StudentGroup } from "../../../../../../api/endpoints/StudentGroupsApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../../../../components/loading/PageLoading";

interface ExplorePlayerProfilesEventsSectionProps {
  playerBookings: Booking[];
  selectedPlayer: Player;
  playerGroups: StudentGroup[];
  clubs: Club[];
}
const ExplorePlayerProfilesEventsSection = (
  props: ExplorePlayerProfilesEventsSectionProps
) => {
  const { playerBookings, selectedPlayer, playerGroups, clubs } = props;

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: matchScores, isLoading: isMatchScoresLoading } =
    useGetMatchScoresQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const [isEventsModalOpen, setIsEventModalOpen] = useState(false);
  const openEventsModal = () => {
    setIsEventModalOpen(true);
  };
  const closeEventsModal = () => {
    setIsEventModalOpen(false);
  };

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

  if (
    isPlayersLoading ||
    isUsersLoading ||
    isTrainersLoading ||
    isMatchScoresLoading ||
    isEventTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["events-section"]}>
      <h2>Geçmiş Etkinlikler</h2>
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
            {playerBookings
              ?.slice(playerBookings.length - 4)
              ?.map((booking) => (
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
      <button onClick={openEventsModal}>Tümünü Görüntüle</button>
      <ExplorePlayerEventsModal
        isEventsModalOpen={isEventsModalOpen}
        closeEventsModal={closeEventsModal}
        playerBookings={playerBookings}
        playerGroups={playerGroups}
        selectedPlayer={selectedPlayer}
        players={players}
        trainers={trainers}
        clubs={clubs}
      />
    </div>
  );
};

export default ExplorePlayerProfilesEventsSection;

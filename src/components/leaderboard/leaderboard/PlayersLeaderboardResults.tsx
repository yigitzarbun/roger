import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";
import { useGetMatchScoresQuery } from "../../../api/endpoints/MatchScoresApi";
import PageLoading from "../../../components/loading/PageLoading";

const PlayersLeaderboardResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: matchScores, isLoading: isMatchScoresLoading } =
    useGetMatchScoresQuery({});

  const date = new Date();
  const currentYear = date.getFullYear();

  const userGender = players?.find(
    (player) => player?.user_id === user?.user?.user_id
  )?.gender;

  const calculateRank = (player) => {
    if (player.totalMatches === 0) {
      return -1;
    }
    return player.wonMatches - player.lostMatches + player.drawMatches * 0.5;
  };

  let rankedPlayersList = [];

  players
    ?.filter((player) => player.gender === (userGender && userGender))
    ?.forEach((player) => {
      const playerStats = {
        id: player.user_id,
        rank: null,
        image: player.image,
        name: `${player.fname} ${player.lname}`,
        level: playerLevels?.find(
          (level) => level.player_level_id === player.player_level_id
        )?.player_level_name,
        location: locations?.find(
          (location) => location.location_id === player.location_id
        )?.location_name,
        gender: player.gender,
        age: Number(currentYear) - player.birth_year,
        totalMatches: bookings?.filter(
          (booking) =>
            (booking.inviter_id === player.user_id ||
              booking.invitee_id === player.user_id) &&
            booking.event_type_id === 2 &&
            matchScores?.find(
              (match) => match.booking_id === booking.booking_id
            )?.match_score_status_type_id === 3
        ).length,
        wonMatches: bookings?.filter(
          (booking) =>
            (booking.inviter_id === player.user_id ||
              booking.invitee_id === player.user_id) &&
            booking.event_type_id === 2 &&
            matchScores?.find(
              (match) =>
                match.booking_id === booking.booking_id &&
                match.winner_id === player.user_id
            )?.match_score_status_type_id === 3
        ).length,
        lostMatches: bookings?.filter(
          (booking) =>
            (booking.inviter_id === player.user_id ||
              booking.invitee_id === player.user_id) &&
            booking.event_type_id === 2 &&
            matchScores?.find(
              (match) =>
                match.booking_id === booking.booking_id &&
                match.winner_id !== player.user_id
            )?.match_score_status_type_id === 3
        ).length,
        drawMatches: bookings?.filter(
          (booking) =>
            (booking.inviter_id === player.user_id ||
              booking.invitee_id === player.user_id) &&
            booking.event_type_id === 2 &&
            matchScores?.find(
              (match) =>
                match.booking_id === booking.booking_id &&
                match.winner_id === null
            )?.match_score_status_type_id === 3
        ).length,
      };
      rankedPlayersList.push(playerStats);
    });

  rankedPlayersList.sort((a, b) => {
    const performanceMetricA = calculateRank(a);
    const performanceMetricB = calculateRank(b);

    if (performanceMetricA !== performanceMetricB) {
      return performanceMetricB - performanceMetricA; // Higher value gets higher rank
    } else {
      // If performance metrics are equal, prioritize the player with more matches
      return b.totalMatches - a.totalMatches;
    }
  });

  rankedPlayersList.forEach((player, index) => {
    player.rank = index + 1;
  });

  if (
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isLocationsLoading ||
    isBookingsLoading ||
    isMatchScoresLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Lidrelik Tablosu</h2>
      <table>
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>Sıralama</th>
            <th>İsim</th>
            <th>Seviye</th>
            <th>Konum</th>
            <th>Cinsiyet</th>
            <th>Yaş</th>
            <th>Toplam Maç</th>
            <th>W</th>
            <th>L</th>
            <th>D</th>
          </tr>
        </thead>
        {rankedPlayersList?.length > 0 && (
          <tbody>
            {rankedPlayersList.map((player) => (
              <tr key={player.id} className={styles["player-row"]}>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${player.id}`}>
                    <img
                      src={
                        player.image ? player.image : "/images/icons/avatar.png"
                      }
                      alt={player.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>{player.rank}</td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${player.id}`}
                    className={styles["player-name"]}
                  >
                    {player.name}
                  </Link>
                </td>
                <td>{player.level}</td>
                <td>{player.location}</td>
                <td>{player.gender}</td>
                <td>{player.age}</td>
                <td>{player.totalMatches}</td>
                <td className={styles["win-count"]}>{player.wonMatches}</td>
                <td className={styles["lost-count"]}>{player.lostMatches}</td>
                <td className={styles["draw-count"]}>{player.drawMatches}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default PlayersLeaderboardResults;

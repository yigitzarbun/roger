import React, { useState } from "react";
import { Link } from "react-router-dom";
import paths from "../../../../../../routing/Paths";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import styles from "./styles.module.scss";
import ExplorePlayerEventsModal from "../../modals/events/ExplorePlayerEventsModal";
import { useGetUserProfileEventsQuery } from "../../../../../../../api/endpoints/BookingsApi";
import { Player } from "../../../../../../../api/endpoints/PlayersApi";
import PageLoading from "../../../../../../components/loading/PageLoading";
import Paths from "../../../../../../routing/Paths";
import { useTranslation } from "react-i18next";

interface ExplorePlayerProfilesEventsSectionProps {
  selectedPlayer: Player;
}
const ExplorePlayerProfilesEventsSection = (
  props: ExplorePlayerProfilesEventsSectionProps
) => {
  const { selectedPlayer } = props;

  const { t } = useTranslation();

  const { data: playerBookings, isLoading: isPlayerBookingsLoading } =
    useGetUserProfileEventsQuery(selectedPlayer?.user_id);
  console.log(playerBookings);
  const [isEventsModalOpen, setIsEventModalOpen] = useState(false);

  const openEventsModal = () => {
    setIsEventModalOpen(true);
  };

  const closeEventsModal = () => {
    setIsEventModalOpen(false);
  };

  if (isPlayerBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["events-section"]}>
      <h2>{t("pastEventsTitle")}</h2>
      {playerBookings?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("user")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableScoreHeader")}</th>
              <th>{t("tableWinnerHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {playerBookings
              ?.slice(playerBookings.length - 4)
              ?.map((booking) => (
                <tr key={booking.booking_id} className={styles["opponent-row"]}>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1
                          ? 1
                          : booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 7
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : ""
                      }/${
                        booking.inviter_id === selectedPlayer?.user_id
                          ? booking.invitee_id
                          : booking.invitee_id === selectedPlayer?.user_id
                          ? booking.inviter_id
                          : ""
                      }`}
                    >
                      <img
                        src={
                          (booking.event_type_id === 1 ||
                            booking.event_type_id === 2 ||
                            booking.event_type_id === 7) &&
                          booking.playerImage
                            ? `${imageUrl}/${booking.playerImage}`
                            : booking.event_type_id === 3 &&
                              booking.trainerImage
                            ? `${imageUrl}/${booking.trainerImage}`
                            : "/images/icons/avatar.jpg"
                        }
                        className={styles["opponent-image"]}
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
                          : ""
                      }/${
                        booking.inviter_id === selectedPlayer?.user_id
                          ? booking.invitee_id
                          : booking.invitee_id === selectedPlayer?.user_id
                          ? booking.inviter_id
                          : ""
                      }`}
                      className={styles["opponent-name"]}
                    >
                      {booking?.fname
                        ? `${booking?.fname} ${booking?.lname}`
                        : booking?.playerFname
                        ? `${booking?.playerFname} ${booking?.playerLname}`
                        : "-"}
                    </Link>
                  </td>
                  <td>{booking.club_name}</td>
                  <td>
                    {booking?.event_type_id === 1
                      ? t("training")
                      : booking?.event_type_id === 2
                      ? t("match")
                      : booking?.event_type_id === 3
                      ? t("lesson")
                      : booking?.event_type_id === 4
                      ? t("externalTraining")
                      : booking?.event_type_id === 5
                      ? t("externalLesson")
                      : booking?.event_type_id === 6
                      ? t("groupLesson")
                      : booking?.event_type_id === 7
                      ? t("tournamentMatch")
                      : ""}
                  </td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>
                    {booking.event_type_id === 2 &&
                    booking.match_score_status_type_id === 3
                      ? `${booking?.inviter_first_set_games_won}/${
                          booking?.invitee_first_set_games_won
                        } ${booking?.inviter_second_set_games_won}/${
                          booking?.invitee_second_set_games_won
                        } ${
                          booking?.inviter_third_set_games_won
                            ? booking?.inviter_third_set_games_won + "/"
                            : ""
                        }${
                          booking?.invitee_third_set_games_won
                            ? booking?.invitee_third_set_games_won
                            : ""
                        }`
                      : "-"}
                  </td>
                  <td>
                    {booking.event_type_id === 2 &&
                    booking.winner_id &&
                    booking.match_score_status_type_id === 3 &&
                    booking?.winner_id === selectedPlayer?.user_id ? (
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}1/${selectedPlayer?.user_id}`}
                        className={styles["opponent-name"]}
                      >
                        {`${selectedPlayer?.fname} ${selectedPlayer?.lname}`}
                      </Link>
                    ) : booking.event_type_id === 2 &&
                      booking.winner_id &&
                      booking.match_score_status_type_id === 3 &&
                      booking?.winner_id !== selectedPlayer?.user_id ? (
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}1/${booking?.winner_id}`}
                        className={styles["opponent-name"]}
                      >{`${booking?.winner_fname} ${booking.winner_lname}`}</Link>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>{t("calendarEmptyText")}</p>
      )}
      {playerBookings?.length > 0 && (
        <button onClick={openEventsModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

      {isEventsModalOpen && (
        <ExplorePlayerEventsModal
          isEventsModalOpen={isEventsModalOpen}
          closeEventsModal={closeEventsModal}
          playerBookings={playerBookings}
          selectedPlayer={selectedPlayer}
        />
      )}
    </div>
  );
};

export default ExplorePlayerProfilesEventsSection;

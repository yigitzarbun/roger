import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { Player } from "../../../../../../api/endpoints/PlayersApi";

interface ExplorePlayerEventsModalProps {
  isEventsModalOpen: boolean;
  closeEventsModal: () => void;
  playerBookings: any;
  selectedPlayer: Player;
}

const ExplorePlayerEventsModal = (props: ExplorePlayerEventsModalProps) => {
  const {
    isEventsModalOpen,
    closeEventsModal,
    playerBookings,
    selectedPlayer,
  } = props;
  return (
    <ReactModal
      isOpen={isEventsModalOpen}
      onRequestClose={closeEventsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEventsModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>Geçmiş Etkinlikler</h1>
        </div>
        <div className={styles["table-container"]}>
          {playerBookings?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Üye</th>
                  <th>İsim</th>
                  <th>Konum</th>
                  <th>Tür</th>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Skor</th>
                  <th>Kazanan</th>
                </tr>
              </thead>
              <tbody>
                {playerBookings?.map((booking) => (
                  <tr
                    key={booking.booking_id}
                    className={styles["opponent-row"]}
                  >
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
                        onClick={closeEventsModal}
                      >
                        <img
                          src={
                            (booking.event_type_id === 1 ||
                              booking.event_type_id === 2) &&
                            booking.playerImage
                              ? `${localUrl}/${booking.playerImage}`
                              : booking.event_type_id === 3 &&
                                booking.trainerImage
                              ? `${localUrl}/${booking.trainerImage}`
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
                        onClick={closeEventsModal}
                      >
                        {`${booking?.fname} ${booking?.lname}`}
                      </Link>
                    </td>
                    <td>{booking.club_name}</td>
                    <td>{booking?.event_type_name}</td>
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
                          to={`${paths.EXPLORE_PROFILE}1/${selectedPlayer?.user_id}`}
                          className={styles["opponent-name"]}
                        >
                          {`${selectedPlayer?.fname} ${selectedPlayer?.lname}`}
                        </Link>
                      ) : booking.event_type_id === 2 &&
                        booking.winner_id &&
                        booking.match_score_status_type_id === 3 &&
                        booking?.winner_id !== selectedPlayer?.user_id ? (
                        <Link
                          to={`${paths.EXPLORE_PROFILE}1/${booking?.winner_id}`}
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
            <p>Henüz tamamlanan etkinlik bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};
export default ExplorePlayerEventsModal;

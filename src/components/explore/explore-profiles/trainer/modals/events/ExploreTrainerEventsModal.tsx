import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../loading/PageLoading";

import { useGetEventTypesQuery } from "../../../../../../api/endpoints/EventTypesApi";
import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { StudentGroup } from "../../../../../../api/endpoints/StudentGroupsApi";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";
import { Court } from "../../../../../../api/endpoints/CourtsApi";

interface ExploreTrainerEventsModalProps {
  isEventsModalOpen: boolean;
  closeEventsModal: () => void;
  trainerBookings: Booking[];
  selectedTrainer: Trainer;
  trainerGroups: StudentGroup[];
  players: Player[];
  clubs: Club[];
  courts: Court[];
}

const ExploreTrainerEventsModal = (props: ExploreTrainerEventsModalProps) => {
  const {
    isEventsModalOpen,
    closeEventsModal,
    trainerBookings,
    selectedTrainer,
    trainerGroups,
    players,
    clubs,
    courts,
  } = props;

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const player = (user_id: number) => {
    return players?.find((player) => player.user_id === user_id);
  };

  const club = (user_id: number) => {
    return clubs?.find((club) => club.user_id === user_id);
  };

  const trainerGroup = (user_id: number) => {
    return trainerGroups?.find((group) => group.user_id === user_id);
  };

  const court = (court_id: number) => {
    return courts?.find((court) => court.court_id === court_id);
  };

  if (isEventTypesLoading) {
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
        {trainerBookings?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Oyuncu</th>
                <th>Tür</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Konum</th>
                <th>Kort</th>
              </tr>
            </thead>
            <tbody>
              {trainerBookings?.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 3
                          ? 1
                          : booking.event_type_id === 6
                          ? 3
                          : ""
                      }/${
                        booking.inviter_id === selectedTrainer?.[0]?.user_id &&
                        booking.event_type_id === 3
                          ? booking.invitee_id
                          : booking.invitee_id ===
                              selectedTrainer?.[0]?.user_id &&
                            booking.event_type_id === 3
                          ? booking.inviter_id
                          : booking.event_type_id === 6
                          ? trainerGroup(booking.invitee_id)?.club_id
                          : ""
                      }`}
                    >
                      <img
                        src={
                          booking.event_type_id === 3 &&
                          booking.inviter_id ===
                            selectedTrainer?.[0]?.user_id &&
                          player(booking.invitee_id)?.image
                            ? `${localUrl}/${player(booking.invitee_id)?.image}`
                            : booking.event_type_id === 3 &&
                              booking.invitee_id ===
                                selectedTrainer?.[0]?.user_id &&
                              player(booking.inviter_id)?.image
                            ? `${localUrl}/${player(booking.inviter_id)?.image}`
                            : booking.event_type_id === 6 &&
                              club(trainerGroup(booking.invitee_id)?.club_id)
                                ?.image
                            ? `${localUrl}/${
                                club(trainerGroup(booking.invitee_id)?.club_id)
                                  ?.image
                              }`
                            : "/images/icons/avatar.png"
                        }
                        className={styles["player-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 3
                          ? 1
                          : booking.event_type_id === 6
                          ? 3
                          : ""
                      }/${
                        booking.inviter_id === selectedTrainer?.[0]?.user_id &&
                        booking.event_type_id === 3
                          ? booking.invitee_id
                          : booking.invitee_id ===
                              selectedTrainer?.[0]?.user_id &&
                            booking.event_type_id === 3
                          ? booking.inviter_id
                          : booking.event_type_id === 6
                          ? trainerGroup(booking.invitee_id)?.club_id
                          : ""
                      }`}
                      className={styles["player-name"]}
                    >
                      {booking.event_type_id === 3 &&
                      booking.inviter_id === selectedTrainer?.[0]?.user_id
                        ? `${player(booking.invitee_id)?.fname} ${
                            player(booking.invitee_id)?.lname
                          }`
                        : booking.event_type_id === 3 &&
                          booking.invitee_id === selectedTrainer?.[0]?.user_id
                        ? `${player(booking.inviter_id)?.fname} ${
                            player(booking.inviter_id)?.lname
                          }`
                        : booking.event_type_id === 6
                        ? trainerGroup(booking.invitee_id)?.student_group_name
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
                  <td>{booking.event_date.slice(0, 10)}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>{club(booking.club_id)?.club_name}</td>
                  <td>{court(booking.court_id)?.court_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz tamamlanan ders bulunmamaktadır.</p>
        )}
      </div>
    </ReactModal>
  );
};
export default ExploreTrainerEventsModal;

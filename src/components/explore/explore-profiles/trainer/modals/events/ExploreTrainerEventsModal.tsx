import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { StudentGroup } from "../../../../../../api/endpoints/StudentGroupsApi";

interface ExploreTrainerEventsModalProps {
  isEventsModalOpen: boolean;
  closeEventsModal: () => void;
  trainerBookings: any;
  selectedTrainer: Trainer;
  trainerGroups: StudentGroup[];
}

const ExploreTrainerEventsModal = (props: ExploreTrainerEventsModalProps) => {
  const {
    isEventsModalOpen,
    closeEventsModal,
    trainerBookings,
    selectedTrainer,
    trainerGroups,
  } = props;

  const trainerGroup = (user_id: number) => {
    return trainerGroups?.find((group) => group.user_id === user_id);
  };

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
                  <tr
                    key={booking.booking_id}
                    className={styles["opponent-row"]}
                  >
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}${
                          booking.event_type_id === 3
                            ? 1
                            : booking.event_type_id === 6
                            ? 3
                            : ""
                        }/${
                          booking.inviter_id ===
                            selectedTrainer?.[0]?.user_id &&
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
                        onClick={closeEventsModal}
                      >
                        <img
                          src={
                            booking.event_type_id === 3 && booking.playerImage
                              ? `${localUrl}/${booking.playerImage}`
                              : "/images/icons/avatar.jpg"
                          }
                          className={styles["opponent-image"]}
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
                          booking.inviter_id ===
                            selectedTrainer?.[0]?.user_id &&
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
                        className={styles["opponent-name"]}
                        onClick={closeEventsModal}
                      >
                        {booking.event_type_id === 3
                          ? `${booking.playerFname} ${booking.playerLname}`
                          : booking.event_type_id === 6
                          ? trainerGroup(booking.invitee_id)?.student_group_name
                          : "-"}
                      </Link>
                    </td>
                    <td>{booking?.event_type_name}</td>
                    <td>{booking?.event_date.slice(0, 10)}</td>
                    <td>{booking?.event_time.slice(0, 5)}</td>
                    <td>{booking?.club_name}</td>
                    <td>{booking?.court_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz tamamlanan ders bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};
export default ExploreTrainerEventsModal;

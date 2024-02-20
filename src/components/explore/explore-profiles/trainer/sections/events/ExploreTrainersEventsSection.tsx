import React, { useState } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../../components/loading/PageLoading";
import ExploreTrainerEventsModal from "../../modals/events/ExploreTrainerEventsModal";
import { useGetUserProfileEventsQuery } from "../../../../../../api/endpoints/BookingsApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { StudentGroup } from "../../../../../../api/endpoints/StudentGroupsApi";

interface ExploreTrainersEventsSectionProps {
  selectedTrainer: Trainer;
  trainerGroups: StudentGroup[];
}

const ExploreTrainersEventsSection = (
  props: ExploreTrainersEventsSectionProps
) => {
  const { selectedTrainer, trainerGroups } = props;

  const { data: trainerBookings, isLoading: isTrainerBookingLoading } =
    useGetUserProfileEventsQuery(selectedTrainer?.[0]?.user_id);

  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const openEventsModal = () => {
    setIsEventsModalOpen(true);
  };
  const closeEventsModal = () => {
    setIsEventsModalOpen(false);
  };

  const trainerGroup = (user_id: number) => {
    return trainerGroups?.find((group) => group.user_id === user_id);
  };

  if (isTrainerBookingLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["events-section"]}>
      <h2>Geçmiş Etkinlikler</h2>
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
            {trainerBookings
              ?.slice(trainerBookings.length - 4)
              ?.map((booking) => (
                <tr key={booking.booking_id} className={styles["opponent-row"]}>
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
                          selectedTrainer?.[0]?.image
                            ? `${localUrl}/${selectedTrainer?.[0]?.image}`
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
                      className={styles["opponent-name"]}
                    >
                      {booking.event_type_id === 3
                        ? `${booking.fname} ${booking.lname}`
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
      {trainerBookings?.length > 0 && (
        <button onClick={openEventsModal}>Tümünü Görüntüle</button>
      )}

      <ExploreTrainerEventsModal
        isEventsModalOpen={isEventsModalOpen}
        closeEventsModal={closeEventsModal}
        trainerBookings={trainerBookings}
        selectedTrainer={selectedTrainer}
        trainerGroups={trainerGroups}
      />
    </div>
  );
};

export default ExploreTrainersEventsSection;

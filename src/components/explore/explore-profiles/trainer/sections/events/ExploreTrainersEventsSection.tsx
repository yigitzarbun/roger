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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  if (isTrainerBookingLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["events-section"]}>
      <h2>{t("pastEventsTitle")}</h2>
      {trainerBookings?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("user")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
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
                        ? `${booking.playerFname} ${booking.playerLname}`
                        : booking.event_type_id === 6
                        ? trainerGroup(booking.invitee_id)?.student_group_name
                        : "-"}
                    </Link>
                  </td>
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
                  <td>{booking?.event_date.slice(0, 10)}</td>
                  <td>{booking?.event_time.slice(0, 5)}</td>
                  <td>{booking?.club_name}</td>
                  <td>{booking?.court_name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>{t("calendarEmptyText")}</p>
      )}
      {trainerBookings?.length > 0 && (
        <button onClick={openEventsModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
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

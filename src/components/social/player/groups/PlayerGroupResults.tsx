import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

const PlayerGroupResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: groups, isLoading: isGroupsLoading } = useGetStudentGroupsQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const nextGroupTrainingDate = (group_id: number) => {
    const filteredBookings = bookings?.filter(
      (booking) =>
        booking.invitee_id === group_id && booking.booking_status_type_id === 2
    );

    if (filteredBookings.length > 0) {
      const currentDate = new Date(); // Current date and time
      const sortedBookings = filteredBookings
        .filter((booking) => {
          const eventDate = new Date(booking.event_date);
          const eventTime = booking.event_time.split(":");
          const eventDateTime = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate(),
            parseInt(eventTime[0]),
            parseInt(eventTime[1])
          );
          return eventDateTime >= currentDate; // Filter out past events
        })
        .sort((a, b) => {
          const dateA = new Date(a.event_date).getTime();
          const dateB = new Date(b.event_date).getTime();
          return dateA - dateB; // Sort by ascending order
        });

      if (sortedBookings.length > 0) {
        const eventDate = new Date(sortedBookings[0].event_date);
        return eventDate.toLocaleDateString(); // Use eventDate as a Date object
      }
    }
    return "-";
  };

  const nextGroupTrainingTime = (group_id: number) => {
    const filteredBookings = bookings?.filter(
      (booking) =>
        booking.invitee_id === group_id && booking.booking_status_type_id === 2
    );

    if (filteredBookings.length > 0) {
      const currentDate = new Date(); // Current date and time
      const sortedBookings = filteredBookings
        .filter((booking) => {
          const eventDate = new Date(booking.event_date);
          const eventTime = booking.event_time.split(":");
          const eventDateTime = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate(),
            parseInt(eventTime[0]),
            parseInt(eventTime[1])
          );
          return eventDateTime >= currentDate; // Filter out past events
        })
        .sort((a, b) => {
          const dateA = new Date(a.event_date);
          const dateB = new Date(b.event_date);

          if (dateA.getTime() === dateB.getTime()) {
            // If the dates are the same, compare by event_time
            const timeA = a.event_time;
            const timeB = b.event_time;
            return timeA.localeCompare(timeB);
          } else {
            // If the dates are different, compare by event_date
            return dateA.getTime() - dateB.getTime();
          }
        });

      if (sortedBookings.length > 0) {
        return sortedBookings[0].event_time.slice(0, 5);
      }
    }
    return "-";
  };

  const myGroups = groups?.filter(
    (group) =>
      group.is_active === true &&
      (group.first_student_id === user?.user?.user_id ||
        group.second_student_id === user?.user?.user_id ||
        group.third_student_id === user?.user?.user_id ||
        group.fourth_student_id === user?.user?.user_id)
  );

  if (
    isGroupsLoading ||
    isClubsLoading ||
    isTrainersLoading ||
    isBookingsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      {myGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>Grup</th>
              <th>Oyuncu Sayısı</th>
              <th>Eğitmen</th>
              <th>Sıradaki Ders Tarihi</th>
              <th>Sıradaki Ders Saati</th>
            </tr>
          </thead>
          <tbody>
            {myGroups?.map((group) => (
              <tr key={group.student_group_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.club_id}`}
                    className={styles.image}
                  >
                    <img
                      src={
                        clubs?.find((club) => club.user_id === group.club_id)
                          ?.image
                          ? clubs?.find(
                              (club) => club.user_id === group.club_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.club_id}`}
                    className={styles["club-name"]}
                  >
                    {
                      clubs?.find((club) => club.user_id === group.club_id)
                        ?.club_name
                    }
                  </Link>
                </td>
                <td>{group.student_group_name}</td>
                <td>
                  {group.fourth_student_id
                    ? 4
                    : group.third_student_id
                    ? 3
                    : group.second_student_id
                    ? 2
                    : 1}
                </td>
                <td>{`${
                  trainers?.find(
                    (trainer) => trainer.user_id === group.trainer_id
                  )?.fname
                } ${
                  trainers?.find(
                    (trainer) => trainer.user_id === group.trainer_id
                  )?.lname
                }`}</td>
                <td>{nextGroupTrainingDate(group.user_id)}</td>
                <td>{nextGroupTrainingTime(group.user_id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : myGroups?.length === 0 ? (
        <p>Kulüp oyuncu grubu üyeliği bulunmamaktadır</p>
      ) : (
        ""
      )}
    </div>
  );
};
export default PlayerGroupResults;

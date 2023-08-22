import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";

interface ClubCalendarResultsProps {
  date: string;
  courtId: number;
  eventTypeId: number;
}
const ClubCalendarResults = (props: ClubCalendarResultsProps) => {
  const { date, courtId, eventTypeId } = props;

  // fetch data
  const user = useAppSelector((store) => store.user.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  // date
  const currentDate = new Date();

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // bookings
  const myBookings = bookings?.filter(
    (booking) =>
      booking.club_id === user.clubDetails.club_id &&
      booking.booking_status_type_id === 2 &&
      new Date(booking.event_date) >= today
  );

  const filteredBookings = myBookings?.filter((booking) => {
    const eventDate = new Date(booking.event_date);
    if (date === "" && courtId === null && eventTypeId === null) {
      return true;
    } else if (
      (date === eventDate.toLocaleDateString() || date === "") &&
      (courtId === booking.court_id || courtId === null) &&
      (eventTypeId === booking.event_type_id || eventTypeId === null)
    ) {
      return booking;
    }
  });

  // data loading check
  if (
    isBookingsLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isEventTypesLoading ||
    isCourtsLoading ||
    isUsersLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Takvim</h2>
      </div>
      {filteredBookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Durum</th>
              <th>Davet Eden</th>
              <th>Davet Eden İsim</th>
              <th>Davet Edilen</th>
              <th>Davet Edilen İsim</th>
              <th>Tür </th>
              <th>Tarih</th>
              <th>Saat </th>
              <th>Kort</th>
              <th>Konum</th>
              <th>Ücret (TL / Saat)</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["player-row"]}>
                <td>
                  {booking.booking_status_type_id === 2 ? "Onaylandı" : ""}
                </td>
                <td>
                  <img
                    src="/images/players/player1.png"
                    className={styles["player-image"]}
                  />
                </td>
                <td>
                  {users?.find((user) => user.user_id === booking.inviter_id)
                    ?.user_type_id === 1 &&
                    `${
                      players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.lname
                    }`}
                  {users?.find((user) => user.user_id === booking.inviter_id)
                    ?.user_type_id === 2 &&
                    `${
                      trainers?.find(
                        (trainer) => trainer.user_id === booking.inviter_id
                      )?.fname
                    } ${
                      trainers?.find(
                        (trainer) => trainer.user_id === booking.inviter_id
                      )?.lname
                    }`}
                </td>
                <td>
                  <img
                    src="/images/players/player1.png"
                    className={styles["player-image"]}
                  />
                </td>
                <td>
                  {users?.find((user) => user.user_id === booking.invitee_id)
                    ?.user_type_id === 1 &&
                    `${
                      players?.find(
                        (player) => player.user_id === booking.invitee_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === booking.invitee_id
                      )?.lname
                    }`}
                  {users?.find((user) => user.user_id === booking.invitee_id)
                    ?.user_type_id === 2 &&
                    `${
                      trainers?.find(
                        (trainer) => trainer.user_id === booking.invitee_id
                      )?.fname
                    } ${
                      trainers?.find(
                        (trainer) => trainer.user_id === booking.invitee_id
                      )?.lname
                    }`}
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
                  {
                    courts?.find((court) => court.court_id === booking.court_id)
                      ?.court_name
                  }
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === booking.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    courts?.find(
                      (court) => court.club_id === user.clubDetails.club_id
                    )?.price_hour
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClubCalendarResults;

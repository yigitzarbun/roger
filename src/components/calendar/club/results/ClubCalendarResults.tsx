import React, { useState } from "react";

import { Link } from "react-router-dom";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";
import Paths from "../../../../routing/Paths";

import AddClubCourtBookingModal from "../add-booking-modal/AddClubCourtBookingModal";
import EditClubCourtBookingModal from "../edit-booking-modal/EditClubCourtBookingModal";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetCourtsByFilterQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetClubExternalMembersByFilterQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";
import {
  currentDayLocale,
  currentTime,
} from "../../../../common/util/TimeFunctions";

interface ClubCalendarResultsProps {
  date: string;
  courtId: number;
  eventTypeId: number;
}
const ClubCalendarResults = (props: ClubCalendarResultsProps) => {
  const { date, courtId, eventTypeId } = props;

  // fetch data
  const user = useAppSelector((store) => store.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const [addBookingModalOpen, setAddBookingModalOpen] = useState(false);

  const openAddBookingModal = () => {
    setAddBookingModalOpen(true);
  };

  const closeAddBookingModal = () => {
    setAddBookingModalOpen(false);
  };

  const [editBookingModalOpen, setEditBookingModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const openEditBookingModal = (booking_id: number) => {
    setEditBookingModalOpen(true);
    setSelectedBooking(
      myBookings?.find((booking) => booking.booking_id === booking_id)
    );
  };

  const closeEditBookingModal = () => {
    setEditBookingModalOpen(false);
    setSelectedBooking(null);
  };

  // date

  const { data: myCourts, isLoading: isMyCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: user?.clubDetails?.club_id,
    });

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const { data: myExternalMembers, isLoading: isMyExternalMembersLoading } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

  // bookings
  const myBookings = bookings?.filter(
    (booking) =>
      (booking.club_id === user?.clubDetails?.club_id &&
        booking.booking_status_type_id === 2 &&
        new Date(booking.event_date).toLocaleDateString() > currentDayLocale) ||
      (new Date(booking.event_date).toLocaleDateString() === currentDayLocale &&
        booking.event_time > currentTime)
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
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isEventTypesLoading ||
    isUsersLoading ||
    isMyExternalMembersLoading ||
    isMyCourtsLoading ||
    isMyGroupsLoading ||
    isBookingsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["add-booking-container"]}>
        <h2 className={styles["result-title"]}>Takvim</h2>
        <button
          className={styles["add-booking-button"]}
          onClick={openAddBookingModal}
          disabled={myCourts?.length === 0}
        >
          <FaPlusSquare className={styles["add-icon"]} />
          <h2 className={styles["add-title"]}>
            {myCourts?.length === 0
              ? "Kort Rezervasyonu için Kort Ekleyin"
              : "Kort Rezervasyonu Ekle"}
          </h2>
        </button>
      </div>

      {filteredBookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
      ) : (
        <table>
          <thead>
            <tr>
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
              <tr key={booking.booking_id}>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}${
                      users?.find((user) => user.user_id === booking.inviter_id)
                        ?.user_type_id === 1
                        ? 1
                        : users?.find(
                            (user) => user.user_id === booking.inviter_id
                          )?.user_type_id === 2
                        ? 2
                        : ""
                    }/${booking.inviter_id}`}
                  >
                    <img
                      src={
                        users?.find(
                          (user) => user.user_id === booking.inviter_id
                        )?.user_type_id === 1 &&
                        players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.image
                          : users?.find(
                              (user) => user.user_id === booking.inviter_id
                            )?.user_type_id === 2 &&
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.inviter_id
                            )?.image
                          ? trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.inviter_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}${
                      users?.find((user) => user.user_id === booking.inviter_id)
                        ?.user_type_id === 1
                        ? 1
                        : users?.find(
                            (user) => user.user_id === booking.inviter_id
                          )?.user_type_id === 2
                        ? 2
                        : ""
                    }/${booking.inviter_id}`}
                    className={styles.name}
                  >
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
                    {users?.find((user) => user.user_id === booking.inviter_id)
                      ?.user_type_id === 5 &&
                      `${
                        myExternalMembers?.find(
                          (member) => member.user_id === booking.inviter_id
                        )?.fname
                      } ${
                        myExternalMembers?.find(
                          (member) => member.user_id === booking.inviter_id
                        )?.lname
                      }`}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}${
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 1
                        ? 1
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 2
                        ? 2
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 6
                        ? 3
                        : ""
                    }/${
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 1 ||
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 2
                        ? booking.invitee_id
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 6
                        ? myGroups?.find(
                            (group) => group.user_id === booking.invitee_id
                          )?.club_id
                        : ""
                    }`}
                  >
                    <img
                      src={
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 1 &&
                        players?.find(
                          (player) => player.user_id === booking.invitee_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.invitee_id
                            )?.image
                          : users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 2 &&
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.invitee_id
                            )?.image
                          ? trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.invitee_id
                            )?.image
                          : users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 6 &&
                            clubs?.find(
                              (club) =>
                                club.user_id ===
                                myGroups?.find(
                                  (group) =>
                                    group.user_id === booking.invitee_id
                                )?.club_id
                            )?.image
                          ? clubs?.find(
                              (club) =>
                                club.user_id ===
                                myGroups?.find(
                                  (group) =>
                                    group.user_id === booking.invitee_id
                                )?.club_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}${
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 1
                        ? 1
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 2
                        ? 2
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 6
                        ? 3
                        : ""
                    }/${
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 1 ||
                      users?.find((user) => user.user_id === booking.invitee_id)
                        ?.user_type_id === 2
                        ? booking.invitee_id
                        : users?.find(
                            (user) => user.user_id === booking.invitee_id
                          )?.user_type_id === 6
                        ? myGroups?.find(
                            (group) => group.user_id === booking.invitee_id
                          )?.club_id
                        : ""
                    }`}
                    className={styles.name}
                  >
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
                    {users?.find((user) => user.user_id === booking.invitee_id)
                      ?.user_type_id === 5 &&
                      `${
                        myExternalMembers?.find(
                          (member) => member.user_id === booking.invitee_id
                        )?.fname
                      } ${
                        myExternalMembers?.find(
                          (member) => member.user_id === booking.invitee_id
                        )?.lname
                      }`}
                    {users?.find((user) => user.user_id === booking.invitee_id)
                      ?.user_type_id === 6 &&
                      myGroups?.find(
                        (group) => group.user_id === booking.invitee_id
                      )?.student_group_name}
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
                  {
                    myCourts?.find(
                      (court) => court.court_id === booking.court_id
                    )?.court_name
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
                    myCourts?.find(
                      (court) => court.court_id === booking.court_id
                    )?.price_hour
                  }
                </td>
                {(booking.event_type_id === 4 ||
                  booking.event_type_id === 5 ||
                  booking.event_type_id === 6) && (
                  <td>
                    <button
                      onClick={() => openEditBookingModal(booking.booking_id)}
                      className={styles["edit-button"]}
                    >
                      Düzenle
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddClubCourtBookingModal
        addBookingModalOpen={addBookingModalOpen}
        closeAddBookingModal={closeAddBookingModal}
      />
      <EditClubCourtBookingModal
        editBookingModalOpen={editBookingModalOpen}
        closeEditBookingModal={closeEditBookingModal}
        selectedBooking={selectedBooking}
      />
    </div>
  );
};

export default ClubCalendarResults;

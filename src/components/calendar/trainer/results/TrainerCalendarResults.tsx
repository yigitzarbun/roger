import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import CancelInviteModal from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

import { BookingData } from "../../../invite/modals/cancel-modal/CancelInviteModal";

import {
  useGetBookingsQuery,
  useGetTrainerBookingsByUserIdQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import {
  currentDayLocale,
  currentTimeLocale,
  currentYear,
} from "../../../../common/util/TimeFunctions";

interface TrainerCalendarResultsProps {
  date: string;
  clubId: number;
  eventTypeId: number;
  textSearch: string;
}
const TrainerCalendarResults = (props: TrainerCalendarResultsProps) => {
  const { date, clubId, eventTypeId, textSearch } = props;

  // fetch data
  const user = useAppSelector((store) => store.user.user.user);
  const formattedDate = date
    ? date.split("/").reverse().join("-") // Convert to "YYYY-MM-DD" format
    : "";
  const { data: trainerBookings, isLoading: isTrainerBookingsLoading } =
    useGetTrainerBookingsByUserIdQuery({
      date: formattedDate,
      eventTypeId: eventTypeId,
      clubId: clubId,
      userId: user?.user_id,
      textSearch: textSearch,
    });
  console.log(trainerBookings);
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetBookingsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      trainer_id: user?.user_id,
      is_active: true,
    });

  // bookings
  const myBookings = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user.user_id ||
        booking.invitee_id === user.user_id) &&
      booking.booking_status_type_id === 2 &&
      (booking.event_type_id === 3 ||
        booking.event_type_id === 5 ||
        booking.event_type_id === 6) &&
      (new Date(booking.event_date).toLocaleDateString() > currentDayLocale ||
        (new Date(booking.event_date).toLocaleDateString() ===
          currentDayLocale &&
          booking.event_time > currentTimeLocale))
  );

  const filteredBookings = myBookings?.filter((booking) => {
    const eventDate = new Date(booking.event_date);
    if (date === "" && clubId === null) {
      return true;
    } else if (
      (date === eventDate.toLocaleDateString() || date === "") &&
      (clubId === booking.club_id || clubId === null)
    ) {
      return booking;
    }
  });

  // update booking
  const [updateBooking, { isSuccess }] = useUpdateBookingMutation({});

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (data) => {
    setBookingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancelBooking = () => {
    const cancelledBookingData = {
      ...bookingData,
      booking_status_type_id: 4,
    };
    updateBooking(cancelledBookingData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Ders iptal edildi");
      handleCloseModal();
    }
  }, [isSuccess]);

  // data loading check
  if (
    isBookingsLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isEventTypesLoading ||
    isPlayerLevelsLoading ||
    isCourtsLoading ||
    isMyGroupsLoading ||
    isExternalMembersLoading
  ) {
    return <PageLoading />;
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
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Tür </th>
              <th>Tarih</th>
              <th>Saat </th>
              <th>Kort</th>
              <th>Konum</th>
              <th>Ücret</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["trainer-row"]}>
                <td>
                  {booking.booking_status_type_id === 2 && (
                    <p className={styles["confirmed-text"]}>Onaylandı</p>
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 3
                        ? 1
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 3 &&
                      booking.inviter_id === user?.user_id
                        ? booking.invitee_id
                        : booking.event_type_id === 3 &&
                          booking.invitee_id === user?.user_id
                        ? booking.inviter_id
                        : booking.event_type_id === 5
                        ? clubs?.find(
                            (club) => club.club_id === booking.club_id
                          )?.user_id
                        : booking.event_type_id === 6
                        ? clubs?.find(
                            (club) =>
                              club.user_id ===
                              myGroups?.find(
                                (group) => group.user_id === booking.invitee_id
                              )?.club_id
                          )?.user_id
                        : ""
                    }`}
                  >
                    <img
                      src={
                        booking.event_type_id === 3 &&
                        booking.inviter_id === user?.user_id &&
                        players?.find(
                          (player) => player.user_id === booking.invitee_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.invitee_id
                            )?.image
                          : booking.event_type_id === 3 &&
                            booking.invitee_id === user?.user_id &&
                            players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.image
                          : booking.event_type_id === 5 &&
                            clubs?.find(
                              (club) => club.club_id === booking.club_id
                            )?.image
                          ? clubs?.find(
                              (club) => club.club_id === booking.club_id
                            )?.image
                          : booking.event_type_id === 6 &&
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
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 3
                        ? 1
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 3 &&
                      booking.inviter_id === user?.user_id
                        ? booking.invitee_id
                        : booking.event_type_id === 3 &&
                          booking.invitee_id === user?.user_id
                        ? booking.inviter_id
                        : booking.event_type_id === 5
                        ? clubs?.find(
                            (club) => club.club_id === booking.club_id
                          )?.user_id
                        : booking.event_type_id === 6
                        ? clubs?.find(
                            (club) =>
                              club.user_id ===
                              myGroups?.find(
                                (group) => group.user_id === booking.invitee_id
                              )?.club_id
                          )?.user_id
                        : ""
                    }`}
                    className={styles["trainer-name"]}
                  >
                    {booking.inviter_id === user.user_id &&
                    booking.event_type_id === 3
                      ? `${
                          players?.find(
                            (player) => player.user_id === booking.invitee_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === booking.invitee_id
                          )?.lname
                        }`
                      : booking.invitee_id === user.user_id &&
                        booking.event_type_id === 3
                      ? `${
                          players?.find(
                            (player) => player.user_id === booking.inviter_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === booking.inviter_id
                          )?.lname
                        }`
                      : booking.inviter_id === user.user_id &&
                        booking.event_type_id === 5
                      ? `${
                          externalMembers?.find(
                            (member) => member.user_id === booking.invitee_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) => member.user_id === booking.invitee_id
                          )?.lname
                        }`
                      : booking.invitee_id === user.user_id &&
                        booking.event_type_id === 5
                      ? `${
                          externalMembers?.find(
                            (member) => member.user_id === booking.inviter_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) => member.user_id === booking.inviter_id
                          )?.lname
                        }`
                      : booking.inviter_id === user.user_id &&
                        booking.event_type_id === 6
                      ? myGroups?.find(
                          (group) => group.user_id === booking.invitee_id
                        )?.student_group_name
                      : booking.invitee_id === user.user_id &&
                        booking.event_type_id === 6
                      ? myGroups?.find(
                          (group) => group.user_id === booking.inviter_id
                        )?.student_group_name
                      : ""}
                  </Link>
                </td>
                <td>
                  {booking.inviter_id === user.user_id &&
                  booking.event_type_id === 3
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === booking.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : booking.invitee_id === user.user_id &&
                      booking.event_type_id === 3
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === booking.inviter_id
                          )?.player_level_id
                      )?.player_level_name
                    : booking.event_type_id === 5 &&
                      booking.inviter_id === user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          externalMembers?.find(
                            (member) => member.user_id === booking.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : booking.event_type_id === 5 &&
                      booking.invitee_id === user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          externalMembers?.find(
                            (member) => member.user_id === booking.inviter_id
                          )?.player_level_id
                      )?.player_level_name
                    : booking.event_type_id === 6 && "-"}
                </td>
                <td>
                  {booking.inviter_id === user.user_id &&
                  booking.event_type_id === 3
                    ? players?.find(
                        (player) => player.user_id === booking.invitee_id
                      )?.gender
                    : booking.invitee_id === user.user_id &&
                      booking.event_type_id === 3
                    ? players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.gender
                    : booking.event_type_id === 5 &&
                      booking.inviter_id === user?.user_id
                    ? externalMembers?.find(
                        (member) => member.user_id === booking.invitee_id
                      )?.gender
                    : booking.event_type_id === 5 &&
                      booking.invitee_id === user?.user_id
                    ? externalMembers?.find(
                        (member) => member.user_id === booking.inviter_id
                      )?.gender
                    : booking.event_type_id === 6 && "-"}
                </td>
                <td>
                  {booking.inviter_id === user.user_id &&
                  booking.event_type_id === 3
                    ? currentYear -
                      players?.find(
                        (player) => player.user_id === booking.invitee_id
                      )?.birth_year
                    : booking.invitee_id === user.user_id &&
                      booking.event_type_id === 3
                    ? currentYear -
                      players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.birth_year
                    : booking.inviter_id === user.user_id &&
                      booking.event_type_id === 5
                    ? currentYear -
                      externalMembers?.find(
                        (member) => member.user_id === booking.invitee_id
                      )?.birth_year
                    : booking.invitee_id === user.user_id &&
                      booking.event_type_id === 5
                    ? currentYear -
                      externalMembers?.find(
                        (member) => member.user_id === booking.inviter_id
                      )?.birth_year
                    : booking.event_type_id === 6 && "-"}
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
                    trainers?.find(
                      (trainer) => trainer.user_id === user.user_id
                    )?.price_hour
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleOpenModal(booking)}
                    className={styles["cancel-button"]}
                  >
                    İptal
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <CancelInviteModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          bookingData={bookingData}
          handleCancelBooking={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default TrainerCalendarResults;

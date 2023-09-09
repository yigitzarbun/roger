import React, { useState } from "react";

import { AiOutlineEye } from "react-icons/ai";

import { BiCommentAdd } from "react-icons/bi";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import AddEventReviewModal from "../../reviews-modals/add/AddEventReviewModal";
import ViewEventReviewModal from "../../reviews-modals/view/ViewEventReviewModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

const TrainerEventsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});
  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});
  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});
  const { data: groups, isLoading: isGroupsLoading } = useGetStudentGroupsQuery(
    {}
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id) &&
      booking.booking_status_type_id === 5
  );

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const openReviewModal = (booking_id: number) => {
    setSelectedBookingId(booking_id);
    setIsAddReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsAddReviewModalOpen(false);
  };

  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const openViewReviewModal = (booking_id: number) => {
    setSelectedBookingId(booking_id);
    setIsViewReviewModalOpen(true);
  };
  const closeViewReviewModal = () => {
    setIsViewReviewModalOpen(false);
  };

  if (
    isBookingsLoading ||
    isEventTypesLoading ||
    isCourtsLoading ||
    isCourtsLoading ||
    isPlayerLevelsLoading ||
    isClubsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading ||
    isPlayersLoading ||
    isEventReviewsLoading ||
    isExternalMembersLoading ||
    isGroupsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["results-container"]}>
      <h2 className={styles.title}>Etkinlik Geçmişi</h2>
      {myEvents?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Kort Yüzey</th>
              <th>Kort Mekan</th>
              <th>Oyuncu</th>
              <th>Oyuncu Seviye</th>
            </tr>
          </thead>
          <tbody>
            {myEvents?.map((event) => (
              <tr key={event.booking_id}>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>
                  {
                    eventTypes?.find(
                      (type) => type.event_type_id === event.event_type_id
                    )?.event_type_name
                  }
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === event.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    courts?.find((court) => court.court_id === event.court_id)
                      ?.court_name
                  }
                </td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        courts?.find(
                          (court) => court.court_id === event.court_id
                        )?.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        courts?.find(
                          (court) => court.court_id === event.court_id
                        )?.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>
                  <Link
                    to={
                      event.event_type_id === 3 &&
                      event.inviter_id === user?.user?.user_id
                        ? `${paths.EXPLORE_PROFILE}1/${event.invitee_id}`
                        : event.event_type_id === 3 &&
                          event.invitee_id === user?.user?.user_id
                        ? `${paths.EXPLORE_PROFILE}1/${event.inviter_id}`
                        : event.event_type_id === 5 || event.event_type_id === 6
                        ? `${paths.EXPLORE_PROFILE}3/${
                            clubs?.find(
                              (club) => club.club_id === event.club_id
                            )?.user_id
                          }`
                        : ""
                    }
                    className={styles["student-name"]}
                  >
                    {event.event_type_id === 3 &&
                    event.inviter_id === user?.user?.user_id
                      ? `${
                          players?.find(
                            (player) => player.user_id === event.invitee_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === event.invitee_id
                          )?.lname
                        }`
                      : event.event_type_id === 3 &&
                        event.invitee_id === user?.user?.user_id
                      ? `${
                          players?.find(
                            (player) => player.user_id === event.inviter_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === event.inviter_id
                          )?.lname
                        }`
                      : event.event_type_id === 5
                      ? `${
                          externalMembers?.find(
                            (member) => member.user_id === event.invitee_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) => member.user_id === event.invitee_id
                          )?.lname
                        }`
                      : event.event_type_id === 6
                      ? groups?.find(
                          (group) => group.user_id === event.invitee_id
                        )?.student_group_name
                      : "-"}
                  </Link>
                </td>
                <td>
                  {event.event_type_id === 3 &&
                  event.inviter_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : event.event_type_id === 3 &&
                      event.invitee_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.inviter_id
                          )?.player_level_id
                      )?.player_level_name
                    : event.event_type_id === 5
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          externalMembers?.find(
                            (member) => member.user_id === event.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : "-"}
                </td>
                {event.event_type_id === 3 && (
                  <td>
                    {eventReviews?.find(
                      (eventReview) =>
                        eventReview.reviewer_id === user?.user?.user_id &&
                        eventReview.booking_id === event.booking_id
                    ) ? (
                      <p className={styles["review-sent-text"]}>
                        Yorum Gönderildi
                      </p>
                    ) : (
                      <BiCommentAdd
                        onClick={() => openReviewModal(event.booking_id)}
                        className={styles["view-icon"]}
                      />
                    )}
                  </td>
                )}{" "}
                {event.event_type_id === 3 && (
                  <td>
                    {eventReviews?.find(
                      (eventReview) =>
                        eventReview.reviewer_id !== user?.user?.user_id &&
                        eventReview.booking_id === event.booking_id
                    ) && (
                      <AiOutlineEye
                        onClick={() => openViewReviewModal(event.booking_id)}
                        className={styles["view-icon"]}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tamamlanmış etkinlik bulunmamaktadır</p>
      )}
      <AddEventReviewModal
        isAddReviewModalOpen={isAddReviewModalOpen}
        closeReviewModal={closeReviewModal}
        selectedBookingId={selectedBookingId}
      />
      <ViewEventReviewModal
        isViewReviewModalOpen={isViewReviewModalOpen}
        closeViewReviewModal={closeViewReviewModal}
        selectedBookingId={selectedBookingId}
      />
    </div>
  );
};
export default TrainerEventsResults;

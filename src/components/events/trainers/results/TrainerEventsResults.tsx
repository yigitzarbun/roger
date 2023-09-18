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

import { useGetBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";

const TrainerEventsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: myEvents, isLoading: isMyEventsLoading } =
    useGetBookingsByFilterQuery({
      booking_player_id: user?.user?.user_id,
      booking_status_type_id: 5,
    });

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

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

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({ trainer_id: user?.user?.user_id });

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

  const selectedPlayer = (user_id: number) => {
    return players?.find((player) => player.user_id === user_id);
  };

  const selectedExternalMember = (user_id: number) => {
    return externalMembers?.find((member) => member.user_id === user_id);
  };

  const selectedClub = (club_id: number) => {
    return clubs?.find((club) => club.club_id === club_id);
  };

  const selectedCourt = (court_id: number) => {
    return courts?.find((court) => court.court_id === court_id);
  };

  const selectedPlayerLevel = (player_level_id: number) => {
    return playerLevels?.find(
      (level) => level.player_level_id === player_level_id
    );
  };

  const isEventLesson = (event_type_id: number) => {
    return event_type_id === 3 ? true : false;
  };

  const isEventExternalLesson = (event_type_id: number) => {
    return event_type_id === 5 ? true : false;
  };

  const isEventGroupLesson = (event_type_id: number) => {
    return event_type_id === 6 ? true : false;
  };

  const isTrainerInviter = (inviter_id: number) => {
    return inviter_id === user?.user?.user_id ? true : false;
  };

  const isTrainerInvitee = (invitee_id: number) => {
    return invitee_id === user?.user?.user_id;
  };

  const selectedGroup = (invitee_id: number) => {
    return myGroups?.find((group) => group.user_id === invitee_id);
  };

  if (
    isMyEventsLoading ||
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
    isMyGroupsLoading
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
                <td>{selectedClub(event.club_id)?.club_name}</td>
                <td>{selectedCourt(event.court_id)?.court_name}</td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        selectedCourt(event.court_id)?.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        selectedCourt(event.court_id)?.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>
                  <Link
                    to={
                      isEventLesson(event.event_type_id) &&
                      isTrainerInviter(event.inviter_id)
                        ? `${paths.EXPLORE_PROFILE}1/${event.invitee_id}`
                        : isEventLesson(event.event_type_id) &&
                          isTrainerInvitee(event.invitee_id)
                        ? `${paths.EXPLORE_PROFILE}1/${event.inviter_id}`
                        : isEventExternalLesson(event.event_type_id) ||
                          isEventGroupLesson(event.event_type_id)
                        ? `${paths.EXPLORE_PROFILE}3/${
                            selectedClub(event.club_id)?.user_id
                          }`
                        : ""
                    }
                    className={styles["student-name"]}
                  >
                    {isEventLesson(event.event_type_id) &&
                    isTrainerInviter(event.inviter_id)
                      ? `${selectedPlayer(event.invitee_id)?.fname} ${
                          selectedPlayer(event.invitee_id)?.lname
                        }`
                      : isEventLesson(event.event_type_id) &&
                        isTrainerInvitee(event.invitee_id)
                      ? `${selectedPlayer(event.inviter_id)?.fname} ${
                          selectedPlayer(event.inviter_id)?.lname
                        }`
                      : isEventExternalLesson(event.event_type_id)
                      ? `${selectedExternalMember(event.invitee_id)?.fname} ${
                          selectedExternalMember(event.invitee_id)?.lname
                        }`
                      : isEventGroupLesson(event.event_type_id)
                      ? selectedGroup(event.invitee_id)?.student_group_name
                      : "-"}
                  </Link>
                </td>
                <td>
                  {isEventLesson(event.event_type_id) &&
                  isTrainerInviter(event.inviter_id)
                    ? selectedPlayerLevel(
                        selectedPlayer(event.invitee_id)?.player_level_id
                      )?.player_level_name
                    : isEventLesson(event.event_type_id) &&
                      isTrainerInvitee(event.invitee_id)
                    ? selectedPlayerLevel(
                        selectedPlayer(event.inviter_id)?.player_level_id
                      )?.player_level_name
                    : isEventExternalLesson(event.event_type_id)
                    ? selectedPlayerLevel(
                        selectedExternalMember(event.invitee_id)
                          ?.player_level_id
                      )?.player_level_name
                    : "-"}
                </td>
                {isEventLesson(event.event_type_id) && (
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
                )}
                {isEventLesson(event.event_type_id) && (
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
      {isAddReviewModalOpen && (
        <AddEventReviewModal
          isAddReviewModalOpen={isAddReviewModalOpen}
          closeReviewModal={closeReviewModal}
          selectedBookingId={selectedBookingId}
        />
      )}
      {isViewReviewModalOpen && (
        <ViewEventReviewModal
          isViewReviewModalOpen={isViewReviewModalOpen}
          closeViewReviewModal={closeViewReviewModal}
          selectedBookingId={selectedBookingId}
        />
      )}
    </div>
  );
};
export default TrainerEventsResults;

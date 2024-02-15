import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetPlayerByUserIdQuery,
  useGetPlayerProfileDetailsQuery,
} from "../../../../api/endpoints/PlayersApi";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";

import ExplorePlayersInteractionsSections from "./sections/interaction/ExplorePlayersInteractionsSections";
import ExplorePlayersReviewsSection from "./sections/reviews/ExplorePlayersReviewsSection";
import ExplorePlayerProfilesEventsSection from "./sections/events/ExplorePlayerProfilesEventsSection";

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerProfileDetailsQuery(Number(user_id));

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: playerGroups, isLoading: isPlayerGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      is_active: true,
      student_id: selectedPlayer?.[0]?.user_id,
    });

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const playerBookings = bookings?.filter(
    (booking) =>
      booking.booking_status_type_id === 5 &&
      (booking.inviter_id === selectedPlayer?.[0]?.user_id ||
        booking.invitee_id === selectedPlayer?.[0]?.user_id ||
        booking.invitee_id ===
          playerGroups?.find((group) => group.user_id === booking.invitee_id)
            ?.user_id)
  );

  if (
    isClubsLoading ||
    isBookingsLoading ||
    isSelectedPlayerLoading ||
    isPlayerGroupsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExplorePlayersInteractionsSections
          selectedPlayer={selectedPlayer}
          user_id={Number(user_id)}
          clubs={clubs}
        />
      </div>
      <div>
        <ExplorePlayersReviewsSection
          selectedPlayer={selectedPlayer}
          playerBookings={playerBookings}
        />
      </div>
      <div>
        <ExplorePlayerProfilesEventsSection
          playerBookings={playerBookings}
          selectedPlayer={selectedPlayer}
          playerGroups={playerGroups}
          clubs={clubs}
        />
      </div>
    </div>
  );
};
export default ExplorePlayerProfile;

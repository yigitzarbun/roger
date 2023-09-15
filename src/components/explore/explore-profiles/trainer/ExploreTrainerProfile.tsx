import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetTrainerByUserIdQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";

import ExploreTrainersProfileSection from "./sections/profile/ExploreTrainersProfileSection";
import ExploreTrainersInteractionSection from "./sections/interaction/ExploreTrainersInteractionSection";
import ExploreTrainersReviewsSection from "./sections/reviews/ExploreTrainersReviewsSection";
import ExploreTrainersEventsSection from "./sections/events/ExploreTrainersEventsSection";

interface ExploreTrainerProfileProps {
  user_id: string;
}
const ExploreTrainerProfile = (props: ExploreTrainerProfileProps) => {
  const { user_id } = props;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: selectedTrainer, isLoading: isSelectedTrainerLoading } =
    useGetTrainerByUserIdQuery(Number(user_id));

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainerGroups, isLoading: isTrainerGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      is_active: true,
      trainer_id: Number(user_id),
    });

  const { data: bookings, isLoading: isBookingsLoading } =
    useGetBookingsByFilterQuery({ booking_status_type_id: 5 });

  const trainerBookings = bookings?.filter(
    (booking) =>
      booking.inviter_id === selectedTrainer?.[0]?.user_id ||
      booking.invitee_id === selectedTrainer?.[0]?.user_id ||
      booking.invitee_id ===
        trainerGroups?.find((group) => group.user_id === booking.invitee_id)
          ?.user_id
  );

  if (
    isClubsLoading ||
    isBookingsLoading ||
    isPlayersLoading ||
    isTrainerGroupsLoading ||
    isSelectedTrainerLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExploreTrainersProfileSection
          selectedTrainer={selectedTrainer}
          clubs={clubs}
        />
        <ExploreTrainersInteractionSection
          user_id={Number(user_id)}
          selectedTrainer={selectedTrainer}
        />
      </div>
      <div>
        <ExploreTrainersReviewsSection
          user_id={Number(user_id)}
          trainerBookings={trainerBookings}
          players={players}
        />
      </div>
      <div>
        <ExploreTrainersEventsSection
          trainerBookings={trainerBookings}
          selectedTrainer={selectedTrainer}
          players={players}
          trainerGroups={trainerGroups}
          clubs={clubs}
        />
      </div>
    </div>
  );
};
export default ExploreTrainerProfile;

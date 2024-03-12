import React from "react";

import { useGetCourtDetailsQuery } from "../../../../api/endpoints/CourtsApi";

import { useGetBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";
import ExploreCourtBioSection from "./sections/bio/ExploreCourtBioSection";
import ExploreCourtHoursSection from "./sections/hours/ExploreCourtHoursSection";

interface ExploreCourtProfileProps {
  court_id: string;
}
const ExploreCourtProfile = (props: ExploreCourtProfileProps) => {
  const { court_id } = props;

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtDetailsQuery(Number(court_id));

  const { data: bookings, isLoading: isBookingsLoading } =
    useGetBookingsByFilterQuery({ court_id: court_id });

  if (isSelectedCourtLoading || isBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExploreCourtBioSection selectedCourt={selectedCourt} />
      </div>
      <ExploreCourtHoursSection
        bookings={bookings}
        selectedCourt={selectedCourt}
      />
    </div>
  );
};
export default ExploreCourtProfile;

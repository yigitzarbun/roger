import React, { useState, ChangeEvent } from "react";
import { useAppSelector } from "../../../store/hooks";

import ClubCalendarSearch from "../../../components/calendar/club/search/ClubCalendarSearch";
import ClubCalendarResults from "../../../components/calendar/club/results/ClubCalendarResults";
import { useGetCourtsByFilterQuery } from "../../../api/endpoints/CourtsApi";

import styles from "./styles.module.scss";

const ClubCalendar = () => {
  const user = useAppSelector((store) => store.user.user);

  const [courtId, setCourtId] = useState<number | null>(null);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleCourt = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setCourtId(isNaN(value) ? null : value);
  };

  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };
  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const { data: myCourts, isLoading: isMyCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

  const handleClear = () => {
    setCourtId(null);
    setEventTypeId(null);
    setTextSearch("");
  };
  return (
    <div className={styles["calendar-container"]}>
      <ClubCalendarSearch
        handleCourt={handleCourt}
        handleEventType={handleEventType}
        handleTextSearch={handleTextSearch}
        handleClear={handleClear}
        myCourts={myCourts}
        courtId={courtId}
        eventTypeId={eventTypeId}
        textSearch={textSearch}
      />
      <ClubCalendarResults
        courtId={courtId}
        eventTypeId={eventTypeId}
        myCourts={myCourts}
        textSearch={textSearch}
      />
    </div>
  );
};
export default ClubCalendar;

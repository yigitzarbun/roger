import React, { useState, ChangeEvent } from "react";

import ClubCalendarHero from "../../../components/calendar/club/hero/ClubCalendarHero";
import ClubCalendarSearch from "../../../components/calendar/club/search/ClubCalendarSearch";
import ClubCalendarResults from "../../../components/calendar/club/results/ClubCalendarResults";

import styles from "./styles.module.scss";

const ClubCalendar = () => {
  const [date, setDate] = useState<string>("");
  const [courtId, setCourtId] = useState<number | null>(null);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);

  const handleDate = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDate(event.target.value);
  };

  const handleCourt = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setCourtId(isNaN(value) ? null : value);
  };

  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setDate("");
    setCourtId(null);
    setEventTypeId(null);
  };
  return (
    <div className={styles["calendar-container"]}>
      <ClubCalendarHero />
      <ClubCalendarSearch
        handleDate={handleDate}
        handleCourt={handleCourt}
        handleEventType={handleEventType}
        handleClear={handleClear}
        date={date}
        courtId={courtId}
        eventTypeId={eventTypeId}
      />
      <ClubCalendarResults
        date={date}
        courtId={courtId}
        eventTypeId={eventTypeId}
      />
    </div>
  );
};
export default ClubCalendar;

import React, { useState, ChangeEvent } from "react";

import PlayerCalendarHero from "../../../components/calendar/player/hero/PlayerCalendarHero";
import PlayerCalendarResults from "../../../components/calendar/player/results/PlayerCalendarResults";
import PlayerCalendarSearch from "../../../components/calendar/player/search/PlayerCalendarSearch";

import styles from "./styles.module.scss";

const PlayerCalendar = () => {
  const [date, setDate] = useState<string>("");
  const [eventTypeId, setEventTypeId] = useState<number>(null);
  const [clubId, setClubId] = useState<number | null>(null);

  const handleDate = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDate(event.target.value);
  };

  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setDate("");
    setEventTypeId(null);
    setClubId(null);
  };
  return (
    <div className={styles["calendar-container"]}>
      <PlayerCalendarHero />
      <PlayerCalendarSearch
        handleDate={handleDate}
        handleEventType={handleEventType}
        handleClub={handleClub}
        handleClear={handleClear}
        date={date}
        eventTypeId={eventTypeId}
        clubId={clubId}
      />
      <PlayerCalendarResults
        date={date}
        eventTypeId={eventTypeId}
        clubId={clubId}
      />
    </div>
  );
};
export default PlayerCalendar;

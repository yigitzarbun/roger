import React, { useState, ChangeEvent } from "react";

import TrainerCalendarResults from "../../../components/calendar/trainer/results/TrainerCalendarResults";
import TrainerCalendarSearch from "../../../components/calendar/trainer/search/TrainerCalendarSearch";

import styles from "./styles.module.scss";

const TrainerCalendar = () => {
  const [date, setDate] = useState<string>("");
  const [clubId, setClubId] = useState<number | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");
  const [eventTypeId, setEventTypeId] = useState<number>(null);

  const handleDate = (event: ChangeEvent<HTMLSelectElement>) => {
    setDate(event.target.value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };

  const [filterOpen, setFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    filterOpen ? setFilterOpen(false) : setFilterOpen(true);
  };

  const handleClear = () => {
    setDate("");
    setClubId(null);
    setTextSearch("");
    setEventTypeId(null);
  };
  return (
    <div className={styles["calendar-container"]}>
      {filterOpen && (
        <TrainerCalendarSearch
          handleDate={handleDate}
          handleClub={handleClub}
          handleClear={handleClear}
          handleTextSearch={handleTextSearch}
          handleEventType={handleEventType}
          date={date}
          clubId={clubId}
          textSearch={textSearch}
          eventTypeId={eventTypeId}
        />
      )}

      <TrainerCalendarResults
        date={date}
        clubId={clubId}
        eventTypeId={eventTypeId}
        textSearch={textSearch}
        handleOpenFilter={handleOpenFilter}
      />
    </div>
  );
};
export default TrainerCalendar;

import React, { useState, ChangeEvent } from "react";

import TrainerCalendarHero from "../../../components/calendar/trainer/hero/TrainerCalendarHero";
import TrainerCalendarResults from "../../../components/calendar/trainer/results/TrainerCalendarResults";
import TrainerCalendarSearch from "../../../components/calendar/trainer/search/TrainerCalendarSearch";

import styles from "./styles.module.scss";

const TrainerCalendar = () => {
  const [date, setDate] = useState<string>("");
  const [clubId, setClubId] = useState<number | null>(null);

  const handleDate = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDate(event.target.value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setDate("");
    setClubId(null);
  };
  return (
    <div className={styles["calendar-container"]}>
      <TrainerCalendarHero />
      <TrainerCalendarSearch
        handleDate={handleDate}
        handleClub={handleClub}
        handleClear={handleClear}
        date={date}
        clubId={clubId}
      />
      <TrainerCalendarResults date={date} clubId={clubId} />
    </div>
  );
};
export default TrainerCalendar;

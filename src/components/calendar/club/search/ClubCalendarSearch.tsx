import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetCourtsByFilterQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  currentDayLocale,
  currentDayObject,
} from "../../../../common/util/TimeFunctions";
import { useAppSelector } from "../../../../store/hooks";

interface ClubCalendarSearchProps {
  handleCourt: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  courtId: number;
  eventTypeId: number;
  myCourts: any[];
  textSearch: string;
}
const ClubCalendarSearch = (props: ClubCalendarSearchProps) => {
  const {
    handleCourt,
    handleClear,
    courtId,
    handleEventType,
    eventTypeId,
    myCourts,
    textSearch,
    handleTextSearch,
  } = props;

  // date filter
  const tomorrow = new Date(currentDayObject);
  tomorrow.setDate(currentDayObject.getDate() + 1);

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  if (isEventTypesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Oyuncu / Eğitmen / Grup adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleCourt} value={courtId ?? ""}>
          <option value="">-- Kort --</option>
          {myCourts?.map((court) => (
            <option key={court.court_id} value={court.court_id}>
              {court.court_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleEventType} value={eventTypeId ?? ""}>
          <option value="">-- Tür --</option>
          {eventTypes?.map((type) => (
            <option key={type.event_type_id} value={type.event_type_id}>
              {type.event_type_name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          textSearch !== "" || courtId > 0 || eventTypeId > 0
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};

export default ClubCalendarSearch;

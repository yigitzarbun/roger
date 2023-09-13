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
  handleDate: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourt: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  date: string;
  courtId: number;
  eventTypeId: number;
}
const ClubCalendarSearch = (props: ClubCalendarSearchProps) => {
  const {
    handleDate,
    handleCourt,
    handleClear,
    date,
    courtId,
    handleEventType,
    eventTypeId,
  } = props;

  // date filter
  const user = useAppSelector((store) => store?.user);
  const tomorrow = new Date(currentDayObject);
  tomorrow.setDate(currentDayObject.getDate() + 1);

  const { data: myCourts, isLoading: isMyCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: user?.user?.clubDetails?.club_id,
    });

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  if (isMyCourtsLoading || isEventTypesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleDate} value={date}>
          <option value="">-- Tarih --</option>
          <option value={currentDayLocale}>Bugün</option>
          <option value={tomorrow.toLocaleDateString()}>Yarın</option>
        </select>
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
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default ClubCalendarSearch;

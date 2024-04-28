import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  currentDayLocale,
  currentDayObject,
} from "../../../../common/util/TimeFunctions";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";

interface TrainerCalendarSearchProps {
  handleDate: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  textSearch: string;
  eventTypeId: number;
  date: string;
  clubId: number;
}
const TrainerCalendarSearch = (props: TrainerCalendarSearchProps) => {
  const {
    handleDate,
    handleClub,
    handleTextSearch,
    handleEventType,
    handleClear,
    date,
    clubId,
    textSearch,
    eventTypeId,
  } = props;

  // date filter
  const tomorrow = new Date(currentDayObject);
  tomorrow.setDate(currentDayObject.getDate() + 1);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  if (isClubsLoading || isEventTypesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Oyuncu / Grup adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleEventType}
          value={eventTypeId ?? ""}
          className="input-element"
        >
          <option value="">-- Tür --</option>
          {eventTypes
            ?.filter(
              (type) => type.event_type_id === 3 || type.event_type_id === 6
            )
            .map((type) => (
              <option key={type.event_type_id} value={type.event_type_id}>
                {type.event_type_name}
              </option>
            ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleDate} value={date}>
          <option value="">-- Tarih --</option>
          <option value={currentDayLocale}>Bugün</option>
          <option value={tomorrow.toLocaleDateString()}>Yarın</option>
        </select>
      </div>

      <div className={styles["input-container"]}>
        <select onChange={handleClub} value={clubId ?? ""}>
          <option value="">-- Konum --</option>
          {clubs?.map((club) => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          date !== "" || textSearch !== "" || eventTypeId > 0 || clubId > 0
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};

export default TrainerCalendarSearch;

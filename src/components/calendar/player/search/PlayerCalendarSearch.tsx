import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";

interface PlayerCalendarSearchProps {
  handleDate: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  date: string;
  eventTypeId: number;
  clubId: number;
}
const PlayerCalendarSearch = (props: PlayerCalendarSearchProps) => {
  const {
    handleDate,
    handleEventType,
    handleClub,
    handleClear,
    date,
    eventTypeId,
    clubId,
  } = props;

  // date filter
  const currentDate = new Date();
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  if (isEventTypesLoading || isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleDate} value={date}>
          <option value="">-- Tarih --</option>
          <option value={today.toLocaleDateString()}>Bugün</option>
          <option value={tomorrow.toLocaleDateString()}>Yarın</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleEventType} value={eventTypeId ?? ""}>
          <option value="">-- Tür --</option>
          {eventTypes
            ?.filter(
              (type) =>
                type.event_type_id === 1 ||
                type.event_type_id === 2 ||
                type.event_type_id === 3
            )
            .map((type) => (
              <option key={type.event_type_id} value={type.event_type_id}>
                {type.event_type_name}
              </option>
            ))}
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
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default PlayerCalendarSearch;

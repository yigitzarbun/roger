import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  currentDayLocale,
  currentDayObject,
} from "../../../../common/util/TimeFunctions";

interface TrainerCalendarSearchProps {
  handleDate: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  date: string;
  clubId: number;
}
const TrainerCalendarSearch = (props: TrainerCalendarSearchProps) => {
  const { handleDate, handleClub, handleClear, date, clubId } = props;

  // date filter
  const tomorrow = new Date(currentDayObject);
  tomorrow.setDate(currentDayObject.getDate() + 1);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  if (isClubsLoading) {
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

export default TrainerCalendarSearch;

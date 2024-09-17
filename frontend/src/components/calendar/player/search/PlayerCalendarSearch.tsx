import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../../api/endpoints/EventTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  currentDayLocale,
  currentDayObject,
} from "../../../../common/util/TimeFunctions";
import { useTranslation } from "react-i18next";

interface PlayerCalendarSearchProps {
  handleDate: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  textSearch: string;
  date: string;
  eventTypeId: number;
  clubId: number;
}
const PlayerCalendarSearch = (props: PlayerCalendarSearchProps) => {
  const {
    handleDate,
    handleEventType,
    handleClub,
    handleTextSearch,
    handleClear,
    date,
    textSearch,
    eventTypeId,
    clubId,
  } = props;

  const { t } = useTranslation();

  const tomorrow = new Date(currentDayObject);

  tomorrow.setDate(currentDayObject.getDate() + 1);

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  if (isEventTypesLoading || isClubsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder={t("explorePlayerCalendarSearchPlaceholder")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleDate} value={date} className="input-element">
          <option value="">-- {t("tableDateHeader")} --</option>
          <option value={currentDayLocale}>{t("today")}</option>
          <option value={tomorrow.toLocaleDateString()}>{t("tomorrow")}</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleEventType}
          value={eventTypeId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("tableClubTypeHeader")} --</option>
          {eventTypes
            ?.filter(
              (type) =>
                type.event_type_id === 1 ||
                type.event_type_id === 2 ||
                type.event_type_id === 3 ||
                type.event_type_id === 6 ||
                type.event_type_id === 7
            )
            .map((type) => (
              <option key={type.event_type_id} value={type.event_type_id}>
                {type?.event_type_id === 1
                  ? t("training")
                  : type?.event_type_id === 2
                  ? t("match")
                  : type?.event_type_id === 3
                  ? t("lesson")
                  : type?.event_type_id === 4
                  ? t("externalTraining")
                  : type?.event_type_id === 5
                  ? t("externalLesson")
                  : type?.event_type_id === 6
                  ? t("groupLesson")
                  : type?.event_type_id === 7
                  ? t("tournamentMatch")
                  : ""}
              </option>
            ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleClub}
          value={clubId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("tableLocationHeader")} --</option>
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
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default PlayerCalendarSearch;

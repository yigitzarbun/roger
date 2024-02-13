import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import PlayerEventsNavigation from "../../../components/events/players/navigation/PlayerEventsNavigation";
import PlayerPastEventsResults from "../../../components/events/players/results/PlayerPastEventsResults";
import PlayerScores from "../../../components/events/players/scores/PlayerScores";
import PlayerPastEventsFilter from "../../../components/events/players/results-filter/PlayerPastEventsFilterModal";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetCourtStructureTypesQuery } from "../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetEventTypesQuery } from "../../../api/endpoints/EventTypesApi";

const PlayerEvents = () => {
  const [display, setDisplay] = useState("events");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const [textSearch, setTextSearch] = useState<string>("");
  const [clubId, setClubId] = useState<number | null>(null);
  const [courtSurfaceTypeId, setcourtSurfaceTypeId] = useState<number | null>(
    null
  );
  const [courtStructureTypeId, setcourtStructureTypeId] = useState<
    number | null
  >(null);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };
  const handleCourtStructure = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setcourtStructureTypeId(isNaN(value) ? null : value);
  };
  const handleCourtSurface = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setcourtSurfaceTypeId(isNaN(value) ? null : value);
  };
  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});
  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});
  const handleClear = () => {
    setTextSearch("");
    setClubId(null);
    setcourtSurfaceTypeId(null);
    setcourtStructureTypeId(null);
    setEventTypeId(null);
  };
  return (
    <div className={styles["player-events-container"]}>
      <PlayerEventsNavigation display={display} handleDisplay={handleDisplay} />
      {display === "events" && (
        <PlayerPastEventsResults
          textSearch={textSearch}
          clubId={clubId}
          courtSurfaceTypeId={courtSurfaceTypeId}
          courtStructureTypeId={courtStructureTypeId}
          eventTypeId={eventTypeId}
          clubs={clubs}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          eventTypes={eventTypes}
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          handleClear={handleClear}
        />
      )}
      {display === "scores" && <PlayerScores />}
    </div>
  );
};
export default PlayerEvents;

import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import TrainerEventsResults from "../../../components/events/trainers/results/TrainerEventsResults";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";

const TrainerEvents = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [clubId, setClubId] = useState<number | null>(null);
  const [courtSurfaceTypeId, setcourtSurfaceTypeId] = useState<number | null>(
    null
  );
  const [courtStructureTypeId, setcourtStructureTypeId] = useState<
    number | null
  >(null);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);
  const [missingReviews, setMissingReviews] = useState<number | null>(null);

  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };
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
  const handleMissingReviews = () => {
    missingReviews === null ? setMissingReviews(1) : setMissingReviews(null);
  };
  const handleClear = () => {
    setTextSearch("");
    setClubId(null);
    setcourtSurfaceTypeId(null);
    setcourtStructureTypeId(null);
    setEventTypeId(null);
    setMissingReviews(null);
  };
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});
  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  return (
    <div className={styles["trainer-events-container"]}>
      <TrainerEventsResults
        textSearch={textSearch}
        clubId={clubId}
        courtSurfaceTypeId={courtSurfaceTypeId}
        courtStructureTypeId={courtStructureTypeId}
        eventTypeId={eventTypeId}
        clubs={clubs}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
        eventTypes={eventTypes}
        missingReviews={missingReviews}
        handleTextSearch={handleTextSearch}
        handleClub={handleClub}
        handleCourtStructure={handleCourtStructure}
        handleCourtSurface={handleCourtSurface}
        handleEventType={handleEventType}
        handleMissingReviews={handleMissingReviews}
        handleClear={handleClear}
      />
    </div>
  );
};

export default TrainerEvents;

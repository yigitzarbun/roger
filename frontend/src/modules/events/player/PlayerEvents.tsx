import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import PlayerEventsNavigation from "../../../components/events/players/navigation/PlayerEventsNavigation";
import PlayerPastEventsResults from "../../../components/events/players/results/PlayerPastEventsResults";
import PlayerScores from "../../../components/events/players/scores/PlayerScores";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";

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
  const [missingReviews, setMissingReviews] = useState<number | null>(null);
  const [missingScores, setMissingScores] = useState<number | null>(null);

  const [selectedMatchScore, setSelectedMatchScore] = useState(null);

  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);

  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const openViewReviewModal = (booking_id: number) => {
    setSelectedBookingId(booking_id);
    setIsViewReviewModalOpen(true);
  };
  const closeViewReviewModal = () => {
    setIsViewReviewModalOpen(false);
  };

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [image, setImage] = useState(null);
  const openReviewModal = (
    booking_id: number,
    fname: string,
    lname: string,
    image: string | null
  ) => {
    setSelectedBookingId(booking_id);
    setFname(fname);
    setLname(lname);
    setImage(image);
    setIsAddReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsAddReviewModalOpen(false);
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
  const handleEventType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setEventTypeId(isNaN(value) ? null : value);
  };
  const handleMissingReviews = () => {
    missingReviews === null ? setMissingReviews(1) : setMissingReviews(null);
  };
  const handleMissingScores = () => {
    missingScores === null ? setMissingScores(1) : setMissingScores(null);
  };
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});
  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const openAddScoreModal = (matchScoreDetails) => {
    setIsAddScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeAddScoreModal = () => {
    setIsAddScoreModalOpen(false);
  };

  const openEditScoreModal = (matchScoreDetails) => {
    setIsEditScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeEditScoreModal = () => {
    setIsEditScoreModalOpen(false);
  };

  const handleClear = () => {
    setTextSearch("");
    setClubId(null);
    setcourtSurfaceTypeId(null);
    setcourtStructureTypeId(null);
    setEventTypeId(null);
    setMissingReviews(null);
    setMissingScores(null);
  };

  return (
    <div className={styles["player-events-container"]}>
      <PlayerEventsNavigation
        display={display}
        handleDisplay={handleDisplay}
        isAddScoreModalOpen={isAddScoreModalOpen}
        isEditScoreModalOpen={isEditScoreModalOpen}
        isAddReviewModalOpen={isAddReviewModalOpen}
      />
      {display === "events" && (
        <PlayerPastEventsResults
          display={display}
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
          missingScores={missingScores}
          selectedBookingId={selectedBookingId}
          isViewReviewModalOpen={isViewReviewModalOpen}
          openViewReviewModal={openViewReviewModal}
          closeViewReviewModal={closeViewReviewModal}
          isAddReviewModalOpen={isAddReviewModalOpen}
          fname={fname}
          lname={lname}
          image={image}
          openReviewModal={openReviewModal}
          closeReviewModal={closeReviewModal}
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          handleMissingReviews={handleMissingReviews}
          handleMissingScores={handleMissingScores}
          handleClear={handleClear}
        />
      )}
      {display === "scores" && (
        <PlayerScores
          display={display}
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
          missingScores={missingScores}
          selectedMatchScore={selectedMatchScore}
          isAddScoreModalOpen={isAddScoreModalOpen}
          isEditScoreModalOpen={isEditScoreModalOpen}
          openAddScoreModal={openAddScoreModal}
          closeAddScoreModal={closeAddScoreModal}
          openEditScoreModal={openEditScoreModal}
          closeEditScoreModal={closeEditScoreModal}
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          handleMissingReviews={handleMissingReviews}
          handleMissingScores={handleMissingScores}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};
export default PlayerEvents;

import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../store/hooks";

import ExploreNavigation from "../../components/explore/navigation/ExploreNavigation";
import ExplorePlayers from "../../components/explore/explore-results/explore-players/ExplorePlayers";
import ExploreTrainers from "../../components/explore/explore-results/explore-trainers/ExploreTrainers";
import ExploreClubs from "../../components/explore/explore-results/explore-clubs/ExploreClubs";
import ExploreCourts from "../../components/explore/explore-results/explore-courts/ExploreCourts";

import { useGetLocationsQuery } from "../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../api/endpoints/PlayerLevelsApi";
import { useGetTrainerExperienceTypesQuery } from "../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../api/endpoints/ClubsApi";
import { useGetClubTypesQuery } from "../../api/endpoints/ClubTypesApi";
import { useGetCourtsQuery } from "../../api/endpoints/CourtsApi";
import { useGetCourtStructureTypesQuery } from "../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../api/endpoints/CourtSurfaceTypesApi";
import { useGetClubStaffQuery } from "../../api/endpoints/ClubStaffApi";

const Explore = () => {
  const user = useAppSelector((store) => store.user.user);

  const [display, setDisplay] = useState("players");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  // TO DO: isUserPlayer burdan gönder
  const [textSearch, setTextSearch] = useState<string>("");
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);

  const [trainerExperienceTypeId, setTrainerExperienceTypeId] = useState<
    number | null
  >(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [clubType, setClubType] = useState<number | null>(null);
  const [courtSurfaceType, setCourtSurfaceType] = useState<number | null>(null);
  const [courtStructureType, setCourtStructureType] = useState<number | null>(
    null
  );
  const [favourite, setFavourite] = useState<boolean | null>(false);

  const [clubTrainers, setClubTrainers] = useState<boolean | null>(false);

  const [subscribedClubs, setSubscribedClubs] = useState<boolean | null>(false);

  const handleClear = () => {
    setTextSearch("");
    setPlayerLevelId(null);
    setClubId(null);
    setTrainerExperienceTypeId(null);
    setGender("");
    setLocationId(null);
    setClubType(null);
    setCourtSurfaceType(null);
    setCourtStructureType(null);
    setFavourite(false);
    setClubTrainers(false);

    setSubscribedClubs(false);
  };
  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleClubId = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };
  const handleTrainerExperience = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setTrainerExperienceTypeId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClubType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubType(isNaN(value) ? null : value);
  };

  const handleCourtSurfaceType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setCourtSurfaceType(isNaN(value) ? null : value);
  };

  const handleCourtStructureType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setCourtStructureType(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFavourite(value === "true");
  };

  const handleClubTrainers = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setClubTrainers(value === "true");
  };

  const handleSubscribedClubs = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSubscribedClubs(value === "true");
  };
  return (
    <div className={styles["explore-container"]}>
      <ExploreNavigation display={display} handleDisplay={handleDisplay} />
      {display === "players" && (
        <ExplorePlayers
          user={user}
          locations={locations}
          playerLevels={playerLevels}
          isLocationsLoading={isLocationsLoading}
          isPlayerLevelsLoading={isPlayerLevelsLoading}
          handleLevel={handleLevel}
          handleTextSearch={handleTextSearch}
          handleGender={handleGender}
          handleLocation={handleLocation}
          handleClear={handleClear}
          playerLevelId={playerLevelId}
          textSearch={textSearch}
          gender={gender}
          locationId={locationId}
        />
      )}
      {display === "trainers" && (
        <ExploreTrainers
          user={user}
          locations={locations}
          trainerExperienceTypes={trainerExperienceTypes}
          clubStaff={clubStaff}
          clubs={clubs}
          isLocationsLoading={isLocationsLoading}
          isTrainerExperienceTypesLoading={isTrainerExperienceTypesLoading}
          isClubStaffLoading={isClubStaffLoading}
          isClubsLoading={isClubsLoading}
          handleTextSearch={handleTextSearch}
          textSearch={textSearch}
          handleGender={handleGender}
          handleLocation={handleLocation}
          gender={gender}
          locationId={locationId}
          trainerExperienceTypeId={trainerExperienceTypeId}
          handleTrainerExperience={handleTrainerExperience}
          clubId={clubId}
          handleClubId={handleClubId}
          handleClear={handleClear}
        />
      )}
      {display === "clubs" && (
        <ExploreClubs
          user={user}
          locations={locations}
          clubs={clubs}
          clubTypes={clubTypes}
          courts={courts}
          clubStaff={clubStaff}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          isLocationsLoading={isLocationsLoading}
          isClubsLoading={isClubsLoading}
          isClubTypesLoading={isClubTypesLoading}
          isCourtsLoading={isCourtsLoading}
          isClubStaffLoading={isClubStaffLoading}
          handleTextSearch={handleTextSearch}
          handleLocation={handleLocation}
          handleClubType={handleClubType}
          handleCourtSurfaceType={handleCourtSurfaceType}
          handleCourtStructureType={handleCourtStructureType}
          handleClubTrainers={handleClubTrainers}
          handleSubscribedClubs={handleSubscribedClubs}
          textSearch={textSearch}
          locationId={locationId}
          clubType={clubType}
          courtSurfaceType={courtSurfaceType}
          courtStructureType={courtStructureType}
          clubTrainers={clubTrainers}
          subscribedClubs={subscribedClubs}
          handleClear={handleClear}
        />
      )}
      {display === "courts" && (
        <ExploreCourts
          user={user}
          locations={locations}
          clubs={clubs}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          isLocationsLoading={isLocationsLoading}
          isClubsLoading={isClubsLoading}
          isCourtStructureTypesLoading={isCourtStructureTypesLoading}
          isCourtSurfaceTypesLoading={isCourtSurfaceTypesLoading}
          locationId={locationId}
          handleLocation={handleLocation}
          clubId={clubId}
          handleClubId={handleClubId}
          courtSurfaceType={courtSurfaceType}
          courtStructureType={courtStructureType}
          handleCourtSurfaceType={handleCourtSurfaceType}
          handleCourtStructureType={handleCourtStructureType}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};

export default Explore;

import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../store/hooks";

import ExploreHero from "../../components/explore/hero/ExploreHero";
import ExploreNavigation from "../../components/explore/navigation/ExploreNavigation";
import ExplorePlayers from "../../components/explore/explore-results/explore-players/ExplorePlayers";
import ExploreTrainers from "../../components/explore/explore-results/explore-trainers/ExploreTrainers";
import ExploreClubs from "../../components/explore/explore-results/explore-clubs/ExploreClubs";
import ExploreCourts from "../../components/explore/explore-results/explore-courts/ExploreCourts";

import { useGetPlayersQuery } from "../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../api/endpoints/PlayerLevelsApi";
import { useGetTrainersQuery } from "../../api/endpoints/TrainersApi";
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

  const {
    data: players,
    isLoading: isPlayersLoading,
    isError,
  } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

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

  return (
    <div className={styles["explore-container"]}>
      <ExploreHero />
      <ExploreNavigation display={display} handleDisplay={handleDisplay} />
      {display === "players" && (
        <ExplorePlayers
          user={user}
          players={players}
          locations={locations}
          playerLevels={playerLevels}
          isPlayersLoading={isPlayersLoading}
          isLocationsLoading={isLocationsLoading}
          isPlayerLevelsLoading={isPlayerLevelsLoading}
        />
      )}
      {display === "trainers" && (
        <ExploreTrainers
          user={user}
          trainers={trainers}
          locations={locations}
          trainerExperienceTypes={trainerExperienceTypes}
          clubStaff={clubStaff}
          clubs={clubs}
          isTrainersLoading={isTrainersLoading}
          isLocationsLoading={isLocationsLoading}
          isTrainerExperienceTypesLoading={isTrainerExperienceTypesLoading}
          isClubStaffLoading={isClubStaffLoading}
          isClubsLoading={isClubsLoading}
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
          isLocationsLoading={isLocationsLoading}
          isClubsLoading={isClubsLoading}
          isClubTypesLoading={isClubTypesLoading}
          isCourtsLoading={isCourtsLoading}
          isClubStaffLoading={isClubStaffLoading}
        />
      )}
      {display === "courts" && (
        <ExploreCourts
          user={user}
          locations={locations}
          clubs={clubs}
          courts={courts}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          isLocationsLoading={isLocationsLoading}
          isClubsLoading={isClubsLoading}
          isCourtsLoading={isCourtsLoading}
          isCourtStructureTypesLoading={isCourtStructureTypesLoading}
          isCourtSurfaceTypesLoading={isCourtSurfaceTypesLoading}
        />
      )}
    </div>
  );
};

export default Explore;

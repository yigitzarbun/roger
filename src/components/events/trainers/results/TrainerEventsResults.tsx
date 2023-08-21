import React from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";

const TrainerEventsResults = () => {
  return <div></div>;
};
export default TrainerEventsResults;

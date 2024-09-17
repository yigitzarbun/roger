import React, { useState } from "react";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../store/hooks";
import { useGetTournamentByClubUserIdQuery } from "../../../api/endpoints/TournamentsApi";
import ClubTournamentsResults from "../../components/club-tournaments/results/ClubTournamentsResults";
import { useGetClubByUserIdQuery } from "../../../api/endpoints/ClubsApi";
import PageLoading from "../../components/loading/PageLoading";

const ClubTournaments = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubTournaments,
    isLoading: isClubTournamentsLoading,
    refetch: refetchClubTournaments,
  } = useGetTournamentByClubUserIdQuery(user?.user?.user_id);

  const {
    data: clubDetails,
    isLoading: isClubDetailsLoading,
    refetch: refetchClubDetails,
  } = useGetClubByUserIdQuery(user?.user?.user_id);

  if (isClubTournamentsLoading || isClubDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["club-tournaments"]}>
      <ClubTournamentsResults
        clubTournaments={clubTournaments}
        user={user}
        clubDetails={clubDetails}
        refetchClubDetails={refetchClubDetails}
        refetchClubTournaments={refetchClubTournaments}
      />
    </div>
  );
};

export default ClubTournaments;

import React, { useState } from "react";
import styles from "./styles.module.scss";
import PlayerTournamentsNavigation from "../../components/player-tournaments/navigation/PlayerTournamentsNavigation";
import AllTournaments from "../../components/player-tournaments/all-tournaments/AllTournaments";
import { useGetPaginatedPlayerActiveTournamentsQuery } from "../../api/endpoints/TournamentParticipantsApi";
import { useAppSelector } from "../../store/hooks";

const Tournaments = () => {
  const [display, setDisplay] = useState("all-tournaments");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: myTournaments,
    isLoading: isMyTournamentsLoading,
    refetch: refetchMyTournaments,
  } = useGetPaginatedPlayerActiveTournamentsQuery({
    currentPage: 1,
    textSearch: "",
    locationId: null,
    clubUserId: null,
    playerUserId: user?.user?.user_id,
  });
  console.log(myTournaments);
  return (
    <div className={styles["tournaments-container"]}>
      <PlayerTournamentsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "all-tournaments" && (
        <AllTournaments
          myTournaments={myTournaments}
          refetchMyTournaments={refetchMyTournaments}
        />
      )}
    </div>
  );
};

export default Tournaments;

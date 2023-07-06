import styles from "./styles.module.scss";

import MatchHero from "../../components/match/hero/MatchHero";
import MatchResults from "../../components/match/results/MatchResults";
import MatchSearch from "../../components/match/search/MatchSearch";

const Match = () => {
  return (
    <div className={styles["match-container"]}>
      <MatchHero />
      <MatchSearch />
      <MatchResults />
    </div>
  );
};
export default Match;

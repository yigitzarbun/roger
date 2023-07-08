import MatchInviteForm from "../../../components/invite/match/form/MathInviteForm";
import MatchInviteHero from "../../../components/invite/match/hero/MatchInviteHero";

import styles from "./styles.module.scss";

const MatchInivte = () => {
  return (
    <div className={styles["invite-container"]}>
      <MatchInviteHero />
      <MatchInviteForm />
    </div>
  );
};

export default MatchInivte;

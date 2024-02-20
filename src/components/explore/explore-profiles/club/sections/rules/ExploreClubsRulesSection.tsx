import React from "react";

import styles from "./styles.module.scss";
import { Club } from "../../../../../../api/endpoints/ClubsApi";

interface ExploreClubsRulesSectionProps {
  selectedClub: any;
}
const ExploreClubsRulesSection = (props: ExploreClubsRulesSectionProps) => {
  const { selectedClub } = props;
  return (
    <div className={styles["rules-section"]}>
      <h2>Kurallar</h2>
      <div className={styles["rules-container"]}>
        <div className={styles["rule-container"]}>
          <h4>Antreman / Maç</h4>
          <p className={styles["rule-text"]}>{`${
            selectedClub?.[0]?.is_player_subscription_required
              ? "Oyuncuların kort kiralamak için kulübe üye olmaları gerekir"
              : "Oyuncuların kort kiralamak için kulübe üye olmalarına gerek yoktur"
          } `}</p>
        </div>
        <div className={styles["rule-container"]}>
          <h4>Ders</h4>
          <p className={styles["rule-text"]}>{`${
            selectedClub?.[0]?.is_player_lesson_subscription_required &&
            selectedClub?.[0]?.is_trainer_subscription_required
              ? "Eğitmenin kulüp çalışanı, oyuncunun kulüp üyesi olması gerekir"
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.[0]?.is_trainer_subscription_required === true
              ? "Eğitmenin kulüp çalışanı olması yeterlidir"
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  true &&
                selectedClub?.[0]?.is_trainer_subscription_required === false
              ? "Oyuncunun kulüp üyesi olması yeterlidir"
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.[0]?.is_trainer_subscription_required === false
              ? "Oyuncunun üye olmasına veya eğitmenin kulüp çalışanı olmasına gerek yoktur"
              : ""
          } `}</p>
        </div>
        <div className={styles["rule-container"]}>
          <h4>Ücret</h4>
          <p className={styles["rule-text"]}>
            {selectedClub?.[0]?.higher_price_for_non_subscribers
              ? "Üyelere farklı fiyat uygulanır"
              : "Üyelere farklı fiyat uygulanmaz"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ExploreClubsRulesSection;

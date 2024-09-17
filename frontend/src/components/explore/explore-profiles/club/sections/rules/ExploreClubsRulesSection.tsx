import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface ExploreClubsRulesSectionProps {
  selectedClub: any;
}
const ExploreClubsRulesSection = (props: ExploreClubsRulesSectionProps) => {
  const { selectedClub } = props;

  const { t } = useTranslation();

  return (
    <div className={styles["rules-section"]}>
      <h2>{t("clubRulesTitle")}</h2>
      <div className={styles["rules-container"]}>
        <div className={styles["rule-container"]}>
          <h4>{t("trainingMatchRuleTitle")}</h4>
          <p className={styles["rule-text"]}>{`${
            selectedClub?.[0]?.is_player_subscription_required
              ? t("playerSubscriptionRequired")
              : t("playerSubscriptionNotRequired")
          } `}</p>
        </div>
        <div className={styles["rule-container"]}>
          <h4>{t("lessonTitle")}</h4>
          <p className={styles["rule-text"]}>{`${
            selectedClub?.[0]?.is_player_lesson_subscription_required &&
            selectedClub?.[0]?.is_trainer_subscription_required
              ? t("clubStaffPlayerSubscriptionRequired")
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.[0]?.is_trainer_subscription_required === true
              ? t("clubStaffRequiredOnly")
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  true &&
                selectedClub?.[0]?.is_trainer_subscription_required === false
              ? t("playerSubscriptionRequiredOnly")
              : selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  false &&
                selectedClub?.[0]?.is_trainer_subscription_required === false
              ? t("clubStaffPlayerSubscriptionNotRequired")
              : ""
          } `}</p>
        </div>
        <div className={styles["rule-container"]}>
          <h4>{t("tablePriceHeader")}</h4>
          <p className={styles["rule-text"]}>
            {selectedClub?.[0]?.higher_price_for_non_subscribers
              ? t("differentPriceForMembers")
              : t("samePriceForMembers")}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ExploreClubsRulesSection;

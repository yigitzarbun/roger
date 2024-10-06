import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEdit } from "react-icons/ai";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetClubByUserIdQuery } from "../../../../../api/endpoints/ClubsApi";
import UpdateCourtRuleModal from "./court-rule-modal/UpdateCourtRuleModal";
import UpdateLessonRuleModal from "./lesson-rule-modal/UpdateLessonRuleModal";
import UpdatePlayerRuleModal from "./player-rule-modal/UpdatePlayerRuleModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../../api/endpoints/ClubSubscriptionPackagesApi";

const ClubRules = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const {
    data: selectedClub,
    isLoading: isClubDetailsLoading,
    refetch: refetchClubDetails,
  } = useGetClubByUserIdQuery(user?.user?.user_id);

  const {
    data: clubHasSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    club_id: user?.user?.user_id,
  });

  const [isCourtRuleModalOpen, setIsCourtRuleModalOpen] = useState(false);

  const openCourtRuleModal = () => {
    setIsCourtRuleModalOpen(true);
  };

  const [isLessonRuleModalOpen, setIsLessonRuleModalOpen] = useState(false);

  const openLessonRuleModal = () => {
    setIsLessonRuleModalOpen(true);
  };

  const [isPlayerRuleModalOpen, setIsPlayerModalOpen] = useState(false);

  const handlePlayerRuleModal = () => {
    setIsPlayerModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCourtRuleModalOpen(false);
    setIsLessonRuleModalOpen(false);
    setIsPlayerModalOpen(false);
  };

  useEffect(() => {
    refetchClubDetails();
  }, [isCourtRuleModalOpen, isLessonRuleModalOpen, isPlayerRuleModalOpen]);

  if (isClubDetailsLoading || isClubSubscriptionPackagesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["club-rules-container"]}>
      <h4>{t("clubRulesTitle")}</h4>
      <div className={styles["tables-container"]}>
        <table
          className={styles["player-rules-table"]}
          onClick={handlePlayerRuleModal}
        >
          <thead>
            <tr>
              <th>{t("trainingMatchRuleTitle")}</th>
              <th>
                <AiOutlineEdit className={styles.edit} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles["rule-row"]}>
              <td>{`${
                selectedClub?.[0]?.is_player_subscription_required === true
                  ? t("playerSubscriptionRequired")
                  : t("playerSubscriptionNotRequired")
              }`}</td>
            </tr>
          </tbody>
        </table>
        <table
          className={styles["lesson-rules-table"]}
          onClick={openLessonRuleModal}
        >
          <thead>
            <tr>
              <th>{t("lessonTitle")}</th>
              <th>
                <AiOutlineEdit className={styles.edit} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles["rule-row"]}>
              <td>
                {selectedClub?.[0]?.is_trainer_subscription_required ===
                  false &&
                selectedClub?.[0]?.is_player_lesson_subscription_required ===
                  false
                  ? t("playerOrTrainerSubscriptionNotRequired")
                  : selectedClub?.[0]?.is_trainer_subscription_required ===
                      false &&
                    selectedClub?.[0]
                      ?.is_player_lesson_subscription_required === true
                  ? t("playerSubscriptionRequiredOnly")
                  : selectedClub?.[0]?.is_trainer_subscription_required ===
                      true &&
                    selectedClub?.[0]
                      ?.is_player_lesson_subscription_required === false
                  ? t("clubStaffRequiredOnly")
                  : selectedClub?.[0]?.is_trainer_subscription_required ===
                      true &&
                    selectedClub?.[0]
                      ?.is_player_lesson_subscription_required === true
                  ? t("clubStaffPlayerSubscriptionRequired")
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
        <table
          className={styles["court-rules-table"]}
          onClick={openCourtRuleModal}
        >
          <thead>
            <tr>
              <th>{t("courtPrice")}</th>
              <th>
                <AiOutlineEdit className={styles.edit} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles["rule-row"]}>
              <td>{` ${
                selectedClub?.[0]?.higher_price_for_non_subscribers === true
                  ? t("differentCourtPricingToExternalApplies")
                  : t("differentCourtPricingToExternalNotApplies")
              }`}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {isCourtRuleModalOpen && (
        <UpdateCourtRuleModal
          isCourtRuleModalOpen={isCourtRuleModalOpen}
          handleCloseModal={handleCloseModal}
          selectedClub={selectedClub}
          refetchClubDetails={refetchClubDetails}
          clubHasSubscriptionPackages={clubHasSubscriptionPackages}
        />
      )}
      {isLessonRuleModalOpen && (
        <UpdateLessonRuleModal
          isLessonRuleModalOpen={isLessonRuleModalOpen}
          handleCloseModal={handleCloseModal}
          selectedClub={selectedClub}
          refetchClubDetails={refetchClubDetails}
          clubHasSubscriptionPackages={clubHasSubscriptionPackages}
        />
      )}
      {isPlayerRuleModalOpen && (
        <UpdatePlayerRuleModal
          isPlayerRuleModalOpen={isPlayerRuleModalOpen}
          handleCloseModal={handleCloseModal}
          selectedClub={selectedClub}
          refetchClubDetails={refetchClubDetails}
          clubHasSubscriptionPackages={clubHasSubscriptionPackages}
        />
      )}
    </div>
  );
};

export default ClubRules;

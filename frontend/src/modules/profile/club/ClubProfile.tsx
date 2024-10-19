import React, { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import styles from "./styles.module.scss";
import ClubAccountDetails from "../../../components/profile/club/account-details/ClubAccountDetails";
import ClubBankAccountDetails from "../../../components/profile/club/bank-details/ClubBankAccountDetails";
import ClubRules from "../../../components/profile/club/club-rules/ClubRules";
import { useGetClubProfileDetailsQuery } from "../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../components/loading/PageLoading";
import ClubProfileNavigation from "../../../components/profile/club/club-profile-nav/ClubProfileNavigation";
import ClubOtherDetails from "../../../components/profile/club/club-other-details/ClubOtherDetails";
import { useTranslation } from "react-i18next";

const ClubProfile = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const {
    data: clubDetails,
    isLoading: isClubDetailsLoading,
    refetch: refetchClubDetails,
  } = useGetClubProfileDetailsQuery(user?.user?.user_id);

  const [page, setPage] = useState("account");

  const handlePage = (page: string) => {
    setPage(page);
  };
  if (isClubDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["club-profile-container"]}>
      <div className={styles["title-container"]}>
        <h2>{t("settingsTitle")}</h2>
      </div>
      <div className={styles.main}>
        <ClubProfileNavigation handlePage={handlePage} page={page} />
        <div className={styles.sections}>
          {page === "account" && (
            <ClubAccountDetails
              clubDetails={clubDetails}
              refetchClubDetails={refetchClubDetails}
            />
          )}
          {page === "payment" && (
            <ClubBankAccountDetails
              clubDetails={clubDetails}
              refetchClubDetails={refetchClubDetails}
            />
          )}
          {page === "rules" && <ClubRules />}
          {page === "other" && <ClubOtherDetails clubDetails={clubDetails} s />}
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;

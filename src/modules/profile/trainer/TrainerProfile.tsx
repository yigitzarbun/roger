import React, { useState } from "react";

import styles from "./styles.module.scss";
import TrainerAccountDetails from "../../../components/profile/trainer/account-details/TrainerAccountDetails";
import TrainerBankAccountDetails from "../../../components/profile/trainer/bank-details/TrainerBankAccountDetails";
import { useAppSelector } from "../../../store/hooks";
import TrainerProfileNavigation from "../../../components/profile/trainer/trainer-profile-nav/TrainerProfileNavigation";
import { useGetTrainerProfileDetailsQuery } from "../../../api/endpoints/TrainersApi";
import PageLoading from "../../../components/loading/PageLoading";

const TrainerProfile = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const [page, setPage] = useState("account");

  const handlePage = (page: string) => {
    setPage(page);
  };

  const {
    data: trainerDetails,
    isLoading: isTrainerDetailsLoading,
    refetch: refetchTrainerDetails,
  } = useGetTrainerProfileDetailsQuery(user?.user?.user_id);

  if (isTrainerDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainer-profile-container"]}>
      <div className={styles["title-container"]}>
        <h2>Hesap Ayarları</h2>
      </div>
      <div className={styles.main}>
        <TrainerProfileNavigation page={page} handlePage={handlePage} />
        <div className={styles.sections}>
          {page === "account" && (
            <TrainerAccountDetails
              trainerDetails={trainerDetails?.[0]}
              refetchTrainerDetails={refetchTrainerDetails}
            />
          )}
          {page === "payment" && <TrainerBankAccountDetails />}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;

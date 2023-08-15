import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

const ClubRules = () => {
  const user = useAppSelector((store) => store.user.user);
  console.log(user);
  return (
    <div className={styles["club-rules-container"]}>
      <h2>Kulüp Kuralları</h2>
      <table>
        <thead>
          <tr>
            <td>Kural</td>
            <td>Durum</td>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["rule-row"]}>
            <td>Kulübe üye olmayan oyuncular da kort kirayalabilir</td>
            <td>
              {user?.clubDetails?.isPlayerSubscriptionRequired === true
                ? "Hayır"
                : "Evet"}
            </td>
          </tr>
          <tr className={styles["rule-row"]}>
            <td>Kulübe üye olmayan eğitmenler da kort kirayalabilir</td>
            <td>
              {user?.clubDetails?.isTrainerSubscriptionRequired === true
                ? "Hayır"
                : "Evet"}
            </td>
          </tr>
        </tbody>
      </table>
      <button>Değiştir</button>
    </div>
  );
};

export default ClubRules;

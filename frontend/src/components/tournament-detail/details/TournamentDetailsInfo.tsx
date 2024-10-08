import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface TournamentDetailsInfo {
  tournamentDetails: any;
}
const TournamentDetailsInfo = (props: TournamentDetailsInfo) => {
  const { tournamentDetails } = props;

  const tournamentInfo = tournamentDetails.tournament;

  const date = new Date();

  const currentYear = date.getFullYear();

  const { t } = useTranslation();

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>
            {`${tournamentInfo?.tournament_name} Bilgileri`}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t("tableTournamentName")}</th>
            <th>{t("userTypeClub")}</th>
            <th>{t("tableLocationHeader")}</th>
            <th>{t("start")}</th>
            <th>{t("end")}</th>
            <th>{t("deadline")}</th>
            <th>{t("admissionFee")}</th>
            <th>{t("gender")}</th>
            <th>{t("participants")}</th>
            <th>{t("membershipRule")}</th>
            <th>{t("ageGap")}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            key={tournamentInfo.tournament_id}
            className={styles["tournament-row"]}
          >
            <td>{tournamentInfo.tournament_name}</td>
            <td>{tournamentInfo.club_name}</td>
            <td>{tournamentInfo.location_name}</td>
            <td>{tournamentInfo.start_date?.slice(0, 10)}</td>
            <td>{tournamentInfo.end_date?.slice(0, 10)}</td>
            <td>{tournamentInfo.application_deadline?.slice(0, 10)}</td>
            <td>{`${tournamentInfo.application_fee} TL`}</td>
            <td>{tournamentInfo.tournament_gender}</td>
            <td>{tournamentInfo.participant_count}</td>
            <td>{tournamentInfo.club_subscription_required ? "Var" : "Yok"}</td>
            <td>{`${currentYear - tournamentInfo?.min_birth_year} - ${
              currentYear - tournamentInfo?.max_birth_year
            }`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TournamentDetailsInfo;

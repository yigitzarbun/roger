import React from "react";
import styles from "./styles.module.scss";

interface TournamentDetailsInfo {
  tournamentDetails: any;
}
const TournamentDetailsInfo = (props: TournamentDetailsInfo) => {
  const { tournamentDetails } = props;
  const tournamentInfo = tournamentDetails.tournament;
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>
            {`${tournamentInfo?.tournament_name}`}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Turnuva Adı</th>
            <th>Kulüp</th>
            <th>Konum</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
            <th>Son Başvuru</th>
            <th>Katılım Ücreti</th>
            <th>Cinsiyet</th>
            <th>Katılımcı</th>
            <th>Üyelik Şartı</th>
            <th>Yaş Aralığı</th>
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
            <td>
              {tournamentInfo.tournament_gender === "male"
                ? t("male")
                : t("female")}
            </td>
            <td>{tournamentInfo.participant_count}</td>
            <td>
              {tournamentInfo.club_subscription_required ? t("yes") : t("no")}
            </td>
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

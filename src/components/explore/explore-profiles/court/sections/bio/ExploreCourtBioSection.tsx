import React from "react";
import styles from "./styles.module.scss";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import { SlOptions } from "react-icons/sl";

interface ExploreCourtBioSectionProps {
  selectedCourt: any;
}
const ExploreCourtBioSection = (props: ExploreCourtBioSectionProps) => {
  const { selectedCourt } = props;
  const profileImage = selectedCourt?.[0]?.courtImage;

  return (
    <div className={styles["bio-section"]}>
      <div className={styles["image-container"]}>
        <img
          src={
            profileImage
              ? `${localUrl}/${profileImage}`
              : "/images/icons/avatar.jpg"
          }
          alt="player picture"
          className={styles["profile-image"]}
        />

        <div className={styles["name-container"]}>
          <h2>{`${selectedCourt?.[0]?.court_name}`}</h2>
          <h4>Kort</h4>
        </div>
      </div>
      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Mekan</th>
                  <th>Zemin</th>
                  <th>Kulüp</th>
                  <th>Konum</th>
                  <th>Açılış</th>
                  <th>Kapanış</th>
                  <th>
                    {selectedCourt?.[0]?.higher_price_for_non_subscribers &&
                    selectedCourt?.[0]?.price_hour_non_subscriber
                      ? "Üye Ücret"
                      : "Ücret"}
                  </th>
                  {selectedCourt?.[0]?.higher_price_for_non_subscribers &&
                    selectedCourt?.[0]?.price_hour_non_subscriber && (
                      <th>Misafir Ücret</th>
                    )}
                </tr>
              </thead>
              <tbody>
                <tr className={styles["court-row"]}>
                  <td>{selectedCourt?.[0]?.court_structure_type_name}</td>
                  <td>{selectedCourt?.[0]?.court_surface_type_name}</td>
                  <td>{selectedCourt?.[0]?.club_name}</td>
                  <td>{selectedCourt?.[0]?.location_name}</td>
                  <td>{selectedCourt?.[0]?.opening_time.slice(0, 5)}</td>
                  <td>{selectedCourt?.[0]?.closing_time.slice(0, 5)}</td>
                  <td>{`${selectedCourt?.[0]?.price_hour} TL / Saat`}</td>
                  {selectedCourt?.[0]?.higher_price_for_non_subscribers &&
                    selectedCourt?.[0]?.price_hour_non_subscriber && (
                      <td>{`${selectedCourt?.[0]?.price_hour_non_subscriber} TL / Saat`}</td>
                    )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SlOptions className={styles.icon} />
    </div>
  );
};
export default ExploreCourtBioSection;

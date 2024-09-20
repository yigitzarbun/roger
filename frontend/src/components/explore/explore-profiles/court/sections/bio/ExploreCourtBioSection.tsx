import React from "react";
import styles from "./styles.module.scss";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import { useTranslation } from "react-i18next";

interface ExploreCourtBioSectionProps {
  selectedCourt: any;
}
const ExploreCourtBioSection = (props: ExploreCourtBioSectionProps) => {
  const { selectedCourt } = props;

  const profileImage = selectedCourt?.[0]?.courtImage;

  const { t } = useTranslation();

  return (
    <div className={styles["bio-section"]}>
      <div className={styles["image-container"]}>
        <img
          src={
            profileImage
              ? `${imageUrl}/${profileImage}`
              : "/images/icons/avatar.jpg"
          }
          alt="player picture"
          className={styles["profile-image"]}
        />

        <div className={styles["name-container"]}>
          <h2>{`${selectedCourt?.[0]?.court_name}`}</h2>
          <h4>{t("tableCourtHeader")}</h4>
        </div>
      </div>
      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>{t("tableStructureHeader")}</th>
                  <th>{t("tableSurfaceHeader")}</th>
                  <th>{t("tableClubHeader")}</th>
                  <th>{t("tableLocationHeader")}</th>
                  <th>{t("tableOpeningTimeHeader")}</th>
                  <th>{t("tableClosingTimeHeader")}</th>
                  <th>
                    {selectedCourt?.[0]?.higher_price_for_non_subscribers &&
                    selectedCourt?.[0]?.price_hour_non_subscriber
                      ? t("tableMemberPrice")
                      : t("tablePriceHeader")}
                  </th>
                  {selectedCourt?.[0]?.higher_price_for_non_subscribers &&
                    selectedCourt?.[0]?.price_hour_non_subscriber && (
                      <th>{t("tablePriceHeader")}</th>
                    )}
                </tr>
              </thead>
              <tbody>
                <tr className={styles["court-row"]}>
                  <td>
                    {selectedCourt?.[0]?.court_structure_type_id === 1
                      ? t("courtStructureOpen")
                      : selectedCourt?.[0]?.court_structure_type_id === 2
                      ? t("courtStructureClosed")
                      : t("courtStructureHybrid")}
                  </td>
                  <td>
                    {selectedCourt?.[0]?.court_surface_type_id === 1
                      ? t("courtSurfaceHard")
                      : selectedCourt?.[0]?.court_surface_type_id === 2
                      ? t("courtSurfaceClay")
                      : selectedCourt?.[0]?.court_surface_type_id === 3
                      ? t("courtSurfaceGrass")
                      : t("courtSurfaceCarpet")}
                  </td>
                  <td>{selectedCourt?.[0]?.club_name}</td>
                  <td>{selectedCourt?.[0]?.location_name}</td>
                  <td>{selectedCourt?.[0]?.opening_time.slice(0, 5)}</td>
                  <td>{selectedCourt?.[0]?.closing_time.slice(0, 5)}</td>
                  <td>{`${selectedCourt?.[0]?.price_hour} TL`}</td>
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
    </div>
  );
};
export default ExploreCourtBioSection;

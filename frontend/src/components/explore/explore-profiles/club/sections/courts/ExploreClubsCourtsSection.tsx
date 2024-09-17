import React, { useState } from "react";
import { Link } from "react-router-dom";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import paths from "../../../../../../routing/Paths";
import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import PageLoading from "../../../../../../components/loading/PageLoading";
import ExploreClubCourtsModal from "../../modals/courts/ExploreClubCourtsModal";
import { useGetClubCourtsQuery } from "../../../../../../../api/endpoints/CourtsApi";
import { useTranslation } from "react-i18next";

interface ExploreClubsCourtsSectionProps {
  selectedClub: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
}

const ExploreClubsCourtsSection = (props: ExploreClubsCourtsSectionProps) => {
  const { selectedClub, isUserPlayer, isUserTrainer } = props;

  const { t } = useTranslation();

  const { data: courts, isLoading: isCourtsLoading } = useGetClubCourtsQuery(
    selectedClub?.[0]?.club_id
  );

  const [isCourtsModalOpen, setIsCourtsModalOpen] = useState(false);

  const openCourtsModal = () => {
    setIsCourtsModalOpen(true);
  };

  const closeCourtsModal = () => {
    setIsCourtsModalOpen(false);
  };

  if (isCourtsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["courts-section"]}>
      <h2>{t("courtsTitle")}</h2>
      {courts?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableSurfaceHeader")}</th>
              <th>{t("tableStructureHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableCourtPriceHeader")}</th>
              {selectedClub?.[0]?.higher_price_for_non_subscribers && (
                <th>{t("tablePriceGuestHeader")}</th>
              )}
              <th>{t("tableOpeningTimeHeader")}</th>
              <th>{t("tableClosingTimeHeader")}</th>
              <th>{t("tableStatusHeader")}</th>
              <th>{t("tableBookingHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {courts?.slice(courts?.length - 2).map((court) => (
              <tr key={court.court_id} className={styles["court-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}>
                    {
                      <img
                        src={
                          court.courtImage
                            ? `${localUrl}/${court.courtImage}`
                            : "/images/icons/avatar.jpg"
                        }
                        alt="court picture"
                        className={styles["court-image"]}
                      />
                    }
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                    className={styles["court-name"]}
                  >
                    {court.court_name}
                  </Link>
                </td>
                <td>
                  {court?.court_surface_type_id === 1
                    ? t("courtSurfaceHard")
                    : court?.court_surface_type_id === 2
                    ? t("courtSurfaceClay")
                    : court?.court_surface_type_id === 3
                    ? t("courtSurfaceGrass")
                    : t("courtSurfaceCarpet")}
                </td>
                <td>
                  {court?.court_structure_type_id === 1
                    ? t("courtStructureOpen")
                    : court?.court_structure_type_id === 2
                    ? t("courtStructureClosed")
                    : t("courtStructureHybrid")}
                </td>
                <td>{court?.location_name}</td>
                <td>{court?.price_hour} TL</td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers && (
                  <td>{court.price_hour_non_subscriber} TL</td>
                )}
                <td>{court?.opening_time.slice(0, 5)}</td>
                <td>{court?.closing_time.slice(0, 5)}</td>
                <td>
                  {court?.is_active ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    <ImBlocked className={styles.blocked} />
                  )}
                </td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}>
                    <button>
                      {isUserPlayer || isUserTrainer
                        ? t("tableBookCourtButton")
                        : t("tableViewHeader")}
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("clubHasNoCourts")}</p>
      )}
      {courts?.length > 0 && (
        <button onClick={openCourtsModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

      {isCourtsModalOpen && (
        <ExploreClubCourtsModal
          isCourtsModalOpen={isCourtsModalOpen}
          closeCourtsModal={closeCourtsModal}
          selectedClub={selectedClub}
          courts={courts}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
    </div>
  );
};

export default ExploreClubsCourtsSection;

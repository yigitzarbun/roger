import React, { useState } from "react";

import { Link } from "react-router-dom";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import paths from "../../../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";
import ExploreClubCourtsModal from "../../modals/courts/ExploreClubCourtsModal";

import { useGetCourtsByFilterQuery } from "../../../../../../api/endpoints/CourtsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../../../api/endpoints/CourtStructureTypesApi";

import { Club } from "../../../../../../api/endpoints/ClubsApi";

interface ExploreClubsCourtsSectionProps {
  selectedClub: any;
}

const ExploreClubsCourtsSection = (props: ExploreClubsCourtsSectionProps) => {
  const { selectedClub } = props;

  const { data: courts, isLoading: isCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: selectedClub?.[0]?.club_id,
    });

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const [isCourtsModalOpen, setIsCourtsModalOpen] = useState(false);
  const openCourtsModal = () => {
    setIsCourtsModalOpen(true);
  };
  const closeCourtsModal = () => {
    setIsCourtsModalOpen(false);
  };

  if (
    isCourtsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["courts-section"]}>
      <h2>Kortlar</h2>
      {courts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kort</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              {selectedClub?.[0]?.higher_price_for_non_subscribers && (
                <th>Fiyat (Üye değil)</th>
              )}
              <th>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {courts?.slice(courts.length - 2).map((court) => (
              <tr key={court.court_id}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}>
                    {
                      <img
                        src={
                          court.image
                            ? `${localUrl}/${court.image}`
                            : "/images/icons/avatar.png"
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
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        court.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        court.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers &&
                court.price_hour_non_subscriber ? (
                  <td>{court.price_hour_non_subscriber}</td>
                ) : (
                  selectedClub?.[0]?.higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber &&
                  "-"
                )}

                <td>{court.price_hour}</td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}>
                    <button>Rezerve et</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz kulübe ait kort bulunmamaktadır</p>
      )}
      <button onClick={openCourtsModal}>Tümünü Görüntüle</button>
      {isCourtsModalOpen && (
        <ExploreClubCourtsModal
          isCourtsModalOpen={isCourtsModalOpen}
          closeCourtsModal={closeCourtsModal}
          selectedClub={selectedClub}
        />
      )}
    </div>
  );
};

export default ExploreClubsCourtsSection;

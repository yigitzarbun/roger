import React, { useState } from "react";

import { Link } from "react-router-dom";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import paths from "../../../../../../routing/Paths";

import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";

import PageLoading from "../../../../../../components/loading/PageLoading";
import ExploreClubCourtsModal from "../../modals/courts/ExploreClubCourtsModal";

import { useGetPaginatedCourtsQuery } from "../../../../../../api/endpoints/CourtsApi";

interface ExploreClubsCourtsSectionProps {
  selectedClub: any;
}

const ExploreClubsCourtsSection = (props: ExploreClubsCourtsSectionProps) => {
  const { selectedClub } = props;

  const { data: courts, isLoading: isCourtsLoading } =
    useGetPaginatedCourtsQuery({
      clubId: selectedClub?.[0]?.club_id,
    });

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
      <h2>Kortlar</h2>
      {courts?.courts?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Kort</th>
              <th>İsim</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Konum</th>
              <th>Fiyat</th>
              {selectedClub?.[0]?.higher_price_for_non_subscribers && (
                <th>Fiyat (Üye değil)</th>
              )}
              <th>Açılış</th>
              <th>Kapanış</th>
              <th>Statü</th>
              <th>Rezervasyon</th>
            </tr>
          </thead>
          <tbody>
            {courts?.courts?.slice(courts?.courts?.length - 2).map((court) => (
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
                <td>{court?.court_surface_type_name}</td>
                <td>{court?.court_structure_type_name}</td>
                <td>{court?.location_name}</td>
                <td>{court?.price_hour}</td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers && (
                  <td>{court.price_hour_non_subscriber}</td>
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
      {courts?.courts?.length > 0 && (
        <button onClick={openCourtsModal}>Tümünü Görüntüle</button>
      )}

      {isCourtsModalOpen && (
        <ExploreClubCourtsModal
          isCourtsModalOpen={isCourtsModalOpen}
          closeCourtsModal={closeCourtsModal}
          selectedClub={selectedClub}
          courts={courts?.courts}
        />
      )}
    </div>
  );
};

export default ExploreClubsCourtsSection;

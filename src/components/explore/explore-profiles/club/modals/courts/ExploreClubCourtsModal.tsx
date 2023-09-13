import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { Club } from "../../../../../../api/endpoints/ClubsApi";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";

import { useGetCourtsByFilterQuery } from "../../../../../../api/endpoints/CourtsApi";
import { useGetCourtStructureTypesQuery } from "../../../../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../../../api/endpoints/CourtSurfaceTypesApi";

interface ExploreClubCourtsModalProps {
  isCourtsModalOpen: boolean;
  closeCourtsModal: () => void;
  selectedClub: Club;
}

const ExploreClubCourtsModal = (props: ExploreClubCourtsModalProps) => {
  const { isCourtsModalOpen, closeCourtsModal, selectedClub } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: myCourts, isLoading: isMyCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: selectedClub?.[0]?.club_id,
    });

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  if (
    isMyCourtsLoading ||
    isCourtStructureTypesLoading ||
    isCourtSurfaceTypesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isCourtsModalOpen}
      onRequestClose={closeCourtsModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Kortlar</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeCourtsModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["table-container"]}>
        {myCourts?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Statü</th>
                <th>Kort</th>
                <th>Yüzey</th>
                <th>Mekan</th>
                <th>Açılış</th>
                <th>Kapanış</th>
                {selectedClub?.higher_price_for_non_subscribers && (
                  <th>Fiyat (Üye değil)</th>
                )}
                <th>Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {myCourts?.map((court) => (
                <tr key={court.court_id}>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                    >
                      <img
                        src={
                          court.image
                            ? `${localUrl}/${court.image}`
                            : "/images/icons/avatar.png"
                        }
                        alt="court picture"
                        className={styles["court-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    {court.is_active === true ? (
                      <p className={styles["active-text"]}>Aktif</p>
                    ) : (
                      <p className={styles["inactive-text"]}>Bloke</p>
                    )}
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
                  <td>{court.opening_time.slice(0, 5)}</td>
                  <td>{court.closing_time.slice(0, 5)}</td>
                  {selectedClub?.higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber ? (
                    <td>{court.price_hour_non_subscriber}</td>
                  ) : (
                    selectedClub?.higher_price_for_non_subscribers &&
                    court.price_hour_non_subscriber &&
                    "-"
                  )}
                  <td>{court.price_hour}</td>

                  <td>
                    {(isUserPlayer || isUserTrainer) && (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                        className={styles["book-button"]}
                      >
                        Rezerve et
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz kulübe ait kort bulunmamaktadır</p>
        )}
      </div>
    </ReactModal>
  );
};

export default ExploreClubCourtsModal;

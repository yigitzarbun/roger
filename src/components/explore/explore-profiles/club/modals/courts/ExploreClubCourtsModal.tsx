import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";

interface ExploreClubCourtsModalProps {
  isCourtsModalOpen: boolean;
  closeCourtsModal: () => void;
  selectedClub: any;
  courts: any;
}

const ExploreClubCourtsModal = (props: ExploreClubCourtsModalProps) => {
  const { isCourtsModalOpen, closeCourtsModal, selectedClub, courts } = props;

  return (
    <ReactModal
      isOpen={isCourtsModalOpen}
      onRequestClose={closeCourtsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeCourtsModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>Kortlar</h1>
        </div>
        <div className={styles["table-container"]}>
          {courts?.length > 0 ? (
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
                {courts?.map((court) => (
                  <tr key={court.court_id} className={styles["court-row"]}>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                      >
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
                      <Link
                        to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                      >
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
        </div>
      </div>
    </ReactModal>
  );
};

export default ExploreClubCourtsModal;

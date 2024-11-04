import React, { useState } from "react";
import ReactModal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../../../routing/Paths";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import { useTranslation } from "react-i18next";
import AddPlayerCardDetails from "../../../../../../components/profile/player/card-payments/add-card-details/AddPlayerCardDetails";
import { useGetTrainerProfileDetailsQuery } from "../../../../../../../api/endpoints/TrainersApi";
import EditTrainerBankDetails from "../../../../../../components/profile/trainer/bank-details/edit-bank-details/EditTrainerBankDetails";
import { Bank } from "../../../../../../../api/endpoints/BanksApi";

interface ExploreClubCourtsModalProps {
  isCourtsModalOpen: boolean;
  closeCourtsModal: () => void;
  selectedClub: any;
  courts: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
  playerDetails: any;
  refetchPlayerDetails: () => void;
  cardDetailsExist: boolean;
  trainerDetails: any;
  bankDetailsExist: boolean;
  refetchTrainerDetails: () => void;
  banks: Bank[];
}

const ExploreClubCourtsModal = (props: ExploreClubCourtsModalProps) => {
  const {
    isCourtsModalOpen,
    closeCourtsModal,
    selectedClub,
    courts,
    isUserPlayer,
    isUserTrainer,
    playerDetails,
    refetchPlayerDetails,
    cardDetailsExist,
    trainerDetails,
    bankDetailsExist,
    refetchTrainerDetails,
    banks,
  } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [addPlayerCardDetailsModelOpen, setAddPlayerCardDetailsModelOpen] =
    useState(false);

  const handleOpenCardDetailsModal = () => {
    setAddPlayerCardDetailsModelOpen(true);
  };

  const handleCloseCardDetailsModal = () => {
    setAddPlayerCardDetailsModelOpen(false);
  };

  const [trainerBankDetailsModal, setTrainerBankDetailsModal] = useState(false);

  const handleOpenBankDetailsModal = () => {
    setTrainerBankDetailsModal(true);
  };

  const handleCloseBankDetailsModal = () => {
    setTrainerBankDetailsModal(false);
  };

  const handleNavigate = (courtId: number) => {
    if (
      (isUserPlayer && cardDetailsExist) ||
      (isUserTrainer && bankDetailsExist)
    ) {
      navigate(`${paths.EXPLORE_PROFILE}kort/${courtId}`);
    } else if (isUserPlayer && !cardDetailsExist) {
      handleOpenCardDetailsModal();
    } else if (isUserTrainer && !bankDetailsExist) {
      handleOpenBankDetailsModal();
    }
  };
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
          <h1>{t("courtsTitle")}</h1>
        </div>
        <div className={styles["table-container"]}>
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
                {courts?.map((court) => (
                  <tr key={court.court_id} className={styles["court-row"]}>
                    <td>
                      {
                        <img
                          src={
                            court.courtImage
                              ? `${imageUrl}/${court.courtImage}`
                              : "/images/icons/avatar.jpg"
                          }
                          alt="court picture"
                          className={styles["court-image"]}
                          onClick={() => handleNavigate(court.court_id)}
                        />
                      }
                    </td>
                    <td>{court.court_name}</td>
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
                        ? t("courtStructureClosed")
                        : court?.court_structure_type_id === 2
                        ? t("courtStructureOpen")
                        : t("courtStructureHybrid")}
                    </td>
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
                      <button onClick={() => handleNavigate(court.court_id)}>
                        {isUserPlayer || isUserTrainer
                          ? t("tableBookCourtButton")
                          : t("tableViewHeader")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{t("clubHasNoCourts")}</p>
          )}
        </div>
        {addPlayerCardDetailsModelOpen && (
          <AddPlayerCardDetails
            isModalOpen={addPlayerCardDetailsModelOpen}
            handleCloseModal={handleCloseCardDetailsModal}
            playerDetails={playerDetails}
            refetchPlayerDetails={refetchPlayerDetails}
            cardDetailsExist={cardDetailsExist}
          />
        )}
        {trainerBankDetailsModal && (
          <EditTrainerBankDetails
            isModalOpen={trainerBankDetailsModal}
            handleCloseModal={handleCloseBankDetailsModal}
            banks={banks}
            trainerDetails={trainerDetails?.[0]}
            bankDetailsExist={bankDetailsExist}
            refetchTrainerDetails={refetchTrainerDetails}
          />
        )}
      </div>
    </ReactModal>
  );
};

export default ExploreClubCourtsModal;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import paths from "../../../../../../routing/Paths";
import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import PageLoading from "../../../../../../components/loading/PageLoading";
import ExploreClubCourtsModal from "../../modals/courts/ExploreClubCourtsModal";
import { useGetClubCourtsQuery } from "../../../../../../../api/endpoints/CourtsApi";
import { useTranslation } from "react-i18next";
import AddPlayerCardDetails from "../../../../../../components/profile/player/card-payments/add-card-details/AddPlayerCardDetails";
import { useAppSelector } from "../../../../../../store/hooks";
import {
  useGetPlayerPaymentDetailsExistQuery,
  useGetPlayerProfileDetailsQuery,
} from "../../../../../../../api/endpoints/PlayersApi";
import EditTrainerBankDetails from "../../../../../../components/profile/trainer/bank-details/edit-bank-details/EditTrainerBankDetails";
import { useGetBanksQuery } from "../../../../../../../api/endpoints/BanksApi";
import { useGetTrainerProfileDetailsQuery } from "../../../../../../../api/endpoints/TrainersApi";

interface ExploreClubsCourtsSectionProps {
  selectedClub: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
}

const ExploreClubsCourtsSection = (props: ExploreClubsCourtsSectionProps) => {
  const { selectedClub, isUserPlayer, isUserTrainer } = props;

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { user } = useAppSelector((store) => store.user);

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const {
    data: playerPaymentDetailsExist,
    isLoading: isPlayerPaymentDetailsExistLoading,
  } = useGetPlayerPaymentDetailsExistQuery(user?.user?.user_id);

  const {
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

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

  const {
    data: trainerDetails,
    isLoading: isTrainerDetailsLoading,
    refetch: refetchTrainerDetails,
  } = useGetTrainerProfileDetailsQuery(user?.user?.user_id);

  const bankDetailsExist =
    trainerDetails?.[0]?.trainerIban &&
    trainerDetails?.[0]?.trainerBankId &&
    trainerDetails?.[0]?.trainerBankAccountName;

  const handleNavigate = (courtId: number) => {
    if (
      (isUserPlayer && playerPaymentDetailsExist) ||
      (isUserTrainer && bankDetailsExist)
    ) {
      navigate(`${paths.EXPLORE_PROFILE}kort/${courtId}`);
    } else if (isUserPlayer && !playerPaymentDetailsExist) {
      handleOpenCardDetailsModal();
    } else if (isUserTrainer && !bankDetailsExist) {
      handleOpenBankDetailsModal();
    }
  };

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
                <td>{court?.price_hour} TL</td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers &&
                court.price_hour_non_subscriber ? (
                  <td>{`${court.price_hour_non_subscriber} TL`}</td>
                ) : (
                  <td>-</td>
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
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={playerPaymentDetailsExist}
          trainerDetails={trainerDetails}
          bankDetailsExist={bankDetailsExist}
          refetchTrainerDetails={refetchTrainerDetails}
          banks={banks}
        />
      )}

      {addPlayerCardDetailsModelOpen && (
        <AddPlayerCardDetails
          isModalOpen={addPlayerCardDetailsModelOpen}
          handleCloseModal={handleCloseCardDetailsModal}
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={playerPaymentDetailsExist}
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
  );
};

export default ExploreClubsCourtsSection;

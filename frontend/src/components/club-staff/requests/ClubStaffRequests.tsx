import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import AcceptClubStaffModal from "./accept-staff-modal/AcceptClubStaffModal";
import DeclineClubStaffModal from "./decline-staff-moda/DeclineClubStaffModal";
import { currentYear } from "../../../common/util/TimeFunctions";
import { useTranslation } from "react-i18next";

interface ClubStaffRequestsProps {
  myStaffRequests: any;
  refetchMyStaffRequests: any;
}

const ClubStaffRequests = (props: ClubStaffRequestsProps) => {
  const { myStaffRequests, refetchMyStaffRequests } = props;

  const { t } = useTranslation();

  const [selectedClubStaffUser, setSelectedClubStaffUser] = useState(null);

  const [isAcceptClubStaffModalOpen, setIsAcceptClubStaffModalOpen] =
    useState(false);

  const openAcceptClubStaffModal = (request: any) => {
    setSelectedClubStaffUser(request);
    setIsAcceptClubStaffModalOpen(true);
  };

  const closeAcceptClubStaffModal = () => {
    setSelectedClubStaffUser(null);
    setIsAcceptClubStaffModalOpen(false);
  };

  const [isDeclineClubStaffModalOpen, setIsDeclineClubStaffModalOpen] =
    useState(false);

  const openDeclineClubStaffModal = (request: any) => {
    setSelectedClubStaffUser(request);
    setIsDeclineClubStaffModalOpen(true);
  };

  const closeDeclineClubStaffModal = () => {
    setSelectedClubStaffUser(null);
    setIsDeclineClubStaffModalOpen(false);
  };

  useEffect(() => {
    refetchMyStaffRequests();
  }, [isAcceptClubStaffModalOpen, isDeclineClubStaffModalOpen]);

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>{t("applicationsTitle")}</h2>
      </div>

      {myStaffRequests?.length === 0 && <p>{t("noClubStaffApplications")}</p>}
      {myStaffRequests?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("staff")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableAgeHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("role")}</th>
              <th>{t("reject")}</th>
              <th>{t("approve")}</th>
            </tr>
          </thead>
          <tbody>
            {myStaffRequests?.map((request) => (
              <tr key={request.club_staff_id} className={styles["trainer-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${request.clubStaffUserId}`}
                  >
                    <img
                      src={
                        request?.trainerImage
                          ? request?.trainerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt="request"
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${request.clubStaffUserId}`}
                    className={styles["name"]}
                  >
                    {`${request?.fname} ${request?.lname}`}
                  </Link>
                </td>
                <td>{currentYear - Number(request?.birth_year)}</td>
                <td>{request?.gender === "male" ? t("male") : t("female")}</td>
                <td>{request?.location_name}</td>
                <td>
                  {request?.club_staff_role_type_id === 1
                    ? t("managerial")
                    : request?.club_staff_role_type_id === 2
                    ? t("userTypeTrainer")
                    : t("other")}
                </td>
                <td>
                  <button
                    onClick={() => openDeclineClubStaffModal(request)}
                    className={styles["decline-button"]}
                  >
                    {t("reject")}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => openAcceptClubStaffModal(request)}
                    className={styles["accept-button"]}
                  >
                    {t("approve")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isAcceptClubStaffModalOpen && (
        <AcceptClubStaffModal
          isAcceptClubStaffModalOpen={isAcceptClubStaffModalOpen}
          closeAcceptClubStaffModal={closeAcceptClubStaffModal}
          selectedClubStaff={selectedClubStaffUser}
        />
      )}

      {isDeclineClubStaffModalOpen && (
        <DeclineClubStaffModal
          isDeclineClubStaffModalOpen={isDeclineClubStaffModalOpen}
          closeDeclineClubStaffModal={closeDeclineClubStaffModal}
          selectedClubStaff={selectedClubStaffUser}
        />
      )}
    </div>
  );
};
export default ClubStaffRequests;

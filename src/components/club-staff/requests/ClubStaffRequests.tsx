import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import AcceptClubStaffModal from "./accept-staff-modal/AcceptClubStaffModal";
import DeclineClubStaffModal from "./decline-staff-moda/DeclineClubStaffModal";
import { currentYear } from "../../../common/util/TimeFunctions";

interface ClubStaffRequestsProps {
  myStaffRequests: any;
  refetchMyStaffRequests: any;
}
const ClubStaffRequests = (props: ClubStaffRequestsProps) => {
  const { myStaffRequests, refetchMyStaffRequests } = props;

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
        <h2 className={styles["result-title"]}>Başvurular</h2>
      </div>

      {myStaffRequests?.length === 0 && (
        <p>Yeni personel başvurusu bulunmamaktadır.</p>
      )}
      {myStaffRequests?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Personel</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Tecrübe</th>
              <th>Konum</th>
              <th>Rol</th>
              <th>Onay Durumu</th>
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
                <td>{request?.gender}</td>
                <td>{request?.trainer_experience_type_name}</td>
                <td>{request?.location_name}</td>
                <td>{request?.club_staff_role_type_name}</td>
                <td>
                  {request.employment_status === "pending" ? (
                    <p className={styles["pending-text"]}>Onay Bekliyor</p>
                  ) : (
                    <p className={styles["confirmed-text"]}>Onaylandı</p>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openDeclineClubStaffModal(request)}
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => openAcceptClubStaffModal(request)}
                    className={styles["accept-button"]}
                  >
                    Onay Ver
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

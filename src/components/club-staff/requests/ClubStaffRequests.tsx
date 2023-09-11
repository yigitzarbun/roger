import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import {
  useGetClubStaffByFilterQuery,
  useGetClubStaffQuery,
} from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";

import AcceptClubStaffModal from "./accept-staff-modal/AcceptClubStaffModal";
import DeclineClubStaffModal from "./decline-staff-moda/DeclineClubStaffModal";
import PageLoading from "../../../components/loading/PageLoading";
import { currentYear } from "../../../common/util/TimeFunctions";

const ClubStaffRequests = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubStaffRoleTypes, isLoading: isClubStaffRoleTypesLoading } =
    useGetClubStaffRoleTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const selectedTrainer = (user_id: number) => {
    return trainers?.find((trainer) => trainer.user_id === user_id);
  };

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: myStaffRequests,
    isLoading: isMyStaffRequestsLoading,
    refetch,
  } = useGetClubStaffByFilterQuery({
    club_id: user?.clubDetails?.club_id,
    employment_status: "pending",
  });

  const [selectedClubStaffUserId, setSelectedClubStaffUserId] = useState(null);

  const [isAcceptClubStaffModalOpen, setIsAcceptClubStaffModalOpen] =
    useState(false);

  const openAcceptClubStaffModal = (club_staff_id: number) => {
    setSelectedClubStaffUserId(club_staff_id);
    setIsAcceptClubStaffModalOpen(true);
  };
  const closeAcceptClubStaffModal = () => {
    setIsAcceptClubStaffModalOpen(false);
    setSelectedClubStaffUserId(null);
    refetch();
  };

  const [isDeclineClubStaffModalOpen, setIsDeclineClubStaffModalOpen] =
    useState(false);

  const openDeclineClubStaffModal = (club_staff_id: number) => {
    setSelectedClubStaffUserId(club_staff_id);
    setIsDeclineClubStaffModalOpen(true);
  };

  const closeDeclineClubStaffModal = () => {
    setIsDeclineClubStaffModalOpen(false);
    setSelectedClubStaffUserId(null);
    refetch();
  };

  if (
    isMyStaffRequestsLoading ||
    isClubStaffRoleTypesLoading ||
    isLocationsLoading ||
    isTrainerExperienceTypesLoading ||
    isTrainersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Başvurular</h2>
      </div>

      {myStaffRequests?.length === 0 && (
        <p>Yeni personel başvurusu bulunmamaktadır.</p>
      )}
      {clubStaffRoleTypes && myStaffRequests.length > 0 && (
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
            {myStaffRequests.map((request) => (
              <tr key={request.club_staff_id} className={styles["request-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}2/${request.user_id}`}>
                    <img
                      src={
                        selectedTrainer(request.user_id)?.image
                          ? selectedTrainer(request.user_id)?.image
                          : "/images/icons/avatar.png"
                      }
                      alt="request"
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${request.user_id}`}
                    className={styles["trainer-name"]}
                  >
                    {`
                    ${selectedTrainer(request.user_id)?.fname} ${
                      selectedTrainer(request.user_id)?.lname
                    }
                  
                  `}
                  </Link>
                </td>
                <td>
                  {currentYear -
                    Number(selectedTrainer(request.user_id)?.birth_year)}
                </td>
                <td>{selectedTrainer(request.user_id)?.gender}</td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (type) =>
                        type.trainer_experience_type_id ===
                        selectedTrainer(request.user_id)
                          ?.trainer_experience_type_id
                    )?.trainer_experience_type_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        selectedTrainer(request.user_id)?.location_id
                    )?.location_name
                  }
                </td>
                <td>
                  {
                    clubStaffRoleTypes?.find(
                      (type) =>
                        type.club_staff_role_type_id ===
                        request.club_staff_role_type_id
                    )?.club_staff_role_type_name
                  }
                </td>
                <td>
                  {request.employment_status === "pending" ? (
                    <p className={styles["pending-text"]}>Onay Bekliyor</p>
                  ) : (
                    <p className={styles["confirmed-text"]}>Onaylandı</p>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openDeclineClubStaffModal(request.user_id)}
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => openAcceptClubStaffModal(request.user_id)}
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
          selectedClubStaffUserId={selectedClubStaffUserId}
        />
      )}

      {isDeclineClubStaffModalOpen && (
        <DeclineClubStaffModal
          isDeclineClubStaffModalOpen={isDeclineClubStaffModalOpen}
          closeDeclineClubStaffModal={closeDeclineClubStaffModal}
          selectedClubStaffUserId={selectedClubStaffUserId}
        />
      )}
    </div>
  );
};
export default ClubStaffRequests;

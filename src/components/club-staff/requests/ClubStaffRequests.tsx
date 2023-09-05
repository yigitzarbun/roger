import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";

import AcceptClubStaffModal from "./accept-staff-modal/AcceptClubStaffModal";
import DeclineClubStaffModal from "./decline-staff-moda/DeclineClubStaffModal";
import PageLoading from "../../../components/loading/PageLoading";

const ClubStaffRequests = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch,
  } = useGetClubStaffQuery({});

  const { data: clubStaffRoleTypes, isLoading: isClubStaffRoleTypesLoading } =
    useGetClubStaffRoleTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const myStaffRequests = clubStaff?.filter(
    (staff) =>
      staff.club_id === user?.clubDetails?.club_id &&
      staff.employment_status === "pending"
  );

  const today = new Date();
  const year = today.getFullYear();

  const [selectedClubStaffId, setSelectedClubStaffId] = useState(null);

  const [isAcceptClubStaffModalOpen, setIsAcceptClubStaffModalOpen] =
    useState(false);

  const openAcceptClubStaffModal = (club_staff_id: number) => {
    setSelectedClubStaffId(club_staff_id);
    setIsAcceptClubStaffModalOpen(true);
  };

  const closeAcceptClubStaffModal = () => {
    setIsAcceptClubStaffModalOpen(false);
    setSelectedClubStaffId(null);
    refetch();
  };

  const [isDeclineClubStaffModalOpen, setIsDeclineClubStaffModalOpen] =
    useState(false);

  const openDeclineClubStaffModal = (club_staff_id: number) => {
    setSelectedClubStaffId(club_staff_id);
    setIsDeclineClubStaffModalOpen(true);
  };

  const closeDeclineClubStaffModal = () => {
    setIsDeclineClubStaffModalOpen(false);
    setSelectedClubStaffId(null);
    refetch();
  };

  if (
    isClubStaffLoading ||
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

      {clubStaff && myStaffRequests.length === 0 && (
        <p>Yeni personel başvurusu bulunmamaktadır.</p>
      )}
      {clubStaff && clubStaffRoleTypes && myStaffRequests.length > 0 && (
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
                        trainers?.find(
                          (trainer) => trainer.user_id === request.user_id
                        )?.image
                          ? trainers?.find(
                              (trainer) => trainer.user_id === request.user_id
                            )?.image
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
                    ${
                      trainers?.find(
                        (trainer) => trainer.user_id === request.user_id
                      )?.fname
                    }
                   ${
                     trainers?.find(
                       (trainer) => trainer.user_id === request.user_id
                     )?.lname
                   }
                  
                  `}
                  </Link>
                </td>
                <td>
                  {year -
                    Number(
                      trainers?.find(
                        (trainer) => trainer.user_id === request.user_id
                      )?.birth_year
                    )}
                </td>
                <td>
                  {
                    trainers?.find(
                      (trainer) => trainer.user_id === request.user_id
                    )?.gender
                  }
                </td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (type) =>
                        type.trainer_experience_type_id ===
                        trainers?.find(
                          (trainer) => trainer.user_id === request.user_id
                        )?.trainer_experience_type_id
                    )?.trainer_experience_type_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        trainers?.find(
                          (trainer) => trainer.user_id === request.user_id
                        )?.location_id
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
                    onClick={() =>
                      openDeclineClubStaffModal(request.club_staff_id)
                    }
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      openAcceptClubStaffModal(request.club_staff_id)
                    }
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
      <AcceptClubStaffModal
        isAcceptClubStaffModalOpen={isAcceptClubStaffModalOpen}
        closeAcceptClubStaffModal={closeAcceptClubStaffModal}
        selectedClubStaffId={selectedClubStaffId}
      />
      <DeclineClubStaffModal
        isDeclineClubStaffModalOpen={isDeclineClubStaffModalOpen}
        closeDeclineClubStaffModal={closeDeclineClubStaffModal}
        selectedClubStaffId={selectedClubStaffId}
      />
    </div>
  );
};
export default ClubStaffRequests;

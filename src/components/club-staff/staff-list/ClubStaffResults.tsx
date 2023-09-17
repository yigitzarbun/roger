import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";
import DeleteClubStaffModal from "./delete-staff-modal/DeleteClubStaffModal";

import { useAppSelector } from "../../../store/hooks";

import { currentYear } from "../../../common/util/TimeFunctions";

import { useGetClubStaffByFilterQuery } from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";

const ClubStaffResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubStaffRoleTypes, isLoading: isClubStaffRoleTypesLoading } =
    useGetClubStaffRoleTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const [selectedStaffUserId, setSelectedStaffUserId] = useState(null);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);

  const openDeleteStaffModal = (staffId: number) => {
    setSelectedStaffUserId(staffId);
    setIsDeleteStaffModalOpen(true);
  };
  const closeDeleteStaffModal = () => {
    setIsDeleteStaffModalOpen(false);
  };

  const {
    data: myStaff,
    isLoading: isMyStaffLoading,
    refetch: refetchMyStaff,
  } = useGetClubStaffByFilterQuery({
    club_id: user?.clubDetails?.club_id,
    employment_status: "accepted",
  });

  const selectedTrainer = (user_id: number) => {
    return trainers?.find((trainer) => trainer.user_id === user_id);
  };

  useEffect(() => {
    refetchMyStaff();
  }, [isDeleteStaffModalOpen]);

  if (
    isMyStaffLoading ||
    isClubStaffRoleTypesLoading ||
    isLocationsLoading ||
    isTrainersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Personel</h2>
      </div>
      {myStaff?.length === 0 && <p>Kayıtlı personel bulunmamaktadır.</p>}
      {clubStaffRoleTypes && myStaff?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Personel Adı</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Konum</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myStaff.map((staff) => (
              <tr key={staff.club_staff_id} className={styles["staff-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}2/${staff.user_id}`}>
                    <img
                      src={
                        selectedTrainer(staff.user_id)?.image
                          ? selectedTrainer(staff.user_id)?.image
                          : "/images/icons/avatar.png"
                      }
                      alt="staff_image"
                      className={styles["staff-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${staff.user_id}`}
                    className={styles["staff-name"]}
                  >
                    {`
                    ${selectedTrainer(staff.user_id)?.fname}
                   ${selectedTrainer(staff.user_id)?.lname}
                  
                  `}
                  </Link>
                </td>
                <td>
                  {currentYear -
                    Number(selectedTrainer(staff.user_id)?.birth_year)}
                </td>
                <td>{selectedTrainer(staff.user_id)?.gender}</td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        selectedTrainer(staff.user_id)?.location_id
                    )?.location_name
                  }
                </td>
                <td>
                  {
                    clubStaffRoleTypes?.find(
                      (type) =>
                        type.club_staff_role_type_id ===
                        staff.club_staff_role_type_id
                    )?.club_staff_role_type_name
                  }
                </td>
                <td>
                  {staff.employment_status === "pending" ? (
                    "Onay Bekliyor"
                  ) : (
                    <button
                      onClick={() => openDeleteStaffModal(staff.user_id)}
                      className={styles["delete-button"]}
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isDeleteStaffModalOpen && (
        <DeleteClubStaffModal
          isDeleteStaffModalOpen={isDeleteStaffModalOpen}
          closeDeleteStaffModal={closeDeleteStaffModal}
          selectedClubStaffUserId={selectedStaffUserId}
        />
      )}
    </div>
  );
};

export default ClubStaffResults;

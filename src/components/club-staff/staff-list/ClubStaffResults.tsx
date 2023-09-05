import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import PageLoading from "../../../components/loading/PageLoading";
import DeleteClubStaffModal from "./delete-staff-modal/DeleteClubStaffModal";

const ClubStaffResults = () => {
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

  const [updateStaff, { isSuccess: isUpdateStaffSuccess }] =
    useUpdateClubStaffMutation({});

  const [selectedStaffUserId, setSelectedStaffUserId] = useState(null);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
  const openDeleteStaffModal = (staffId: number) => {
    setSelectedStaffUserId(staffId);
    setIsDeleteStaffModalOpen(true);
  };
  const closeDeleteStaffModal = () => {
    setIsDeleteStaffModalOpen(false);
  };
  const myStaff = clubStaff?.filter(
    (staff) =>
      staff.employment_status === "accepted" &&
      staff.club_id === user?.clubDetails?.club_id
  );

  const handleRemoveStaff = (staff_id: number) => {
    const selectedStaff = myStaff?.find(
      (staff) => staff.club_staff_id === staff_id
    );
    const updatedStaffData = {
      ...selectedStaff,
      employment_status: "terminated_by_club",
    };
    updateStaff(updatedStaffData);
  };

  const today = new Date();
  const year = today.getFullYear();

  useEffect(() => {
    if (isUpdateStaffSuccess) {
      refetch();
    }
  }, [isUpdateStaffSuccess]);
  if (
    isClubStaffLoading ||
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
      {clubStaff && myStaff.length === 0 && (
        <p>Kayıtlı personel bulunmamaktadır.</p>
      )}
      {clubStaff && clubStaffRoleTypes && myStaff.length > 0 && (
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
                        trainers?.find(
                          (trainer) => trainer.user_id === staff.user_id
                        )?.image
                          ? trainers?.find(
                              (trainer) => trainer.user_id === staff.user_id
                            )?.image
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
                    ${
                      trainers?.find(
                        (trainer) => trainer.user_id === staff.user_id
                      )?.fname
                    }
                   ${
                     trainers?.find(
                       (trainer) => trainer.user_id === staff.user_id
                     )?.lname
                   }
                  
                  `}
                  </Link>
                </td>
                <td>
                  {year -
                    Number(
                      trainers?.find(
                        (trainer) => trainer.user_id === staff.user_id
                      )?.birth_year
                    )}
                </td>
                <td>
                  {
                    trainers?.find(
                      (trainer) => trainer.user_id === staff.user_id
                    )?.gender
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        trainers?.find(
                          (trainer) => trainer.user_id === staff.user_id
                        )?.location_id
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
      <DeleteClubStaffModal
        isDeleteStaffModalOpen={isDeleteStaffModalOpen}
        closeDeleteStaffModal={closeDeleteStaffModal}
        selectedStaffUserId={selectedStaffUserId}
      />
    </div>
  );
};

export default ClubStaffResults;

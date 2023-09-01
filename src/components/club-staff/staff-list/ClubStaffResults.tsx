import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import PageLoading from "../../../components/loading/PageLoading";

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

  const myStaff = clubStaff?.filter(
    (staff) =>
      staff.employment_status === "accepted" &&
      staff.club_id === user?.clubDetails?.club_id
  );

  const today = new Date();
  const year = today.getFullYear();

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
              <th>Personel</th>
              <th>Personel Adı</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Konum</th>
              <th>Rol</th>
              <th>Onay Durumu</th>
            </tr>
          </thead>
          <tbody>
            {myStaff.map((staff) => (
              <tr key={staff.club_staff_id} className={styles["staff-row"]}>
                <td>
                  <img
                    src={"/images/icons/avatar.png"}
                    alt="staff"
                    className={styles["staff-image"]}
                  />
                </td>
                <td>
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
                  {staff.employment_status === "pending"
                    ? "Onay Bekliyor"
                    : "Onaylandı"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClubStaffResults;

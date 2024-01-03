import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerActiveStudentGroupsByUserIdQuery } from "../../../../api/endpoints/StudentGroupsApi";

const PlayerGroupResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: myGroups, isLoading: isGroupsLoading } =
    useGetPlayerActiveStudentGroupsByUserIdQuery(user?.user?.user_id);

  if (isGroupsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      {myGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>Grup</th>
              <th>Oyuncu Sayısı</th>
              <th>Eğitmen</th>
              <th>Sıradaki Ders Tarihi</th>
              <th>Sıradaki Ders Saati</th>
            </tr>
          </thead>
          <tbody>
            {myGroups?.map((group) => (
              <tr key={group.student_group_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.club_id}`}
                    className={styles.image}
                  >
                    <img
                      src={
                        group?.club_image
                          ? group?.club_image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.club_id}`}
                    className={styles["club-name"]}
                  >
                    {group?.club_name}
                  </Link>
                </td>
                <td>{group.student_group_name}</td>
                <td>
                  {group.fourth_student_id
                    ? 4
                    : group.third_student_id
                    ? 3
                    : group.second_student_id
                    ? 2
                    : 1}
                </td>
                <td>{`${group?.fname} ${group?.lname}`}</td>
                <td>{group.latest_event_date?.slice(0, 10)}</td>
                <td>{group.latest_event_time?.slice(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : myGroups?.length === 0 ? (
        <p>Kulüp oyuncu grubu üyeliği bulunmamaktadır</p>
      ) : (
        ""
      )}
    </div>
  );
};
export default PlayerGroupResults;

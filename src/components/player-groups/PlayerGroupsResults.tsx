import React, { useState } from "react";

import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import paths from "../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../components/loading/PageLoading";

import { useAppSelector } from "../../store/hooks";
import { useGetPlayerActiveStudentGroupsByUserIdQuery } from "../../api/endpoints/StudentGroupsApi";

const PlayerGroupResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: myGroups, isLoading: isGroupsLoading } =
    useGetPlayerActiveStudentGroupsByUserIdQuery(user?.user?.user_id);
  console.log(myGroups);
  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myGroups?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myGroups?.totalPages) % myGroups?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  if (isGroupsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Gruplar</h2>
        <div className={styles["nav-container"]}>
          <FaAngleLeft
            onClick={handlePrevPage}
            className={styles["nav-arrow"]}
          />

          <FaAngleRight
            onClick={handleNextPage}
            className={styles["nav-arrow"]}
          />
        </div>
      </div>
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
              <tr key={group.student_group_id} className={styles.row}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.clubUserId}`}
                    className={styles.image}
                  >
                    <img
                      src={
                        group?.clubImage
                          ? group?.clubImage
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${group.clubUserId}`}
                    className={styles["name"]}
                  >
                    {group?.club_name}
                  </Link>
                </td>
                <td>{group.student_group_name}</td>
                <td>{group.studentcount}</td>
                <td>
                  <p
                    className={
                      group.trainerUserStatusTypeId !== 1
                        ? styles["inactive-trainer-name"]
                        : styles["active-trainer-name"]
                    }
                  >{`${group?.fname} ${group?.lname}`}</p>
                </td>
                <td>
                  {group.latest_event_date?.slice(0, 10)
                    ? group.latest_event_date?.slice(0, 10)
                    : "-"}
                </td>
                <td>
                  {group.latest_event_time?.slice(0, 5)
                    ? group.latest_event_time?.slice(0, 5)
                    : "-"}
                </td>
                <td>
                  <SlOptions className={styles.icon} />
                </td>
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

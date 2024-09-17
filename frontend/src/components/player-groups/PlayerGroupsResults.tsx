import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import paths from "../../routing/Paths";
import styles from "./styles.module.scss";
import PageLoading from "../../components/loading/PageLoading";
import { useAppSelector } from "../../store/hooks";
import { useGetPlayerActiveStudentGroupsByUserIdQuery } from "../../../api/endpoints/StudentGroupsApi";
import { useTranslation } from "react-i18next";

const PlayerGroupResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  const { data: myGroups, isLoading: isGroupsLoading } =
    useGetPlayerActiveStudentGroupsByUserIdQuery(user?.user?.user_id);

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
        <h2 className={styles.title}>{t("groupsTitle")}</h2>
        {myGroups?.totalPages > 1 && (
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
        )}
      </div>
      {myGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableClubHeader")}</th>
              <th>{t("clubNameHeader")}</th>
              <th>{t("groupHeader")}</th>
              <th>{t("studentCountHeader")}</th>
              <th>{t("tableTrainerHeader")}</th>
              <th>{t("nextLessonDateHeader")}</th>
              <th>{t("nextLessonTimeHeader")}</th>
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

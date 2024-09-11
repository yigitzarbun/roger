import React, { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import paths from "../../../routing/Paths";
import PageLoading from "../../../components/loading/PageLoading";
import { useGetPaginatedTrainerStudentGroupsQuery } from "../../../api/endpoints/StudentGroupsApi";
import TrainerStudentGroupsFilterModal from "./filter/TrainerStudentGroupsFilter";
import { useTranslation } from "react-i18next";

interface TrainerStudentGroupsResultsProps {
  textSearch: string;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}

const TrainerStudentGroupsResults = (
  props: TrainerStudentGroupsResultsProps
) => {
  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const { textSearch, handleTextSearch, handleClear } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedTrainerStudentGroups,
    isLoading: isPaginatedTrainerStudentGroupsLoading,
    refetch: refetchStudentGroups,
  } = useGetPaginatedTrainerStudentGroupsQuery({
    trainerUserId: user?.user?.user_id,
    page: currentPage,
    textSearch: textSearch,
  });

  const [
    isTrainerStudentGroupsFilterOpen,
    setIsTrainerStudentGroupsFilterOpen,
  ] = useState(false);

  const handleOpenTrainerStudentGroupsFilter = () => {
    setIsTrainerStudentGroupsFilterOpen(true);
  };

  const handleCloseTrainerStudentGroupsFilter = () => {
    setIsTrainerStudentGroupsFilterOpen(false);
  };

  const handleTrainersPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage =
      (currentPage % paginatedTrainerStudentGroups?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedTrainerStudentGroups?.totalPages) %
        paginatedTrainerStudentGroups?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const pageNumbers = [];

  for (let i = 1; i <= paginatedTrainerStudentGroups?.totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    refetchStudentGroups();
  }, [currentPage, textSearch]);

  if (isPaginatedTrainerStudentGroupsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>{t("groups")}</h2>
          {paginatedTrainerStudentGroups?.studentGroups?.length > 0 && (
            <FaFilter
              onClick={handleOpenTrainerStudentGroupsFilter}
              className={
                textSearch !== "" ? styles["active-filter"] : styles.filter
              }
            />
          )}
        </div>
        {paginatedTrainerStudentGroups?.totalPages > 1 && (
          <div className={styles["navigation-container"]}>
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
      {paginatedTrainerStudentGroups?.studentGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("groupName")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("student1")}</th>
              <th>{t("student2")}</th>
              <th>{t("student3")}</th>
              <th>{t("student4")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrainerStudentGroups.studentGroups?.map((group) => (
              <tr key={group.user_id} className={styles["player-row"]}>
                <td>{group.student_group_name}</td>
                <td>{group.clubName}</td>
                <td>
                  {group.student1_user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.student1_user_id}`}
                      className={
                        group.student1_status_type_id === 1
                          ? styles["active-name"]
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.student1_fname} ${group.student1_lname} `}
                    </Link>
                  ) : (
                    <>{`${group.student1_fname} ${group.student1_lname}`}</>
                  )}
                </td>
                <td>
                  {group.student2_user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.student2_user_id}`}
                      className={
                        group.student2_status_type_id === 1
                          ? styles["active-name"]
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.student2_fname} ${group.student2_lname}`}
                    </Link>
                  ) : (
                    `${group.student2_fname} ${group.student2_lname}`
                  )}
                </td>
                <td>
                  {group.student3_user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.student3_user_id}`}
                      className={
                        group.student3_status_type_id === 1
                          ? styles["active-name"]
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.student3_fname} ${group.student3_lname}`}
                    </Link>
                  ) : group.cem3_user_id ? (
                    `${group.student3_fname} ${group.student3_lname}`
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {group.student4_user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.student4_user_id}`}
                      className={
                        group.student4_status_type_id === 1
                          ? styles["active-name"]
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.student4_fname} ${group.student4_lname}`}
                    </Link>
                  ) : group.cem4_user_id ? (
                    `${group.student4_fname} ${group.student4_lname}`
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz aktif öğrenci grubu bulunmamaktadır</p>
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handleTrainersPage}
            className={
              pageNumber === Number(currentPage)
                ? styles["active-page"]
                : styles["passive-page"]
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>
      {isTrainerStudentGroupsFilterOpen && (
        <TrainerStudentGroupsFilterModal
          textSearch={textSearch}
          isTrainerStudentGroupsFilterOpen={isTrainerStudentGroupsFilterOpen}
          handleCloseTrainerStudentGroupsFilter={
            handleCloseTrainerStudentGroupsFilter
          }
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};

export default TrainerStudentGroupsResults;

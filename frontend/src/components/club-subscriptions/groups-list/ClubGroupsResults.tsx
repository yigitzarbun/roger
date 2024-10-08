import React, { useEffect, useState, ChangeEvent } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import AddGroupModal from "./add-group-modal/AddGroupModal";
import EditGroupModal from "./edit-group-modal/EditGroupModal";
import PageLoading from "../../../components/loading/PageLoading";

import { useGetPaginatedStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";
import { useGetTrainersByFilterQuery } from "../../../../api/endpoints/TrainersApi";
import ClubStudentGroupsFilterModal from "./filter/ClubStudentGroupsFilterModal";

interface ClubGroupsResultsProps {
  textSearch: string;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}
const ClubGroupsResults = (props: ClubGroupsResultsProps) => {
  const { textSearch, handleTextSearch, handleClear } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: myTrainers, isLoading: isMyTrainersLoading } =
    useGetTrainersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      employment_status: "accepted",
    });

  const [currentPage, setCurrentPage] = useState(1);

  const { data: groups, refetch: refetchGroups } =
    useGetPaginatedStudentGroupsQuery({
      clubUserId: user?.user?.user_id,
      page: currentPage,
      textSearch: textSearch,
    });

  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  const openAddGroupModal = () => {
    setIsAddGroupModalOpen(true);
  };

  const closeAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const openEditGroupModal = (group) => {
    setSelectedGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const closeEditGroupModal = () => {
    setIsEditGroupModalOpen(false);
  };

  const [isClubStudentGroupsFilterOpen, setIsClubStudentGroupsFilterOpen] =
    useState(false);
  const handleOpenClubStudentGroupsFilter = () => {
    setIsClubStudentGroupsFilterOpen(true);
  };
  const handleCloseClubStudentGroupsFilter = () => {
    setIsClubStudentGroupsFilterOpen(false);
  };
  const handleGroupsPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % groups?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + groups?.totalPages) % groups?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const pageNumbers = [];
  for (let i = 1; i <= groups?.totalPages; i++) {
    pageNumbers.push(i);
  }
  useEffect(() => {
    refetchGroups();
  }, [currentPage, textSearch, isEditGroupModalOpen, isAddGroupModalOpen]);

  if (isMyTrainersLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Gruplar</h2>
          <button
            onClick={openAddGroupModal}
            className={styles["add-group-button"]}
          >
            <p className={styles["add-title"]}>Yeni Grup Ekle</p>
          </button>
          {groups?.studentGroups?.length > 0 && (
            <FaFilter
              onClick={handleOpenClubStudentGroupsFilter}
              className={
                textSearch !== "" ? styles["active-filter"] : styles.filter
              }
            />
          )}
        </div>
        {groups?.totalPages > 1 && (
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
      {groups?.studentGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Grup Adı</th>
              <th>Eğitmen</th>
              <th>Oyuncu 1</th>
              <th>Oyuncu 2</th>
              <th>Oyuncu 3</th>
              <th>Oyuncu 4</th>
            </tr>
          </thead>
          <tbody>
            {groups?.studentGroups?.map((group) => (
              <tr key={group.student_group_id} className={styles.row}>
                <td>{group.student_group_name}</td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${group.trainer_user_id}`}
                    className={
                      group.trainerUserStatusTypeId === 1
                        ? styles.name
                        : styles["inactive-name"]
                    }
                  >
                    {`
                    ${group?.trainer_fname} ${group?.trainer_lname}`}
                  </Link>
                </td>
                <td>
                  {group?.students_info?.[0]?.user_id && (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.students_info?.[0]?.user_id}`}
                      className={
                        group?.students_info?.[0]?.playerUserStatusTypeId === 1
                          ? styles.name
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.students_info?.[0]?.name}`}
                    </Link>
                  )}
                </td>
                <td>
                  {group?.students_info?.[1]?.user_id && (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.students_info?.[1]?.user_id}`}
                      className={
                        group?.students_info?.[1]?.playerUserStatusTypeId === 1
                          ? styles.name
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.students_info?.[1]?.name}`}
                    </Link>
                  )}
                </td>
                <td>
                  {group?.students_info?.[2]?.user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.students_info?.[2]?.user_id}`}
                      className={
                        group?.students_info?.[2]?.playerUserStatusTypeId === 1
                          ? styles.name
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.students_info?.[2]?.name}`}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {group?.students_info?.[3]?.user_id ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${group.students_info?.[3]?.user_id}`}
                      className={
                        group?.students_info?.[3]?.playerUserStatusTypeId === 1
                          ? styles.name
                          : styles["inactive-name"]
                      }
                    >
                      {`${group.students_info?.[3]?.name}`}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openEditGroupModal(group)}
                    className={styles["edit-button"]}
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Kayıtlı grubunuz bulunmamaktadır.</p>
      )}
      {isAddGroupModalOpen && (
        <AddGroupModal
          isAddGroupModalOpen={isAddGroupModalOpen}
          closeAddGroupModal={closeAddGroupModal}
          myTrainers={myTrainers}
          user={user}
        />
      )}
      {isEditGroupModalOpen && (
        <EditGroupModal
          isEditGroupModalOpen={isEditGroupModalOpen}
          closeEditGroupModal={closeEditGroupModal}
          selectedGroup={selectedGroup}
          myTrainers={myTrainers}
          user={user}
        />
      )}

      {isClubStudentGroupsFilterOpen && (
        <ClubStudentGroupsFilterModal
          textSearch={textSearch}
          isClubStudentGroupsFilterOpen={isClubStudentGroupsFilterOpen}
          handleCloseClubStudentGroupsFilter={
            handleCloseClubStudentGroupsFilter
          }
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
        />
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handleGroupsPage}
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
    </div>
  );
};
export default ClubGroupsResults;

import React, { useState } from "react";

import { Link } from "react-router-dom";

import { FaPlusSquare } from "react-icons/fa";

import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import styles from "./styles.module.scss";
import AddGroupModal from "./add-group-modal/AddGroupModal";

import { useGetStudentGroupsQuery } from "../../../api/endpoints/StudentGroupsApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetClubExternalMembersQuery } from "../../../api/endpoints/ClubExternalMembersApi";
import EditGroupModal from "./edit-group-modal/EditGroupModal";
import PageLoading from "../../../components/loading/PageLoading";

const ClubGroupsResults = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: groups, isLoading: isGroupsLoading } = useGetStudentGroupsQuery(
    {}
  );
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const myGroups = groups?.filter(
    (group) => group.club_id === user?.user_id && group.is_active === true
  );

  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  const openAddGroupModal = () => {
    setIsAddGroupModalOpen(true);
  };

  const closeAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const openEditGroupModal = (group_id: number) => {
    setSelectedGroup(
      myGroups?.find((group) => group.student_group_id === group_id)
    );
    setIsEditGroupModalOpen(true);
  };

  const closeEditGroupModal = () => {
    setIsEditGroupModalOpen(false);
  };

  if (
    isGroupsLoading ||
    isUsersLoading ||
    isTrainersLoading ||
    isPlayersLoading ||
    isExternalMembersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["add-group-container"]}>
        <h2 className={styles["result-title"]}>Gruplar</h2>
        <button
          onClick={openAddGroupModal}
          className={styles["add-group-button"]}
        >
          <FaPlusSquare className={styles["add-icon"]} />
          <h2 className={styles["add-title"]}>Yeni Grup Ekle</h2>
        </button>
      </div>
      <div className={styles["top-container"]}></div>
      {myGroups?.length > 0 ? (
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
            {myGroups.map((group) => (
              <tr key={group.student_group_id}>
                <td>{group.student_group_name}</td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${group.trainer_id}`}
                    className={styles.name}
                  >
                    {`
                    ${
                      trainers?.find(
                        (trainer) => trainer.user_id === group.trainer_id
                      )?.fname
                    } ${
                      trainers?.find(
                        (trainer) => trainer.user_id === group.trainer_id
                      )?.lname
                    }`}
                  </Link>
                </td>
                <td>
                  {group.first_student_id ? (
                    users?.find(
                      (user) => user.user_id === group.first_student_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${group.first_student_id}`}
                        className={styles.name}
                      >
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === group.first_student_id
                          )?.fname
                        }
                        ${
                          players?.find(
                            (player) =>
                              player.user_id === group.first_student_id
                          )?.lname
                        }
                        `}
                      </Link>
                    ) : (
                      users?.find(
                        (user) => user.user_id === group.first_student_id
                      )?.user_type_id === 5 &&
                      `${
                        externalMembers?.find(
                          (member) => member.user_id === group.first_student_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === group.first_student_id
                        )?.lname
                      }`
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {group.second_student_id ? (
                    users?.find(
                      (user) => user.user_id === group.second_student_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${group.first_student_id}`}
                        className={styles.name}
                      >
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === group.second_student_id
                          )?.fname
                        }
                        ${
                          players?.find(
                            (player) =>
                              player.user_id === group.second_student_id
                          )?.lname
                        }
                        `}
                      </Link>
                    ) : (
                      users?.find(
                        (user) => user.user_id === group.second_student_id
                      )?.user_type_id === 5 &&
                      `${
                        externalMembers?.find(
                          (member) => member.user_id === group.second_student_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === group.second_student_id
                        )?.lname
                      }`
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {group.third_student_id ? (
                    users?.find(
                      (user) => user.user_id === group.third_student_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${group.first_student_id}`}
                        className={styles.name}
                      >
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === group.third_student_id
                          )?.fname
                        }
                        ${
                          players?.find(
                            (player) =>
                              player.user_id === group.third_student_id
                          )?.lname
                        }`}
                      </Link>
                    ) : (
                      users?.find(
                        (user) => user.user_id === group.third_student_id
                      )?.user_type_id === 5 &&
                      `${
                        externalMembers?.find(
                          (member) => member.user_id === group.third_student_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === group.third_student_id
                        )?.lname
                      }`
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {group.fourth_student_id ? (
                    users?.find(
                      (user) => user.user_id === group.fourth_student_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${group.first_student_id}`}
                        className={styles.name}
                      >
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === group.fourth_student_id
                          )?.fname
                        }
                        ${
                          players?.find(
                            (player) =>
                              player.user_id === group.fourth_student_id
                          )?.lname
                        }
                        `}
                      </Link>
                    ) : (
                      users?.find(
                        (user) => user.user_id === group.fourth_student_id
                      )?.user_type_id === 5 &&
                      `${
                        externalMembers?.find(
                          (member) => member.user_id === group.fourth_student_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === group.fourth_student_id
                        )?.lname
                      }`
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openEditGroupModal(group.student_group_id)}
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
      <AddGroupModal
        isAddGroupModalOpen={isAddGroupModalOpen}
        closeAddGroupModal={closeAddGroupModal}
      />
      <EditGroupModal
        isEditGroupModalOpen={isEditGroupModalOpen}
        closeEditGroupModal={closeEditGroupModal}
        selectedGroup={selectedGroup}
      />
    </div>
  );
};
export default ClubGroupsResults;

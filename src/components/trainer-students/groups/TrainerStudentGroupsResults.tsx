import React from "react";

import { useAppSelector } from "../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetStudentGroupsQuery } from "../../../api/endpoints/StudentGroupsApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetClubExternalMembersQuery } from "../../../api/endpoints/ClubExternalMembersApi";
import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";

const TrainerStudentGroupsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const myGroups = studentGroups?.filter(
    (group) => group.trainer_id === user?.user?.user_id
  );

  let myGroupUserIds = [];
  myGroups?.forEach((group) => myGroupUserIds.push(group.user_id));

  const myGroupBookings = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id) &&
      booking.booking_status_type_id === 5 &&
      booking.event_type_id == 6 &&
      (myGroupUserIds.includes(booking.invitee_id) ||
        myGroupUserIds.includes(booking.inviter_id))
  );

  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Öğrenciler</h2>
      {myGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Grup Adı</th>
              <th>Öğrenci Sayısı</th>
              <th>Anterman Sayısı</th>
              <th>Oyuncu 1</th>
              <th>Oyuncu 2</th>
              <th>Oyuncu 3</th>
              <th>Oyuncu 4</th>
            </tr>
          </thead>
          <tbody>
            {myGroups.map((group) => (
              <tr key={group.user_id}>
                <td>{group.student_group_name}</td>
                <td>
                  {group.fourth_student_id ? 4 : group.third_student_id ? 3 : 2}
                </td>
                <td>
                  {
                    myGroupBookings?.filter(
                      (booking) =>
                        booking.inviter_id === group.user_id ||
                        booking.invitee_id === group.user_id
                    ).length
                  }
                </td>
                <td>
                  {group.first_student_id
                    ? users?.find(
                        (user) => user.user_id === group.first_student_id
                      )?.user_type_id === 1
                      ? `${
                          players.find(
                            (player) =>
                              player.user_id === group.first_student_id
                          )?.fname
                        } ${
                          players.find(
                            (player) =>
                              player.user_id === group.first_student_id
                          )?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === group.first_student_id
                        )?.user_type_id === 5 &&
                        `${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.first_student_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.first_student_id
                          )?.lname
                        }`
                    : "-"}
                </td>
                <td>
                  {group.second_student_id
                    ? users?.find(
                        (user) => user.user_id === group.second_student_id
                      )?.user_type_id === 1
                      ? `${
                          players.find(
                            (player) =>
                              player.user_id === group.second_student_id
                          )?.fname
                        } ${
                          players.find(
                            (player) =>
                              player.user_id === group.second_student_id
                          )?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === group.second_student_id
                        )?.user_type_id === 5 &&
                        `${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.second_student_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.second_student_id
                          )?.lname
                        }`
                    : "-"}
                </td>
                <td>
                  {group.third_student_id
                    ? users?.find(
                        (user) => user.user_id === group.third_student_id
                      )?.user_type_id === 1
                      ? `${
                          players.find(
                            (player) =>
                              player.user_id === group.third_student_id
                          )?.fname
                        } ${
                          players.find(
                            (player) =>
                              player.user_id === group.third_student_id
                          )?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === group.third_student_id
                        )?.user_type_id === 5 &&
                        `${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.third_student_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.third_student_id
                          )?.lname
                        }`
                    : "-"}
                </td>
                <td>
                  {group.fourth_student_id
                    ? users?.find(
                        (user) => user.user_id === group.fourth_student_id
                      )?.user_type_id === 1
                      ? `${
                          players.find(
                            (player) =>
                              player.user_id === group.fourth_student_id
                          )?.fname
                        } ${
                          players.find(
                            (player) =>
                              player.user_id === group.fourth_student_id
                          )?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === group.fourth_student_id
                        )?.user_type_id === 5 &&
                        `${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.fourth_student_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) =>
                              member.user_id === group.fourth_student_id
                          )?.lname
                        }`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz aktif öğrenci grubu bulunmamaktadır</p>
      )}
    </div>
  );
};

export default TrainerStudentGroupsResults;

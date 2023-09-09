import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import {
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../api/endpoints/StudentsApi";

import PageLoading from "../../../components/loading/PageLoading";

const TrainerStudentRequests = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsQuery({});

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const date = new Date();
  const currentYear = date.getFullYear();

  const myStudents = students?.filter(
    (student) =>
      student.trainer_id === user?.user?.user_id &&
      student.student_status === "pending"
  );

  const handleAddStudent = (student_id: number) => {
    const selectedStudent = students?.find(
      (student) =>
        student.student_id === student_id &&
        student.trainer_id === user?.user?.user_id &&
        student.student_status === "pending"
    );
    const updatedStudentData = {
      ...selectedStudent,
      student_status: "accepted",
    };
    updateStudent(updatedStudentData);
  };

  const handleDeclineStudent = (student_id: number) => {
    const selectedStudent = students?.find(
      (student) =>
        student.student_id === student_id &&
        student.trainer_id === user?.user?.user_id &&
        student.student_status === "pending"
    );
    const updatedStudentData = {
      ...selectedStudent,
      student_status: "declined",
    };
    updateStudent(updatedStudentData);
  };

  useEffect(() => {
    if (isUpdateStudentSuccess) {
      refetchStudents();
    }
  }, [isUpdateStudentSuccess]);

  if (
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isLocationsLoading ||
    isStudentsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Öğrenciler</h2>
      {myStudents?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Öğrenci</th>
              <th>İsim</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Konum</th>
              <th>Seviye</th>
            </tr>
          </thead>
          <tbody>
            {myStudents?.map((student) => (
              <tr key={student.student_id}>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${student.player_id}`}>
                    <img
                      src={
                        players?.find(
                          (player) => player.user_id === student.player_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === student.player_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      alt={student.name}
                      className={styles["student-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${student.player_id}`}
                    className={styles["student-name"]}
                  >{`${
                    players?.find(
                      (player) => player.user_id === student.player_id
                    )?.fname
                  } ${
                    players?.find(
                      (player) => player.user_id === student.player_id
                    )?.lname
                  }`}</Link>
                </td>
                <td>
                  {currentYear -
                    players?.find(
                      (player) => player.user_id === student.player_id
                    )?.birth_year}
                </td>
                <td>
                  {
                    players?.find(
                      (player) => player.user_id === student.player_id
                    )?.gender
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        players?.find(
                          (player) => player.user_id === student.player_id
                        )?.location_id
                    )?.location_name
                  }
                </td>
                <td>
                  {
                    playerLevels?.find(
                      (level) =>
                        level.player_level_id ===
                        players?.find(
                          (player) => player.user_id === student.player_id
                        )?.player_level_id
                    )?.player_level_name
                  }
                </td>
                <td>
                  <div className={styles["action-buttons-container"]}>
                    <button
                      onClick={() => handleAddStudent(student.student_id)}
                      className={styles["accept-button"]}
                    >
                      Kabul Et
                    </button>
                    <button
                      onClick={() => handleDeclineStudent(student.student_id)}
                      className={styles["decline-button"]}
                    >
                      Reddet
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Yeni öğrenci başvurusu bulunmamaktadır</p>
      )}
    </div>
  );
};

export default TrainerStudentRequests;

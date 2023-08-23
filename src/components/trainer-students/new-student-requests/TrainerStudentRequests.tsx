import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetStudentsQuery } from "../../../api/endpoints/StudentsApi";
import { tr } from "date-fns/locale";

const TrainerStudentRequests = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: students, isLoading: isStudentsLoading } = useGetStudentsQuery(
    {}
  );

  const date = new Date();
  const currentYear = date.getFullYear();

  console.log(date.toLocaleTimeString());
  const myStudents = students?.filter(
    (student) =>
      student.trainer_id === user?.user?.user_id &&
      student.student_status === "pending"
  );

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
                <td>
                  <img
                    src={
                      student.image ? student.image : "/images/icons/avatar.png"
                    }
                    alt={student.name}
                    className={styles["student-image"]}
                  />
                </td>
                <td>{`${
                  players?.find(
                    (player) => player.user_id === student.player_id
                  )?.fname
                } ${
                  players?.find(
                    (player) => player.user_id === student.player_id
                  )?.lname
                }`}</td>
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
                <button>Kabul Et</button>
                <button>Reddet</button>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz aktif öğrenci bulunmamaktadır</p>
      )}
    </div>
  );
};

export default TrainerStudentRequests;

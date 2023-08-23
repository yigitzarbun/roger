import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetStudentsQuery } from "../../../api/endpoints/StudentsApi";

const TrainerStudentsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: students, isLoading: isStudentsLoading } = useGetStudentsQuery(
    {}
  );

  const myStudents = students?.filter(
    (student) =>
      student.trainer_id === user?.user?.user_id &&
      student.student_status === "accepted"
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
              <th>Antreman Sayısı</th>
              <th>Grup</th>
            </tr>
          </thead>
        </table>
      ) : (
        <p>Henüz aktif öğrenci bulunmamaktadır</p>
      )}
    </div>
  );
};

export default TrainerStudentsResults;

import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import {
  useGetStudentsByFilterQuery,
  useGetTrainerNewStudentRequestsListQuery,
  useUpdateStudentMutation,
} from "../../../api/endpoints/StudentsApi";

import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";
import { toast } from "react-toastify";

interface TrainerStudentRequestsProps {
  refetchStudents: () => void;
}
const TrainerStudentRequests = (props: TrainerStudentRequestsProps) => {
  const { refetchStudents } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: newStudentRequestsList,
    isLoading: isNewStudentRequestsListLoading,
    refetch: refetchStudentRequests,
  } = useGetTrainerNewStudentRequestsListQuery(user?.user?.user_id);
  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const handleAddStudent = (student) => {
    const updatedStudentData = {
      student_id: student.student_id,
      registered_at: student.registered_at,
      trainer_id: student.trainer_id,
      //player_id: student.player_id,
      student_status: "accepted",
    };
    updateStudent(updatedStudentData);
  };

  const handleDeclineStudent = (student) => {
    const updatedStudentData = {
      student_id: student.student_id,
      registered_at: student.registered_at,
      trainer_id: student.trainer_id,
      //player_id: student.player_id,
      student_status: "declined",
    };
    updateStudent(updatedStudentData);
  };

  useEffect(() => {
    if (isUpdateStudentSuccess) {
      toast.success("İşlem başarılı");
      refetchStudents();
      refetchStudentRequests();
    }
  }, [isUpdateStudentSuccess]);

  if (isNewStudentRequestsListLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Öğrenciler</h2>
      {newStudentRequestsList?.length > 0 ? (
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
            {newStudentRequestsList?.map((student) => (
              <tr key={student.student_id} className={styles["player-row"]}>
                <td className={styles["vertical-center"]}>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${student.playerUserId}`}
                  >
                    <img
                      src={
                        student.playerImage
                          ? student.playerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={student.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${student.playerUserId}`}
                    className={styles["player-name"]}
                  >{`${student?.playerFname} ${student?.playerLname}`}</Link>
                </td>
                <td>{getAge(student?.playerBirthYear)}</td>
                <td>{student?.playerGender}</td>
                <td>{student?.location_name}</td>
                <td>{student?.player_level_name}</td>
                <td>
                  <button
                    onClick={() => handleDeclineStudent(student)}
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>{" "}
                </td>{" "}
                <td>
                  <button
                    onClick={() => handleAddStudent(student)}
                    className={styles["accept-button"]}
                  >
                    Kabul Et
                  </button>
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

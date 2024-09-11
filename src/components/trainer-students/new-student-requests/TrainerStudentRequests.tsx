import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../store/hooks";
import { useUpdateStudentMutation } from "../../../api/endpoints/StudentsApi";
import { getAge } from "../../../common/util/TimeFunctions";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface TrainerStudentRequestsProps {
  refetchStudents: () => void;
  newStudentRequestsList: any[];
  refetchStudentRequests: () => void;
}
const TrainerStudentRequests = (props: TrainerStudentRequestsProps) => {
  const { refetchStudents, newStudentRequestsList, refetchStudentRequests } =
    props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

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

  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Öğrenciler</h2>
      {newStudentRequestsList?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("student")}</th>
              <th>{t("leaderboardTablePlayerNameHeader")}</th>
              <th>{t("leaderboardTableAgeHeader")}</th>
              <th>{t("leaderboardTableGenderHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("leaderboardTableLevelHeader")}</th>
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
                <td>
                  {student?.gender === "female" ? t("female") : t("male")}
                </td>
                <td>{student?.location_name}</td>
                <td>
                  {student.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : student?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : student?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : t("playerLevelProfessinal")}
                </td>
                <td>
                  <button
                    onClick={() => handleDeclineStudent(student)}
                    className={styles["decline-button"]}
                  >
                    {t("reject")}
                  </button>{" "}
                </td>{" "}
                <td>
                  <button
                    onClick={() => handleAddStudent(student)}
                    className={styles["accept-button"]}
                  >
                    {t("approve")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("noNewStudentRequests")}</p>
      )}
    </div>
  );
};

export default TrainerStudentRequests;

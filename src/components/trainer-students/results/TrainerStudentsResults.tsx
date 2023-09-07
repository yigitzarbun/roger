import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetStudentsQuery } from "../../../api/endpoints/StudentsApi";
import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";

import PageLoading from "../../../components/loading/PageLoading";
import DeleteTrainerStudentModal from "./delete-student-modal/DeleteTrainerStudentModal";

const TrainerStudentsResults = () => {
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

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const date = new Date();
  const currentYear = date.getFullYear();

  const myStudents = students?.filter(
    (student) =>
      student.trainer_id === user?.user?.user_id &&
      student.student_status === "accepted"
  );

  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const openDeleteModal = (student_id: number) => {
    setDeleteStudentId(student_id);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  if (
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isLocationsLoading ||
    isStudentsLoading ||
    isBookingsLoading
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
              <th>Antreman Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {myStudents?.map((student) => (
              <tr key={student.student_id}>
                <td>
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
                  >
                    {`${
                      players?.find(
                        (player) => player.user_id === student.player_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === student.player_id
                      )?.lname
                    }`}
                  </Link>
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
                  {
                    bookings?.filter(
                      (booking) =>
                        booking.booking_status_type_id === 5 &&
                        ((booking.inviter_id === user?.user?.user_id &&
                          booking.invitee_id === student.player_id) ||
                          (booking.invitee_id === user?.user?.user_id &&
                            booking.inviter_id === student.player_id))
                    )?.length
                  }
                </td>
                <td>
                  <button
                    onClick={() => openDeleteModal(student.student_id)}
                    className={styles["decline-button"]}
                  >
                    Öğrenciyi Sil
                  </button>
                </td>
                <td>
                  <Link
                    to={paths.LESSON_INVITE}
                    state={{
                      fname: players?.find(
                        (player) => player.user_id === student.player_id
                      ).fname,
                      lname: players?.find(
                        (player) => player.user_id === student.player_id
                      ).lname,
                      image: players?.find(
                        (player) => player.user_id === student.player_id
                      ).image,
                      court_price: "",
                      user_id: players?.find(
                        (player) => player.user_id === student.player_id
                      ).user_id,
                    }}
                    className={styles["lesson-button"]}
                  >
                    Derse davet et
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz aktif öğrenci bulunmamaktadır</p>
      )}
      <DeleteTrainerStudentModal
        deleteModalOpen={deleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        deleteStudentId={deleteStudentId}
        trainerUserId={user?.user?.user_id}
        students={students}
        players={players}
      />
    </div>
  );
};

export default TrainerStudentsResults;

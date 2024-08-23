import React, { useState, ChangeEvent } from "react";
import styles from "./styles.module.scss";
import TrainerStudentsResults from "../../components/trainer-students/results/TrainerStudentsResults";
import TrainerStudentsNavigation from "../../components/trainer-students/navigation/TrainerStudentsNavigation";
import TrainerStudentRequests from "../../components/trainer-students/new-student-requests/TrainerStudentRequests";
import TrainerStudentGroupsResults from "../../components/trainer-students/groups/TrainerStudentGroupsResults";
import {
  useGetPaginatedTrainerStudentsQuery,
  useGetTrainerNewStudentRequestsListQuery,
} from "../../api/endpoints/StudentsApi";
import { useAppSelector } from "../../store/hooks";
import PageLoading from "../../components/loading/PageLoading";

const TrainerStudents = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const [display, setDisplay] = useState("students");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const [textSearch, setTextSearch] = useState<string>("");

  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);

  const [gender, setGender] = useState<string>("");

  const [locationId, setLocationId] = useState<number | null>(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setTextSearch("");
    setPlayerLevelId(null);
    setGender("");
    setLocationId(null);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: newStudentRequestsList,
    isLoading: isNewStudentRequestsListLoading,
    refetch: refetchStudentRequests,
  } = useGetTrainerNewStudentRequestsListQuery(user?.user?.user_id);

  const {
    data: paginatedTrainerStudents,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetPaginatedTrainerStudentsQuery({
    perPage: 4,
    currentPage: currentPage,
    playerLevelId: playerLevelId,
    textSearch: textSearch,
    locationId: locationId,
    gender: gender,
    trainerUserId: user?.user?.user_id,
    studentStatus: "accepted",
  });

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % paginatedTrainerStudents?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedTrainerStudents?.totalPages) %
        paginatedTrainerStudents?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  if (isNewStudentRequestsListLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["students-container"]}>
      <TrainerStudentsNavigation
        display={display}
        handleDisplay={handleDisplay}
        newStudentRequestsList={newStudentRequestsList}
      />
      {display === "students" && (
        <TrainerStudentsResults
          playerLevelId={playerLevelId}
          textSearch={textSearch}
          locationId={locationId}
          gender={gender}
          handleLevel={handleLevel}
          handleTextSearch={handleTextSearch}
          handleGender={handleGender}
          handleLocation={handleLocation}
          handleClear={handleClear}
          paginatedTrainerStudents={paginatedTrainerStudents}
          handlePlayerPage={handlePlayerPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          user={user}
          refetchStudents={refetchStudents}
        />
      )}
      {display === "groups" && (
        <TrainerStudentGroupsResults
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
        />
      )}
      {display === "requests" && (
        <TrainerStudentRequests
          refetchStudents={refetchStudents}
          newStudentRequestsList={newStudentRequestsList}
          refetchStudentRequests={refetchStudentRequests}
        />
      )}
    </div>
  );
};

export default TrainerStudents;

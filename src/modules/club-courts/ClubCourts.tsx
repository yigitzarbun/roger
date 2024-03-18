import React, { useState, useEffect, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import ClubCourtsSearch from "../../components/club-courts/search/ClubCourtsSearch";
import ClubCourtsResults from "../../components/club-courts/results/ClubCourtsResults";
import AddCourtModal from "../../components/club-courts/add-court-modal/AddCourtModal";
import EditCourtModal from "../../components/club-courts/edit-court-modal/EditCourtModal";
import { useGetCourtStructureTypesQuery } from "../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../api/endpoints/CourtSurfaceTypesApi";
import { useGetClubByClubIdQuery } from "../../api/endpoints/ClubsApi";
import { useAppSelector } from "../../store/hooks";
import { useGetPaginatedCourtsQuery } from "../../api/endpoints/CourtsApi";
const ClubCourts = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const [surfaceTypeId, setSurfaceTypeId] = useState<number | null>(null);
  const [structureTypeId, setStructureTypeId] = useState<number | null>(null);
  const [textSearch, setTextSearch] = useState("");
  const [courtStatus, setCourtStatus] = useState<boolean | null>(null);

  const { data: currentClub, isLoading: isCurrentClubLoading } =
    useGetClubByClubIdQuery(user?.clubDetails?.club_id);

  const handleSurface = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setSurfaceTypeId(isNaN(value) ? null : value);
  };

  const handleStructure = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setStructureTypeId(isNaN(value) ? null : value);
  };

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleCourtStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const boolValue =
      value === "true" ? true : value === "false" ? false : null;
    setCourtStatus(boolValue);
  };
  const handleClear = () => {
    setSurfaceTypeId(null);
    setStructureTypeId(null);
    setTextSearch("");
    setCourtStatus(null);
  };

  const [isAddCourtModalOpen, setIsAddCourtModalOpen] = useState(false);

  const openAddCourtModal = () => {
    setIsAddCourtModalOpen(true);
  };

  const closeAddCourtModal = () => {
    setIsAddCourtModalOpen(false);
  };

  const [isEditCourtModalOpen, setIsEditCourtModalOpen] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);

  const openEditCourtModal = (court_id: number) => {
    setSelectedCourtId(court_id);
    setIsEditCourtModalOpen(true);
  };

  const closeEditCourtModal = () => {
    setIsEditCourtModalOpen(false);
  };

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: currentClubCourts,
    isLoading: isCurrentClubCourtsLoading,
    refetch: refetchClubCourts,
  } = useGetPaginatedCourtsQuery({
    page: currentPage,
    clubId: user?.clubDetails.club_id,
    courtSurfaceType: surfaceTypeId,
    courtStructureType: structureTypeId,
    textSearch: textSearch,
    locationId: null,
    isActive: courtStatus,
  });

  const handleCourtPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % currentClubCourts?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + currentClubCourts?.totalPages) %
        currentClubCourts?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };
  useEffect(() => {
    refetchClubCourts();
  }, [
    surfaceTypeId,
    structureTypeId,
    textSearch,
    currentPage,
    courtStatus,
    isEditCourtModalOpen,
    isAddCourtModalOpen,
  ]);

  return (
    <div className={styles["club-courts-container"]}>
      <ClubCourtsSearch
        handleSurface={handleSurface}
        handleStructure={handleStructure}
        handleTextSearch={handleTextSearch}
        handleClear={handleClear}
        surfaceTypeId={surfaceTypeId}
        structureTypeId={structureTypeId}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
        textSearch={textSearch}
        courtStatus={courtStatus}
        handleCourtStatus={handleCourtStatus}
      />

      <ClubCourtsResults
        surfaceTypeId={surfaceTypeId}
        structureTypeId={structureTypeId}
        textSearch={textSearch}
        openEditCourtModal={openEditCourtModal}
        openAddCourtModal={openAddCourtModal}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
        currentClub={currentClub}
        currentClubCourts={currentClubCourts}
        courtStatus={courtStatus}
        currentPage={currentPage}
        handleCourtPage={handleCourtPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />
      {isAddCourtModalOpen && (
        <AddCourtModal
          isAddCourtModalOpen={isAddCourtModalOpen}
          closeAddCourtModal={closeAddCourtModal}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          currentClub={currentClub}
          user={user}
        />
      )}

      {isEditCourtModalOpen && (
        <EditCourtModal
          court_id={selectedCourtId}
          isEditCourtModalOpen={isEditCourtModalOpen}
          closeEditCourtModal={closeEditCourtModal}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          currentClub={currentClub}
        />
      )}
    </div>
  );
};
export default ClubCourts;

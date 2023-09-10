import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import ClubCourtseHero from "../../components/club-courts/hero/ClubCourtsHero";
import ClubCourtsSearch from "../../components/club-courts/search/ClubCourtsSearch";
import ClubCourtsResults from "../../components/club-courts/results/ClubCourtsResults";
import AddCourtModal from "../../components/club-courts/add-court-modal/AddCourtModal";
import EditCourtModal from "../../components/club-courts/edit-court-modal/EditCourtModal";
import { useGetCourtStructureTypesQuery } from "../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../api/endpoints/CourtSurfaceTypesApi";

const ClubCourts = () => {
  const [surfaceTypeId, setSurfaceTypeId] = useState<number | null>(null);
  const [structureTypeId, setStructureTypeId] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(0);

  const handleSurface = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setSurfaceTypeId(isNaN(value) ? null : value);
  };
  const handleStructure = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setStructureTypeId(isNaN(value) ? null : value);
  };

  const handlePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setPrice(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setSurfaceTypeId(null);
    setStructureTypeId(null);
    setPrice(0);
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
  return (
    <div className={styles["club-courts-container"]}>
      <ClubCourtseHero />
      <ClubCourtsSearch
        handleSurface={handleSurface}
        handleStructure={handleStructure}
        handlePrice={handlePrice}
        handleClear={handleClear}
        surfaceTypeId={surfaceTypeId}
        structureTypeId={structureTypeId}
        price={price}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
      />

      <ClubCourtsResults
        surfaceTypeId={surfaceTypeId}
        structureTypeId={structureTypeId}
        price={price}
        openEditCourtModal={openEditCourtModal}
        openAddCourtModal={openAddCourtModal}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
      />
      <AddCourtModal
        isAddCourtModalOpen={isAddCourtModalOpen}
        closeAddCourtModal={closeAddCourtModal}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
      />
      {isEditCourtModalOpen && (
        <EditCourtModal
          court_id={selectedCourtId}
          isEditCourtModalOpen={isEditCourtModalOpen}
          closeEditCourtModal={closeEditCourtModal}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
        />
      )}
    </div>
  );
};
export default ClubCourts;

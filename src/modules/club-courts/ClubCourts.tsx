import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import ClubCourtseHero from "../../components/club-courts/hero/ClubCourtsHero";
import ClubCourtsSearch from "../../components/club-courts/search/ClubCourtsSearch";
import AddCourt from "../../components/club-courts/add-court-button/AddCourtButton";
import ClubCourtsResults from "../../components/club-courts/results/ClubCourtsResults";
import AddCourtModal from "../../components/club-courts/add-court-modal/AddCourtModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      />
      <AddCourt openModal={openModal} />
      <ClubCourtsResults
        surfaceTypeId={surfaceTypeId}
        structureTypeId={structureTypeId}
        price={price}
      />
      <AddCourtModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};
export default ClubCourts;

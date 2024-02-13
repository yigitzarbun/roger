import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";

interface PlayerPastEventsFilterProps {
  isPastEventsModalOpen: boolean;
  handleClosePastEventsModal: () => void;
  handleClear: () => void;
  clubId: number;
  textSearch: string;
  courtSurfaceTypeId: number;
  courtStructureTypeId: number;
  eventTypeId: number;
  clubs: Club[];
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  eventTypes: any;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}
const PlayerPastEventsFilterModal = (props: PlayerPastEventsFilterProps) => {
  const {
    isPastEventsModalOpen,
    handleClosePastEventsModal,
    clubId,
    textSearch,
    courtSurfaceTypeId,
    courtStructureTypeId,
    eventTypeId,
    clubs,
    courtStructureTypes,
    courtSurfaceTypes,
    eventTypes,
    handleClub,
    handleCourtStructure,
    handleCourtSurface,
    handleTextSearch,
    handleEventType,
    handleClear,
  } = props;

  return (
    <ReactModal
      isOpen={isPastEventsModalOpen}
      onRequestClose={handleClosePastEventsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleClosePastEventsModal} />
      <div className={styles["modal-content"]}>
        <h3>Etkinlikleri Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Oyuncu / Eğitmen / Kulüp adı"
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleClub}
                value={clubId ?? ""}
                className="input-element"
              >
                <option value="">-- Kulüp --</option>
                {clubs?.map((club) => (
                  <option key={club.user_id} value={club.user_id}>
                    {club.club_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleCourtStructure}
                value={courtStructureTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Mekan --</option>
                {courtStructureTypes?.map((type) => (
                  <option
                    key={type.court_structure_type_id}
                    value={type.court_structure_type_id}
                  >
                    {type.court_structure_type_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleCourtSurface}
                value={courtSurfaceTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Zemin --</option>
                {courtSurfaceTypes?.map((type) => (
                  <option
                    key={type.court_surface_type_id}
                    value={type.court_surface_type_id}
                  >
                    {type.court_surface_type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleEventType}
                value={eventTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Etkinlik --</option>
                {eventTypes?.map((type) => (
                  <option key={type.event_type_id} value={type.event_type_id}>
                    {type.event_type_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={handleClosePastEventsModal}
              className={styles["submit-button"]}
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default PlayerPastEventsFilterModal;

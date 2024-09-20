import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { Club } from "../../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import { useTranslation } from "react-i18next";

interface PlayerPastEventsFilterProps {
  display: string;
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
  missingReviews: number;
  missingScores: number;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMissingReviews: () => void;
  handleMissingScores: () => void;
}
const PlayerPastEventsFilterModal = (props: PlayerPastEventsFilterProps) => {
  const {
    display,
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
    missingReviews,
    missingScores,
    handleClub,
    handleCourtStructure,
    handleCourtSurface,
    handleTextSearch,
    handleEventType,
    handleMissingReviews,
    handleMissingScores,
    handleClear,
  } = props;

  const { t } = useTranslation();

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
        <h3>{t("pastEventsFilterTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("exploreEventsFilterSearchPlaceholder")}
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleClub}
                value={clubId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("allClubs")} --</option>
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
                <option value="">-- {t("structure")} --</option>
                {courtStructureTypes?.map((type) => (
                  <option
                    key={type.court_structure_type_id}
                    value={type.court_structure_type_id}
                  >
                    {type?.court_structure_type_id === 1
                      ? t("courtStructureOpen")
                      : type?.court_structure_type_id === 2
                      ? t("courtStructureClosed")
                      : t("courtStructureHybrid")}
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
                <option value="">-- {t("surface")} --</option>
                {courtSurfaceTypes?.map((type) => (
                  <option
                    key={type.court_surface_type_id}
                    value={type.court_surface_type_id}
                  >
                    {type?.court_surface_type_id === 1
                      ? t("courtSurfaceHard")
                      : type?.court_surface_type_id === 2
                      ? t("courtSurfaceClay")
                      : type?.court_surface_type_id === 3
                      ? t("courtSurfaceGrass")
                      : t("courtSurfaceCarpet")}
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
                <option value="">-- {t("eventTypes")} --</option>
                {eventTypes?.map((type) => (
                  <option key={type.event_type_id} value={type.event_type_id}>
                    {type?.event_type_id === 1
                      ? t("training")
                      : type?.event_type_id === 2
                      ? t("match")
                      : type?.event_type_id === 3
                      ? t("lesson")
                      : type?.event_type_id === 4
                      ? t("externalTraining")
                      : type?.event_type_id === 5
                      ? t("externalLesson")
                      : type?.event_type_id === 6
                      ? t("groupLesson")
                      : type?.event_type_id === 7
                      ? t("tournamentMatch")
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["missing-review-container"]}>
            {display === "events" && (
              <label>
                <input
                  type="checkbox"
                  checked={missingReviews === 1 ? true : false}
                  onChange={handleMissingReviews}
                />
                {t("unreviewedOnly")}
              </label>
            )}
            {display === "scores" && (
              <label>
                <input
                  type="checkbox"
                  checked={missingScores === 1 ? true : false}
                  onChange={handleMissingScores}
                />
                {t("missingMatchScoresOnly")}
              </label>
            )}
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleClosePastEventsModal}
              className={styles["submit-button"]}
            >
              {t("applyButtonText")}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default PlayerPastEventsFilterModal;

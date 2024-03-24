import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../../routing/Paths";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";

import { CourtStructureType } from "../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../api/endpoints/CourtSurfaceTypesApi";

interface ClubCourtResultsProps {
  surfaceTypeId: number;
  structureTypeId: number;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  textSearch: string;
  openEditCourtModal: (value: number) => void;
  openAddCourtModal: () => void;
  currentClub: any;
  currentClubCourts: any;
  currentPage: number;
  courtStatus: null | boolean;
  handleCourtPage: (e) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}
const ClubCourtsResults = (props: ClubCourtResultsProps) => {
  const {
    surfaceTypeId,
    structureTypeId,
    textSearch,
    courtStructureTypes,
    courtSurfaceTypes,
    openEditCourtModal,
    openAddCourtModal,
    currentClub,
    currentClubCourts,
    currentPage,
    courtStatus,
    handleCourtPage,
    handleNextPage,
    handlePrevPage,
  } = props;

  const clubBankDetailsExist =
    currentClub?.[0]["iban"] &&
    currentClub?.[0]["bank_id"] &&
    currentClub?.[0]["name_on_bank_account"];

  const higher_price_for_non_subscribers =
    currentClub?.[0]["higher_price_for_non_subscribers"];

  const pageNumbers = [];
  for (let i = 1; i <= currentClubCourts?.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Kortlar</h2>
          <button
            onClick={openAddCourtModal}
            className={styles["add-court-button"]}
            disabled={!clubBankDetailsExist}
          >
            {clubBankDetailsExist
              ? "Yeni Kort Ekle"
              : "Kort Eklemek İçin Banka Hesap Bilgilerinizi Ekleyin"}
          </button>
        </div>
        {currentClubCourts?.totalPages > 1 && (
          <div className={styles["navigation-container"]}>
            <FaAngleLeft
              onClick={handlePrevPage}
              className={styles["nav-arrow"]}
            />
            <FaAngleRight
              onClick={handleNextPage}
              className={styles["nav-arrow"]}
            />
          </div>
        )}
      </div>
      {currentClubCourts?.courts?.length === 0 ? (
        <p>Henüz sisteme eklenmiş kortunuz bulunmamaktadır.</p>
      ) : (
        currentClubCourts?.courts?.length === 0 &&
        (surfaceTypeId > 0 || structureTypeId > 0 || textSearch !== "") && (
          <p>
            Aradığınız kritere göre kort bulunamadı. Lütfen filtreyi temizleyip
            tekrar deneyin.
          </p>
        )
      )}
      {currentClubCourts?.courts?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Kort</th>
              <th>Kort Adı</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Açılış</th>
              <th>Kapanış</th>
              <th>Fiyat </th>
              <th>Fiyat - (misafir)</th>
              <th>Aktif</th>
              <th>Kortu Düzenle</th>
            </tr>
          </thead>
          <tbody>
            {currentClubCourts?.courts?.map((court) => (
              <tr key={court.court_id} className={styles["court-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}>
                    <img
                      src={
                        court?.courtImage
                          ? court?.courtImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt="kort"
                      className={styles["court-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}
                    className={styles["court-name"]}
                  >
                    {court.court_name}
                  </Link>
                </td>
                <td>{court.court_surface_type_name}</td>
                <td>{court.court_structure_type_name}</td>
                <td>{court.opening_time.slice(0, 5)}</td>
                <td>{court.closing_time.slice(0, 5)}</td>
                <td>{court.price_hour}</td>
                <td>
                  {higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber
                    ? court.price_hour_non_subscriber
                    : higher_price_for_non_subscribers &&
                      !court.price_hour_non_subscriber
                    ? "Fiyat Girin"
                    : higher_price_for_non_subscribers === false && "-"}
                </td>
                <td>
                  {court.is_active ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    <ImBlocked className={styles.blocked} />
                  )}
                </td>
                <td onClick={() => openEditCourtModal(court.court_id)}>
                  <button className={styles["edit-button"]}>Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handleCourtPage}
            className={
              pageNumber === Number(currentPage)
                ? styles["active-page"]
                : styles["passive-page"]
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClubCourtsResults;

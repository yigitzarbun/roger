import React, { useState } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import PageLoading from "../../../../components/loading/PageLoading";

import { User } from "../../../../store/slices/authSlice";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import {
  Court,
  useGetPaginatedCourtsQuery,
} from "../../../../api/endpoints/CourtsApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";

interface ExploreCourtsProps {
  user: User;
  clubs: Club[];
  locations: Location[];
  courtSurfaceTypes: CourtSurfaceType[];
  courtStructureTypes: CourtStructureType[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isCourtStructureTypesLoading: boolean;
  isCourtSurfaceTypesLoading: boolean;
}
const ExploreCourts = (props: ExploreCourtsProps) => {
  const {
    user,
    clubs,
    locations,
    courtStructureTypes,
    courtSurfaceTypes,
    isClubsLoading,
    isLocationsLoading,
    isCourtStructureTypesLoading,
    isCourtSurfaceTypesLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
    isUserClub = user?.user?.user_type_id === 3;
  }

  const [currentPage, setCurrentPage] = useState(1);

  const { data: courts, isLoading: isCourtsLoading } =
    useGetPaginatedCourtsQuery(currentPage);

  const pageNumbers = [];
  for (let i = 1; i <= courts?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleCourtPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % courts?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + courts?.totalPages) % courts?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isCourtStructureTypesLoading ||
    isCourtsLoading ||
    isCourtSurfaceTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kortları Keşfet</h2>
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
      </div>
      {courts && courts?.courts?.length === 0 && (
        <p>
          Aradığınız kritere göre kort bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {courts && courts?.courts?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Kort</th>
              <th>İsim</th>
              <th>Açılış</th>
              <th>Kapanış</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Fiyat</th>
              <th>Fiyat (misafir)</th>
              <th>Kulüp</th>
              <th>Konum</th>
              <th>Statüsü</th>
            </tr>
          </thead>
          <tbody>
            {courts?.courts?.map((court) => (
              <tr key={court.court_id} className={styles["court-row"]}>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}>
                    <img
                      src={
                        court.image ? court.image : "/images/icons/avatar.png"
                      }
                      alt={"court-iamge"}
                      className={styles["court-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}
                    className={styles["court-name"]}
                  >{`${court.court_name}`}</Link>
                </td>
                <td>{court.opening_time.slice(0, 5)}</td>
                <td>{court.closing_time.slice(0, 5)}</td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        court.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        court.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>{court?.price_hour}</td>
                <td>
                  {clubs?.find((club) => club.club_id === court.club_id)
                    ?.higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber
                    ? court.price_hour_non_subscriber
                    : "-"}
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === court.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        clubs?.find((club) => club.club_id === court.club_id)
                          ?.location_id
                    )?.location_name
                  }
                </td>
                <td>{court.is_active ? "Aktif" : "Bloke"}</td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}
                    className={styles["book-button"]}
                  >
                    {isUserPlayer || isUserTrainer
                      ? " Rezerve et"
                      : isUserClub
                      ? "Görüntüle"
                      : ""}
                  </Link>
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

export default ExploreCourts;

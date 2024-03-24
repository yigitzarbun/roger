import React, { useState, ChangeEvent, useEffect } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import PageLoading from "../../../../components/loading/PageLoading";

import { User } from "../../../../store/slices/authSlice";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { useGetPaginatedCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";
import ExploreCourtsFilterModal from "./explore-courts-filter/ExploreCourtsFilterModal";

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
  locationId: number;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  clubId: number;
  handleClubId: (event: ChangeEvent<HTMLSelectElement>) => void;
  courtSurfaceType: number;
  courtStructureType: number;
  handleCourtSurfaceType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructureType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
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
    locationId,
    handleLocation,
    clubId,
    handleClubId,
    courtSurfaceType,
    courtStructureType,
    handleCourtSurfaceType,
    handleCourtStructureType,
    handleClear,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
    isUserClub = user?.user?.user_type_id === 3;
  }

  const [isCourtFilterModalOpen, setIsCourtFilterModalOpen] = useState(false);
  const handleOpenCourtFilterModal = () => {
    setIsCourtFilterModalOpen(true);
  };
  const handleCloseCourtFilterModal = () => {
    setIsCourtFilterModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: courts,
    isLoading: isCourtsLoading,
    refetch: refetchCourts,
  } = useGetPaginatedCourtsQuery({
    page: currentPage,
    locationId: locationId,
    clubId: clubId,
    courtSurfaceType: courtSurfaceType,
    courtStructureType: courtStructureType,
    textSearch: "",
    isActive: true,
  });

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

  useEffect(() => {
    refetchCourts();
  }, [locationId, clubId, courtSurfaceType, courtStructureType]);

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
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Kortları Keşfet</h2>
          <FaFilter
            onClick={handleOpenCourtFilterModal}
            className={
              locationId > 0 ||
              clubId > 0 ||
              courtSurfaceType > 0 ||
              courtStructureType > 0
                ? styles["active-filter"]
                : styles.filter
            }
          />
        </div>
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
              <th>Statü</th>
              <th>
                {isUserPlayer || isUserTrainer
                  ? "Rezervasyon"
                  : isUserClub && "Görüntüle"}
              </th>
            </tr>
          </thead>
          <tbody>
            {courts?.courts?.map((court) => (
              <tr key={court.court_id} className={styles["court-row"]}>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}>
                    <img
                      src={
                        court.courtImage
                          ? court.courtImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={"court-image"}
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
                <td>{court?.court_surface_type_name}</td>
                <td>{court?.court_structure_type_name}</td>
                <td>{court?.price_hour}</td>
                <td>
                  {court.higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber
                    ? court.price_hour_non_subscriber
                    : "-"}
                </td>
                <td>{court.club_name}</td>
                <td>{court?.location_name}</td>
                <td>
                  {court.is_active ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    <ImBlocked className={styles.blocked} />
                  )}
                </td>
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
      <ExploreCourtsFilterModal
        locations={locations}
        courtStructureTypes={courtStructureTypes}
        courtSurfaceTypes={courtSurfaceTypes}
        handleLocation={handleLocation}
        handleCourtSurfaceType={handleCourtSurfaceType}
        handleCourtStructureType={handleCourtStructureType}
        handleClear={handleClear}
        locationId={locationId}
        courtSurfaceType={courtSurfaceType}
        courtStructureType={courtStructureType}
        clubId={clubId}
        handleClubId={handleClubId}
        clubs={clubs}
        isCourtFilterModalOpen={isCourtFilterModalOpen}
        handleCloseCourtFilterModal={handleCloseCourtFilterModal}
      />
    </div>
  );
};

export default ExploreCourts;

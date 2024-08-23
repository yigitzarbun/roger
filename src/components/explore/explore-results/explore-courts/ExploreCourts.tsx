import React, { useState, ChangeEvent, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import { BsSortDown } from "react-icons/bs";
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
import ExploreCourtsSortModal from "./explore-courts-sort/ExploreCourtsSortModal";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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

  const logicLocationId = isUserPlayer
    ? user?.playerDetails?.location_id
    : isUserTrainer
    ? user?.trainerDetails?.location_id
    : isUserClub
    ? user?.clubDetails?.location_id
    : null;

  const [orderByDirection, setOrderByDirection] = useState("desc");

  const [orderByColumn, setOrderByColumn] = useState("");

  const handleOrderBy = (orderByColumn: string, orderByDirection: string) => {
    setOrderByColumn(orderByColumn);
    setOrderByDirection(orderByDirection);
  };

  const handleClearOrderBy = () => {
    setOrderByColumn("");
  };

  const [sortModalOpen, setSortModalOpen] = useState(false);

  const handleOpenSortModal = () => {
    setSortModalOpen(true);
  };

  const handleCloseSortModal = () => {
    setSortModalOpen(false);
  };

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
    proximityLocationId: logicLocationId,
    column: orderByColumn,
    direction: orderByDirection,
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
  }, [
    locationId,
    clubId,
    courtSurfaceType,
    courtStructureType,
    orderByDirection,
    orderByColumn,
    currentPage,
  ]);

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
          <h2 className={styles["result-title"]}>{t("exploreCourtsTitle")}</h2>
          <div className={styles.icons}>
            {courts?.courts?.length > 0 && (
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
            )}
            <BsSortDown
              className={
                orderByColumn === ""
                  ? styles["passive-sort"]
                  : styles["active-sort"]
              }
              onClick={handleOpenSortModal}
            />
          </div>
        </div>
        {courts?.totalPages > 1 && (
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

      {courts && courts?.courts?.length === 0 && <p>{t("courtsEmptyText")}</p>}
      {courts && courts?.courts?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableOpeningTimeHeader")}</th>
              <th>{t("tableClosingTimeHeader")}</th>
              <th>{t("tableSurfaceHeader")}</th>
              <th>{t("tableStructureHeader")}</th>
              <th>{t("tableCourtPriceHeader")}</th>
              <th>{t("tablePriceGuestHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableStatusHeader")}</th>
              <th>
                {isUserPlayer || isUserTrainer
                  ? t("tableBookingHeader")
                  : isUserClub && t("tableViewHeader")}
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
                <td>
                  {court?.court_surface_type_id === 1
                    ? t("courtSurfaceHard")
                    : court?.court_surface_type_id === 2
                    ? t("courtSurfaceClay")
                    : court?.court_surface_type_id === 3
                    ? t("courtSurfaceGrass")
                    : t("courtSurfaceCarpet")}
                </td>
                <td>
                  {court?.court_structure_type_id === 1
                    ? t("courtStructureOpen")
                    : court?.court_structure_type_id === 2
                    ? t("courtStructureClosed")
                    : t("courtStructureHybrid")}
                </td>
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
                      ? t("tableBookCourtButton")
                      : isUserClub
                      ? t("tableViewHeader")
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
      {isCourtFilterModalOpen && (
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
      )}
      {sortModalOpen && (
        <ExploreCourtsSortModal
          sortModalOpen={sortModalOpen}
          handleCloseSortModal={handleCloseSortModal}
          handleOrderBy={handleOrderBy}
          handleClearOrderBy={handleClearOrderBy}
          orderByDirection={orderByDirection}
          orderByColumn={orderByColumn}
        />
      )}
    </div>
  );
};

export default ExploreCourts;

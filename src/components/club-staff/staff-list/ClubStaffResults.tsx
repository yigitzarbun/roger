import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import PageLoading from "../../../components/loading/PageLoading";
import DeleteClubStaffModal from "./delete-staff-modal/DeleteClubStaffModal";
import { useAppSelector } from "../../../store/hooks";
import { currentYear } from "../../../common/util/TimeFunctions";
import { useGetPaginatedClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import { useGetClubStaffRoleTypesQuery } from "../../../api/endpoints/ClubStaffRoleTypesApi";
import ClubStaffFilterModal from "./filter/ClubStaffFilterModal";

const ClubStaffResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubStaffRoleTypes, isLoading: isClubStaffRoleTypesLoading } =
    useGetClubStaffRoleTypesQuery({});

  const [currentPage, setCurrentPage] = useState(1);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleClear = () => {
    setLocationId(null);
    setGender("");
    setRoleId(null);
    setTextSearch("");
  };
  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleGender = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const handleRole = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setRoleId(isNaN(value) ? null : value);
  };

  const {
    data: myStaff,
    isLoading: isMyStaffLoading,
    refetch: refetchMyStaff,
  } = useGetPaginatedClubStaffQuery({
    currentPage: currentPage,
    locationId: locationId,
    gender: gender,
    roleId: roleId,
    textSearch: textSearch,
    clubId: user?.clubDetails?.club_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= myStaff?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleStaffPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myStaff?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myStaff?.totalPages) % myStaff?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const [selectedStaffUser, setSelectedStaffUser] = useState(null);

  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);

  const openDeleteStaffModal = (staff) => {
    setSelectedStaffUser(staff);
    setIsDeleteStaffModalOpen(true);
  };

  const closeDeleteStaffModal = () => {
    setSelectedStaffUser(null);
    setIsDeleteStaffModalOpen(false);
  };

  const [isStaffFilterModalOpen, setIsStaffFilterModalOpen] = useState(false);

  const handleOpenStaffFilterModal = () => {
    setIsStaffFilterModalOpen(true);
  };

  const closeStaffFilterModal = () => {
    setIsStaffFilterModalOpen(false);
  };

  useEffect(() => {
    refetchMyStaff();
  }, [
    isDeleteStaffModalOpen,
    currentPage,
    locationId,
    gender,
    roleId,
    textSearch,
  ]);

  if (isMyStaffLoading || isClubStaffRoleTypesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Eğitmenleri Keşfet</h2>
          {myStaff?.staff?.length > 0 && (
            <FaFilter
              onClick={handleOpenStaffFilterModal}
              className={
                roleId > 0 ||
                textSearch !== "" ||
                gender !== "" ||
                locationId > 0
                  ? styles["active-filter"]
                  : styles.filter
              }
            />
          )}
        </div>
        {myStaff?.totalPages > 1 && (
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
      {myStaff?.staff?.length === 0 && <p>Kayıtlı personel bulunmamaktadır.</p>}
      {clubStaffRoleTypes && myStaff?.staff?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Personel</th>
              <th>İsim</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Konum</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myStaff?.staff?.map((staff) => (
              <tr key={staff.club_staff_id} className={styles["trainer-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}2/${staff.trainerUserId}`}>
                    <img
                      src={
                        staff.trainerImage
                          ? staff.trainerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt="staff_image"
                      className={styles["staff-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}2/${staff.trainerUserId}`}
                    className={styles["name"]}
                  >
                    {`
                    ${staff?.fname}
                   ${staff?.lname}
                  
                  `}
                  </Link>
                </td>
                <td>{currentYear - Number(staff?.birth_year)}</td>
                <td>{staff?.gender}</td>
                <td>{staff?.location_name}</td>
                <td>{staff?.club_staff_role_type_name}</td>
                <td>
                  {staff.employment_status === "pending" ? (
                    "Onay Bekliyor"
                  ) : (
                    <button
                      onClick={() => openDeleteStaffModal(staff)}
                      className={styles["delete-button"]}
                    >
                      Sil
                    </button>
                  )}
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
            onClick={handleStaffPage}
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
      {isDeleteStaffModalOpen && (
        <DeleteClubStaffModal
          isDeleteStaffModalOpen={isDeleteStaffModalOpen}
          closeDeleteStaffModal={closeDeleteStaffModal}
          selectedClubStaff={selectedStaffUser}
        />
      )}
      {isStaffFilterModalOpen && (
        <ClubStaffFilterModal
          locationId={locationId}
          gender={gender}
          roleId={roleId}
          textSearch={textSearch}
          handleClear={handleClear}
          handleTextSearch={handleTextSearch}
          handleLocation={handleLocation}
          handleGender={handleGender}
          handleRole={handleRole}
          closeStaffFilterModal={closeStaffFilterModal}
          isStaffFilterModalOpen={isStaffFilterModalOpen}
        />
      )}
    </div>
  );
};

export default ClubStaffResults;

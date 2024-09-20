import React, { useEffect, useState, ChangeEvent } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaFilter } from "react-icons/fa6";
import { ImBlocked } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { BsSortDown } from "react-icons/bs";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../routing/Paths";
import { User } from "../../../../store/slices/authSlice";
import { Location } from "../../../../../api/endpoints/LocationsApi";
import { ClubType } from "../../../../../api/endpoints/ClubTypesApi";
import { Court } from "../../../../../api/endpoints/CourtsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../../api/endpoints/FavouritesApi";
import { ClubStaff } from "../../../../../api/endpoints/ClubStaffApi";
import {
  useGetPlayerByUserIdQuery,
  useGetPlayerProfileDetailsQuery,
} from "../../../../../api/endpoints/PlayersApi";
import { useGetPaginatedClubsQuery } from "../../../../../api/endpoints/ClubsApi";
import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";
import ClubEmploymentModal from "./employment-modal/ClubEmploymentModal";
import { handleToggleFavourite } from "../../../../common/util/UserDataFunctions";
import { CourtStructureType } from "../../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../../api/endpoints/CourtSurfaceTypesApi";
import ExploreClubsFilterModal from "./explore-clubs-filter/ExploreClubsFilterModal";
import AddPlayerCardDetails from "../../../../components/profile/player/card-payments/add-card-details/AddPlayerCardDetails";
import ExploreClubsSortModal from "./explore-clubs-sort/ExploreClubsSortModal";
import { BsClockHistory } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { imageUrl } from "@/common/constants/apiConstants";

interface ExploreClubsProps {
  user: User;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  locations: Location[];
  clubTypes: ClubType[];
  courts: Court[];
  clubStaff: ClubStaff[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isClubTypesLoading: boolean;
  isCourtsLoading: boolean;
  isClubStaffLoading: boolean;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClubType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurfaceType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructureType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClubTrainers: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleSubscribedClubs: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  textSearch: string;
  locationId: number;
  clubType: number;
  courtSurfaceType: number;
  courtStructureType: number;
  clubTrainers: boolean;
  subscribedClubs: boolean;
}
const ExploreClubs = (props: ExploreClubsProps) => {
  const {
    user,
    locations,
    clubTypes,
    clubStaff,
    courtStructureTypes,
    courtSurfaceTypes,
    isLocationsLoading,
    isClubTypesLoading,
    isCourtsLoading,
    isClubStaffLoading,
    handleTextSearch,
    handleLocation,
    handleClubType,
    handleCourtSurfaceType,
    handleCourtStructureType,
    handleClubTrainers,
    handleSubscribedClubs,
    handleClear,
    textSearch,
    locationId,
    clubType,
    courtSurfaceType,
    courtStructureType,
    clubTrainers,
    subscribedClubs,
  } = props;

  const { t } = useTranslation();

  const {
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

  const [paymentModal, setPaymentModal] = useState(false);

  const handleOpenPaymentModal = () => {
    setPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModal(false);
  };

  let isUserPlayer = false;

  let isUserTrainer = false;

  let isUserClub = false;

  if (user) {
    isUserPlayer = user?.user.user_type_id === 1;
    isUserTrainer = user?.user.user_type_id === 2;
    isUserClub = user?.user?.user_type_id === 3;
  }

  const [isClubFilterModalOpen, setIsClubFilterModalOpen] = useState(false);

  const handleOpenClubFilterModal = () => {
    setIsClubFilterModalOpen(true);
  };
  const handleCloseclubFilterModal = () => {
    setIsClubFilterModalOpen(false);
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
    data: clubs,
    isLoading: isClubsLoading,
    refetch: refetchClubs,
  } = useGetPaginatedClubsQuery({
    page: currentPage,
    locationId: locationId,
    textSearch: textSearch,
    clubType: clubType,
    courtSurfaceType: courtSurfaceType,
    courtStructureType: courtStructureType,
    clubTrainers: clubTrainers,
    subscribedClubs: subscribedClubs,
    currentUserId: user?.user?.user_id,
    proximityLocationId: logicLocationId,
    column: orderByColumn,
    direction: orderByDirection,
  });

  const pageNumbers = [];
  for (let i = 1; i <= clubs?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleClubPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % clubs?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + clubs?.totalPages) % clubs?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const {
    data: currentPlayer,
    isLoading: isCurrentPlayerLoading,
    refetch: refetchCurrentPlayer,
  } = useGetPlayerByUserIdQuery(user?.user?.user_id);

  // player payment details
  let playerPaymentDetailsExist = false;

  if (isUserPlayer) {
    if (
      currentPlayer?.[0]?.name_on_card &&
      currentPlayer?.[0]?.card_number &&
      currentPlayer?.[0]?.cvc &&
      currentPlayer?.[0]?.card_expiry
    ) {
      playerPaymentDetailsExist = true;
    }
  }

  // add club staff
  const [trainerEmploymentClub, setTrainerEmploymentClub] = useState(null);

  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);

  const openEmploymentModal = (club) => {
    setTrainerEmploymentClub(club);
    setEmploymentModalOpen(true);
  };

  const closeEmploymentModal = () => {
    setEmploymentModalOpen(false);
  };

  // favourites
  const { refetch: refetchFavourites } = useGetFavouritesQuery({});

  const {
    data: myFavouriteClubs,
    isLoading: isMyFavouriteClubsLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({ favouriter_id: user?.user?.user_id });

  const isClubInMyFavourites = (user_id: number) => {
    return myFavouriteClubs?.find(
      (favourite) => favourite.favouritee_id === user_id
    );
  };

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  // subscription
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const [selectedClubId, setSelectedClubId] = useState(null);

  const handleOpenSubscribeModal = (value: number) => {
    setOpenSubscribeModal(true);
    setSelectedClubId(value);
  };

  const handleCloseSubscribeModal = () => {
    setOpenSubscribeModal(false);
    setSelectedClubId(null);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
      refetchFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchCurrentPlayer();
  }, [paymentModal]);

  useEffect(() => {
    refetchMyFavourites();
  }, []);

  useEffect(() => {
    refetchClubs();
  }, [openSubscribeModal]);

  useEffect(() => {
    refetchClubs();
  }, [
    currentPage,
    locationId,
    textSearch,
    clubType,
    courtSurfaceType,
    courtStructureType,
    clubTrainers,
    subscribedClubs,
    employmentModalOpen,
    orderByDirection,
    orderByColumn,
  ]);

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isClubTypesLoading ||
    isCourtsLoading ||
    isClubStaffLoading ||
    isMyFavouriteClubsLoading ||
    isCurrentPlayerLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>{t("exploreClubsTitle")}</h2>
          <div className={styles.icons}>
            {clubs?.clubs && clubs?.clubs.length > 0 && (
              <FaFilter
                onClick={handleOpenClubFilterModal}
                className={
                  textSearch !== "" ||
                  locationId > 0 ||
                  clubType > 0 ||
                  courtSurfaceType > 0 ||
                  courtStructureType > 0 ||
                  clubTrainers === true ||
                  subscribedClubs === true
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
        {clubs?.totalPages > 1 && (
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
      {clubs?.clubs && clubs?.clubs.length === 0 && (
        <p>{t("clubsEmptyText")}</p>
      )}
      {clubs?.clubs && clubs?.clubs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("tableFavouriteHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("tableTrainerHeader")}</th>
              <th>{t("tableSubscribersHeader")}</th>
              <th>
                {isUserPlayer
                  ? t("tableSubscriptionHeader")
                  : isUserTrainer
                  ? t("tableTrainerEmploymentHeader")
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {clubs?.clubs.map((club) => (
              <tr key={club.club_id} className={styles["club-row"]}>
                <td
                  onClick={() =>
                    handleToggleFavourite(
                      club.user_id,
                      isClubInMyFavourites,
                      updateFavourite,
                      myFavouriteClubs,
                      user,
                      addFavourite
                    )
                  }
                >
                  {isClubInMyFavourites(club.user_id)?.is_active === true &&
                  club.user_id !== user?.user?.user_id ? (
                    <AiFillStar className={styles["remove-fav-icon"]} />
                  ) : (
                    <AiOutlineStar className={styles["add-fav-icon"]} />
                  )}
                </td>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}>
                    <img
                      src={
                        club.clubImage
                          ? `${imageUrl}/${club?.clubImage}`
                          : "/images/icons/avatar.jpg"
                      }
                      alt={"club-image"}
                      className={styles["club-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}
                    className={styles["club-name"]}
                  >
                    {`${club.club_name}`}
                  </Link>
                </td>
                <td>
                  {club?.club_type_id === 1
                    ? t("clubTypePrivate")
                    : club?.club_type_id === 2
                    ? t("clubTypePublic")
                    : t("clubTypeResidential")}
                </td>
                <td>{club?.location_name}</td>
                <td>{club?.courtquantity}</td>
                <td>{club?.staffquantity}</td>
                <td>{club?.memberquantity}</td>
                {isUserPlayer && (
                  <td className={styles.status}>
                    {club?.clubHasSubscriptionPackages &&
                    club?.isPlayerSubscribed ? (
                      <IoIosCheckmarkCircle className={styles.done} />
                    ) : club?.clubHasSubscriptionPackages &&
                      playerPaymentDetailsExist ? (
                      <button
                        onClick={() => handleOpenSubscribeModal(club.user_id)}
                        disabled={!playerPaymentDetailsExist}
                        className={styles["subscribe-button"]}
                      >
                        {t("subscribe")}
                      </button>
                    ) : club?.clubHasSubscriptionPackages &&
                      !playerPaymentDetailsExist ? (
                      <button
                        onClick={handleOpenPaymentModal}
                        className={styles["payment-button"]}
                      >
                        {t("addPaymentDetails")}
                      </button>
                    ) : (
                      <ImBlocked className={styles.blocked} />
                    )}
                  </td>
                )}
                {isUserTrainer && (
                  <td className={styles.status}>
                    {club?.isTrainerStaff?.employment_status === "accepted" ? (
                      <IoIosCheckmarkCircle className={styles.done} />
                    ) : club?.isTrainerStaff?.employment_status ===
                      "pending" ? (
                      <BsClockHistory
                        className={styles["employment-pending-icon"]}
                      />
                    ) : (
                      <button
                        onClick={() => openEmploymentModal(club)}
                        className={styles["subscribe-button"]}
                      >
                        {t("staffApplyButtonText")}
                      </button>
                    )}
                  </td>
                )}
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
            onClick={handleClubPage}
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
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClubId}
        />
      )}
      {employmentModalOpen && (
        <ClubEmploymentModal
          employmentModalOpen={employmentModalOpen}
          closeEmploymentModal={closeEmploymentModal}
          selectedClub={trainerEmploymentClub}
        />
      )}
      {isClubFilterModalOpen && (
        <ExploreClubsFilterModal
          isClubFilterModalOpen={isClubFilterModalOpen}
          handleCloseclubFilterModal={handleCloseclubFilterModal}
          locations={locations}
          clubTypes={clubTypes}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          handleTextSearch={handleTextSearch}
          handleLocation={handleLocation}
          handleClubType={handleClubType}
          handleCourtSurfaceType={handleCourtSurfaceType}
          handleCourtStructureType={handleCourtStructureType}
          handleClubTrainers={handleClubTrainers}
          handleSubscribedClubs={handleSubscribedClubs}
          handleClear={handleClear}
          textSearch={textSearch}
          locationId={locationId}
          clubType={clubType}
          courtSurfaceType={courtSurfaceType}
          courtStructureType={courtStructureType}
          clubTrainers={clubTrainers}
          subscribedClubs={subscribedClubs}
        />
      )}
      {paymentModal && (
        <AddPlayerCardDetails
          isModalOpen={paymentModal}
          handleCloseModal={handleClosePaymentModal}
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={playerPaymentDetailsExist}
        />
      )}
      {sortModalOpen && (
        <ExploreClubsSortModal
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

export default ExploreClubs;

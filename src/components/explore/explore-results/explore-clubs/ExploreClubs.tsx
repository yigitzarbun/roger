import React, { useEffect, useState, ChangeEvent } from "react";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { FaFilter } from "react-icons/fa6";
import { ImBlocked } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { PaginatedClubs } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { ClubType } from "../../../../api/endpoints/ClubTypesApi";
import { Court } from "../../../../api/endpoints/CourtsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";

import { ClubStaff } from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPaginatedClubsQuery } from "../../../../api/endpoints/ClubsApi";

import SubscribeToClubModal from "../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../components/loading/PageLoading";
import ClubEmploymentModal from "./employment-modal/ClubEmploymentModal";
import { handleToggleFavourite } from "../../../../common/util/UserDataFunctions";
import Paths from "../../../../routing/Paths";
import { CourtStructureType } from "../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import ExploreClubsFilterModal from "./explore-clubs-filter/ExploreClubsFilterModal";

interface ExploreClubsProps {
  user: User;
  clubs: PaginatedClubs;
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

  const navigate = useNavigate();

  const navigatePaymentDetails = () => {
    navigate(Paths.PROFILE);
  };
  let isUserPlayer = false;
  let isUserTrainer = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
  }

  const [isClubFilterModalOpen, setIsClubFilterModalOpen] = useState(false);
  const handleOpenClubFilterModal = () => {
    setIsClubFilterModalOpen(true);
  };
  const handleCloseclubFilterModal = () => {
    setIsClubFilterModalOpen(false);
  };
  const [currentPage, setCurrentPage] = useState(1);

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

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

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
          <h2 className={styles["result-title"]}>Kulüpleri Keşfet</h2>
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
        <p>
          Aradığınız kritere göre kulüp bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {clubs?.clubs && clubs?.clubs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Eğitmen</th>
              <th>Üye Sayısı</th>
              <th>
                {isUserPlayer ? "Üyelik" : isUserTrainer ? "Antrenörlük" : ""}
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
                          ? club.clubImage
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
                <td>{club?.club_type_name}</td>
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
                        Üye Ol
                      </button>
                    ) : club?.clubHasSubscriptionPackages &&
                      !playerPaymentDetailsExist ? (
                      <button
                        onClick={navigatePaymentDetails}
                        className={styles["payment-button"]}
                      >
                        Ödeme bilgilerini ekle
                      </button>
                    ) : (
                      <ImBlocked className={styles.blocked} />
                    )}
                  </td>
                )}
                {isUserTrainer && (
                  <td className={styles.status}>
                    {club?.isTrainerStaff?.employment_status === "accepted" ? (
                      <p className={styles["employment-confirmed-text"]}>
                        Bu kulüpte çalışıyorsun
                      </p>
                    ) : club?.isTrainerStaff?.employment_status ===
                      "pending" ? (
                      <p className={styles["employment-pending-text"]}>
                        Başvurun henüz yanıtlanmadı
                      </p>
                    ) : (
                      <button
                        onClick={() => openEmploymentModal(club)}
                        className={styles["subscribe-button"]}
                      >
                        Kulübe başvur
                      </button>
                    )}
                  </td>
                )}
                <td>
                  <SlOptions className={styles.icon} />
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
    </div>
  );
};

export default ExploreClubs;

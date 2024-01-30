import React, { useEffect, useState, ChangeEvent } from "react";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { FaFilter } from "react-icons/fa6";

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

  const [filter, setFilter] = useState(false);
  const toggleFilter = () => {
    setFilter((curr) => !curr);
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
  const [trainerEmploymentClubId, setTrainerEmploymentClubId] = useState(null);
  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);

  const openEmploymentModal = (club_id: number) => {
    setTrainerEmploymentClubId(club_id);
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

  const isUserStaff = (club_id: number) => {
    const staffMember = clubStaff?.find(
      (staff) =>
        staff.club_id === club_id &&
        staff.user_id === user?.user?.user_id &&
        (staff.employment_status === "accepted" ||
          staff.employment_status === "pending")
    );

    return staffMember ? staffMember.employment_status : null;
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
  }, [
    currentPage,
    locationId,
    textSearch,
    clubType,
    courtSurfaceType,
    courtStructureType,
    clubTrainers,
    subscribedClubs,
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
          <FaFilter onClick={toggleFilter} className={styles.filter} />
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
      {filter && (
        <div className={styles["nav-filter-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Kulüp adı"
            />
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleLocation}
              value={locationId ?? ""}
              className="input-element"
            >
              <option value="">-- Konum --</option>
              {locations?.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleClubType}
              value={clubType ?? ""}
              className="input-element"
            >
              <option value="">-- Kulüp Tipi --</option>
              {clubTypes?.map((type) => (
                <option key={type.club_type_id} value={type.club_type_id}>
                  {type.club_type_name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleCourtStructureType}
              value={courtStructureType ?? ""}
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
          <div className={styles["input-container"]}>
            <select
              onChange={handleCourtSurfaceType}
              value={courtSurfaceType ?? ""}
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
              onChange={handleClubTrainers}
              value={clubTrainers ? "true" : "false"}
              className="input-element"
            >
              <option key={1} value={"false"}>
                Tüm Kulüpler
              </option>
              <option key={2} value={"true"}>
                Yalnızca eğitmeni olan kulüpler
              </option>
            </select>
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleSubscribedClubs}
              value={subscribedClubs ? "true" : "false"}
              className="input-element"
            >
              <option key={1} value={"false"}>
                -- Tüm Kulüpler --
              </option>
              <option key={2} value={"true"}>
                Yalnızca üyeliğim olan kulüpler
              </option>
            </select>
          </div>
        </div>
      )}
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
              <th>Üyelik Paketi</th>
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
                  {isClubInMyFavourites(club.user_id)?.is_active === true ? (
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
                      <p className={styles["subscribed-text"]}>Üyelik Var</p>
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
                      <p className={styles["no-subscription-text"]}>
                        Kulübün üyelik paketi yok
                      </p>
                    )}
                  </td>
                )}
                {isUserTrainer && (
                  <td className={styles.status}>
                    {isUserStaff(club.club_id) === "accepted" ? (
                      <p className={styles["employed-text"]}>
                        Bu kulüpte çalışıyorsun
                      </p>
                    ) : isUserStaff(club.club_id) === "pending" ? (
                      <p className={styles["employment-pending-text"]}>
                        Başvurun henüz yanıtlanmadı
                      </p>
                    ) : (
                      <button
                        onClick={() => openEmploymentModal(club.club_id)}
                        className={styles["subscribe-button"]}
                      >
                        Bu kulüpte çalıştığına dair kulübe başvur
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
          trainerEmploymentClubId={trainerEmploymentClubId}
        />
      )}
    </div>
  );
};

export default ExploreClubs;

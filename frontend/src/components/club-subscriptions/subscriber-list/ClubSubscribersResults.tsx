import React, { useState, ChangeEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import AddClubSubscriberModal from "./add-subscriber-modal/AddClubSubscriberModal";
import EditClubSubscriberModal from "./edit-subscriber-modal/EditClubSubscriberModal";
import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";
import { FaFilter } from "react-icons/fa6";
import { useGetPaginatedClubSubscribersQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import ClubSubscriptionsFilterModal from "./filter/ClubSubscriptionsFilterModal";
import EditClubBankDetailsModal from "../../../components/profile/club/bank-details/edit-bank-details/EditClubBankDetails";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import AddSubscriptionPackageModal from "../subscription-packages/add-subscription-package-modal/AddSubscriptionPackageModal";
import { useGetClubSubscriptionPackageDetailsQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

interface ClubSubscribersResultsProps {
  textSearch: any;
  clubSubscriptionTypeId: any;
  playerLevelId: any;
  locationId: any;
  userTypeId: any;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePlayerLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleUserType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  currentClub: any;
  refetchClubDetails: () => any;
}
const ClubSubscribersResults = (props: ClubSubscribersResultsProps) => {
  const {
    textSearch,
    clubSubscriptionTypeId,
    locationId,
    playerLevelId,
    userTypeId,
    handleTextSearch,
    handleSubscriptionType,
    handlePlayerLevel,
    handleLocation,
    handleUserType,
    handleClear,
    currentClub,
    refetchClubDetails,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: mySubscriptions,
    isLoading: isMySubscriptionsLoading,
    refetch: refetchMySubscriptions,
  } = useGetPaginatedClubSubscribersQuery({
    page: currentPage,
    textSearch: textSearch,
    clubSubscriptionTypeId: clubSubscriptionTypeId,
    playerLevelId: playerLevelId,
    locationId: locationId,
    userTypeId: userTypeId,
    userId: user?.user?.user_id,
  });

  const [isAddSubscriberModalOpen, setIsAddSubscriberModalOpen] =
    useState(false);

  const openAddClubSubscriberModal = () => {
    setIsAddSubscriberModalOpen(true);
  };

  const closeAddClubSubscriberModal = () => {
    setIsAddSubscriberModalOpen(false);
  };

  const [isEditSubscriberModalOpen, setIsEditSubscriberModalOpen] =
    useState(false);

  const [selectedSubscriptionDetails, setSelectedSubscriptionDetails] =
    useState(false);

  const openEditClubSubscriberModal = (selectedSubscriptionDetails) => {
    setSelectedSubscriptionDetails(selectedSubscriptionDetails);
    setIsEditSubscriberModalOpen(true);
  };

  const closeEditClubSubscriberModal = () => {
    setIsEditSubscriberModalOpen(false);
  };

  const {
    data: mySubscriptionPackages,
    isLoading: isMySubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    is_active: true,
    club_id: user?.user?.user_id,
  });

  const {
    data: myPackages,
    isLoading: isMyPackagesLoading,
    refetch: refetchMyPackages,
  } = useGetClubSubscriptionPackageDetailsQuery({
    clubId: user?.user?.user_id,
  });

  const handleCourtPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % mySubscriptions?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + mySubscriptions?.totalPages) %
        mySubscriptions?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const pageNumbers = [];
  for (let i = 1; i <= mySubscriptions?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const [subscriberFilterModalOpen, setSubscriberFilterModalOpen] =
    useState(false);

  const handleOpenSubscribersFilterModal = () => {
    setSubscriberFilterModalOpen(true);
  };

  const handleCloseSubscribersFilterModal = () => {
    setSubscriberFilterModalOpen(false);
  };

  const bankDetails = {
    bank_id: currentClub?.[0]?.bank_id,
    iban: currentClub?.[0]?.iban,
    name_on_bank_account: currentClub?.[0]?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  const openAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(true);
  };
  const closeAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(false);
  };

  useEffect(() => {
    refetchMySubscriptions();
  }, [
    currentPage,
    textSearch,
    clubSubscriptionTypeId,
    playerLevelId,
    locationId,
    userTypeId,
    isEditSubscriberModalOpen,
    isAddSubscriberModalOpen,
  ]);

  useEffect(() => {
    refetchClubDetails();
  }, [isEditBankModalOpen]);

  useEffect(() => {
    refetchMyPackages();
  }, [openAddPackageModal]);

  if (
    isMySubscriptionsLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isSubscriptionTypesLoading ||
    isMySubscriptionPackagesLoading ||
    isUserTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Üyeler</h2>
          {bankDetailsExist && mySubscriptionPackages?.length > 0 && (
            <button
              onClick={openAddClubSubscriberModal}
              className={styles["add-subscription-package-button"]}
              disabled={mySubscriptionPackages?.length === 0}
            >
              <p className={styles["add-title"]}>Yeni Üye Ekle</p>
            </button>
          )}
          {mySubscriptions?.subscribers?.length > 0 && (
            <FaFilter
              onClick={handleOpenSubscribersFilterModal}
              className={
                clubSubscriptionTypeId > 0 ||
                textSearch !== "" ||
                locationId > 0 ||
                playerLevelId > 0 ||
                userTypeId > 0
                  ? styles["active-filter"]
                  : styles.filter
              }
            />
          )}
        </div>
        {mySubscriptions?.totalPages > 1 && (
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
      {!bankDetailsExist ? (
        <div className={styles["add-bank-details-container"]}>
          <p>Üyelik satışı yapmak için banka bilgilerinizi ekleyin.</p>
          <button className={styles.button} onClick={handleOpenEditBankModal}>
            Banka Bilgilerini Ekle
          </button>
        </div>
      ) : bankDetailsExist && mySubscriptionPackages?.length === 0 ? (
        <div className={styles["add-bank-details-container"]}>
          <p>Üyelik satışı yapmak için üyelik paketi ekleyin.</p>
          <button
            className={styles.button}
            onClick={openAddClubSubscriptionPackageModal}
          >
            Üyelik Paketi Ekle
          </button>
        </div>
      ) : (
        mySubscriptions?.subscribers?.length === 0 && (
          <p>Kayıtlı aktif üye bulunmamaktadır.</p>
        )
      )}
      {mySubscriptions?.subscribers?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Üye</th>
              <th>İsim</th>
              <th>Üye Tipi</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th>Üyelik Tipi</th>
              <th>Üyelik Başlangıç</th>
              <th>Üyelik Bitiş</th>
            </tr>
          </thead>
          <tbody>
            {mySubscriptions?.subscribers?.map((subscription) => (
              <tr
                key={subscription.club_subscription_id}
                className={styles.row}
              >
                <td>
                  {subscription?.user_type_id === 1 ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${subscription.playerUserId}`}
                    >
                      <img
                        src={
                          subscription?.playerImage
                            ? subscription?.playerImage
                            : "/images/icons/avatar.jpg"
                        }
                        alt="subsciption"
                        className={styles["subscription-image"]}
                      />
                    </Link>
                  ) : (
                    <img
                      src="/images/icons/avatar.jpg"
                      className={styles["subscription-image"]}
                    />
                  )}
                </td>
                <td>
                  {subscription?.user_type_id === 1 ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${subscription.playerUserId}`}
                      className={styles["subscription-name"]}
                    >
                      {`${subscription?.fname}
                        ${subscription?.lname}
                        `}
                    </Link>
                  ) : subscription?.user_type_id === 5 ? (
                    `${subscription?.fname} ${subscription?.lname}`
                  ) : (
                    ""
                  )}
                </td>
                <td>{subscription?.user_type_name}</td>
                <td>
                  {subscription?.playerLevelName
                    ? subscription?.playerLevelName
                    : subscription?.externalLevelName
                    ? subscription?.externalLevelName
                    : ""}
                </td>
                <td>{subscription?.gender}</td>
                <td>{getAge(Number(subscription.birth_year))}</td>
                <td>
                  {subscription?.playerLocationName
                    ? subscription?.playerLocationName
                    : subscription?.externalLocationName
                    ? subscription?.externalLocationName
                    : ""}
                </td>
                <td>{subscription?.club_subscription_type_name}</td>
                <td>{subscription.start_date.slice(0, 10)}</td>
                <td>{subscription.end_date.slice(0, 10)}</td>
                <td>
                  {subscription?.user_type_id === 1 ? (
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${subscription.playerUserId} `}
                    >
                      <button className={styles["view-button"]}>
                        Görüntüle
                      </button>
                    </Link>
                  ) : subscription?.user_type_id === 5 ? (
                    <button
                      onClick={() => openEditClubSubscriberModal(subscription)}
                      className={styles["edit-button"]}
                    >
                      Güncelle
                    </button>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {mySubscriptions?.subscribers?.length > 0 && (
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
      )}

      {isAddSubscriberModalOpen && (
        <AddClubSubscriberModal
          isAddSubscriberModalOpen={isAddSubscriberModalOpen}
          closeAddClubSubscriberModal={closeAddClubSubscriberModal}
          userTypes={userTypes}
          locations={locations}
          playerLevels={playerLevels}
          clubSubscriptionTypes={subscriptionTypes}
          mySubscriptionPackages={mySubscriptionPackages}
        />
      )}
      {isEditSubscriberModalOpen && (
        <EditClubSubscriberModal
          isEditSubscriberModalOpen={isEditSubscriberModalOpen}
          closeEditClubSubscriberModal={closeEditClubSubscriberModal}
          selectedSubscriptionDetails={selectedSubscriptionDetails}
          locations={locations}
          playerLevels={playerLevels}
          mySubscriptionPackages={mySubscriptionPackages}
        />
      )}
      {subscriberFilterModalOpen && (
        <ClubSubscriptionsFilterModal
          subscriberFilterModalOpen={subscriberFilterModalOpen}
          textSearch={textSearch}
          clubSubscriptionTypeId={clubSubscriptionTypeId}
          playerLevelId={playerLevelId}
          locationId={locationId}
          userTypeId={userTypeId}
          handleCloseSubscribersFilterModal={handleCloseSubscribersFilterModal}
          handleTextSearch={handleTextSearch}
          handleSubscriptionType={handleSubscriptionType}
          handlePlayerLevel={handlePlayerLevel}
          handleLocation={handleLocation}
          handleUserType={handleUserType}
          handleClear={handleClear}
        />
      )}
      {isEditBankModalOpen && (
        <EditClubBankDetailsModal
          isModalOpen={isEditBankModalOpen}
          handleCloseModal={handleCloseEditBankModal}
          banks={banks}
          clubDetails={currentClub}
          bankDetailsExist={bankDetailsExist}
          refetchClubDetails={refetchClubDetails}
        />
      )}
      {openAddPackageModal && (
        <AddSubscriptionPackageModal
          openAddPackageModal={openAddPackageModal}
          closeAddClubSubscriptionPackageModal={
            closeAddClubSubscriptionPackageModal
          }
          clubSubscriptionTypes={subscriptionTypes}
          myPackages={myPackages}
          user={user}
          currentClub={currentClub}
        />
      )}
    </div>
  );
};
export default ClubSubscribersResults;

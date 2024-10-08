import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImBlocked } from "react-icons/im";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./styles.module.scss";
import Paths from "../../../../routing/Paths";
import AddClubCourtBookingModal from "../add-booking-modal/AddClubCourtBookingModal";
import EditClubCourtBookingModal from "../edit-booking-modal/EditClubCourtBookingModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { useAppSelector } from "../../../../store/hooks";
import { useGetPaginatedClubCalendarBookingsQuery } from "../../../../../api/endpoints/BookingsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetStudentGroupsByFilterQuery } from "../../../../../api/endpoints/StudentGroupsApi";
import AddCourtModal from "../../../../components/club-courts/add-court-modal/AddCourtModal";
import { useGetClubProfileDetailsQuery } from "../../../../../api/endpoints/ClubsApi";
import { useGetCourtStructureTypesQuery } from "../../../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../../api/endpoints/CourtSurfaceTypesApi";
import EditClubBankDetailsModal from "../../../../components/profile/club/bank-details/edit-bank-details/EditClubBankDetails";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";

interface ClubCalendarResultsProps {
  courtId: number;
  eventTypeId: number;
  myCourts: any[];
  textSearch: string;
  refecthMyCourts: () => void;
}
const ClubCalendarResults = (props: ClubCalendarResultsProps) => {
  const { courtId, eventTypeId, myCourts, textSearch, refecthMyCourts } = props;

  // fetch data
  const user = useAppSelector((store) => store.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const {
    data: currentClub,
    isLoading: isClubDetailsLoading,
    refetch: refetchClubDetails,
  } = useGetClubProfileDetailsQuery(user?.user?.user_id);

  const clubBankDetailsExist =
    currentClub?.[0]["iban"] &&
    currentClub?.[0]["bank_id"] &&
    currentClub?.[0]["name_on_bank_account"];

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const [currentPage, setCurrentPage] = useState(1);

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const {
    data: clubCalendarBookings,
    isLoading: isClubCalendarBookingsLoading,
    refetch: refetchClubCalendarBookings,
  } = useGetPaginatedClubCalendarBookingsQuery({
    currentPage: currentPage,
    textSearch: textSearch,
    courtId: courtId,
    eventTypeId: eventTypeId,
    clubId: user?.clubDetails?.club_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= clubCalendarBookings?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleBookingPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % clubCalendarBookings?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + clubCalendarBookings?.totalPages) %
        clubCalendarBookings?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const [addBookingModalOpen, setAddBookingModalOpen] = useState(false);

  const openAddBookingModal = () => {
    setAddBookingModalOpen(true);
  };

  const closeAddBookingModal = () => {
    setAddBookingModalOpen(false);
  };

  const [editBookingModalOpen, setEditBookingModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const openEditBookingModal = (booking: any) => {
    setEditBookingModalOpen(true);
    setSelectedBooking(booking);
  };

  const closeEditBookingModal = () => {
    setEditBookingModalOpen(false);
    setSelectedBooking(null);
  };

  // date

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const [isAddCourtModalOpen, setIsAddCourtModalOpen] = useState(false);

  const openAddCourtModal = () => {
    setIsAddCourtModalOpen(true);
  };

  const closeAddCourtModal = () => {
    setIsAddCourtModalOpen(false);
  };

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  useEffect(() => {
    refetchClubCalendarBookings();
  }, [
    currentPage,
    textSearch,
    courtId,
    eventTypeId,
    editBookingModalOpen,
    addBookingModalOpen,
  ]);

  useEffect(() => {
    refetchClubDetails();
  }, [isEditBankModalOpen]);

  if (
    isUsersLoading ||
    isMyGroupsLoading ||
    isClubCalendarBookingsLoading ||
    isClubDetailsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Takvim</h2>
          {myCourts?.length > 0 && (
            <button
              className={styles["add-booking-button"]}
              onClick={openAddBookingModal}
              disabled={myCourts?.length === 0}
            >
              Rezervasyon Ekle
            </button>
          )}
        </div>

        {clubCalendarBookings?.totalPages > 1 && (
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
      {!clubBankDetailsExist ? (
        <div className={styles["add-bank-details-container"]}>
          <p>
            Kort satışı gerçekleştirmek için öncelikle banka bilgilerinizi
            eklemeniz gerekmektedir.
          </p>
          <button className={styles.button} onClick={handleOpenEditBankModal}>
            Banka Bilgilerini Ekle
          </button>
        </div>
      ) : clubBankDetailsExist &&
        clubCalendarBookings?.bookings?.length === 0 &&
        myCourts?.length === 0 ? (
        <div className={styles["add-bank-details-container"]}>
          <p>
            Kendi üyeleriniz ve diğer oyuncu / eğitmenlerin rezervasyon
            yapabilmesi için kort ekleyin.
          </p>
          <button onClick={openAddCourtModal} className={styles.button}>
            Kort Ekle
          </button>
        </div>
      ) : clubBankDetailsExist &&
        clubCalendarBookings?.bookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Davet Eden</th>
              <th>Davet Edilen</th>
              <th>Tür </th>
              <th>Tarih</th>
              <th>Saat </th>
              <th>Kort</th>
              <th>Konum</th>
              <th>Ücret</th>
              <th>Düzenle</th>
            </tr>
          </thead>
          <tbody>
            {clubCalendarBookings?.bookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["booking-row"]}>
                <td>
                  {booking.event_type_id !== 4 ? (
                    <Link
                      to={`${Paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1 ||
                        booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : booking.event_type_id === 5 ||
                            booking.event_type_id === 6
                          ? 2
                          : ""
                      }/${booking.inviter_id}`}
                      className={styles.name}
                    >
                      {booking.invitername}
                    </Link>
                  ) : (
                    booking.invitername
                  )}
                </td>

                <td>
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 3 ? (
                    <Link
                      to={`${Paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1 ||
                        booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : ""
                      }/${
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 1 ||
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 2
                          ? booking.invitee_id
                          : users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 6
                          ? myGroups?.find(
                              (group) => group.user_id === booking.invitee_id
                            )?.club_id
                          : ""
                      }`}
                      className={styles.name}
                    >
                      {booking.inviteename}
                    </Link>
                  ) : (
                    booking.inviteename
                  )}
                </td>
                <td>{booking?.event_type_name}</td>
                <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                <td>{booking.event_time.slice(0, 5)}</td>
                <td>{booking?.court_name}</td>
                <td>{booking?.club_name}</td>
                <td>
                  {booking?.event_type_id !== 6
                    ? `${booking?.price_hour} TL`
                    : "-"}
                </td>
                <td>
                  {booking.event_type_id === 4 ||
                  booking.event_type_id === 5 ||
                  booking.event_type_id === 6 ? (
                    <button
                      onClick={() => openEditBookingModal(booking)}
                      className={styles["edit-button"]}
                    >
                      Düzenle
                    </button>
                  ) : (
                    <ImBlocked className={styles.blocked} />
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
            onClick={handleBookingPage}
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
      {addBookingModalOpen && (
        <AddClubCourtBookingModal
          addBookingModalOpen={addBookingModalOpen}
          closeAddBookingModal={closeAddBookingModal}
          myCourts={myCourts}
        />
      )}

      {editBookingModalOpen && (
        <EditClubCourtBookingModal
          editBookingModalOpen={editBookingModalOpen}
          closeEditBookingModal={closeEditBookingModal}
          selectedBooking={selectedBooking}
          myCourts={myCourts}
          user={user}
        />
      )}

      {isAddCourtModalOpen && (
        <AddCourtModal
          isAddCourtModalOpen={isAddCourtModalOpen}
          closeAddCourtModal={closeAddCourtModal}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          currentClub={currentClub}
          user={user}
          refetchMyCourts={refecthMyCourts}
        />
      )}
      {isEditBankModalOpen && (
        <EditClubBankDetailsModal
          isModalOpen={isEditBankModalOpen}
          handleCloseModal={handleCloseEditBankModal}
          banks={banks}
          clubDetails={currentClub}
          bankDetailsExist={clubBankDetailsExist}
          refetchClubDetails={refetchClubDetails}
        />
      )}
    </div>
  );
};

export default ClubCalendarResults;

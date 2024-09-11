import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import AcceptInviteModal, {
  AcceptBookingData,
} from "../../../invite/modals/accept-modal/AcceptInviteModal";
import DeclineInviteModal, {
  DeclineBookingData,
} from "../../../invite/modals/decline-modal/DeclineInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  useGetTrainerIncomingRequestsQuery,
  useUpdateBookingMutation,
} from "../../../../api/endpoints/BookingsApi";
import {
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
} from "../../../../api/endpoints/PaymentsApi";
import {
  useGetIsStudentQuery,
  useAddStudentMutation,
  useGetStudentsByFilterQuery,
} from "../../../../api/endpoints/StudentsApi";
import { getAge } from "../../../../common/util/TimeFunctions";
import { useTranslation } from "react-i18next";

const TrainerRequestsIncoming = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [skipSelectedPayment, setSkipSelectedPayment] = useState(true);

  const { t } = useTranslation();

  //const [skipStudent, setSkipStudent] = useState(true);

  //const [selectedPlayerUserId, setSelectedPlayerUserId] = useState(null);

  const {
    data: incomingBookings,
    isLoading: isIncomingBookingsLoading,
    refetch: refetchBookings,
  } = useGetTrainerIncomingRequestsQuery(user?.user_id);

  /*
  const { data: isStudent, isLoading: isStudentLoading } = useGetIsStudentQuery(
    {
      player_id: selectedPlayerUserId,
      trainer_id: user?.user_id,
    },
    { skip: skipStudent }
  );

  const { refetch: refetchStudents } = useGetStudentsByFilterQuery({
    trainer_id: user?.user_id,
  });
*/
  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [updatePayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useUpdatePaymentMutation({});

  /*
  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});
*/

  // accept booking
  const [acceptBookingData, setAcceptBookingData] =
    useState<AcceptBookingData | null>(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const handleOpenAcceptModal = (data) => {
    setAcceptBookingData(data);
    setSelectedPaymentId(data.payment_id);
    setSkipSelectedPayment(false);
    setIsAcceptModalOpen(true);
  };

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const {
    data: selectedPayment,
    isLoading: isSelectedPaymentLoading,
    refetch: refetchPayments,
  } = useGetPaymentByIdQuery(selectedPaymentId, { skip: skipSelectedPayment });

  const handleAcceptBooking = () => {
    const updatedPaymentData = {
      ...selectedPayment?.[0],
      payment_status: "success",
    };
    updatePayment(updatedPaymentData);
  };

  // decline booking
  const [declineBookingData, setDeclineBookingData] =
    useState<DeclineBookingData | null>(null);

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleOpenDeclineModal = (data) => {
    setSelectedPaymentId(data.payment_id);
    setSkipSelectedPayment(false);
    setDeclineBookingData(data);
    setIsDeclineModalOpen(true);
  };

  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
  };

  const handleDeclineBooking = () => {
    const updatedPaymentData = {
      ...selectedPayment?.[0],
      payment_status: "declined",
    };
    updatePayment(updatedPaymentData);
  };

  useEffect(() => {
    if (isPaymentSuccess && paymentData) {
      if (paymentData[0]?.payment_status === "success") {
        const acceptedBookingData = {
          booking_id: acceptBookingData?.booking_id,
          event_date: acceptBookingData?.event_date,
          event_time: acceptBookingData?.event_time,
          court_price: acceptBookingData?.court_price,
          lesson_price: acceptBookingData?.lesson_price,
          payment_id: acceptBookingData?.payment_id,
          event_type_id: acceptBookingData?.event_type_id,
          club_id: acceptBookingData?.club_id,
          court_id: acceptBookingData?.court_id,
          inviter_id: acceptBookingData?.inviter_id,
          invitee_id: acceptBookingData?.invitee_id,
          invitation_note: acceptBookingData?.invitation_note,
          booking_status_type_id: 2,
        };
        updateBooking(acceptedBookingData);
      } else if (paymentData[0]?.payment_status === "declined") {
        const declinedBookingData = {
          booking_id: declineBookingData?.booking_id,
          event_date: declineBookingData?.event_date,
          event_time: declineBookingData?.event_time,
          court_price: declineBookingData?.court_price,
          lesson_price: declineBookingData?.lesson_price,
          payment_id: declineBookingData?.payment_id,
          event_type_id: declineBookingData?.event_type_id,
          club_id: declineBookingData?.club_id,
          court_id: declineBookingData?.court_id,
          inviter_id: declineBookingData?.inviter_id,
          invitee_id: declineBookingData?.invitee_id,
          invitation_note: declineBookingData?.invitation_note,
          booking_status_type_id: 3,
        };
        updateBooking(declinedBookingData);
      }
      refetchPayments();
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      toast.success("İşlem başarılı");
      // check if player is not student. add if not
      //setSelectedPlayerUserId(acceptBookingData?.inviter_id);
      //setSkipStudent(false);
      refetchBookings();
      refetchPayments();
      setAcceptBookingData(null);
      handleCloseAcceptModal();
      handleCloseDeclineModal();
    }
  }, [isUpdateBookingSuccess]);

  /*
  useEffect(() => {
    if (!isStudent) {
      const newStudent = {
        student_status: "pending",
        trainer_id: user?.user_id,
        player_id: acceptBookingData?.inviter_id,
      };
      addStudent(newStudent);
    }
  }, [isStudent]);

  useEffect(() => {
    if (isAddStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess]);
*/

  if (isIncomingBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>{t("incomingRequestsTitle")}</h2>
      </div>
      {incomingBookings?.length === 0 ? (
        <div>{t("noLessonInvitationText")}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t("tablePlayerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableAgeHeader")}</th>
              <th>{t("tableClubTypeHeader")} </th>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")} </th>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>
                {t("tablePriceHeader")}
                <span className={styles["fee"]}>*</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {incomingBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["player-row"]}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${booking?.inviter_id}`}>
                    <img
                      src={
                        booking?.playerImage
                          ? booking?.playerImage
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${booking?.inviter_id}`}
                    className={styles["player-name"]}
                  >
                    {`${booking?.fname} ${booking?.lname}`}
                  </Link>
                </td>
                <td>
                  {(booking.event_type_id === 3 ||
                    booking.event_type_id === 5) &&
                  booking.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 4
                    ? t("playerLevelProfessinal")
                    : "-"}
                </td>
                <td>
                  {booking?.gender === "female" ? t("female") : t("male")}
                </td>
                <td>{getAge(booking?.birth_year)}</td>
                <td>
                  {booking?.event_type_id === 1
                    ? t("training")
                    : booking?.event_type_id === 2
                    ? t("match")
                    : booking?.event_type_id === 3
                    ? t("lesson")
                    : booking?.event_type_id === 4
                    ? t("externalTraining")
                    : booking?.event_type_id === 5
                    ? t("externalLesson")
                    : booking?.event_type_id === 6
                    ? t("groupLesson")
                    : booking?.event_type_id === 7
                    ? t("tournamentMatch")
                    : ""}
                </td>
                <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                <td>{booking.event_time.slice(0, 5)}</td>
                <td>{booking?.court_name}</td>
                <td>{booking?.club_name}</td>
                <td>{booking?.lesson_price}</td>
                <td>
                  <button
                    onClick={() => handleOpenDeclineModal(booking)}
                    className={styles["decline-button"]}
                  >
                    {t("reject")}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenAcceptModal(booking)}
                    className={styles["accept-button"]}
                  >
                    {t("approve")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isAcceptModalOpen && (
        <AcceptInviteModal
          isAcceptModalOpen={isAcceptModalOpen}
          handleCloseAcceptModal={handleCloseAcceptModal}
          acceptBookingData={acceptBookingData}
          handleAcceptBooking={handleAcceptBooking}
          user={user}
        />
      )}
      {isDeclineModalOpen && (
        <DeclineInviteModal
          isDeclineModalOpen={isDeclineModalOpen}
          handleCloseDeclineModal={handleCloseDeclineModal}
          declineBookingData={declineBookingData}
          handleDeclineBooking={handleDeclineBooking}
          user={user}
        />
      )}
    </div>
  );
};

export default TrainerRequestsIncoming;

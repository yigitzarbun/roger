import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  currentDay,
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";
import { useGetClubExternalMembersByFilterQuery } from "../../../../../api/endpoints/ClubExternalMembersApi";
import {
  Booking,
  useUpdateBookingMutation,
  useGetBookedCourtHoursQuery,
} from "../../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../../api/endpoints/EventTypesApi";
import { useGetClubTrainersQuery } from "../../../../../api/endpoints/ClubStaffApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../../api/endpoints/StudentGroupsApi";
import { useTranslation } from "react-i18next";

interface EditClubCourtBookingModalProps {
  editBookingModalOpen: boolean;
  closeEditBookingModal: () => void;
  selectedBooking: any;
  myCourts: any;
  user: any;
}

const EditClubCourtBookingModal = (props: EditClubCourtBookingModalProps) => {
  const {
    editBookingModalOpen,
    closeEditBookingModal,
    selectedBooking,
    myCourts,
    user,
  } = props;

  const { t } = useTranslation();

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: myTrainers, isLoading: isMyTrainersLoading } =
    useGetClubTrainersQuery(user?.user?.user_id);

  const { data: myExternalMembers, isLoading: isMyExternalMembersLoading } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [selectedDate, setSelectedDate] = useState("");

  const handleSelectedDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const [selectedTime, setSelectedTime] = useState("");

  const handleSelectedTime = (event) => {
    setSelectedTime(event.target.value);
  };

  const [selectedCourt, setSelectedCourt] = useState(null);

  const handleSelectedCourt = (event) => {
    setSelectedCourt(Number(event.target.value));
  };

  const [selectedEventType, setSelectedEventType] = useState(null);

  const handleSelectedEventType = (event) => {
    setSelectedEventType(Number(event.target.value));
  };

  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectedGroup = (event) => {
    setSelectedGroup(Number(event.target.value));
  };

  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );

  const {
    data: filteredBookings,
    isLoading: isFilteredBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookedCourtHoursQuery({
    courtId: selectedCourt,
    eventDate: selectedDate,
  });

  useEffect(() => {
    setBookedHours(filteredBookings);
  }, [selectedCourt, selectedDate, filteredBookings, selectedBooking]);

  const availableTimeSlots = generateAvailableTimeSlots(
    selectedCourt,
    selectedDate,
    myCourts,
    bookedHoursForSelectedCourtOnSelectedDate
  );

  const handleDeleteBooking = () => {
    const deletedBookingData = {
      booking_id: selectedBooking?.booking_id,
      registered_at: selectedBooking?.registered_at,
      event_date: selectedBooking?.event_date,
      event_time: selectedBooking?.event_time,
      court_price: selectedBooking?.court_price,
      lesson_price: selectedBooking?.lesson_price,
      invitation_note: selectedBooking?.invitation_note,
      payment_id: selectedBooking?.payment_id,
      booking_status_type_id: 4,
      event_type_id: selectedBooking?.event_type_id,
      club_id: selectedBooking?.club_id,
      court_id: selectedBooking?.court_id,
      inviter_id: selectedBooking?.inviter_id,
      invitee_id: selectedBooking?.invitee_id,
    };
    updateBooking(deletedBookingData);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Booking>({
    defaultValues: {
      event_date: selectedBooking?.event_date
        ? new Date(selectedBooking.event_date).toISOString().substring(0, 10)
        : "",
      event_time: selectedBooking?.event_time.slice(0, 5),
      booking_status_type_id: selectedBooking?.booking_status_type_id,
      event_type_id: selectedBooking?.event_type_id,
      court_id: selectedBooking?.court_id,
      inviter_id: selectedBooking?.inviter_id,
      invitee_id: selectedBooking?.invitee_id,
    },
  });

  const onSubmit: SubmitHandler<Booking> = async (formData: Booking) => {
    const bookingData = {
      booking_id: selectedBooking?.booking_id,
      event_date: new Date(formData.event_date).toISOString(),
      event_time: selectedTime,
      court_price: Number(
        myCourts?.find((court) => court.court_id === Number(selectedCourt))
          ?.price_hour
      ),
      booking_status_type_id: 2,
      event_type_id: Number(formData?.event_type_id),
      club_id: user?.user?.clubDetails?.club_id,
      court_id: Number(formData?.court_id),
      inviter_id: Number(formData?.inviter_id),
      invitee_id: Number(formData?.invitee_id),
    };
    updateBooking(bookingData);
  };

  useEffect(() => {
    if (selectedBooking) {
      reset({
        event_date: selectedBooking?.event_date
          ? new Date(selectedBooking.event_date).toISOString().substring(0, 10)
          : "",
        event_time: selectedBooking?.event_time.slice(0, 5),
        booking_status_type_id: selectedBooking?.booking_status_type_id,
        event_type_id: selectedBooking?.event_type_id,
        court_id: selectedBooking?.court_id,
        inviter_id: selectedBooking?.inviter_id,
        invitee_id: selectedBooking?.invitee_id,
      });
    }
  }, [editBookingModalOpen]);

  useEffect(() => {
    if (selectedBooking) {
      setSelectedCourt(selectedBooking.court_id);
      setSelectedDate(
        new Date(selectedBooking.event_date).toISOString().slice(0, 10)
      );
      setSelectedEventType(selectedBooking.event_type_id);

      setSelectedTime(selectedBooking.event_time.slice(0, 5));

      setSelectedGroup(selectedBooking.invitee_id);
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      refetchBookings();
      toast.success("Rezervasyon güncellendi");
      closeEditBookingModal();
      reset();
    }
  }, [isUpdateBookingSuccess]);

  if (
    isMyExternalMembersLoading ||
    isEventTypesLoading ||
    isMyTrainersLoading ||
    isMyGroupsLoading ||
    isFilteredBookingsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={editBookingModalOpen}
      onRequestClose={closeEditBookingModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEditBookingModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1 className={styles.title}>{t("updateBookingTitle")}</h1>
          <button
            onClick={handleDeleteBooking}
            className={styles["delete-button"]}
          >
            {t("deleteBooking")}
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("tableDateHeader")}</label>
              <input
                {...register("event_date", {
                  required: t("mandatoryField"),
                })}
                type="date"
                onChange={handleSelectedDate}
                min={currentDay}
              />
              {errors.event_date && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("tableCourtHeader")}</label>
              <select
                {...register("court_id", { required: true })}
                onChange={handleSelectedCourt}
                disabled={!selectedDate}
              >
                {myCourts &&
                  myCourts.map((court) => (
                    <option key={court.court_id} value={court.court_id}>
                      {court.court_name}
                    </option>
                  ))}
              </select>
              {errors.court_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("tableTimeHeader")}</label>
              <select
                {...register("event_time", {
                  required: t("mandatoryField"),
                })}
                onChange={handleSelectedTime}
                value={selectedTime}
                disabled={!selectedDate || !selectedCourt}
              >
                {/* Render default option with selectedBooking.event_time */}
                <option value={selectedBooking.event_time}>
                  {`${selectedBooking.event_time?.slice(0, 5)} - ${
                    Number(selectedBooking.event_time?.split(":")[0]) +
                    1 +
                    ":00"
                  }`}
                </option>

                {/* Render other available time slots */}
                {availableTimeSlots.map((timeSlot) => {
                  // Skip rendering the selectedBooking.event_time
                  if (timeSlot.start === selectedBooking.event_time) {
                    return null;
                  }
                  return (
                    <option key={timeSlot.start} value={timeSlot.start}>
                      {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
                    </option>
                  );
                })}
              </select>

              {errors.event_time && (
                <span className={styles["error-field"]}>
                  {errors.event_time.message}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("tableClubTypeHeader")}</label>
              <select
                {...register("event_type_id", {
                  required: t("mandatoryField"),
                })}
                onChange={handleSelectedEventType}
              >
                {eventTypes
                  .filter(
                    (type) =>
                      type.event_type_id === 4 ||
                      type.event_type_id == 5 ||
                      type.event_type_id == 6
                  )
                  .map((type) => (
                    <option key={type.event_type_id} value={type.event_type_id}>
                      {type?.event_type_id === 1
                        ? t("training")
                        : type?.event_type_id === 2
                        ? t("match")
                        : type?.event_type_id === 3
                        ? t("lesson")
                        : type?.event_type_id === 4
                        ? t("externalTraining")
                        : type?.event_type_id === 5
                        ? t("externalLesson")
                        : type?.event_type_id === 6
                        ? t("groupLesson")
                        : type?.event_type_id === 7
                        ? t("tournamentMatch")
                        : ""}
                    </option>
                  ))}
              </select>
              {errors.event_type_id && (
                <span className={styles["error-field"]}>
                  {errors.event_type_id.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>
                {selectedEventType === 4
                  ? t("player1")
                  : selectedEventType === 5 || selectedEventType === 6
                  ? t("tableTrainerHeader")
                  : t("side1")}
              </label>
              <select
                {...register("inviter_id", { required: true })}
                disabled={selectedEventType === 6 && !selectedGroup}
                defaultValue={selectedBooking.inviter_id}
              >
                {selectedEventType === 4 && myExternalMembers
                  ? myExternalMembers?.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {`${member.fname} ${member.lname}`}
                      </option>
                    ))
                  : selectedEventType === 5
                  ? myTrainers?.map((staff) => (
                      <option
                        key={staff.trainerUserId}
                        value={staff.trainerUserId}
                      >
                        {`${staff.fname} ${staff.lname}`}
                      </option>
                    ))
                  : selectedEventType === 6 &&
                    myTrainers
                      ?.filter(
                        (trainer) =>
                          trainer.trainerUserId ===
                          myGroups?.find(
                            (group) => group.user_id === selectedGroup
                          )?.trainer_id
                      )
                      ?.map((trainer) => (
                        <option
                          key={trainer.trainerUserId}
                          value={trainer.trainerUserId}
                        >
                          {`${trainer.fname} ${trainer.lname}`}
                        </option>
                      ))}
              </select>
              {errors.inviter_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>
                {selectedEventType === 4
                  ? t("player2")
                  : selectedEventType === 5
                  ? t("student")
                  : selectedEventType === 6
                  ? t("groupHeader")
                  : t("side2")}
              </label>
              <select
                {...register("invitee_id", {
                  required: true,
                })}
                onChange={handleSelectedGroup}
              >
                {myExternalMembers && selectedEventType === 6
                  ? myGroups.map((group) => (
                      <option key={group.user_id} value={group.user_id}>
                        {group.student_group_name}
                      </option>
                    ))
                  : myExternalMembers.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {`${member.fname} ${member.lname}`}
                      </option>
                    ))}
              </select>
              {errors.invitee_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeEditBookingModal}
              className={styles["discard-button"]}
            >
              {t("discardButtonText")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EditClubCourtBookingModal;

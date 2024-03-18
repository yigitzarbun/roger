import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  currentDay,
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";

import {
  useGetCourtsByFilterQuery,
  useGetCourtsQuery,
} from "../../../../api/endpoints/CourtsApi";
import { useGetClubExternalMembersByFilterQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import {
  Booking,
  useUpdateBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetClubStaffByFilterQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";

interface EditClubCourtBookingModalProps {
  editBookingModalOpen: boolean;
  closeEditBookingModal: () => void;
  selectedBooking: Booking;
  myCourts: any[];
}

const EditClubCourtBookingModal = (props: EditClubCourtBookingModalProps) => {
  const {
    editBookingModalOpen,
    closeEditBookingModal,
    selectedBooking,
    myCourts,
  } = props;

  const user = useAppSelector((store) => store?.user);

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: myTrainers, isLoading: isMyTrainersLoading } =
    useGetClubStaffByFilterQuery({
      club_id: user?.user?.clubDetails?.club_id,
      employment_status: "accepted",
    });

  const { data: myExternalMembers, isLoading: isMyExternalMembersLoading } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.user?.clubDetails?.club_id,
      is_active: true,
    });

  const { data: myGroups, isLoading: isMyGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      club_id: user?.user?.user?.user_id,
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

  useEffect(() => {
    if (selectedCourt && selectedDate && bookings) {
      const filteredBookings = bookings.filter(
        (booking) =>
          booking.court_id === Number(selectedCourt) &&
          booking.event_date.slice(0, 10) === selectedDate &&
          (booking.booking_status_type_id === 1 ||
            booking.booking_status_type_id === 2) &&
          booking.booking_id !== selectedBooking?.booking_id
      );
      setBookedHours(filteredBookings);
    }
  }, [selectedCourt, selectedDate, bookings, selectedBooking]);

  const availableTimeSlots = generateAvailableTimeSlots(
    selectedCourt,
    selectedDate,
    courts,
    bookedHoursForSelectedCourtOnSelectedDate
  );

  const handleDeleteBooking = () => {
    const deletedBookingData = {
      ...selectedBooking,
      booking_status_type_id: 4,
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
        courts?.find((court) => court.court_id === Number(selectedCourt))
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
  }, [selectedBooking]);

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
    isCourtsLoading ||
    isMyExternalMembersLoading ||
    isBookingsLoading ||
    isEventTypesLoading ||
    isMyTrainersLoading ||
    isTrainersLoading ||
    isMyGroupsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <Modal
      isOpen={editBookingModalOpen}
      onRequestClose={closeEditBookingModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <div>
          <h1 className={styles.title}>Kort Rezervasyonunu Düzenle</h1>
          <button
            onClick={handleDeleteBooking}
            className={styles["delete-button"]}
          >
            Rezervasyonu sil
          </button>
        </div>
        <FaWindowClose
          onClick={closeEditBookingModal}
          className={styles["close-icon"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Tarih</label>
            <input
              {...register("event_date", {
                required: "Bu alan zorunludur",
              })}
              type="date"
              onChange={handleSelectedDate}
              min={currentDay}
            />
            {errors.event_date && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kort</label>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Saat</label>
            <select
              {...register("event_time", {
                required: "Bu alan zorunludur",
              })}
              onChange={handleSelectedTime}
              value={selectedTime}
              disabled={!selectedDate || !selectedCourt}
            >
              {availableTimeSlots.map((timeSlot) => (
                <option key={timeSlot.start} value={timeSlot.start}>
                  {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
                </option>
              ))}
            </select>
            {errors.event_time && (
              <span className={styles["error-field"]}>
                {errors.event_time.message}
              </span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Etkinlik Türü</label>
            <select
              {...register("event_type_id", {
                required: "Bu alan zorunludur",
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
                    {type.event_type_name}
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
                ? "1. Oyuncu"
                : selectedEventType === 5 || selectedEventType === 6
                ? "Eğitmen"
                : "Taraf 1"}
            </label>
            <select
              {...register("inviter_id", { required: true })}
              disabled={selectedEventType === 6 && !selectedGroup}
            >
              {selectedEventType === 4 && myExternalMembers
                ? myExternalMembers.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {`${member.fname} ${member.lname}`}
                    </option>
                  ))
                : selectedEventType === 5
                ? myTrainers?.map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {
                        trainers?.find(
                          (trainer) => trainer.user_id === staff.user_id
                        )?.fname
                      }
                    </option>
                  ))
                : selectedEventType === 6 &&
                  myTrainers
                    ?.filter(
                      (trainer) =>
                        trainer.user_id ===
                        myGroups?.find(
                          (group) => group.user_id === selectedGroup
                        )?.trainer_id
                    )
                    .map((trainer) => (
                      <option key={trainer.user_id} value={trainer.user_id}>
                        {trainer.fname}
                      </option>
                    ))}
            </select>
            {errors.inviter_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>
              {selectedEventType === 4
                ? "2. Oyuncu"
                : selectedEventType === 5
                ? "Öğrenci"
                : selectedEventType === 6
                ? "Grup"
                : "Taraf 1"}
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Tamamla
        </button>
      </form>
    </Modal>
  );
};

export default EditClubCourtBookingModal;

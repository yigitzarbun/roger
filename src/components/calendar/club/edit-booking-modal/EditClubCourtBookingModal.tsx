import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  addMinutes,
  formatTime,
  roundToNearestHour,
} from "../../../../common/util/TimeFunctions";

import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import {
  Booking,
  useUpdateBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";

interface EditClubCourtBookingModalProps {
  editBookingModalOpen: boolean;
  closeEditBookingModal: () => void;
  selectedBooking: Booking;
}

const EditClubCourtBookingModal = (props: EditClubCourtBookingModalProps) => {
  const { editBookingModalOpen, closeEditBookingModal, selectedBooking } =
    props;

  const user = useAppSelector((store) => store?.user);

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: clubExternalMembers, isLoading: isClubExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const today = new Date();
  let day = String(today.getDate());
  let month = String(today.getMonth() + 1);
  const year = today.getFullYear();

  day = String(day).length === 1 ? String(day).padStart(2, "0") : day;
  month = String(month).length === 1 ? String(month).padStart(2, "0") : month;

  const currentDay = `${year}-${month}-${day}`;

  const currentHour = String(today.getHours()).padStart(2, "0");
  const currentMinute = String(today.getMinutes()).padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;

  const myTrainers = clubStaff?.filter(
    (staff) =>
      staff.club_id === user?.user?.clubDetails?.club_id &&
      staff.employment_status === "accepted"
  );

  const myCourts = courts?.filter(
    (court) =>
      court?.club_id === user?.user?.user?.user_id && court.is_active === true
  );

  const myExternalMembers = clubExternalMembers?.filter(
    (member) =>
      member.club_id === user?.user?.user?.user_id && member.is_active === true
  );

  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [selectedDate, setSelectedDate] = useState("");
  const handleSelectedDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const [selectedTime, setSelectedTime] = useState(
    selectedBooking?.event_time.slice(0, 5)
  );

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
            booking.booking_status_type_id === 2)
      );
      setBookedHours(filteredBookings);
    }
  }, [selectedCourt, selectedDate, bookings, selectedBooking]);

  // Determine the available time slots based on the opening and closing times and the booked hours
  const availableTimeSlots = [];
  if (selectedCourt && selectedDate && courts) {
    const selectedCourtInfo = courts.find(
      (court) => court.court_id === selectedCourt
    );
    const openingTime = selectedCourtInfo.opening_time; // Make sure this is in "HH:mm" format
    const closingTime = selectedCourtInfo.closing_time; // Make sure this is in "HH:mm" format
    const slotDurationInMinutes = 60;

    // Loop through the time slots to create available time slots
    let startTime = roundToNearestHour(openingTime);

    // Check if the selected date is the same as the current date
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isCurrentDate =
      selectedDateObj.toDateString() === currentDate.toDateString();

    if (isCurrentDate) {
      // Find the next available time slot after the current hour
      while (startTime < closingTime) {
        const endTime = addMinutes(startTime, slotDurationInMinutes);

        // Check if the startTime is not earlier than the current time
        if (
          startTime >= currentTime &&
          startTime !== "24:00" &&
          startTime !== "25:00"
        ) {
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
            (booking) =>
              (startTime <= booking.event_time &&
                booking.event_time < endTime) ||
              (startTime < booking.end_time && booking.end_time <= endTime)
          );

          if (!isBooked) {
            availableTimeSlots.push({
              start: startTime,
              end: endTime,
            });
          }
        }
        startTime = roundToNearestHour(endTime);
      }
    } else {
      // If the selected date is in the future, show all time slots from opening to closing
      while (startTime < closingTime) {
        const endTime = addMinutes(startTime, slotDurationInMinutes);

        // Exclude the 24:00-25:00 time slot
        if (startTime !== "24:00" && startTime !== "25:00") {
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
            (booking) =>
              (startTime <= booking.event_time &&
                booking.event_time < endTime) ||
              (startTime < booking.end_time && booking.end_time <= endTime)
          );

          if (!isBooked) {
            availableTimeSlots.push({
              start: startTime,
              end: endTime,
            });
          }
        }

        startTime = roundToNearestHour(endTime);
      }
    }
  }

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
      club_id: user?.user?.user?.user_id,
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

      setSelectedTime(selectedBooking?.event_time.slice(0, 5)); // Set the default time
    }
  }, [selectedBooking]);

  // for setBookedHours to be populated initially, run the useEffect below
  useEffect(() => {
    if (selectedBooking) {
      setSelectedCourt(selectedBooking.court_id);
      setSelectedDate(
        new Date(selectedBooking.event_date).toISOString().slice(0, 10)
      );
      setSelectedEventType(selectedBooking.event_type_id);
      setSelectedTime(selectedBooking?.event_time.slice(0, 5));
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      refetchBookings();
      closeEditBookingModal();
      reset();
    }
  }, [isUpdateBookingSuccess]);

  if (
    isCourtsLoading ||
    isClubExternalMembersLoading ||
    isBookingsLoading ||
    isEventTypesLoading ||
    isClubStaffLoading ||
    isTrainersLoading
  ) {
    return <div>Yükleniyor..</div>;
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
          <button onClick={handleDeleteBooking}>Rezervasyonu sil</button>
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
            >
              <option value="">-- Seçim yapın --</option>
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
            >
              <option value="">-- Seçim yapın --</option>
              {availableTimeSlots.map((timeSlot) => (
                <option key={timeSlot.start} value={timeSlot.start}>
                  {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
                </option>
              ))}
              {selectedTime &&
                !availableTimeSlots.some(
                  (timeSlot) => timeSlot.start === selectedTime
                ) && (
                  <option value={selectedTime} disabled>
                    {formatTime(selectedTime)} (Already Booked)
                  </option>
                )}
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
              <option value="">-- Seçim yapın --</option>
              {eventTypes
                .filter(
                  (type) => type.event_type_id === 4 || type.event_type_id == 5
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
                : selectedEventType === 5
                ? "Eğitmen"
                : "Taraf 1"}
            </label>
            <select
              {...register("inviter_id", {
                required: true,
              })}
            >
              <option value="">-- Seçim yapın --</option>
              {myExternalMembers && selectedEventType === 4
                ? myExternalMembers?.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {`${member.fname} ${member.lname}`}
                    </option>
                  ))
                : myTrainers &&
                  selectedEventType === 5 &&
                  myTrainers?.map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {
                        trainers?.find(
                          (trainer) => trainer.user_id === staff.user_id
                        )?.fname
                      }
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
                : "Taraf 1"}
            </label>
            <select
              {...register("invitee_id", {
                required: true,
              })}
            >
              <option value="">-- Seçim yapın --</option>
              {myExternalMembers &&
                myExternalMembers.map((member) => (
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

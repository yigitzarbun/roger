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
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";

interface AddClubCourtBookingModalProps {
  addBookingModalOpen: boolean;
  closeAddBookingModal: () => void;
}

const AddClubCourtBookingModal = (props: AddClubCourtBookingModalProps) => {
  const { addBookingModalOpen, closeAddBookingModal } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: clubExternalMembers, isLoading: isClubExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

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

  const myCourts = courts?.filter(
    (court) => court?.club_id === user?.user_id && court.is_active === true
  );

  const myExternalMembers = clubExternalMembers?.filter(
    (member) => member.club_id === user?.user_id && member.is_active === true
  );

  const [addBooking, { isSuccess: isAddBookingSuccess }] =
    useAddBookingMutation({});

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

  const [selectedInviter, setSelectedInviter] = useState(null);
  const handleSelectedInviter = (event) => {
    setSelectedInviter(Number(event.target.value));
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
  }, [selectedCourt, selectedDate, bookings]);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Booking>();

  const isDifferent = (invitee_id: number) => {
    return selectedInviter !== invitee_id;
  };

  const onSubmit: SubmitHandler<Booking> = async (formData: Booking) => {
    const bookingData = {
      event_date: new Date(formData.event_date).toISOString(),
      event_time: selectedTime,
      court_price: Number(
        courts?.find((court) => court.court_id === Number(selectedCourt))
          ?.price_hour
      ),
      booking_status_type_id: 2,
      event_type_id: 4,
      club_id: user?.user_id,
      court_id: Number(formData?.court_id),
      inviter_id: Number(formData?.inviter_id),
      invitee_id: Number(formData?.invitee_id),
    };
    addBooking(bookingData);
  };

  useEffect(() => {
    if (isAddBookingSuccess) {
      refetchBookings();
      closeAddBookingModal();
      reset();
    }
  }, [isAddBookingSuccess]);

  useEffect(() => {
    reset();
  }, [closeAddBookingModal]);
  if (isCourtsLoading || isClubExternalMembersLoading || isBookingsLoading);

  return (
    <Modal
      isOpen={addBookingModalOpen}
      onRequestClose={closeAddBookingModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Kort Rezervasyonu Ekle</h1>
        <FaWindowClose
          onClick={closeAddBookingModal}
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
              <option value="">-- Seçim yapın --</option>
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
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>1. Oyuncu</label>
            <select
              {...register("inviter_id", { required: true })}
              onChange={handleSelectedInviter}
            >
              <option value="">-- Seçim yapın --</option>
              {myExternalMembers &&
                myExternalMembers.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {`${member.fname} ${member.lname}`}
                  </option>
                ))}
            </select>
            {errors.inviter_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>2. Oyuncu</label>
            <select
              {...register("invitee_id", {
                required: true,
                validate: (value) => isDifferent(value),
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

export default AddClubCourtBookingModal;

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
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

interface AddClubCourtBookingModalProps {
  addBookingModalOpen: boolean;
  closeAddBookingModal: () => void;
}

const AddClubCourtBookingModal = (props: AddClubCourtBookingModalProps) => {
  const { addBookingModalOpen, closeAddBookingModal } = props;

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

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

  const myTrainers = clubStaff?.filter(
    (staff) =>
      staff.club_id === user?.user?.clubDetails?.club_id &&
      staff.employment_status === "accepted"
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

  const myCourts = courts?.filter(
    (court) =>
      court?.club_id === user?.user?.user?.user_id && court.is_active === true
  );

  const myExternalMembers = clubExternalMembers?.filter(
    (member) =>
      member.club_id === user?.user?.user?.user_id && member.is_active === true
  );

  const myGroups = studentGroups?.filter(
    (group) =>
      group.club_id === user?.user?.user?.user_id && group.is_active === true
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

  const onSubmit: SubmitHandler<Booking> = async (formData: Booking) => {
    const bookingData = {
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

  if (
    isCourtsLoading ||
    isClubExternalMembersLoading ||
    isBookingsLoading ||
    isEventTypesLoading ||
    isClubStaffLoading ||
    isTrainersLoading ||
    isStudentGroupsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

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
              <option value="">-- Seçim yapın --</option>
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
              <option value="">-- Seçim yapın --</option>
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

export default AddClubCourtBookingModal;

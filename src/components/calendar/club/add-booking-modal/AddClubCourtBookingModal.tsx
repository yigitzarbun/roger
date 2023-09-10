import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

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
  useAddBookingMutation,
  useGetBookingsByFilterQuery,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetClubStaffByFilterQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetStudentGroupsByFilterQuery } from "../../../../api/endpoints/StudentGroupsApi";

interface AddClubCourtBookingModalProps {
  addBookingModalOpen: boolean;
  closeAddBookingModal: () => void;
}

const AddClubCourtBookingModal = (props: AddClubCourtBookingModalProps) => {
  const { addBookingModalOpen, closeAddBookingModal } = props;

  const user = useAppSelector((store) => store?.user);

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { refetch: refetchBookings } = useGetBookingsQuery({});

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

  const { data: myCourts, isLoading: isMyCourtsLoading } =
    useGetCourtsByFilterQuery({
      club_id: user?.user?.clubDetails?.club_id,
      is_active: true,
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

  const { data: myBookings, isLoading: isMyBookingsLoading } =
    useGetBookingsByFilterQuery({
      club_id: user?.user?.clubDetails?.club_id,
    });

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
    if (selectedCourt && selectedDate && myBookings) {
      const filteredBookings = myBookings.filter(
        (booking) =>
          booking.court_id === Number(selectedCourt) &&
          booking.event_date.slice(0, 10) === selectedDate &&
          (booking.booking_status_type_id === 1 ||
            booking.booking_status_type_id === 2)
      );

      setBookedHours(filteredBookings);
    }
  }, [selectedCourt, selectedDate, myBookings]);

  const availableTimeSlots = generateAvailableTimeSlots(
    selectedCourt,
    selectedDate,
    courts,
    bookedHoursForSelectedCourtOnSelectedDate
  );

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
    addBooking(bookingData);
  };

  useEffect(() => {
    if (isAddBookingSuccess) {
      refetchBookings();
      closeAddBookingModal();
      toast.success("Kort eklendi");
      reset();
    }
  }, [isAddBookingSuccess]);

  useEffect(() => {
    reset();
  }, [closeAddBookingModal]);

  if (
    isCourtsLoading ||
    isEventTypesLoading ||
    isTrainersLoading ||
    isMyCourtsLoading ||
    isMyTrainersLoading ||
    isMyExternalMembersLoading ||
    isMyGroupsLoading ||
    isMyBookingsLoading
  ) {
    return <PageLoading />;
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

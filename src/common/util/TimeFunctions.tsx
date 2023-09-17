export const today = new Date();

const currentHour = String(today.getHours()).padStart(2, "0");
const currentMinute = String(today.getMinutes()).padStart(2, "0");

let day = String(today.getDate());
let month = String(today.getMonth() + 1);
const year = today.getFullYear();

day = String(day).length === 1 ? String(day).padStart(2, "0") : day;
month = String(month).length === 1 ? String(month).padStart(2, "0") : month;

export const currentTime = `${currentHour}:${currentMinute}`;
export const currentDay = `${year}-${month}-${day}`;
export const currentDayObject = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);
export const currentYear = today.getFullYear();
export const currentDayLocale = new Date(currentDay).toLocaleDateString();
export const currentTimeLocale = new Date().toLocaleTimeString();

// Utility function to add minutes to a given time
export function addMinutes(time, minutes) {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins;
  const newTotalMinutes = totalMinutes + minutes;
  const newHours = Math.floor(newTotalMinutes / 60);
  const newMins = newTotalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
    2,
    "0"
  )}`;
}

// Utility function to format time in "HH:mm" format
export function formatTime(time) {
  const [hours, mins] = time.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function roundToNearestHour(time) {
  const timeParts = time.split(":");
  const hours = parseInt(timeParts[0]);

  // Round to the nearest hour by setting minutes to 0
  const roundedTime = `${String(hours).padStart(2, "0")}:00`;
  return roundedTime;
}

export function generateTimesArray(hours) {
  const hoursArray = [];
  let t = 0;
  for (let t = 1; t <= hours; t++) {
    let time = String(t);
    if (time.length === 1) {
      time = time.padStart(2, "0");
    }
    hoursArray.push(`${time}:00`);
  }
  return hoursArray;
}

export const generateAvailableTimeSlots = (
  selectedCourt,
  selectedDate,
  courts,
  bookedHoursForSelectedCourtOnSelectedDate
) => {
  const availableTimeSlots = [];
  if (
    selectedCourt &&
    selectedDate &&
    courts &&
    Array.isArray(bookedHoursForSelectedCourtOnSelectedDate)
  ) {
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
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate?.some(
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
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate?.some(
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
  return availableTimeSlots;
};

export const slotAvailabilityChecker = (
  date,
  time,
  selectedCourt,
  bookings
) => {
  const [year, month, day] = date
    .split("-")
    .map((part) => part.padStart(2, "0"));
  const selectedDate = new Date(`${year}-${month}-${day}`);
  const selectedTime = `${String(time).slice(0, 2)}:${String(time).slice(2)}`;

  const currentTime = new Date();
  const currentTimeString = `${String(currentTime.getHours()).padStart(
    2,
    "0"
  )}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

  if (
    selectedDate.toDateString() === currentTime.toDateString() &&
    selectedTime < currentTimeString
  ) {
    return "reserved";
  }

  const bookingExists = bookings.find((booking) => {
    const bookingDate = new Date(booking.event_date.slice(0, 10));
    const bookingTime = booking.event_time.slice(0, 5);

    return (
      booking.court_id === selectedCourt?.[0]?.court_id &&
      bookingDate.getTime() === selectedDate.getTime() &&
      bookingTime === selectedTime &&
      (booking.booking_status_type_id === 1 ||
        booking.booking_status_type_id === 2)
    );
  });

  return bookingExists ? "reserved" : "available";
};

export const daysOfWeek = () => {
  const date = new Date();
  let daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    const day = nextDate.getDate();
    const month = nextDate.getMonth() + 1;
    const year = nextDate.getFullYear();
    daysOfWeek.push(`${year}-${month}-${day}`);
  }
  return daysOfWeek;
};

export const openHours = (selectedCourt) => {
  let openHours = [];

  const openingTime = Number(
    selectedCourt?.[0]?.opening_time.slice(0, 5).split(":").join("")
  );

  const closingTime = Number(
    selectedCourt?.[0]?.closing_time.slice(0, 5).split(":").join("")
  );

  for (let i = openingTime; i < closingTime; i += 100) {
    openHours.push(String(i).padStart(4, "0"));
  }
  return openHours;
};

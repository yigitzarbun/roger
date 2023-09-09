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
  currentTime,
  bookedHoursForSelectedCourtOnSelectedDate
) => {
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
  return availableTimeSlots;
};

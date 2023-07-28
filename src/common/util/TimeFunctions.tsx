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

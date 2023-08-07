import React from "react";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

import styles from "./styles.module.scss";
import { th } from "date-fns/locale";
import { log } from "console";

interface ExploreCourtProfileProps {
  court_id: string;
}
const ExploreCourtProfile = (props: ExploreCourtProfileProps) => {
  const { court_id } = props;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const selectedCourt = courts?.find(
    (court) => court.court_id === Number(court_id)
  );

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  //const today = `${year}-${month}-${day}`;

  let daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    const day = nextDate.getDate();
    const month = nextDate.getMonth() + 1;
    const year = nextDate.getFullYear();
    daysOfWeek.push(`${year}-${month}-${day}`);
  }

  let openHours = [];

  const openingTime = Number(
    selectedCourt?.opening_time.slice(0, 5).split(":").join("")
  );

  const closingTime = Number(
    selectedCourt?.closing_time.slice(0, 5).split(":").join("")
  );

  for (let i = openingTime; i < closingTime; i += 100) {
    openHours.push(i);
  }

  const slotAvailabilityChecker = (date, time) => {
    const [year, month, day] = date
      .split("-")
      .map((part) => part.padStart(2, "0"));

    const selectedDate = new Date(`${year}-${month}-${day}`);
    const selectedTime = `${String(time).slice(0, 2)}:${String(time).slice(2)}`;

    const bookingExists = bookings.find((booking) => {
      const bookingDate = new Date(booking.event_date.slice(0, 10));
      const bookingTime = booking.event_time.slice(0, 5);
      return (
        booking.court_id === selectedCourt.court_id &&
        bookingDate.getTime() === selectedDate.getTime() &&
        bookingTime === selectedTime &&
        (booking.booking_status_type_id === 1 ||
          booking.booking_status_type_id === 2)
      );
    });

    return bookingExists ? "reserved" : "available";
  };

  if (
    isClubsLoading ||
    isCourtsLoading ||
    isBookingsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Kort</h3>
          <img
            src={
              selectedCourt?.picture
                ? selectedCourt?.picture
                : "/images/icons/avatar.png"
            }
            alt="court_picture"
            className={styles["court-image"]}
          />
          <h2>{selectedCourt?.court_name}</h2>
          <p>
            {
              clubs?.find((club) => club.club_id === selectedCourt?.club_id)
                ?.club_name
            }
          </p>
          <p>{selectedCourt?.opening_time.slice(0, 5)}</p>
          <p>{selectedCourt?.closing_time.slice(0, 5)}</p>
          <p>{`${selectedCourt?.price_hour} TL / Saat`}</p>
          <p>
            {
              courtSurfaceTypes?.find(
                (type) =>
                  type.court_surface_type_id ===
                  selectedCourt?.court_surface_type_id
              )?.court_surface_type_name
            }
          </p>
          <p>
            {
              courtStructureTypes?.find(
                (type) =>
                  type.court_structure_type_id ===
                  selectedCourt?.court_structure_type_id
              )?.court_structure_type_name
            }
          </p>
        </div>
        <div className={styles["courts-section"]}>
          <h3>Takvim</h3>
          <table>
            <thead>
              <tr>
                <th>Saat</th>
                {daysOfWeek.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openHours.map((hour) => (
                <tr key={hour}>
                  <td>{`${String(hour).slice(0, 2)}:${String(hour).slice(
                    2
                  )}`}</td>
                  {daysOfWeek.map((day) => (
                    <td
                      key={day}
                      className={
                        slotAvailabilityChecker(day, hour) === "reserved"
                          ? styles.reserved
                          : styles.available
                      }
                    >
                      {slotAvailabilityChecker(day, hour)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ExploreCourtProfile;

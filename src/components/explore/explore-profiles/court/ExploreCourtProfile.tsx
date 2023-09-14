import React from "react";

import { Link } from "react-router-dom";

import { MdMoney, MdSportsTennis } from "react-icons/md";
import { PiMoney } from "react-icons/pi";
import { GiTennisCourt } from "react-icons/gi";
import { FaClock } from "react-icons/fa";

import { localUrl } from "../../../../common/constants/apiConstants";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtByIdQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";

import {
  daysOfWeek,
  openHours,
  slotAvailabilityChecker,
} from "../../../../common/util/TimeFunctions";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import PageLoading from "../../../../components/loading/PageLoading";

interface ExploreCourtProfileProps {
  court_id: string;
}
const ExploreCourtProfile = (props: ExploreCourtProfileProps) => {
  const { court_id } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const isUserClub = user?.user?.user_type_id === 3;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtByIdQuery(Number(court_id));

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: bookings, isLoading: isBookingsLoading } =
    useGetBookingsByFilterQuery({ court_id: court_id });

  const profileImage = selectedCourt?.[0]?.image;

  if (
    isClubsLoading ||
    isSelectedCourtLoading ||
    isBookingsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h2>Kort</h2>
          <img
            src={
              profileImage
                ? `${localUrl}/${profileImage}`
                : "/images/icons/avatar.png"
            }
            alt="court_picture"
            className={styles["profile-image"]}
          />
          <h3>{selectedCourt?.[0]?.court_name}</h3>
          <div className={styles["profile-info"]}>
            <FaClock className={styles.icon} />
            <p>{selectedCourt?.[0]?.opening_time.slice(0, 5)}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaClock className={styles.icon} />
            <p>{selectedCourt?.[0]?.closing_time.slice(0, 5)}</p>
          </div>
          <div className={styles["profile-info"]}>
            <MdMoney className={styles.icon} />
            <p>{`${selectedCourt?.[0]?.price_hour} TL / Saat`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <MdSportsTennis className={styles.icon} />
            <p>
              {
                clubs?.find(
                  (club) => club.club_id === selectedCourt?.[0]?.club_id
                )?.club_name
              }
            </p>
          </div>
          {clubs?.find((club) => club.club_id === selectedCourt?.[0]?.club_id)
            ?.higher_price_for_non_subscribers &&
            selectedCourt?.[0]?.price_hour_non_subscriber && (
              <div className={styles["profile-info"]}>
                <PiMoney className={styles.icon} />
                <p>{`${selectedCourt?.[0]?.price_hour_non_subscriber} TL / Saat (Üye Olmayanlar)`}</p>
              </div>
            )}
          <div className={styles["profile-info"]}>
            <GiTennisCourt className={styles.icon} />
            <p>
              {
                courtSurfaceTypes?.find(
                  (type) =>
                    type.court_surface_type_id ===
                    selectedCourt?.[0]?.court_surface_type_id
                )?.court_surface_type_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <GiTennisCourt className={styles.icon} />
            <p>
              {
                courtStructureTypes?.find(
                  (type) =>
                    type.court_structure_type_id ===
                    selectedCourt?.[0]?.court_structure_type_id
                )?.court_structure_type_name
              }
            </p>
          </div>
        </div>
        <div className={styles["courts-section"]}>
          <h2>Takvim</h2>
          <table>
            <thead>
              <tr>
                <th>Saat</th>
                {daysOfWeek()?.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openHours(selectedCourt)?.map((hour) => (
                <tr key={hour}>
                  <td>{`${String(hour).slice(0, 2)}:${String(hour).slice(
                    2
                  )}`}</td>
                  {daysOfWeek()?.map((day) => (
                    <td
                      key={day}
                      className={
                        slotAvailabilityChecker(
                          day,
                          hour,
                          selectedCourt,
                          bookings
                        ) === "reserved"
                          ? styles.reserved
                          : styles.available
                      }
                    >
                      {slotAvailabilityChecker(
                        day,
                        hour,
                        selectedCourt,
                        bookings
                      ) === "available" &&
                      (isUserPlayer || isUserTrainer) &&
                      selectedCourt?.[0]?.is_active === true ? (
                        <Link
                          to={paths.COURT_BOOKING_INVITE}
                          state={{
                            event_date: day,
                            event_time: hour,
                            club_id: selectedCourt?.[0]?.club_id,
                            court_id: selectedCourt?.[0]?.court_id,
                            court_price: selectedCourt?.[0]?.price_hour,
                          }}
                          className={
                            slotAvailabilityChecker(
                              day,
                              hour,
                              selectedCourt,
                              bookings
                            ) === "available" && styles.available
                          }
                        >
                          {slotAvailabilityChecker(
                            day,
                            hour,
                            selectedCourt,
                            bookings
                          ) === "available"
                            ? "Uygun"
                            : "Hayır"}
                        </Link>
                      ) : isUserClub &&
                        slotAvailabilityChecker(
                          day,
                          hour,
                          selectedCourt,
                          bookings
                        ) === "available" &&
                        selectedCourt?.[0]?.is_active === true ? (
                        "Uygun"
                      ) : (
                        "Rezerve"
                      )}
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

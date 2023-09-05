import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import PageLoading from "../../../components/loading/PageLoading";
import AddCourtButton from "../add-court-button/AddCourtButton";

import { useGetCourtStructureTypesQuery } from "../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtsQuery } from "../../../api/endpoints/CourtsApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";

interface ClubCourtResultsProps {
  surfaceTypeId: number;
  structureTypeId: number;
  price: number;
  openEditCourtModal: (value: number) => void;
  openAddCourtModal: () => void;
}
const ClubCourtsResults = (props: ClubCourtResultsProps) => {
  const {
    surfaceTypeId,
    structureTypeId,
    price,
    openEditCourtModal,
    openAddCourtModal,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const {
    data: courts,
    isLoading: isCourtsLoading,
    isError,
  } = useGetCourtsQuery({});

  const courtStructureIdValue = Number(structureTypeId) ?? null;
  const courtSurfaceIdValue = Number(surfaceTypeId) ?? null;
  const courtPriceValue = Number(price) ?? null;

  const filteredCourts =
    courts &&
    courts
      .filter((court) => court.club_id === user.clubDetails.club_id)
      .filter((court) => {
        if (
          courtStructureIdValue === 0 &&
          courtSurfaceIdValue === 0 &&
          courtPriceValue === 0
        ) {
          return court;
        } else if (
          (courtStructureIdValue === court.court_structure_type_id ||
            courtStructureIdValue === 0) &&
          (courtSurfaceIdValue === court.court_surface_type_id ||
            courtSurfaceIdValue === 0) &&
          (courtPriceValue <= court.price_hour || courtPriceValue === 0)
        ) {
          return court;
        }
      });

  const myCourts = courts?.filter(
    (court) => court.club_id === user.clubDetails.club_id
  );

  if (
    isCourtStructureTypesLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtsLoading ||
    isClubsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kortlar</h2>
        <AddCourtButton openAddCourtModal={openAddCourtModal} />
      </div>
      {isCourtsLoading && <p>Yükleniyor...</p>}
      {isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}
      {courts && myCourts.length === 0 ? (
        <p>Henüz sisteme eklenmiş kortunuz bulunmamaktadır.</p>
      ) : (
        courts &&
        filteredCourts.length === 0 && (
          <p>
            Aradığınız kritere göre kort bulunamadı. Lütfen filtreyi temizleyip
            tekrar deneyin.
          </p>
        )
      )}
      {courts &&
        courtStructureTypes &&
        courtSurfaceTypes &&
        filteredCourts.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Kort</th>
                <th>Kort Adı</th>
                <th>Yüzey</th>
                <th>Mekan</th>
                <th>Açılış</th>
                <th>Kapanış</th>
                <th>Fiyat </th>
                <th>Fiyat - (misafir)</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourts.map((court) => (
                <tr key={court.court_id} className={styles["court-row"]}>
                  <td>
                    <Link to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}>
                      <img
                        src={
                          court?.image
                            ? court?.image
                            : "/images/icons/avatar.png"
                        }
                        alt="kort"
                        className={styles["court-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}kort/${court.court_id}`}
                      className={styles.name}
                    >
                      {court.court_name}
                    </Link>
                  </td>
                  <td>
                    {
                      courtSurfaceTypes.find(
                        (surface) =>
                          surface.court_surface_type_id ==
                          court.court_surface_type_id
                      ).court_surface_type_name
                    }
                  </td>
                  <td>
                    {
                      courtStructureTypes.find(
                        (structure) =>
                          structure.court_structure_type_id ==
                          court.court_structure_type_id
                      ).court_structure_type_name
                    }
                  </td>
                  <td>{court.opening_time.slice(0, 5)}</td>
                  <td>{court.closing_time.slice(0, 5)}</td>
                  <td>{court.price_hour}</td>
                  <td>
                    {clubs?.find((club) => club.user_id === user?.user?.user_id)
                      ?.higher_price_for_non_subscribers &&
                    court.price_hour_non_subscriber
                      ? court.price_hour_non_subscriber
                      : clubs?.find(
                          (club) => club.user_id === user?.user?.user_id
                        )?.higher_price_for_non_subscribers &&
                        !court.price_hour_non_subscriber
                      ? "Fiyat Girin"
                      : clubs?.find(
                          (club) => club.user_id === user?.user?.user_id
                        )?.higher_price_for_non_subscribers === false && "-"}
                  </td>
                  <td>{court.is_active ? "Aktif" : "Bloke"}</td>
                  <td onClick={() => openEditCourtModal(court.court_id)}>
                    <button className={styles["edit-button"]}>Düzenle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default ClubCourtsResults;

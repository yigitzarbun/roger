import React, { useState } from "react";
import styles from "./styles.module.scss";
import { getAge } from "../../../common/util/TimeFunctions";
import AddTournamentModal from "../add-tournament-modal/AddTournamentModal";
import { User } from "../../../store/slices/authSlice";
import { useGetClubPaymentDetailsExistQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetClubCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { Link, useNavigate } from "react-router-dom";
import Paths from "../../../routing/Paths";
import EditClubBankDetailsModal from "../../../components/profile/club/bank-details/edit-bank-details/EditClubBankDetails";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import PageLoading from "../../../components/loading/PageLoading";
import EditTournamentModal from "../edit-tournament-modal/EditTournamentModal";

interface ClubTournamentsResultsProps {
  clubTournaments: any[];
  user: User;
  clubDetails: any;
  refetchClubDetails: () => void;
  refetchClubTournaments: () => void;
}
const ClubTournamentsResults = (props: ClubTournamentsResultsProps) => {
  const {
    clubTournaments,
    user,
    clubDetails,
    refetchClubDetails,
    refetchClubTournaments,
  } = props;
  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(Paths[path]);
  };
  const [addTournamentModal, setAddTournamentModal] = useState(false);
  const handleAddTournamentModal = () => {
    setAddTournamentModal(true);
  };
  const closeAddTournamentModal = () => {
    setAddTournamentModal(false);
  };

  const {
    data: clubBankDetailsExist,
    isLoading: isClubBankDetailsExistLoading,
    refetch: refetchClubBankDetails,
  } = useGetClubPaymentDetailsExistQuery(user?.user?.user_id);

  const { data: clubCourts, isLoading: isClubCourtsLoading } =
    useGetClubCourtsQuery(clubDetails?.[0]?.club_id);

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    is_active: true,
    club_id: user?.user?.user_id,
  });

  const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
  const handleOpenBankDetailsModal = () => {
    setAddBankDetailsModal(true);
  };
  const closeAddBankDetailsModal = () => {
    setAddBankDetailsModal(false);
    refetchClubBankDetails();
  };

  const handleNavigateTournamentFixture = (tournamentId: number) => {
    navigate(`${Paths.CLUB_TOURNAMENT_FIXTURE}${tournamentId}`);
  };

  const [updateTournamentModal, setUpdateTournamentModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const handleOpenUpdateTournamentModal = (tournament: any) => {
    setSelectedTournament(tournament);
    setUpdateTournamentModal(true);
  };

  const closeUpdateTournamentModal = () => {
    setUpdateTournamentModal(false);
  };

  console.log(updateTournamentModal);
  if (
    isBanksLoading ||
    isClubBankDetailsExistLoading ||
    isClubCourtsLoading ||
    isClubSubscriptionPackagesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Turnuvalar</h2>
          <button
            onClick={handleAddTournamentModal}
            className={styles["add-tournament-button"]}
            disabled={!clubBankDetailsExist || clubCourts?.length === 0}
          >
            Yeni Turnuva
          </button>
        </div>
      </div>
      {(!clubBankDetailsExist || clubCourts?.length === 0) && (
        <div className={styles["validation-container"]}>
          <p>Yeni turnuva ekleyebilmek için gerekenler:</p>{" "}
          <div className={styles["buttons-container"]}>
            {!clubBankDetailsExist && (
              <button onClick={handleOpenBankDetailsModal}>
                Banka Bilgilerini Ekle
              </button>
            )}
            {clubCourts?.length === 0 && (
              <button onClick={() => handleNavigate("CLUB_COURTS")}>
                Kort Ekle
              </button>
            )}
          </div>
        </div>
      )}
      {clubTournaments?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Turnuva Adı</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Min. Yaş</th>
              <th>Max. Yaş</th>
              <th>Cinsiyet</th>
              <th>Katılım Ücreti</th>
              <th>Katılımcı</th>
              <th>Max. Katılımcı</th>
              <th>Son Başvuru</th>
              <th>Üyelik Şartı</th>
            </tr>
          </thead>
          <tbody>
            {clubTournaments?.map((tournament) => (
              <tr
                key={tournament.tournament_id}
                className={styles["tournament-row"]}
              >
                <td>
                  <Link
                    to={`${Paths.CLUB_TOURNAMENT_FIXTURE}${tournament.tournament_id}`}
                    className={styles["tournament-name"]}
                  >
                    {tournament.tournament_name}
                  </Link>
                </td>
                <td>{tournament.start_date.slice(0, 10)}</td>
                <td>{tournament.end_date.slice(0, 10)}</td>
                <td>{getAge(Number(tournament.min_birth_year))}</td>
                <td>{getAge(Number(tournament.max_birth_year))}</td>
                <td>{tournament.tournament_gender}</td>
                <td>{`${tournament.application_fee} TL`}</td>
                <td>{tournament.participant_count}</td>
                <td>{tournament.max_players}</td>
                <td>{tournament.application_deadline.slice(0, 10)}</td>
                <td>{tournament.club_subscription_required ? "Var" : "Yok"}</td>
                <td>
                  <button
                    onClick={() => handleOpenUpdateTournamentModal(tournament)}
                    className={styles["submit-button"]}
                  >
                    Düzenle
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleNavigateTournamentFixture(tournament.tournament_id)
                    }
                    className={styles["submit-button"]}
                  >
                    Fikstür
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : clubBankDetailsExist && clubCourts?.length > 0 ? (
        <p>Güncel turnuva bulunmamaktadır</p>
      ) : (
        ""
      )}
      {addTournamentModal && (
        <AddTournamentModal
          addTournamentModal={addTournamentModal}
          closeAddTournamentModal={closeAddTournamentModal}
          clubUserId={user?.user?.user_id}
          clubBankDetailsExist={clubBankDetailsExist}
          clubCourts={clubCourts}
          clubSubscriptionPackages={clubSubscriptionPackages}
          refetchClubTournaments={refetchClubTournaments}
        />
      )}
      {addBankDetailsModal && (
        <EditClubBankDetailsModal
          isModalOpen={addBankDetailsModal}
          handleCloseModal={closeAddBankDetailsModal}
          banks={banks}
          clubDetails={clubDetails}
          bankDetailsExist={clubBankDetailsExist}
          refetchClubDetails={refetchClubDetails}
        />
      )}
      {
        <EditTournamentModal
          updateTournamentModal={updateTournamentModal}
          closeUpdateTournamentModal={closeUpdateTournamentModal}
          clubUserId={user?.user?.user_id}
          clubBankDetailsExist={clubBankDetailsExist}
          clubCourts={clubCourts}
          refetchClubTournaments={refetchClubTournaments}
          selectedTournament={selectedTournament}
        />
      }
    </div>
  );
};

export default ClubTournamentsResults;

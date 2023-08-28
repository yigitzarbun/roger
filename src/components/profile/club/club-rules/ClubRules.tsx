import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import UpdateClubRulesModal from "./update-club-rules/UpdateClubRulesModal";

const ClubRules = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const clubDetails = clubs?.find(
    (club) => club.user_id === user?.user?.user_id
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["club-rules-container"]}>
      <h2>Kulüp Kuralları</h2>
      <table>
        <thead>
          <tr>
            <th>Antreman ve Maç Kuralları</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["rule-row"]}>
            <td>Oyuncuların kort kiralamak için üye olmasına gerek yok</td>
            <td>
              {clubDetails?.is_player_subscription_required === false
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Ders Kuralları</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["rule-row"]}>
            <td>
              Eğtimenin kulüp çalışanı veya oyuncunun üye olmasına gerek yok
            </td>
            <td>
              {clubDetails?.is_trainer_subscription_required === false &&
              clubDetails?.is_player_lesson_subscription_required === false
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
          <tr className={styles["rule-row"]}>
            <td>
              Eğitmenin kulüp çalışanı değil, oyuncu üye ise kort kiralanabilir
            </td>
            <td>
              {clubDetails?.is_trainer_subscription_required === false &&
              clubDetails?.is_player_lesson_subscription_required === true
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
          <tr className={styles["rule-row"]}>
            <td>
              Eğitmenin kulüp çalışanı, oyuncu üye değil ise kort kiralanabilir{" "}
            </td>
            <td>
              {clubDetails?.is_trainer_subscription_required === true &&
              clubDetails?.is_player_lesson_subscription_required === false
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
          <tr className={styles["rule-row"]}>
            <td>Eğitmenin kulüp çalışanı, oyuncunun üye olması zorunludur</td>
            <td>
              {clubDetails?.is_trainer_subscription_required === true &&
              clubDetails?.is_player_lesson_subscription_required === true
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Kort Fiyat Kuralları</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["rule-row"]}>
            <td>Üye olmayanlara farklı fiyat politikası uygulanır</td>
            <td>
              {clubDetails?.higher_price_for_non_subscribers === true
                ? "Evet"
                : "Hayır"}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleOpenModal}>Düzenle</button>
      <UpdateClubRulesModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default ClubRules;

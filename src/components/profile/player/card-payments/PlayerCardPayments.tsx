import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import AddPlayerCardDetails from "./add-card-details/AddPlayerCardDetails";
import EditPlayerCardDetails from "./edit-card-details/EditPlayerCardDetails";
import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetPlayerByUserIdQuery,
  useGetPlayersQuery,
} from "../../../../api/endpoints/PlayersApi";
import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

const PlayerCardPayments = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  const cardDetailsExist =
    selectedPlayer?.[0]?.name_on_card &&
    selectedPlayer?.[0]?.card_number &&
    selectedPlayer?.[0]?.cvc &&
    selectedPlayer?.[0]?.card_expiry;

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
  };

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);

  const handleOpenEditCardModal = () => {
    setIsEditCardModalOpen(true);
  };

  const handleCloseEditCardModal = () => {
    setIsEditCardModalOpen(false);
  };

  const [display, setDisplay] = useState("card");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const myPayments = payments
    ?.filter(
      (payment) =>
        payment.sender_subscriber_id === user?.user?.user_id ||
        payment.sender_inviter_id === user?.user?.user_id ||
        payment.sender_invitee_id === user?.user?.user_id
    )
    .slice(0, 5);

  if (
    isSelectedPlayerLoading ||
    isPaymentsLoading ||
    isPaymentTypesLoading ||
    isTrainersLoading ||
    isClubsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["player-payment-details-container"]}>
      <h2>Kart ve Ödeme</h2>
      <div className={styles["nav-container"]}>
        <button
          onClick={() => handleDisplay("card")}
          className={
            display === "card"
              ? styles["active-button"]
              : styles["inactive-button"]
          }
        >
          Kart Bilgileri
        </button>
        <button
          onClick={() => handleDisplay("payments")}
          className={
            display === "payments"
              ? styles["active-button"]
              : styles["inactive-button"]
          }
        >
          Ödeme Geçmişi
        </button>
      </div>
      {display === "card" && (
        <div className={styles.section}>
          {cardDetailsExist ? (
            <div className={styles.section}>
              <p className={styles["card-exists-text"]}>
                {`${(selectedPlayer?.[0]?.card_number).slice(
                  (selectedPlayer?.[0]?.card_number).length - 4
                )}
            ile biten kartınız aktiftir`}
              </p>
              <button
                onClick={handleOpenEditCardModal}
                className={styles["view-all-button"]}
              >
                Kart Bilgilerini Düzenle
              </button>
            </div>
          ) : (
            <div className={styles.section}>
              <h4>Kayıtlı kart bulunmamaktadır</h4>
              <p className={styles["card-missing-text"]}>
                Antreman, maç ve özel ders etkinlikleri ile kulüp üyeliği
                işlemleri için kart bilgisi eklemek zorunludur.
              </p>
              <button
                onClick={handleOpenAddCardModal}
                className={styles["view-all-button"]}
              >
                Yeni Kart Ekle
              </button>
            </div>
          )}
        </div>
      )}
      {display === "payments" &&
        (myPayments?.length > 0 ? (
          <div className={styles.section}>
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>Konu</th>
                  <th>Tutar</th>
                  <th>Kulüp</th>
                  <th>Eğitmen</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.slice(myPayments.length - 1)?.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>{payment.registered_at.slice(0, 10)}</td>
                    <td>{payment.payment_status}</td>
                    <td>
                      {
                        paymentTypes?.find(
                          (type) =>
                            type.payment_type_id === payment.payment_type_id
                        )?.payment_type_name
                      }
                    </td>
                    {(payment.payment_type_id === 1 ||
                      payment.payment_type_id === 2) && (
                      <td>{`${payment.court_price / 2} TL`}</td>
                    )}
                    {payment.payment_type_id === 3 && (
                      <td>
                        {`${payment.lesson_price + payment.court_price} TL`}
                      </td>
                    )}
                    {payment.payment_type_id === 5 && (
                      <td>
                        {`${
                          payment.lesson_price + payment.subscription_price
                        } TL`}
                      </td>
                    )}
                    <td>
                      {
                        clubs?.find(
                          (club) => club.user_id === payment.recipient_club_id
                        )?.club_name
                      }
                    </td>
                    {payment.payment_type_id === 3 && (
                      <td>
                        {`${
                          trainers?.find(
                            (trainer) =>
                              trainer.user_id === payment.recipient_trainer_id
                          )?.fname
                        } ${
                          trainers?.find(
                            (trainer) =>
                              trainer.user_id === payment.recipient_trainer_id
                          )?.lname
                        }`}
                      </td>
                    )}
                    {(payment.payment_type_id === 1 ||
                      payment.payment_type_id === 2 ||
                      payment.payment_type_id === 5) && <td>-</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to={paths.PAYMENTS}>
              <button className={styles["view-all-button"]}>
                Tümünü Görüntüle
              </button>
            </Link>
          </div>
        ) : (
          <h4>Henüz ödemeniz bulunmamaktadır.</h4>
        ))}

      <AddPlayerCardDetails
        isModalOpen={isAddCardModalOpen}
        handleCloseModal={handleCloseAddCardModal}
      />
      <EditPlayerCardDetails
        isModalOpen={isEditCardModalOpen}
        handleCloseModal={handleCloseEditCardModal}
      />
    </div>
  );
};

export default PlayerCardPayments;

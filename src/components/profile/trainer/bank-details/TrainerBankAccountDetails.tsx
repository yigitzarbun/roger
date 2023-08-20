import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import AddTrainerBankDetailsModal from "./add-bank-details/AddTrainerBankDetails";
import EditTrainerBankDetailsModal from "./edit-bank-details/EditTrainerBankDetails";

import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

const TrainerBankAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  const selectedTrainer = trainers?.find(
    (trainer) => trainer.user_id === user?.user?.user_id
  );

  const bankDetails = {
    bank_id: selectedTrainer?.bank_id,
    iban: selectedTrainer?.iban,
    name_on_bank_account: selectedTrainer?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

  const myPayments = payments
    ?.filter((payment) => payment.recipient_trainer_id === user?.user?.user_id)
    .slice(0, 5);

  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);

  const handleOpenAddBankModal = () => {
    setIsAddBankModalOpen(true);
  };

  const handleCloseAddBankModal = () => {
    setIsAddBankModalOpen(false);
  };

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  const [display, setDisplay] = useState("bankDetails");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  if (
    isTrainersLoading ||
    isBanksLoading ||
    isPaymentsLoading ||
    isPaymentTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["trainer-bank-details-container"]}>
      <h2>Hesap ve Ödeme Bilgileri</h2>
      <div className={styles["nav-container"]}>
        <button
          onClick={() => handleDisplay("bankDetails")}
          className={
            display === "bankDetails"
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
      {display === "bankDetails" && (
        <>
          {bankDetailsExist ? (
            <>
              <p>{`Banka Adı: ${
                banks?.find((bank) => bank.bank_id === bankDetails?.bank_id)
                  ?.bank_name
              }`}</p>
              <p>{`Hesap / IBAN no: ${bankDetails?.iban}`}</p>
              <p>{`Hesap adı: ${bankDetails?.name_on_bank_account}`}</p>
              <button onClick={handleOpenEditBankModal}>
                Hesap Bilgilerini Düzenle
              </button>
            </>
          ) : (
            <div>
              <h3>Kayıtlı banka hesabınız bulunmamaktadır</h3>
              <p>
                Kort kiralamak ve ders satışı yapmak için banka hesap
                bilgilerinizi eklemeniz gerekmektedir
              </p>
              <button onClick={handleOpenAddBankModal}>
                Hesap Bilgileri Ekle
              </button>
            </div>
          )}
        </>
      )}
      {display === "payments" &&
        (myPayments?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Durum</th>
                <th>Konu</th>
                <th>Tutar</th>
                <th>Öğrenci</th>
              </tr>
            </thead>
            <tbody>
              {myPayments?.map((payment) => (
                <tr key={payment.payment_id} className={styles["payment-row"]}>
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
                  {payment.payment_type_id === 3 && (
                    <td>{`${payment.lesson_price} TL`}</td>
                  )}
                  <td>{`${
                    players?.find(
                      (player) => player.user_id === payment.sender_inviter_id
                    )?.fname
                  } ${
                    players?.find(
                      (player) => player.user_id === payment.sender_inviter_id
                    )?.lname
                  }`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz ödemeniz bulunmamaktadır.</p>
        ))}
      <AddTrainerBankDetailsModal
        isModalOpen={isAddBankModalOpen}
        handleCloseModal={handleCloseAddBankModal}
      />
      <EditTrainerBankDetailsModal
        isModalOpen={isEditBankModalOpen}
        handleCloseModal={handleCloseEditBankModal}
      />
    </div>
  );
};

export default TrainerBankAccountDetails;

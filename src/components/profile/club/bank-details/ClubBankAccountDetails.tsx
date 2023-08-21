import React, { useState } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

import AddClubBankDetailsModal from "./add-bank-details/AddClubBankDetailsModal";
import EditClubBankDetailsModal from "./edit-bank-details/EditClubBankDetails";

const ClubBankAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const selectedClub = clubs?.find(
    (club) => club.user_id === user?.user?.user_id
  );

  const [display, setDisplay] = useState("bankDetails");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const myPayments = payments
    ?.filter((payment) => payment.recipient_club_id === user?.user?.user_id)
    .slice(0, 5);

  const bankDetails = {
    bank_id: selectedClub?.bank_id,
    iban: selectedClub?.iban,
    name_on_bank_account: selectedClub?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

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

  if (
    isClubsLoading ||
    isBanksLoading ||
    isPaymentsLoading ||
    isPaymentTypesLoading ||
    isPlayersLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["club-bank-details-container"]}>
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
                Kort kiralamak ve üyelik satışı yapmak için banka hesap
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
          <>
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>Konu</th>
                  <th>Tutar</th>
                  <th>Gönderen 1</th>
                  <th>Gönderen 2</th>
                </tr>
              </thead>
              <tbody>
                {myPayments?.map((payment) => (
                  <tr
                    key={payment.payment_id}
                    className={styles["payment-row"]}
                  >
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
                    {payment.payment_type_id === 5 && (
                      <td>{`${payment.subscription_price} TL`}</td>
                    )}
                    {(payment.payment_type_id === 1 ||
                      payment.payment_type_id === 2 ||
                      payment.payment_type_id === 3) && (
                      <td>{`${payment.court_price} TL`}</td>
                    )}
                    {payment.payment_type_id === 5 && (
                      <td>
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === payment.sender_subscriber_id
                          )?.fname
                        }
                      ${
                        players?.find(
                          (player) =>
                            player.user_id === payment.sender_subscriber_id
                        )?.lname
                      }
                      `}
                      </td>
                    )}
                    {(payment.payment_type_id === 1 ||
                      payment.payment_type_id === 2) && (
                      <td>
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === payment.sender_inviter_id
                          )?.fname
                        }
                      ${
                        players?.find(
                          (player) =>
                            player.user_id === payment.sender_inviter_id
                        )?.lname
                      }
                      `}
                      </td>
                    )}
                    {(payment.payment_type_id === 1 ||
                      payment.payment_type_id === 2) && (
                      <td>
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === payment.sender_invitee_id
                          )?.fname
                        }
                      ${
                        players?.find(
                          (player) =>
                            player.user_id === payment.sender_invitee_id
                        )?.lname
                      }
                      `}
                      </td>
                    )}
                    {payment.payment_type_id === 3 &&
                      players?.find(
                        (player) => player.user_id === payment.sender_inviter_id
                      ) && (
                        <td>
                          {`${
                            players?.find(
                              (player) =>
                                player.user_id === payment.sender_inviter_id
                            )?.fname
                          }
                      ${
                        players?.find(
                          (player) =>
                            player.user_id === payment.sender_inviter_id
                        )?.lname
                      }
                      `}
                        </td>
                      )}
                    {payment.payment_type_id === 3 &&
                      players?.find(
                        (player) => player.user_id === payment.sender_invitee_id
                      ) && (
                        <td>
                          {`${
                            players?.find(
                              (player) =>
                                player.user_id === payment.sender_invitee_id
                            )?.fname
                          }
                      ${
                        players?.find(
                          (player) =>
                            player.user_id === payment.sender_invitee_id
                        )?.lname
                      }
                      `}
                        </td>
                      )}
                    {(payment.payment_type_id === 3 ||
                      payment.payment_type_id === 5) && <td>-</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to={paths.PAYMENTS}>Tümünü Görüntüle</Link>
          </>
        ) : (
          <p>Henüz ödemeniz bulunmamaktadır.</p>
        ))}
      <AddClubBankDetailsModal
        isModalOpen={isAddBankModalOpen}
        handleCloseModal={handleCloseAddBankModal}
      />
      <EditClubBankDetailsModal
        isModalOpen={isEditBankModalOpen}
        handleCloseModal={handleCloseEditBankModal}
      />
    </div>
  );
};

export default ClubBankAccountDetails;

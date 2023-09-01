import React from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import PageLoading from "../../../../components/loading/PageLoading";

const ClubPaymentsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );
  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const myPayments = payments?.filter(
    (payment) => payment.recipient_club_id === user?.user?.user_id
  );

  if (isPaymentsLoading || isPaymentTypesLoading || isPlayersLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["payment-results-container"]}>
      <h2 className={styles.title}>Ödemeler</h2>
      {myPayments?.length > 0 ? (
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
              <tr key={payment.payment_id} className={styles["payment-row"]}>
                <td>{payment.registered_at.slice(0, 10)}</td>
                <td>{payment.payment_status}</td>
                <td>
                  {
                    paymentTypes?.find(
                      (type) => type.payment_type_id === payment.payment_type_id
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
                        (player) => player.user_id === payment.sender_inviter_id
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
                        (player) => player.user_id === payment.sender_invitee_id
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
      ) : (
        <p>Henüz ödemeniz bulunmamaktadır.</p>
      )}
    </div>
  );
};

export default ClubPaymentsResults;

import React from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

const PlayerPaymentsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );
  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const myPayments = payments?.filter(
    (payment) =>
      payment.sender_subscriber_id === user?.user?.user_id ||
      payment.sender_inviter_id === user?.user?.user_id ||
      payment.sender_invitee_id === user?.user?.user_id
  );

  if (
    isPaymentsLoading ||
    isPaymentTypesLoading ||
    isTrainersLoading ||
    isClubsLoading
  ) {
    return <div>Yükleniyor..</div>;
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
              <th>Kulüp</th>
              <th>Eğitmen</th>
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
                {(payment.payment_type_id === 1 ||
                  payment.payment_type_id === 2) && (
                  <td>{`${payment.court_price / 2} TL`}</td>
                )}
                {payment.payment_type_id === 3 && (
                  <td>{`${payment.lesson_price + payment.court_price} TL`}</td>
                )}
                {payment.payment_type_id === 5 && (
                  <td>
                    {`${payment.lesson_price + payment.subscription_price} TL`}
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
      ) : (
        <p>Henüz ödemeniz bulunmamaktadır.</p>
      )}
    </div>
  );
};
export default PlayerPaymentsResults;

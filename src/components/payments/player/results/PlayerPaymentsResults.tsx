import React, { useState } from "react";

import { useAppSelector } from "../../../../store/hooks";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import { useGetPlayerPaymentssByUserIdQuery } from "../../../../api/endpoints/PaymentsApi";

const PlayerPaymentsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: myPayments, isLoading: isPaymentsLoading } =
    useGetPlayerPaymentssByUserIdQuery(user?.user?.user_id);

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myPayments?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myPayments?.totalPages) % myPayments?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  if (isPaymentsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Ödemeler</h2>
        <div className={styles["nav-container"]}>
          <FaAngleLeft
            onClick={handlePrevPage}
            className={styles["nav-arrow"]}
          />
          <FaAngleRight
            onClick={handleNextPage}
            className={styles["nav-arrow"]}
          />
        </div>
      </div>
      {myPayments?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ödeme Tarih</th>
              <th>Durum</th>
              <th>Tür</th>
              <th>Eğitmen / Oyuncu</th>
              <th>Etkinlik Tarih</th>
              <th>Etkinlik Saat</th>
              <th>Kulüp</th>
              <th>Kort</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            {myPayments?.map((payment) => (
              <tr key={payment.payment_id} className={styles["payment-row"]}>
                <td>{payment.paymentDate.slice(0, 10)}</td>
                <td>{payment.payment_status}</td>
                <td>{payment?.payment_type_name}</td>
                <td>
                  {payment.fname && payment.lname
                    ? `${payment.fname} ${payment.lname}`
                    : "-"}
                </td>
                <td>{payment.event_date.slice(0, 10)}</td>
                <td>{payment.event_time.slice(0, 5)}</td>
                <td>{payment?.club_name}</td>
                <td>{payment.court_name ? payment.court_name : "-"}</td>
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

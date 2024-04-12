import React, { useState, useEffect } from "react";

import { useAppSelector } from "../../../../store/hooks";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import styles from "./styles.module.scss";
import Paths from "../../../../routing/Paths";

import PageLoading from "../../../../components/loading/PageLoading";
import { useGetTrainerPaymentsByUserIdQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetTrainerByUserIdQuery } from "../../../../api/endpoints/TrainersApi";
import { useNavigate } from "react-router-dom";

interface TrainerPaymentsResultsProps {
  clubId: number;
  textSearch: string;
  status: string;
  paymentTypeId: number;
}
const TrainerPaymentsResults = (props: TrainerPaymentsResultsProps) => {
  const { clubId, textSearch, status, paymentTypeId } = props;

  const user = useAppSelector((store) => store?.user?.user);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: myPayments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetTrainerPaymentsByUserIdQuery({
    perPage: 5,
    currentPageNumber: currentPage,
    userId: Number(user?.user?.user_id),
    clubId: Number(clubId),
    textSearch: textSearch,
    status: status,
    paymentTypeId: Number(paymentTypeId),
  });

  const { data: trainerDetails, isLoading: isTrainerDetailsLoading } =
    useGetTrainerByUserIdQuery(user?.user?.user_id);

  const bankDetailsExist =
    trainerDetails?.[0]?.iban &&
    trainerDetails?.[0]?.name_on_bank_account &&
    trainerDetails?.[0]?.bank_id;

  const pageNumbers = [];
  for (let i = 1; i <= myPayments?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePaymentPage = (e) => {
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
  const navigate = useNavigate();

  const navigateToAddPayment = () => {
    navigate(Paths.PROFILE);
  };

  useEffect(() => {
    refetchPayments();
  }, [clubId, textSearch, status, paymentTypeId]);

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
      {myPayments?.payments?.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Ödeme Tarih</th>
                <th>Durum</th>
                <th>Konu</th>
                <th>Tutar</th>
                <th>Öğrenci</th>
                <th>Kulüp</th>
                <th>Kort</th>
              </tr>
            </thead>
            <tbody>
              {myPayments?.payments?.map((payment) => (
                <tr key={payment.payment_id} className={styles["payment-row"]}>
                  <td>{payment.registered_at.slice(0, 10)}</td>
                  <td>{payment.payment_status}</td>
                  <td>{payment?.payment_type_name}</td>
                  <td>{`${payment.lesson_price} TL`}</td>
                  <td>{`${payment?.fname} ${payment?.lname}`}</td>
                  <td>{payment?.club_name}</td>
                  <td>{payment?.court_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles["pages-container"]}>
            {pageNumbers?.map((pageNumber) => (
              <button
                key={pageNumber}
                value={pageNumber}
                onClick={handlePaymentPage}
                className={
                  pageNumber === Number(currentPage)
                    ? styles["active-page"]
                    : styles["passive-page"]
                }
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Henüz ödemeniz bulunmamaktadır.</p>
      )}
      {!bankDetailsExist && (
        <button
          onClick={navigateToAddPayment}
          className={styles["add-payment-button"]}
        >
          Ödeme Bilgilerini Ekle
        </button>
      )}
    </div>
  );
};

export default TrainerPaymentsResults;

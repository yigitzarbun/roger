import React, { useEffect } from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";
import Paths from "../../../../routing/Paths";

import { useGetClubPaymentssByUserIdQuery } from "../../../../api/endpoints/PaymentsApi";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useGetClubByUserIdQuery } from "../../../../api/endpoints/ClubsApi";
import { useNavigate } from "react-router-dom";

interface ClubPaymentsResultsProps {
  textSearch: string;
  status: string;
  paymentTypeId: number;
  currentPage: number;
  setCurrentPage: (e: number) => void;
}

const ClubPaymentsResults = (props: ClubPaymentsResultsProps) => {
  const { textSearch, status, paymentTypeId, currentPage, setCurrentPage } =
    props;
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubPayments,
    isLoading: isClubPaymentsLoading,
    refetch: refetchClubPayments,
  } = useGetClubPaymentssByUserIdQuery({
    textSearch: textSearch,
    status: status,
    paymentTypeId: paymentTypeId,
    userId: user?.user?.user_id,
    currentPageNumber: currentPage,
  });

  const { data: clubDetails, isLoading: isClubDetailsLoading } =
    useGetClubByUserIdQuery(user?.user?.user_id);

  const bankDetails = {
    bank_id: clubDetails?.[0]?.bank_id,
    iban: clubDetails?.[0]?.iban,
    name_on_bank_account: clubDetails?.[0]?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

  const navigate = useNavigate();

  const navigateToAddPayment = () => {
    navigate(Paths.PROFILE);
  };

  const pageNumbers = [];
  for (let i = 1; i <= clubPayments?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handlePaymentPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % clubPayments?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + clubPayments?.totalPages) %
        clubPayments?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  useEffect(() => {
    refetchClubPayments();
  }, [textSearch, paymentTypeId, status, currentPage]);

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Ödemeler</h2>
        {clubPayments?.payments?.length > 0 && (
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
        )}
      </div>
      {clubPayments?.payments?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Durum</th>
              <th>Ödeme Tarih</th>
              <th>Etkinlik Tarih</th>
              <th>Etkinlik Saat</th>
              <th>Tür</th>
              <th>Kort</th>
              <th>Tutar</th>
              <th>Taraf 1</th>
              <th>Taraf 2</th>
            </tr>
          </thead>
          <tbody>
            {clubPayments?.payments?.map((payment) => (
              <tr key={payment.payment_id} className={styles["payment-row"]}>
                <td>{payment.payment_status}</td>
                <td>{payment.registered_at.slice(0, 10)}</td>
                <td>
                  {payment.eventDate ? payment.eventDate.slice(0, 10) : "-"}
                </td>
                <td>
                  {payment.eventTime ? payment.eventTime.slice(0, 5) : "-"}
                </td>
                <td>{payment?.payment_type_name}</td>
                <td>{payment.court_name ? payment.court_name : "-"}</td>
                <td>
                  {payment.payment_type_id === 5
                    ? payment.subscription_price
                    : (payment.payment_type_id === 1 ||
                        payment.payment_type_id === 2 ||
                        payment.payment_type_id === 3) &&
                      payment.court_price}{" "}
                  TL
                </td>
                <td>
                  {payment.payment_type_id === 5
                    ? `${payment.subscriber_fname}
                      ${payment?.subscriber_lname}
                      `
                    : (payment.payment_type_id === 1 ||
                        payment.payment_type_id === 2 ||
                        payment.payment_type_id === 3) &&
                      `${payment?.inviter_fname}
                    ${payment?.inviter_lname}`}
                </td>
                <td>
                  {payment.payment_type_id === 1 ||
                  payment.payment_type_id === 2 ||
                  payment.payment_type_id === 3
                    ? `${payment?.invitee_fname}
                      ${payment?.invitee_lname}
                      `
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default ClubPaymentsResults;

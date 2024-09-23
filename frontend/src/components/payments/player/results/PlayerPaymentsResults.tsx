import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hooks";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./styles.module.scss";
import Paths from "../../../../routing/Paths";
import PageLoading from "../../../../components/loading/PageLoading";
import { useGetPlayerPaymentssByUserIdQuery } from "../../../../../api/endpoints/PaymentsApi";
import { useGetPlayerByUserIdQuery } from "../../../../../api/endpoints/PlayersApi";
import { useNavigate } from "react-router-dom";

interface PlayerPaymentsResultsProps {
  clubId: number;
  textSearch: string;
  status: string;
  paymentTypeId: number;
  currentPage: number;
  setCurrentPage: (e: number) => void;
}

const PlayerPaymentsResults = (props: PlayerPaymentsResultsProps) => {
  const {
    clubId,
    textSearch,
    status,
    paymentTypeId,
    currentPage,
    setCurrentPage,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const paymentDetailsExist =
    currentPlayer?.[0]?.card_expiry &&
    currentPlayer?.[0]?.card_number &&
    currentPlayer?.[0]?.cvc &&
    currentPlayer?.[0]?.name_on_card;

  const {
    data: myPayments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetPlayerPaymentssByUserIdQuery({
    perPage: 5,
    currentPageNumber: currentPage,
    userId: Number(user?.user?.user_id),
    clubId: Number(clubId),
    textSearch: textSearch,
    status: status,
    paymentTypeId: Number(paymentTypeId),
  });

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
  }, [clubId, textSearch, status, paymentTypeId, currentPage]);

  if (isPaymentsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>{t("paymentsTitle")}</h2>
        {myPayments?.totalPages > 1 && (
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
      {myPayments?.payments?.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>{t("paymentDateTitle")}</th>
                <th>{t("paymentStatus")}</th>
                <th>{t("paymentType")}</th>
                <th>{t("trainerPlayer")}</th>
                <th>{t("eventDate")}</th>
                <th>{t("eventTime")}</th>
                <th>{t("tableClubHeader")}</th>
                <th>{t("tableCourtHeader")}</th>
                <th>{t("paymentAmount")}</th>
              </tr>
            </thead>
            <tbody>
              {myPayments?.payments?.map((payment) => (
                <tr key={payment.payment_id} className={styles["payment-row"]}>
                  <td>{payment?.paymentDate?.slice(0, 10)}</td>
                  <td>
                    {payment.payment_status === "success"
                      ? t("success")
                      : t("declined")}
                  </td>
                  <td>
                    {payment?.payment_type_id === 1
                      ? t("training")
                      : payment?.payment_type_id === 2
                      ? t("match")
                      : payment?.payment_type_id === 3
                      ? t("lesson")
                      : payment?.payment_type_id === 4
                      ? t("externalEvent")
                      : payment?.payment_type_id === 5
                      ? t("subscriptionPayment")
                      : payment?.payment_type_id === 6
                      ? t("tournamentAdmissionPayment")
                      : ""}
                  </td>
                  <td>
                    {payment?.player_names
                      ? payment?.player_names[0]
                      : payment?.trainer_names
                      ? payment?.trainer_names[0]
                      : "-"}
                  </td>
                  <td>
                    {payment?.event_date
                      ? payment?.event_date?.slice(0, 10)
                      : "-"}
                  </td>
                  <td>
                    {payment?.event_time
                      ? payment?.event_time?.slice(0, 5)
                      : "-"}
                  </td>
                  <td>{payment?.club_name}</td>
                  <td>{payment.court_name ? payment.court_name : "-"}</td>
                  {(payment.payment_type_id === 1 ||
                    payment.payment_type_id === 2) && (
                    <td>{`${payment.court_price / 2} TL`}</td>
                  )}
                  {payment.payment_type_id === 3 && (
                    <td>{`${
                      payment.lesson_price + payment.court_price
                    } TL`}</td>
                  )}
                  {payment.payment_type_id === 5 && (
                    <td>
                      {`${
                        payment.lesson_price + payment.subscription_price
                      } TL`}
                    </td>
                  )}
                  {payment.payment_type_id === 6 && (
                    <td>{`${payment.payment_amount} TL`}</td>
                  )}
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
        <p>{t("noPaymentsText")}</p>
      )}

      {!paymentDetailsExist && (
        <button
          onClick={navigateToAddPayment}
          className={styles["add-payment-button"]}
        >
          {t("addPaymentDetailsButtonText")}
        </button>
      )}
    </div>
  );
};
export default PlayerPaymentsResults;

import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import TrainerPaymentsResults from "../../../components/payments/trainer/results/TrainerPaymentsResults";
import TrainerPaymentsFilter from "../../../components/payments/trainer/filter/TrainerPaymentsFilter";

const TrainerPayments = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [clubId, setClubId] = useState<number | null>(null);
  const [paymentTypeId, setPaymentTypeId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setTextSearch(event.target.value);
  };
  const handleStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    setStatus(event.target.value);
  };
  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handlePaymentType = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const value = parseInt(event.target.value, 10);
    setPaymentTypeId(isNaN(value) ? null : value);
  };
  const handleClear = () => {
    setCurrentPage(1);
    setTextSearch("");
    setStatus("");
    setClubId(null);
    setPaymentTypeId(null);
  };
  return (
    <div className={styles["trainer-payments-container"]}>
      <TrainerPaymentsFilter
        clubId={clubId}
        textSearch={textSearch}
        status={status}
        paymentTypeId={paymentTypeId}
        handleClub={handleClub}
        handlePaymentType={handlePaymentType}
        handleTextSearch={handleTextSearch}
        handleStatus={handleStatus}
        handleClear={handleClear}
      />
      <TrainerPaymentsResults
        clubId={clubId}
        textSearch={textSearch}
        status={status}
        paymentTypeId={paymentTypeId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default TrainerPayments;

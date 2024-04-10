import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import ClubPaymentsResults from "../../../components/payments/club/results/ClubPaymentsResults";
import ClubPaymentsFilter from "../../../components/payments/club/filter/ClubPAymentsFilter";

const ClubPayments = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [paymentTypeId, setPaymentTypeId] = useState<number | null>(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handlePaymentType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPaymentTypeId(isNaN(value) ? null : value);
  };
  const handleClear = () => {
    setTextSearch("");
    setStatus("");
    setPaymentTypeId(null);
  };
  return (
    <div className={styles["club-payments-container"]}>
      <ClubPaymentsFilter
        textSearch={textSearch}
        status={status}
        paymentTypeId={paymentTypeId}
        handlePaymentType={handlePaymentType}
        handleTextSearch={handleTextSearch}
        handleStatus={handleStatus}
        handleClear={handleClear}
      />
      <ClubPaymentsResults
        textSearch={textSearch}
        status={status}
        paymentTypeId={paymentTypeId}
      />
    </div>
  );
};

export default ClubPayments;

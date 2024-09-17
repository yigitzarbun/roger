import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import PlayerPaymentsResults from "../../../components/payments/player/results/PlayerPaymentsResults";
import PlayerPaymentsFilter from "../../../components/payments/player/filter/PlayerPaymentsFilter";

const PlayerPayments = () => {
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
    setTextSearch("");
    setStatus("");
    setClubId(null);
    setPaymentTypeId(null);
    setCurrentPage(1);
  };
  return (
    <div className={styles["player-payments-container"]}>
      <PlayerPaymentsFilter
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
      <PlayerPaymentsResults
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

export default PlayerPayments;

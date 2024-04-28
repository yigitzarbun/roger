import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface ClubPaymentsFilterProps {
  textSearch: string;
  status: string;
  paymentTypeId: number;
  handlePaymentType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatus: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
}
const ClubPaymentsFilter = (props: ClubPaymentsFilterProps) => {
  const {
    textSearch,
    status,
    paymentTypeId,
    handlePaymentType,
    handleTextSearch,
    handleStatus,
    handleClear,
  } = props;

  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  if (isPaymentTypesLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["payments-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Oyuncu / üye adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handlePaymentType}
          value={paymentTypeId ?? ""}
          className="input-element"
        >
          <option value="">-- Ödeme Türü --</option>
          {paymentTypes?.map((type) => (
            <option key={type.payment_type_id} value={type.payment_type_id}>
              {type.payment_type_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleStatus}
          value={status ?? ""}
          className="input-element"
        >
          <option value="">-- Ödeme Durumu --</option>
          <option value="success">Başarılı</option>
          <option value="declined">Başarısız</option>
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          textSearch !== "" || paymentTypeId > 0 || status !== ""
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};

export default ClubPaymentsFilter;

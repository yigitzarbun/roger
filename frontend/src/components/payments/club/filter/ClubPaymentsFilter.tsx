import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetPaymentTypesQuery } from "../../../../../api/endpoints/PaymentTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
          placeholder={t("explorePlayersFilterSearchPlaceholder")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handlePaymentType}
          value={paymentTypeId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("paymentType")} --</option>
          {paymentTypes?.map((type) => (
            <option key={type.payment_type_id} value={type.payment_type_id}>
              {type?.payment_type_id === 1
                ? t("training")
                : type?.payment_type_id === 2
                ? t("match")
                : type?.payment_type_id === 3
                ? t("lesson")
                : type?.payment_type_id === 4
                ? t("externalEvent")
                : type?.payment_type_id === 5
                ? t("subscriptionPayment")
                : type?.payment_type_id === 6
                ? t("tournamentAdmissionPayment")
                : ""}
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
          <option value="">-- {t("paymentStatus")} --</option>
          <option value="success">{t("success")}</option>
          <option value="declined">{t("declined")}</option>
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
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default ClubPaymentsFilter;

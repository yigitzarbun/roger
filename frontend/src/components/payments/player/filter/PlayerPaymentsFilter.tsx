import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../../api/endpoints/ClubsApi";
import { useGetPaymentTypesQuery } from "../../../../../api/endpoints/PaymentTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";
import { useTranslation } from "react-i18next";

interface PlayerPaymentsFilterProps {
  clubId: number;
  textSearch: string;
  status: string;
  paymentTypeId: number;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePaymentType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatus: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
}
const PlayerPaymentsFilter = (props: PlayerPaymentsFilterProps) => {
  const {
    clubId,
    textSearch,
    status,
    paymentTypeId,
    handleClub,
    handlePaymentType,
    handleTextSearch,
    handleStatus,
    handleClear,
  } = props;

  const { t } = useTranslation();

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: paymentTypes, isLoading: isPaymentTypesLoading } =
    useGetPaymentTypesQuery({});

  if (isClubsLoading || isPaymentTypesLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["payments-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder={t("exploreEventsFilterSearchPlaceholder")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleClub}
          value={clubId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("allClubs")} --</option>
          {clubs?.map((club) => (
            <option key={club.user_id} value={club.user_id}>
              {club.club_name}
            </option>
          ))}
        </select>
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
          textSearch !== "" || clubId > 0 || status !== "" || paymentTypeId > 0
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default PlayerPaymentsFilter;

import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetPaymentTypesQuery } from "../../../../api/endpoints/PaymentTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface PlayerPaymentsFilterProps {
  clubId: number;
  textSearch: string;
  status: string;
  paymentTypeId: number;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePaymentType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatus: (event: ChangeEvent<HTMLSelectElement>) => void;
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
  } = props;

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
          placeholder="Oyuncu / Eğitmen adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleClub}
          value={clubId ?? ""}
          className="input-element"
        >
          <option value="">-- Kulüp --</option>
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
    </div>
  );
};

export default PlayerPaymentsFilter;

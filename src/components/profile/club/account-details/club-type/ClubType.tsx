import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import {
  useUpdateClubMutation,
  Club,
} from "../../../../../api/endpoints/ClubsApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateClubDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { useGetClubTypesQuery } from "../../../../../api/endpoints/ClubTypesApi";

const ClubType = (props) => {
  const { clubDetails, refetchClubDetails } = props;
  const { data: clubTypes } = useGetClubTypesQuery({});
  const dispatch = useAppDispatch();
  const [updateClub, { isSuccess }] = useUpdateClubMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [newType, setNewType] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleTypeChange = (e) => {
    setNewType(Number(e.target.value));
  };

  const handleButtonDisabled = () => {
    const isTypeEmpty = !newType;

    if (isTypeEmpty || newType === clubDetails?.[0]?.club_type_id) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      club_type_id: Number(clubDetails?.[0]?.club_type_id),
    },
  });
  const onSubmit: SubmitHandler<Club> = (formData) => {
    const updatedProfileData = {
      club_id: clubDetails?.[0]?.club_id,
      club_address: clubDetails?.[0]?.club_address,
      club_bio_description: clubDetails?.[0]?.club_bio_description,
      club_name: clubDetails?.[0]?.club_name,
      club_type_id: formData?.club_type_id,
      is_trainer_subscription_required:
        clubDetails?.[0]?.is_trainer_subscription_required,
      image: clubDetails?.[0]?.image,
      is_player_lesson_subscription_required:
        clubDetails?.[0]?.is_player_lesson_subscription_required,
      is_player_subscription_required:
        clubDetails?.[0]?.is_player_subscription_required,
      lesson_rule_id: Number(clubDetails?.[0]?.lesson_rule_id),
      player_rule_id: Number(clubDetails?.[0]?.player_rule_id),
      iban: Number(clubDetails?.[0]?.iban),
      bank_id: Number(clubDetails?.[0]?.bank_id),
      name_on_bank_account: Number(clubDetails?.[0]?.name_on_bank_account),
      higher_price_for_non_subscribers: Number(
        clubDetails?.[0]?.higher_price_for_non_subscribers
      ),
      location_id: clubDetails?.[0]?.location_id,
      club_level_id: Number(clubDetails?.[0]?.club_level_id),
      user_id: clubDetails?.[0]?.user_id,
    };
    updateClub(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateClubDetails(updatedProfile));
      toast.success("Profil güncellendi");
      refetchClubDetails();
      reset(updatedProfile);
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newType]);

  useEffect(() => {
    if (clubTypes && clubTypes.length > 0) {
      setValue("club_type_id", Number(clubDetails?.[0]?.club_type_id));
    }
  }, [clubTypes, setValue, clubDetails]);

  return (
    <div className={styles["club-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Kulüp Türü</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <select
            {...register("club_type_id", { required: true })}
            onChange={handleTypeChange}
          >
            {clubTypes?.map((type) => (
              <option key={type.club_type_id} value={type.club_type_id}>
                {type.club_type_name}
              </option>
            ))}
          </select>
          {errors.club_type_id && (
            <span className={styles["error-field"]}>Bu alan zorunludur.</span>
          )}
        </div>
        <button
          type="submit"
          className={
            buttonDisabled ? styles["disabled-button"] : styles["active-button"]
          }
          disabled={buttonDisabled}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default ClubType;

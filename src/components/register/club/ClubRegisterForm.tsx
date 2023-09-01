import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../common/i18n/i18n";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAddUserMutation } from "../../../store/auth/apiSlice";
import {
  useAddClubMutation,
  useGetClubsQuery,
} from "../../../api/endpoints/ClubsApi";
import { useGetClubTypesQuery } from "../../../api/endpoints/ClubTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../api/endpoints/UserStatusTypesApi";

export type FormValues = {
  user_type_id: number;
  user_status_type_id: number;
  email: string;
  password: string;
  club_name: string;
  location_id: number;
  picture: string;
  club_address: string;
  club_bio_description: string;
  club_type_id: number;
  image?: string;
};

const ClubRegisterForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    setValue("image", imageFile);
  };
  const [addUser] = useAddUserMutation();
  const [addClub, { isSuccess }] = useAddClubMutation();

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});
  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});
  const { refetch } = useGetClubsQuery({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // arrange user register data
    const userRegisterData = {
      email: formData.email,
      password: formData.password,
      user_type_id: userTypes?.find((u) => u.user_type_name === "club")
        .user_type_id,
      user_status_type_id: userStatusTypes?.find(
        (u) => u.user_status_type_name === "active"
      ).user_status_type_id,
    };
    try {
      // register user
      const response = await addUser(userRegisterData);

      if ("data" in response) {
        // get newly added user from db
        const newUser = response.data;
        // arrange user register data
        const clubRegisterData = {
          club_name: formData.club_name,
          picture: null,
          club_address: formData.club_address,
          club_bio_description: null,
          club_type_id: formData.club_type_id,
          location_id: Number(formData.location_id),
          image: selectedImage ? selectedImage : null,
          user_id: newUser.user_id,
        };
        // register user
        await addClub(clubRegisterData);
        console.log(clubRegisterData);
        navigate(paths.LOGIN);
        reset();
      } else {
        console.error("New user data is missing.");
      }
    } catch (error) {
      console.error("Error while adding new user:", error);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);
  if (
    isLocationsLoading ||
    isClubTypesLoading ||
    isUserTypesLoading ||
    isUserStatusTypesLoading
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court3.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>Kulüp Kayıt</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Kulüp Adı</label>
              <input
                {...register("club_name", { required: true })}
                type="text"
                placeholder="örn. Wimbledon Tennis Club"
              />
              {errors.club_name && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Kulüp Tipi</label>
              <select {...register("club_type_id", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                {clubTypes?.map((club_type) => (
                  <option
                    key={club_type.club_type_id}
                    value={club_type.club_type_id}
                  >
                    {club_type.club_type_name}
                  </option>
                ))}
              </select>
              {errors.club_type_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>

          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Konum</label>
              <select {...register("location_id", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                {locations?.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Adres</label>
              <input
                {...register("club_address", { required: true })}
                type="text"
              />
              {errors.club_address && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>E-posta</label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder={i18n.t("registerEmailInputPlaceholder")}
              />
              {errors.email && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Şifre</label>
              <input
                {...register("password", { required: true })}
                type="password"
              />
              {errors.password && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />
          <button type="submit" className={styles["form-button"]}>
            {i18n.t("registerButtonText")}
          </button>
        </form>
        <Link to={paths.LOGIN} className={styles["login-nav"]}>
          Hesabın var mı?{" "}
          <span className={styles["login-span"]}>Giriş yap</span>
        </Link>
      </div>
    </div>
  );
};

export default ClubRegisterForm;

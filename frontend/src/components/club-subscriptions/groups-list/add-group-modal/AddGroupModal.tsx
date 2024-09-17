import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { Trainer } from "../../../../../api/endpoints/TrainersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import {
  useAddStudentGroupMutation,
  useGetStudentGroupsQuery,
} from "../../../../../api/endpoints/StudentGroupsApi";
import { useGetClubSubscribersByIdQuery } from "../../../../../api/endpoints/ClubSubscriptionsApi";
import { useAddUserMutation } from "../../../../store/auth/apiSlice";
import PageLoading from "../../../../components/loading/PageLoading";

interface AddGroupModalProps {
  isAddGroupModalOpen: boolean;
  closeAddGroupModal: () => void;
  myTrainers: Trainer[];
  user: any;
}

type FormValues = {
  student_group_name: string;
  trainer_id: number;
  first_student_id: number;
  second_student_id: number;
  third_student_id?: number;
  fourth_student_id?: number;
};

const AddGroupModal = (props: AddGroupModalProps) => {
  const { isAddGroupModalOpen, closeAddGroupModal, myTrainers, user } = props;

  const { data: mySubscribers, isLoading: isMySubscribersLoading } =
    useGetClubSubscribersByIdQuery(user?.user?.user_id);

  const { isLoading: isGroupsLoading, refetch: refetchGroups } =
    useGetStudentGroupsQuery({});

  const { refetch: refetchUsers } = useGetUsersQuery({});

  const [addGroup, { isSuccess: isAddGroupSuccess }] =
    useAddStudentGroupMutation({});

  const [addUser, { data: newUserData, isSuccess: isAddUserSuccess }] =
    useAddUserMutation({});

  const [newGroup, setNewGroup] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const newUser = {
        email: `${formData?.student_group_name}${Date.now()}@dummyemail.com`,
        password: String(Date.now()),
        user_type_id: 6,
        user_status_type_id: 1,
        language_id: 1,
      };
      addUser(newUser);
      const groupData = {
        student_group_name: formData?.student_group_name,
        is_active: true,
        club_id: user?.user?.user_id,
        trainer_id: Number(formData?.trainer_id),
        first_student_id: Number(formData?.first_student_id),
        second_student_id: Number(formData?.second_student_id),
        third_student_id: Number(formData?.third_student_id)
          ? Number(formData?.third_student_id)
          : null,
        fourth_student_id: Number(formData?.fourth_student_id)
          ? Number(formData?.fourth_student_id)
          : null,
      };
      setNewGroup(groupData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isAddUserSuccess) {
      newGroup.user_id = newUserData?.user_id;
      refetchUsers();
      addGroup(newGroup);
    }
  }, [isAddUserSuccess]);

  useEffect(() => {
    if (isAddGroupSuccess) {
      toast.success("Grup eklendi");
      refetchGroups();
      reset();
      closeAddGroupModal();
    }
  }, [isAddGroupSuccess]);

  if (isGroupsLoading || isMySubscribersLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isAddGroupModalOpen}
      onRequestClose={closeAddGroupModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeAddGroupModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Yeni Grup Ekle</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Grup Adı</label>
              <input
                {...register("student_group_name", { required: true })}
                type="text"
                placeholder="örn. Yıldızlar Grubu"
              />
              {errors.student_group_name && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Eğitmen</label>
              <select
                {...register("trainer_id", {
                  required: true,
                })}
              >
                <option value="">-- Eğitmen --</option>
                {myTrainers?.map((staff) => (
                  <option
                    key={staff.user_id}
                    value={staff.user_id}
                  >{`${staff?.fname} ${staff?.lname}`}</option>
                ))}
              </select>
              {errors.trainer_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>1. Oyuncu</label>
              <select
                {...register("first_student_id", {
                  required: true,
                })}
              >
                <option value="">-- 1. Oyuncu --</option>
                {mySubscribers?.map((subscriber) => (
                  <option
                    key={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                    value={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                  >
                    {subscriber?.playerUserId
                      ? `${subscriber?.playerFname} ${subscriber?.playerLname}`
                      : subscriber?.externalUserId
                      ? `${subscriber?.externalFname} ${subscriber?.externalLname}`
                      : ""}
                  </option>
                ))}
              </select>
              {errors.first_student_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>2. Oyuncu</label>
              <select
                {...register("second_student_id", {
                  required: true,
                })}
              >
                <option value="">-- 2. Oyuncu --</option>
                {mySubscribers?.map((subscriber) => (
                  <option
                    key={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                    value={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                  >
                    {subscriber?.playerUserId
                      ? `${subscriber?.playerFname} ${subscriber?.playerLname}`
                      : subscriber?.externalUserId
                      ? `${subscriber?.externalFname} ${subscriber?.externalLname}`
                      : ""}
                  </option>
                ))}
              </select>
              {errors.second_student_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>3. Oyuncu</label>
              <select {...register("third_student_id")}>
                <option value="">-- 3. Oyuncu --</option>
                {mySubscribers?.map((subscriber) => (
                  <option
                    key={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                    value={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                  >
                    {subscriber?.playerUserId
                      ? `${subscriber?.playerFname} ${subscriber?.playerLname}`
                      : subscriber?.externalUserId
                      ? `${subscriber?.externalFname} ${subscriber?.externalLname}`
                      : ""}
                  </option>
                ))}
              </select>
              {errors.third_student_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>4. Oyuncu</label>
              <select {...register("fourth_student_id")}>
                <option value="">-- 4. Oyuncu --</option>
                {mySubscribers?.map((subscriber) => (
                  <option
                    key={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                    value={
                      subscriber?.playerUserId
                        ? subscriber.playerUserId
                        : subscriber?.externalUserId
                        ? subscriber?.externalUserId
                        : null
                    }
                  >
                    {subscriber?.playerUserId
                      ? `${subscriber?.playerFname} ${subscriber?.playerLname}`
                      : subscriber?.externalUserId
                      ? `${subscriber?.externalFname} ${subscriber?.externalLname}`
                      : ""}
                  </option>
                ))}
              </select>
              {errors.fourth_student_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>

          <div className={styles["buttons-container"]}>
            <button
              className={styles["discard-button"]}
              onClick={closeAddGroupModal}
            >
              İptal
            </button>
            <button type="submit" className={styles["submit-button"]}>
              Tamamla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default AddGroupModal;

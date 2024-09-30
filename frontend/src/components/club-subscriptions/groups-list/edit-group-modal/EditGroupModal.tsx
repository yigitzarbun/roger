import React, { useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import PageLoading from "../../../../components/loading/PageLoading";
import {
  useGetStudentGroupsQuery,
  useUpdateStudentGroupMutation,
} from "../../../../../api/endpoints/StudentGroupsApi";
import { useGetClubSubscribersByIdQuery } from "../../../../../api/endpoints/ClubSubscriptionsApi";
import { useTranslation } from "react-i18next";

interface EditGroupModalProps {
  isEditGroupModalOpen: boolean;
  closeEditGroupModal: () => void;
  selectedGroup: any;
  myTrainers: any[];
  user: any;
}

type FormValues = {
  student_group_name: string;
  trainer_id: number;
  first_student_id: number;
  second_student_id: number;
  third_student_id: number;
  fourth_student_id: number;
};

const EditGroupModal = (props: EditGroupModalProps) => {
  const {
    isEditGroupModalOpen,
    closeEditGroupModal,
    selectedGroup,
    myTrainers,
    user,
  } = props;

  const { t } = useTranslation();

  const { data: mySubscribers, isLoading: isMySubscribersLoading } =
    useGetClubSubscribersByIdQuery(user?.user?.user_id);

  const { isLoading: isGroupsLoading, refetch: refetchGroups } =
    useGetStudentGroupsQuery({});

  const [updateGroup, { isSuccess: isUpdateGroupSuccess }] =
    useUpdateStudentGroupMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      student_group_name: selectedGroup?.student_group_name,
      trainer_id: selectedGroup?.trainer_user_id,
      first_student_id: selectedGroup?.students_info?.[0]
        ? selectedGroup?.students_info?.[0]?.user_id
        : null,
      second_student_id: selectedGroup?.students_info?.[1]
        ? selectedGroup?.students_info?.[1]?.user_id
        : null,
      third_student_id: selectedGroup?.students_info?.[2]
        ? selectedGroup?.students_info?.[2]?.user_id
        : null,
      fourth_student_id: selectedGroup?.students_info?.[3]
        ? selectedGroup?.students_info?.[3]?.user_id
        : null,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const groupData = {
        student_group_id: selectedGroup?.student_group_id,
        registered_at: selectedGroup?.registered_at,
        user_id: selectedGroup?.user_id,
        student_group_name: formData?.student_group_name,
        is_active: true,
        club_id: user?.user?.user_id,
        trainer_id: Number(formData?.trainer_id),
        first_student_id: Number(formData?.first_student_id),
        second_student_id: Number(formData?.second_student_id),
        third_student_id: formData?.third_student_id
          ? Number(formData?.third_student_id)
          : null,
        fourth_student_id: formData?.fourth_student_id
          ? Number(formData?.fourth_student_id)
          : null,
      };
      updateGroup(groupData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = () => {
    const deleteGroupData = {
      student_group_id: selectedGroup?.student_group_id,
      registered_at: selectedGroup?.registered_at,
      user_id: selectedGroup?.user_id,
      is_active: false,
      student_group_name: selectedGroup?.student_group_name,
      trainer_id: selectedGroup?.trainer_user_id,
      first_student_id: selectedGroup?.cem1_user_id
        ? selectedGroup?.cem1_user_id
        : selectedGroup?.student1_user_id
        ? selectedGroup?.student1_user_id
        : null,
      second_student_id: selectedGroup?.cem2_user_id
        ? selectedGroup?.cem2_user_id
        : selectedGroup?.student2_user_id
        ? selectedGroup?.student2_user_id
        : null,
      third_student_id: selectedGroup?.cem3_user_id
        ? selectedGroup?.cem3_user_id
        : selectedGroup?.student3_user_id
        ? selectedGroup?.student3_user_id
        : null,
      fourth_student_id: selectedGroup?.cem4_user_id
        ? selectedGroup?.cem4_user_id
        : selectedGroup?.student4_user_id
        ? selectedGroup?.student4_user_id
        : null,
    };
    updateGroup(deleteGroupData);
  };

  useEffect(() => {
    if (selectedGroup) {
      reset({
        student_group_name: selectedGroup?.student_group_name,
        trainer_id: selectedGroup?.trainer_user_id,
        first_student_id: selectedGroup?.students_info?.[0]
          ? selectedGroup?.students_info?.[0]?.user_id
          : null,
        second_student_id: selectedGroup?.students_info?.[1]
          ? selectedGroup?.students_info?.[1]?.user_id
          : null,
        third_student_id: selectedGroup?.students_info?.[2]
          ? selectedGroup?.students_info?.[2]?.user_id
          : null,
        fourth_student_id: selectedGroup?.students_info?.[3]
          ? selectedGroup?.students_info?.[3]?.user_id
          : null,
      });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (isUpdateGroupSuccess) {
      toast.success("İşlem başarılı");
      refetchGroups();
      reset();
      closeEditGroupModal();
    }
  }, [isUpdateGroupSuccess]);

  if (isGroupsLoading || isMySubscribersLoading) {
    return <PageLoading />;
  }
  return (
    <Modal
      isOpen={isEditGroupModalOpen}
      onRequestClose={closeEditGroupModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEditGroupModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1 className={styles.title}>{t("editGroup")}</h1>
          <button
            onClick={handleDeleteGroup}
            className={styles["delete-button"]}
          >
            {t("deleteGroup")}
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("groupName")}</label>
              <input
                {...register("student_group_name", { required: true })}
                type="text"
              />
              {errors.student_group_name && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("userTypeTrainer")}</label>
              <select
                {...register("trainer_id", {
                  required: true,
                })}
              >
                <option value="">-- {t("userTypeTrainer")} --</option>
                {myTrainers?.map((staff) => (
                  <option key={staff.user_id} value={staff.user_id}>{`${
                    myTrainers?.find(
                      (trainer) => trainer.user_id === staff.user_id
                    )?.fname
                  } ${
                    myTrainers?.find(
                      (trainer) => trainer.user_id === staff.user_id
                    )?.lname
                  }`}</option>
                ))}
              </select>
              {errors.trainer_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("student1")}</label>
              <select
                {...register("first_student_id", {
                  required: true,
                })}
              >
                <option value="">-- {t("student1")} --</option>
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
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("student2")}</label>
              <select
                {...register("second_student_id", {
                  required: true,
                })}
              >
                <option value="">-- {t("student2")} --</option>
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
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("student3")}</label>
              <select {...register("third_student_id")}>
                <option value="">-- {t("student3")} --</option>
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
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("student4")}</label>
              <select {...register("fourth_student_id")}>
                <option value="">-- {t("student4")} --</option>
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
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeEditGroupModal}
              className={styles["discard-button"]}
            >
              {t("cancel")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditGroupModal;

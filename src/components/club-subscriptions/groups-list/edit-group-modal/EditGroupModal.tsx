import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import {
  Trainer,
  useGetTrainersByFilterQuery,
} from "../../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import {
  ClubExternalMember,
  useGetClubExternalMembersByFilterQuery,
} from "../../../../api/endpoints/ClubExternalMembersApi";
import {
  StudentGroup,
  useGetStudentGroupsQuery,
  useUpdateStudentGroupMutation,
} from "../../../../api/endpoints/StudentGroupsApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";

interface EditGroupModalProps {
  isEditGroupModalOpen: boolean;
  closeEditGroupModal: () => void;
  selectedGroup: StudentGroup;
  myTrainers: Trainer[];
  myExternalMembers: ClubExternalMember[];
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
    myExternalMembers,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: mySubscribers, isLoading: isMySubscribersLoading } =
    useGetClubSubscriptionsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const { isLoading: isGroupsLoading, refetch: refetchGroups } =
    useGetStudentGroupsQuery({});

  const [updateGroup, { isSuccess: isUpdateGroupSuccess }] =
    useUpdateStudentGroupMutation({});

  const [addMoreUsers, setAddMoreUsers] = useState(false);

  const handleAddMoreUsers = () => {
    setAddMoreUsers(true);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      student_group_name: selectedGroup?.student_group_name,
      trainer_id: selectedGroup?.trainer_id,
      first_student_id: selectedGroup?.first_student_id,
      second_student_id: selectedGroup?.second_student_id,
      third_student_id: selectedGroup?.third_student_id
        ? selectedGroup?.third_student_id
        : null,
      fourth_student_id: selectedGroup?.fourth_student_id
        ? selectedGroup?.fourth_student_id
        : null,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const groupData = {
        ...selectedGroup,
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
      console.log(groupData);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedExternalMember = (user_id: number) => {
    return myExternalMembers?.find((member) => member.user_id === user_id);
  };

  useEffect(() => {
    if (selectedGroup) {
      reset({
        student_group_name: selectedGroup?.student_group_name,
        trainer_id: selectedGroup?.trainer_id,
        first_student_id: selectedGroup?.first_student_id,
        second_student_id: selectedGroup?.second_student_id,
        third_student_id: selectedGroup?.third_student_id
          ? selectedGroup?.third_student_id
          : null,
        fourth_student_id: selectedGroup?.fourth_student_id
          ? selectedGroup?.fourth_student_id
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

  useEffect(() => {
    setAddMoreUsers(false);
  }, [closeEditGroupModal]);

  if (
    isGroupsLoading ||
    isUsersLoading ||
    isPlayersLoading ||
    isMySubscribersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isEditGroupModalOpen}
      onRequestClose={closeEditGroupModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Grup Düzenle</h1>
        <FaWindowClose
          onClick={closeEditGroupModal}
          className={styles["close-icon"]}
        />
      </div>
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
            />
            {errors.student_group_name && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              {mySubscribers.map((subscriber) => (
                <option key={subscriber.player_id} value={subscriber.player_id}>
                  {users?.find((user) => user.user_id === subscriber.player_id)
                    ?.user_type_id === 5
                    ? `${selectedExternalMember(subscriber.player_id)?.fname} ${
                        selectedExternalMember(subscriber.player_id)?.lname
                      }`
                    : users?.find(
                        (user) => user.user_id === subscriber.player_id
                      )?.user_type_id === 1 &&
                      `${
                        players?.find(
                          (player) => player.user_id === subscriber.player_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === subscriber.player_id
                        )?.lname
                      } `}
                </option>
              ))}
            </select>
            {errors.first_student_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              {mySubscribers.map((subscriber) => (
                <option key={subscriber.player_id} value={subscriber.player_id}>
                  {users?.find((user) => user.user_id === subscriber.player_id)
                    ?.user_type_id === 5
                    ? `${selectedExternalMember(subscriber.player_id)?.fname} ${
                        selectedExternalMember(subscriber.player_id)?.lname
                      }`
                    : users?.find(
                        (user) => user.user_id === subscriber.player_id
                      )?.user_type_id === 1 &&
                      `${
                        players?.find(
                          (player) => player.user_id === subscriber.player_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === subscriber.player_id
                        )?.lname
                      } `}
                </option>
              ))}
            </select>
            {errors.second_student_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>

        {addMoreUsers ? (
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>3. Oyuncu</label>
              <select {...register("third_student_id")}>
                <option value="">-- 3. Oyuncu --</option>
                {mySubscribers.map((subscriber) => (
                  <option
                    key={subscriber.player_id}
                    value={subscriber.player_id}
                  >
                    {users?.find(
                      (user) => user.user_id === subscriber.player_id
                    )?.user_type_id === 5
                      ? `${
                          selectedExternalMember(subscriber.player_id)?.fname
                        } ${
                          selectedExternalMember(subscriber.player_id)?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === subscriber.player_id
                        )?.user_type_id === 1 &&
                        `${
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.lname
                        } `}
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
                {mySubscribers.map((subscriber) => (
                  <option
                    key={subscriber.player_id}
                    value={subscriber.player_id}
                  >
                    {users?.find(
                      (user) => user.user_id === subscriber.player_id
                    )?.user_type_id === 5
                      ? `${
                          selectedExternalMember(subscriber.player_id)?.fname
                        } ${
                          selectedExternalMember(subscriber.player_id)?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === subscriber.player_id
                        )?.user_type_id === 1 &&
                        `${
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) => player.user_id === subscriber.player_id
                          )?.lname
                        } `}
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
        ) : (
          <div
            onClick={handleAddMoreUsers}
            className={styles["more-players-container"]}
          >
            <AiOutlineUserAdd />
            Daha fazla oyuncu ekle
          </div>
        )}

        <button type="submit" className={styles["form-button"]}>
          Tamamla
        </button>
      </form>
    </Modal>
  );
};

export default EditGroupModal;

import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import {
  StudentGroup,
  useGetStudentGroupsQuery,
  useUpdateStudentGroupMutation,
} from "../../../../api/endpoints/StudentGroupsApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import PageLoading from "../../../../components/loading/PageLoading";

interface EditGroupModalProps {
  isEditGroupModalOpen: boolean;
  closeEditGroupModal: () => void;
  selectedGroup: StudentGroup;
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
  const { isEditGroupModalOpen, closeEditGroupModal, selectedGroup } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { isLoading: isGroupsLoading, refetch: refetchGroups } =
    useGetStudentGroupsQuery({});

  const [updateGroup, { isSuccess: isUpdateGroupSuccess }] =
    useUpdateStudentGroupMutation({});

  const [addMoreUsers, setAddMoreUsers] = useState(false);

  const handleAddMoreUsers = () => {
    setAddMoreUsers(true);
  };

  const myTrainers = clubStaff?.filter(
    (staff) =>
      staff.club_id === user?.clubDetails?.club_id &&
      staff.employment_status === "accepted"
  );

  const mySubscribers = clubSubscriptions?.filter(
    (subscriber) =>
      subscriber.club_id === user?.user?.user_id &&
      subscriber.is_active === true
  );

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
    isClubStaffLoading ||
    isExternalMembersLoading ||
    isTrainersLoading ||
    isUsersLoading ||
    isPlayersLoading ||
    isClubSubscriptionsLoading
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
                  trainers?.find((trainer) => trainer.user_id === staff.user_id)
                    ?.fname
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
                    ? `${
                        externalMembers?.find(
                          (member) => member.user_id === subscriber.player_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === subscriber.player_id
                        )?.lname
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
                    ? `${
                        externalMembers?.find(
                          (member) => member.user_id === subscriber.player_id
                        )?.fname
                      } ${
                        externalMembers?.find(
                          (member) => member.user_id === subscriber.player_id
                        )?.lname
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
                          externalMembers?.find(
                            (member) => member.user_id === subscriber.player_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) => member.user_id === subscriber.player_id
                          )?.lname
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
                          externalMembers?.find(
                            (member) => member.user_id === subscriber.player_id
                          )?.fname
                        } ${
                          externalMembers?.find(
                            (member) => member.user_id === subscriber.player_id
                          )?.lname
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
          <button onClick={handleAddMoreUsers}>Daha fazla oyuncu ekle</button>
        )}

        <button type="submit" className={styles["form-button"]}>
          Tamamla
        </button>
      </form>
    </Modal>
  );
};

export default EditGroupModal;

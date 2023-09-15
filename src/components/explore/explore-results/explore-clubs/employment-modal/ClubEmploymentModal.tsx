import React, { useEffect } from "react";

import { FaWindowClose } from "react-icons/fa";

import Modal from "react-modal";

import { localUrl } from "../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../components/loading/PageLoading";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";
import { useGetTrainerByUserIdQuery } from "../../../../../api/endpoints/TrainersApi";
import {
  useGetClubStaffQuery,
  useAddClubStaffMutation,
  useUpdateClubStaffMutation,
  useGetClubStaffByFilterQuery,
} from "../../../../../api/endpoints/ClubStaffApi";
import { useGetClubByClubIdQuery } from "../../../../../api/endpoints/ClubsApi";

interface ClubEmploymentModalProps {
  employmentModalOpen: boolean;
  closeEmploymentModal: () => void;
  trainerEmploymentClubId: number;
}
const ClubEmploymentModal = (props: ClubEmploymentModalProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const { employmentModalOpen, closeEmploymentModal, trainerEmploymentClubId } =
    props;

  const { data: currentTrainer, isLoading: isCurrentTrainerLoading } =
    useGetTrainerByUserIdQuery(user?.user?.user_id);

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(trainerEmploymentClubId);

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

  const {
    data: clubStaff,
    isLoading: isStaffLoading,
    refetch: clubStaffRefetch,
  } = useGetClubStaffByFilterQuery({
    club_id: trainerEmploymentClubId,
    user_id: user?.user?.user_id,
  });

  const [addClubStaff, { isSuccess: isAddClubStaffSuccess }] =
    useAddClubStaffMutation({});

  const [updateClubStaff, { isSuccess: isUpdateStaffSuccess }] =
    useUpdateClubStaffMutation({});

  const isUserTrainer = user?.user?.user_type_id === 2;

  const isPastApplicationExist = clubStaff?.find(
    (staff) =>
      staff.employment_status === "declined" ||
      staff.employment_status === "terminated_by_club"
  );
  const handleAddClubStaff = () => {
    if (isUserTrainer) {
      const newClubStaffData = {
        fname: currentTrainer?.[0]?.fname,
        lname: currentTrainer?.[0]?.lname,
        birth_year: currentTrainer?.[0]?.birth_year,
        gender: currentTrainer?.[0]?.gender,
        employment_status: "pending",
        gross_salary_month: null,
        iban: null,
        bank_id: null,
        phone_number: null,
        image: null,
        club_id: trainerEmploymentClubId,
        club_staff_role_type_id: 2,
        user_id: user?.user?.user_id,
      };

      const updatedClubStaffData = {
        ...isPastApplicationExist,
        employment_status: "pending",
      };

      if (!isPastApplicationExist) {
        addClubStaff(newClubStaffData);
      } else {
        updateClubStaff(updatedClubStaffData);
      }
    }
  };

  useEffect(() => {
    if (isAddClubStaffSuccess || isUpdateStaffSuccess) {
      clubStaffRefetch();
      refetchAllClubStaff();
      closeEmploymentModal();
    }
  }, [isAddClubStaffSuccess, isUpdateStaffSuccess]);

  if (isStaffLoading || isCurrentTrainerLoading || isSelectedClubLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={employmentModalOpen}
      onRequestClose={closeEmploymentModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Çalışan Başvurunu Gönder</h1>
        <FaWindowClose
          onClick={closeEmploymentModal}
          className={styles["close-icon"]}
        />
      </div>
      <div className={styles["bottom-container"]}>
        <img
          src={
            selectedClub?.[0]?.image
              ? `${localUrl}/${selectedClub?.[0]?.image}`
              : "images/icons/avatar.png"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedClub?.[0]?.club_name} kulubüne başvurunuzu göndermeyi onaylıyor musunuz?`}</h4>
      </div>
      <button onClick={handleAddClubStaff} className={styles["button"]}>
        Onayla
      </button>
    </Modal>
  );
};

export default ClubEmploymentModal;

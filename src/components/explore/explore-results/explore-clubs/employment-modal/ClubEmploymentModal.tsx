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
  useGetIsTrainerClubStaffQuery,
} from "../../../../../api/endpoints/ClubStaffApi";

interface ClubEmploymentModalProps {
  employmentModalOpen: boolean;
  closeEmploymentModal: () => void;
  selectedClub: any;
}
const ClubEmploymentModal = (props: ClubEmploymentModalProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const { employmentModalOpen, closeEmploymentModal, selectedClub } = props;

  const { data: currentTrainer, isLoading: isCurrentTrainerLoading } =
    useGetTrainerByUserIdQuery(user?.user?.user_id);

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

  const { data: isTrainerStaff, isLoading: isTrainerStaffLoading } =
    useGetIsTrainerClubStaffQuery({
      clubId: selectedClub?.club_id,
      trainerUserId: user?.user?.user_id,
    });

  const [addClubStaff, { isSuccess: isAddClubStaffSuccess }] =
    useAddClubStaffMutation({});

  const [updateClubStaff, { isSuccess: isUpdateStaffSuccess }] =
    useUpdateClubStaffMutation({});

  const isUserTrainer = user?.user?.user_type_id === 2;

  const isPastApplicationExist =
    isTrainerStaff?.[0]?.employment_status === "declined" ||
    isTrainerStaff?.[0]?.employment_status === "terminated_by_club";

  const handleAddClubStaff = () => {
    if (isUserTrainer && !isPastApplicationExist) {
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
        club_id: selectedClub?.club_id,
        club_staff_role_type_id: 2,
        user_id: user?.user?.user_id,
      };
      addClubStaff(newClubStaffData);
    }
    if (isUserTrainer && isPastApplicationExist) {
      const updatedClubStaffData = {
        club_staff_id: isTrainerStaff?.[0]?.club_staff_id,
        fname: isTrainerStaff?.[0]?.fname,
        lname: isTrainerStaff?.[0]?.lname,
        birth_year: isTrainerStaff?.[0]?.birth_year,
        gender: isTrainerStaff?.[0]?.gender,
        employment_status: "pending",
        gross_salary_month: isTrainerStaff?.[0]?.gross_salary_month,
        iban: isTrainerStaff?.[0]?.iban,
        bank_id: isTrainerStaff?.[0]?.bank_id,
        phone_number: isTrainerStaff?.[0]?.phone_number,
        image: isTrainerStaff?.[0]?.image,
        club_id: isTrainerStaff?.[0]?.club_id,
        club_staff_role_type_id: isTrainerStaff?.[0]?.club_staff_role_type_id,
        user_id: isTrainerStaff?.[0]?.user_id,
      };
      updateClubStaff(updatedClubStaffData);
    }
  };

  useEffect(() => {
    if (isAddClubStaffSuccess || isUpdateStaffSuccess) {
      refetchAllClubStaff();
      closeEmploymentModal();
    }
  }, [isAddClubStaffSuccess, isUpdateStaffSuccess]);

  if (isCurrentTrainerLoading) {
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
            selectedClub?.image
              ? `${localUrl}/${selectedClub?.image}`
              : "/images/icons/avatar.jpg"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedClub?.club_name} kulubüne başvurunuzu göndermeyi onaylıyor musunuz?`}</h4>
      </div>
      <button onClick={handleAddClubStaff} className={styles["button"]}>
        Onayla
      </button>
    </Modal>
  );
};

export default ClubEmploymentModal;

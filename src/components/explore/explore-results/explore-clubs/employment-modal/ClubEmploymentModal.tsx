import React, { useEffect } from "react";

import ReactModal from "react-modal";

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
  useGetClubStaffByFilterQuery,
} from "../../../../../api/endpoints/ClubStaffApi";
import { toast } from "react-toastify";

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

  const {
    data: isTrainerStaff,
    isLoading: isTrainerStaffLoading,
    refetch: refetchIsTrainer,
  } = useGetIsTrainerClubStaffQuery({
    clubId: selectedClub?.club_id,
    trainerUserId: user?.user?.user_id,
  });

  const { data: clubStaffDetails, isLoading: isClubStaffDetailsLoading } =
    useGetClubStaffByFilterQuery({
      user_id: user?.user?.user_id,
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
    if (
      clubStaffDetails?.[0]?.employment_status === "accepted" ||
      clubStaffDetails?.[0]?.employment_status === "pending"
    ) {
      toast.error("Aynı anda birden fazla kulüpte çalışamazsınız");
      closeEmploymentModal();
      return;
    }
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
      refetchIsTrainer();
      closeEmploymentModal();
    }
  }, [isAddClubStaffSuccess, isUpdateStaffSuccess]);

  if (isCurrentTrainerLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={employmentModalOpen}
      onRequestClose={closeEmploymentModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeEmploymentModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Çalışan Başvurusu</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              selectedClub?.image
                ? `${localUrl}/${selectedClub?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p>{`${selectedClub?.club_name} kulubüne başvurunuzu göndermeyi onaylıyor musunuz?`}</p>
        </div>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeEmploymentModal}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleAddClubStaff}
            className={styles["submit-button"]}
          >
            Onayla
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default ClubEmploymentModal;

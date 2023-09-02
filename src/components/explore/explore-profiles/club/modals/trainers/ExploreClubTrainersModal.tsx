import React from "react";

import ReactModal from "react-modal";

import { AiOutlineEye } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { Club } from "../../../../../../api/endpoints/ClubsApi";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";

import {
  Trainer,
  useGetTrainersQuery,
} from "../../../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";

interface ExploreClubTrainersModalProps {
  isTrainersModalOpen: boolean;
  closeTrainersModal: () => void;
  selectedClub: Club;
  confirmedClubTrainers: Trainer[];
}

const ExploreClubTrainerModal = (props: ExploreClubTrainersModalProps) => {
  const {
    isTrainersModalOpen,
    closeTrainersModal,
    selectedClub,
    confirmedClubTrainers,
  } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  if (isTrainersLoading || isTrainerExperienceTypesLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isTrainersModalOpen}
      onRequestClose={closeTrainersModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Eğitmenler</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeTrainersModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["table-container"]}>
        {confirmedClubTrainers?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Cinsiyet</th>
                <th>Tecrübe</th>
                <th>Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {confirmedClubTrainers?.map((trainer) => (
                <tr key={trainer.user_id}>
                  <td>
                    <Link to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}>
                      <img
                        src={
                          trainer.image
                            ? `${localUrl}/${trainer.image}`
                            : "/images/icons/avatar.png"
                        }
                        alt="trainer picture"
                        className={styles["trainer-image"]}
                      />
                    </Link>
                  </td>
                  <td>{trainer.fname}</td>
                  <td>{trainer.lname}</td>
                  <td>{trainer.gender}</td>
                  <td>
                    {
                      trainerExperienceTypes?.find(
                        (type) =>
                          type.trainer_experience_type_id ===
                          trainer.trainer_experience_type_id
                      )?.trainer_experience_type_name
                    }
                  </td>
                  <td>{trainer.price_hour}</td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}
                      className={styles["view-icon"]}
                    >
                      <AiOutlineEye />
                    </Link>
                  </td>
                  {isUserPlayer && (
                    <td>
                      <Link
                        to={paths.LESSON_INVITE}
                        state={{
                          fname: trainer.fname,
                          lname: trainer.lname,
                          image: trainer.image,
                          court_price: "",
                          user_id: trainer.user_id,
                        }}
                        className={styles["lesson-button"]}
                      >
                        Derse davet et
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz kulübe bağlı çalışan eğitmen bulunmamaktadır</p>
        )}
      </div>
    </ReactModal>
  );
};
export default ExploreClubTrainerModal;

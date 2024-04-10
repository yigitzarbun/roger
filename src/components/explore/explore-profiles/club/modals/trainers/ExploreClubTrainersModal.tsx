import React, { useState, useEffect } from "react";

import ReactModal from "react-modal";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { useAppSelector } from "../../../../../../store/hooks";

import { getAge } from "../../../../../../common/util/TimeFunctions";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";

interface ExploreClubTrainersModalProps {
  isTrainersModalOpen: boolean;
  closeTrainersModal: () => void;
  confirmedClubTrainers: any[];
}

const ExploreClubTrainerModal = (props: ExploreClubTrainersModalProps) => {
  const { isTrainersModalOpen, closeTrainersModal, confirmedClubTrainers } =
    props;
  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const [trainerLessonUserId, setTrainerLessonUserId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const handleOpenLessonModal = (trainerLessonUserId: number) => {
    setTrainerLessonUserId(trainerLessonUserId);
    setIsInviteModalOpen(true);
  };
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const {
    data: myFavourites,
    isLoading: isMyFavouritesLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const handleUpdateFavourite = (userId: number) => {
    const selectedFavourite = myFavourites?.find(
      (favourite) => favourite.favouritee_id === userId
    );
    const favouriteData = {
      favourite_id: selectedFavourite.favourite_id,
      registered_at: selectedFavourite.registered_at,
      is_active: selectedFavourite.is_active === true ? false : true,
      favouriter_id: selectedFavourite.favouriter_id,
      favouritee_id: selectedFavourite.favouritee_id,
    };
    updateFavourite(favouriteData);
  };

  const handleToggleFavourite = (userId: number) => {
    if (myFavourites?.find((favourite) => favourite.favouritee_id === userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);
  return (
    <ReactModal
      isOpen={isTrainersModalOpen}
      onRequestClose={closeTrainersModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeTrainersModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>Eğitmenler</h1>
        </div>
        <div className={styles["table-container"]}>
          {confirmedClubTrainers?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Eğitmen</th>
                  <th>İsim</th>
                  <th>Cinsiyet</th>
                  <th>Yaş</th>
                  <th>Tecrübe</th>
                  <th>Ders</th>
                  <th>Öğrenci</th>
                  <th>Fiyat</th>
                  <th>Kulüp</th>
                  <th>Konum</th>
                  {isUserPlayer && <th>Ders</th>}
                </tr>
              </thead>
              <tbody>
                {confirmedClubTrainers?.map((trainer) => (
                  <tr key={trainer.user_id} className={styles["trainer-row"]}>
                    <td>
                      {myFavourites?.find(
                        (favourite) =>
                          favourite.favouritee_id === trainer.trainerUserId &&
                          favourite.is_active === true
                      ) && trainer.trainerUserId !== user?.user?.user_id ? (
                        <AiFillStar
                          onClick={() =>
                            handleToggleFavourite(trainer.trainerUserId)
                          }
                          className={styles["remove-fav-icon"]}
                        />
                      ) : (
                        trainer.trainerUserId !== user?.user?.user_id &&
                        !myFavourites?.find(
                          (favourite) =>
                            favourite.favouritee_id === trainer.trainerUserId &&
                            favourite.is_active === true
                        ) && (
                          <AiOutlineStar
                            onClick={() =>
                              handleToggleFavourite(trainer.trainerUserId)
                            }
                            className={styles["add-fav-icon"]}
                          />
                        )
                      )}
                    </td>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                      >
                        <img
                          src={
                            trainer.trainerImage
                              ? `${localUrl}/${trainer.trainerImage}`
                              : "/images/icons/avatar.jpg"
                          }
                          alt="trainer picture"
                          className={styles["trainer-image"]}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                        className={styles["trainer-name"]}
                      >
                        {`${trainer.fname} ${trainer.lname}`}
                      </Link>
                    </td>
                    <td>{trainer.gender}</td>
                    <td>{getAge(trainer.birth_year)}</td>
                    <td>{trainer?.trainer_experience_type_name}</td>
                    <td>{trainer.lessoncount}</td>
                    <td>{trainer.studentcount}</td>
                    <td>{trainer.price_hour} TL</td>
                    <td>{trainer.club_name}</td>
                    <td>{trainer.location_name}</td>
                    {isUserPlayer && (
                      <td>
                        <button
                          onClick={() =>
                            handleOpenLessonModal(trainer.trainerUserId)
                          }
                          className={styles["lesson-button"]}
                        >
                          Derse davet et
                        </button>
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
      </div>
      {isInviteModalOpen && (
        <LessonInviteFormModal
          opponentUserId={trainerLessonUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
    </ReactModal>
  );
};
export default ExploreClubTrainerModal;

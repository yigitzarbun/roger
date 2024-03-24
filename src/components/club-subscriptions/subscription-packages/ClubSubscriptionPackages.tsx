import React, { useState } from "react";

import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";
import EditSubscriptionPackageModal from "./edit-subscription-package-modal/EditSubscriptionPackageModal";
import PageLoading from "../../../components/loading/PageLoading";

import {
  useGetClubSubscriptionPackageDetailsQuery,
  useGetClubSubscriptionPackagesByFilterQuery,
} from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useAppSelector } from "../../../store/hooks";
import { useGetClubByClubIdQuery } from "../../../api/endpoints/ClubsApi";

const ClubSubscriptionPackages = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(user?.clubDetails?.club_id);
  const [selectedSubscriptionPackage, setSelectedSubscriptionPackage] =
    useState(null);

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { data: mySubscribers, isLoading: isMySubscribersLoading } =
    useGetClubSubscriptionsByFilterQuery({
      is_active: true,
      club_id: user?.user?.user_id,
    });

  const { data: myPackages, isLoading: isMyPackagesLoading } =
    useGetClubSubscriptionPackageDetailsQuery({
      clubId: user?.user?.user_id,
    });

  const [openEditPackageModal, setOpenEditPackageModal] = useState(false);

  const openEditClubSubscriptionPackageModal = (subscriptionPackage) => {
    setOpenEditPackageModal(true);
    setSelectedSubscriptionPackage(subscriptionPackage);
  };

  const closeEditClubSubscriptionPackageModal = () => {
    setOpenEditPackageModal(false);
  };

  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  const openAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(true);
  };
  const closeAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(false);
  };

  if (
    isClubSubscriptionTypesLoading ||
    isMySubscribersLoading ||
    isMyPackagesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div>
      <ClubSubscriptionPackagesResults
        openEditClubSubscriptionPackageModal={
          openEditClubSubscriptionPackageModal
        }
        openAddClubSubscriptionPackageModal={
          openAddClubSubscriptionPackageModal
        }
        closeAddClubSubscriptionPackageModal={
          closeAddClubSubscriptionPackageModal
        }
        openAddPackageModal={openAddPackageModal}
        myPackages={myPackages}
        mySubscribers={mySubscribers}
        subscriptionTypes={clubSubscriptionTypes}
        selectedClub={selectedClub}
      />

      <EditSubscriptionPackageModal
        openEditPackageModal={openEditPackageModal}
        closeEditClubSubscriptionPackageModal={
          closeEditClubSubscriptionPackageModal
        }
        selectedSubscriptionPackage={selectedSubscriptionPackage}
        clubSubscriptionTypes={clubSubscriptionTypes}
      />
    </div>
  );
};
export default ClubSubscriptionPackages;

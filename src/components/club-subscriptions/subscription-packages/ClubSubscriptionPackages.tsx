import React, { useState } from "react";

import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";
import EditSubscriptionPackageModal from "./edit-subscription-package-modal/EditSubscriptionPackageModal";
import PageLoading from "../../../components/loading/PageLoading";

import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useAppSelector } from "../../../store/hooks";

const ClubSubscriptionPackages = () => {
  const user = useAppSelector((store) => store?.user?.user);

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
    useGetClubSubscriptionPackagesByFilterQuery({
      is_active: true,
      club_id: user?.user?.user_id,
    });

  const [openEditPackageModal, setOpenEditPackageModal] = useState(false);

  const [clubSubscriptionPackageId, setClubSubscriptionPackageId] =
    useState(null);

  const openEditClubSubscriptionPackageModal = (value: number) => {
    setClubSubscriptionPackageId(null);
    setOpenEditPackageModal(true);
    setClubSubscriptionPackageId(value);
    setSelectedSubscriptionPackage(
      myPackages?.find(
        (subscriptionPackage) =>
          subscriptionPackage.club_subscription_package_id === value
      )
    );
  };

  const closeEditClubSubscriptionPackageModal = () => {
    setClubSubscriptionPackageId(null);
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
      />

      <EditSubscriptionPackageModal
        openEditPackageModal={openEditPackageModal}
        closeEditClubSubscriptionPackageModal={
          closeEditClubSubscriptionPackageModal
        }
        clubSubscriptionPackageId={clubSubscriptionPackageId}
        selectedSubscriptionPackage={selectedSubscriptionPackage}
        clubSubscriptionTypes={clubSubscriptionTypes}
      />
    </div>
  );
};
export default ClubSubscriptionPackages;

import React, { useState } from "react";

import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";
import EditSubscriptionPackageModal from "./edit-subscription-package-modal/EditSubscriptionPackageModal";
import PageLoading from "../../../components/loading/PageLoading";

import { useGetClubSubscriptionPackagesQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";

const ClubSubscriptionPackages = () => {
  const [selectedSubscriptionPackage, setSelectedSubscriptionPackage] =
    useState(null);

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const [openEditPackageModal, setOpenEditPackageModal] = useState(false);

  const [clubSubscriptionPackageId, setClubSubscriptionPackageId] =
    useState(null);

  const openEditClubSubscriptionPackageModal = (value: number) => {
    setClubSubscriptionPackageId(null);
    setOpenEditPackageModal(true);
    setClubSubscriptionPackageId(value);
    setSelectedSubscriptionPackage(
      clubSubscriptionPackages?.find(
        (subscriptionPackage) =>
          subscriptionPackage.club_subscription_package_id === value
      )
    );
  };
  const closeEditClubSubscriptionPackageModal = () => {
    setClubSubscriptionPackageId(null);
    setOpenEditPackageModal(false);
  };

  if (isClubSubscriptionPackagesLoading) {
    return <PageLoading />;
  }
  return (
    <div>
      <ClubSubscriptionPackagesResults
        openEditClubSubscriptionPackageModal={
          openEditClubSubscriptionPackageModal
        }
      />

      <EditSubscriptionPackageModal
        openEditPackageModal={openEditPackageModal}
        closeEditClubSubscriptionPackageModal={
          closeEditClubSubscriptionPackageModal
        }
        clubSubscriptionPackageId={clubSubscriptionPackageId}
        selectedSubscriptionPackage={selectedSubscriptionPackage}
      />
    </div>
  );
};
export default ClubSubscriptionPackages;

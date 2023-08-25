import React, { useState } from "react";

import AddClubSubscriptionPackageButton from "./add-subscription-package-button/AddClubSubscriptionPackageButton";
import AddSubscriptionPackageModal from "./add-subscription-package-modal/AddSubscriptionPackageModal";
import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";
import EditSubscriptionPackageModal from "./edit-subscription-package-modal/EditSubscriptionPackageModal";

import { useGetClubSubscriptionPackagesQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";

const ClubSubscriptionPackages = () => {
  const [selectedSubscriptionPackage, setSelectedSubscriptionPackage] =
    useState(null);

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});
  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  const openAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(true);
  };
  const closeAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(false);
  };

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

  return (
    <div>
      <AddClubSubscriptionPackageButton
        openAddClubSubscriptionPackageModal={
          openAddClubSubscriptionPackageModal
        }
      />
      <ClubSubscriptionPackagesResults
        openEditClubSubscriptionPackageModal={
          openEditClubSubscriptionPackageModal
        }
      />
      <AddSubscriptionPackageModal
        openAddPackageModal={openAddPackageModal}
        closeAddClubSubscriptionPackageModal={
          closeAddClubSubscriptionPackageModal
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

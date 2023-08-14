import React, { useState } from "react";

import AddClubSubscriptionPackageButton from "./add-subscription-package-button/AddClubSubscriptionPackageButton";
import AddSubscriptionPackageModal from "./add-subscription-package-modal/AddSubscriptionPackageModal";
import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";
import EditSubscriptionPackageModal from "./edit-subscription-package-modal/EditSubscriptionPackageModal";

const ClubSubscriptionPackages = () => {
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
      />
    </div>
  );
};
export default ClubSubscriptionPackages;

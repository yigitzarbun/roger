import React, { useState } from "react";

import AddClubSubscriptionPackageButton from "./add-subscription-package-button/AddClubSubscriptionPackageButton";
import AddSubscriptionPackageModal from "./add-subscription-package-modal/AddSubscriptionPackageModal";
import ClubSubscriptionPackagesResults from "./results/ClubSubscriptionPackagesResults";

const ClubSubscriptionPackages = () => {
  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  const openAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(true);
  };
  const closeAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(false);
  };

  return (
    <div>
      <AddClubSubscriptionPackageButton
        openAddClubSubscriptionPackageModal={
          openAddClubSubscriptionPackageModal
        }
      />
      <ClubSubscriptionPackagesResults />
      <AddSubscriptionPackageModal
        openAddPackageModal={openAddPackageModal}
        closeAddClubSubscriptionPackageModal={
          closeAddClubSubscriptionPackageModal
        }
      />
    </div>
  );
};
export default ClubSubscriptionPackages;

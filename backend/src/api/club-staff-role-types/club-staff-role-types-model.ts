const db = require("../../data/dbconfig");

const clubStaffRoleTypesModel = {
  async getAll() {
    const clubStaffRoleTypes = await db("club_staff_role_types");
    return clubStaffRoleTypes;
  },
};

export default clubStaffRoleTypesModel;

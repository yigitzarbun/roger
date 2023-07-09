import playersModel from "../players/players-model";

/*
const credentialsExist = (req, res, next) => {
  const {
    birth_year,
    body_image,
    club_preference_1_id,
    club_preference_2_id,
    club_preference_3_id,
    email,
    face_image,
    fname,
    gender_id,
    level_id,
    lname,
    password,
    registry_date,
    user_type,
  } = req.body;
  if (
    !birth_year ||
    !body_image ||
    !club_preference_1_id ||
    !club_preference_2_id ||
    !club_preference_3_id ||
    !email ||
    !face_image ||
    !fname ||
    !gender_id ||
    !level_id ||
    !lname ||
    !password ||
    !registry_date ||
    !user_type
  ) {
    res.status(400).json({ message: "Required fields are missing" });
  } else {
    next();
  }
};
*/

const emailUnique = async (req, res, next) => {
  const { email } = req.body;
  const emailExist = await playersModel.getByFilter({ email });
  if (emailExist) {
    res.status(400).json({ message: "Email is already registered" });
  } else {
    next();
  }
};

const emailExists = async (req, res, next) => {
  const { email } = req.body;
  const emailExists = await playersModel.getByFilter({ email });
  if (!emailExists) {
    res.status(400).json({ message: "Invalid credentials" });
  } else {
    next();
  }
};

const loginCredentialsExist = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Invalid credentials" });
  } else {
    next();
  }
};
module.exports = {
  //credentialsExist,
  emailUnique,
  emailExists,
  loginCredentialsExist,
};

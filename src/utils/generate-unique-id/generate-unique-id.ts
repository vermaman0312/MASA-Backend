import UserCredential from "../../models/users-model/user-credential/user-credential.model";

export const generateUniqueId = async (
  role: string,
  department: string
): Promise<string> => {
  let userUniqueIdPrefix = "";
  const CEPREFIXSTUDENT = "SOECE";
  const CVPREFIXSTUDENT = "SOECV";
  const ECPREFIXSTUDENT = "SOEEC";
  const ITPREFIXSTUDENT = "SOEIT";
  const EEPREFIXSTUDENT = "SOEEE";
  const BAPREFIXSTUDENT = "SOMBA";
  const MBAPREFIXSTUDENT = "SOMMBA";

  const SOEEMPLOYEEPREFIX = "SOEEMP";
  const SOMEMPLOYEEPREFIX = "SOMEMP";
  const MAINEMPLOYEEPREFIX = "RKEMP";

  if (role === "student") {
    switch (department) {
      case "CE":
        userUniqueIdPrefix = CEPREFIXSTUDENT;
        break;
      case "CV":
        userUniqueIdPrefix = CVPREFIXSTUDENT;
        break;
      case "EC":
        userUniqueIdPrefix = ECPREFIXSTUDENT;
        break;
      case "IT":
        userUniqueIdPrefix = ITPREFIXSTUDENT;
        break;
      case "EE":
        userUniqueIdPrefix = EEPREFIXSTUDENT;
        break;
      case "BA":
        userUniqueIdPrefix = BAPREFIXSTUDENT;
        break;
      case "MBA":
        userUniqueIdPrefix = MBAPREFIXSTUDENT;
        break;
    }
  } else {
    switch (department) {
      case "SOE":
        userUniqueIdPrefix = SOEEMPLOYEEPREFIX;
        break;
      case "SOM":
        userUniqueIdPrefix = SOMEMPLOYEEPREFIX;
        break;
      default:
        userUniqueIdPrefix = MAINEMPLOYEEPREFIX;
        break;
    }
  }

  const allUserUniqueId = await UserCredential.find({})
    .sort({ userUniqueId: -1 })
    .limit(1)
    .exec();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const lastTwoDigits = currentYear.toString().slice(-2);

  let newIdNumber = 1;
  if (allUserUniqueId.length > 0) {
    const lastId = allUserUniqueId[0].userUniqueId;
    const lastIdNumber = parseInt(
      lastId.replace(userUniqueIdPrefix, "").slice(2),
      10
    ); // Remove the year and prefix
    newIdNumber = lastIdNumber + 1;
  }

  let newUserUniqueId = `${lastTwoDigits}${userUniqueIdPrefix}${newIdNumber.toString().padStart(3, "0")}`;

  // Check for uniqueness and increment if necessary
  while (await UserCredential.findOne({ userUniqueId: newUserUniqueId })) {
    newIdNumber++;
    newUserUniqueId = `${lastTwoDigits}${userUniqueIdPrefix}${newIdNumber.toString().padStart(3, "0")}`;
  }

  return newUserUniqueId;
};

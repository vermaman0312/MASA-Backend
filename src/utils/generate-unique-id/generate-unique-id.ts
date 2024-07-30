export const generateUniqueId = async (
  role: string,
  department: string
): Promise<string> => {
  const CEPREFIXSTUDENT = "SOECE";
  const CVPREFIXSTUDENT = "SOECV";
  const ECPREFIXSTUDENT = "SOEEC";
  const ITPREFIXSTUDENT = "SOEIT";
  const EEPREFIXSTUDENT = "SOEEE";
  const BAPREFIXSTUDENT = "SOMBA";
  const MBAPREFIXSTUDENT = "SOMMBA";

  const SOEEMPLOYEEPREFIX = "SOEEMP";
  const SOMEMPLOYEEPREFIX = "SOMEMP";

  let studentId: string;
  if (role === "student") {
    if (department === "SOE") {
      studentId = CEPREFIXSTUDENT;
      return studentId;
    } else if (department === "") {
        
    }
  } else {
  }

  return "";
};

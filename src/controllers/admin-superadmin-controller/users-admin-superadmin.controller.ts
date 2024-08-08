import { Request, RequestHandler, Response } from "express";
import { TUserCredentialInterface } from "../../models/users-model/user-credential/TType";
import UserCredential from "../../models/users-model/user-credential/user-credential.model";
import UserDevice from "../../models/users-model/user-device/user-device.model";
import UserProfileImage from "../../models/users-model/user-profile-image/user-profile-image.model";
import UserRole from "../../models/users-model/user-role/user-role.model";
import { decodeToken, generateToken } from "../../utils/Token/Token.Util";
import EmployeeDetails from "../../models/users-model/employee-details/employee-details/employee-details.model";
import EmployeeOfficialDetails from "../../models/users-model/employee-details/employee-official-details/employee-official-details.model";
import { generateUniqueId } from "../../utils/generate-unique-id/generate-unique-id";
import { TEmployeeDetailsInterface } from "../../models/users-model/employee-details/employee-details/TType";
import { TEmployeeOfficialDetailInterface } from "../../models/users-model/employee-details/employee-official-details/TType";
import { generateRandomPassword } from "../../utils/generate-password/generate-password.util";
import { TStudentDetailsInterface } from "../../models/users-model/student-details/student-details/TType";
import { TStudetOfficialDetailsInterface } from "../../models/users-model/student-details/student-official-details/TType";
import StudentDetails from "../../models/users-model/student-details/student-details/student-details-model";
import StudentOfficialDetails from "../../models/users-model/student-details/student-official-details/student-official-details.model";
import { TUserRoleInterface } from "../../models/users-model/user-role/TType";
import UserPrivacy from "../../models/users-model/user-privacy/user-privacy.model";

// Super-admin registration
export const superAdminRegistration: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unknown Api call!!!",
      });
    }
    const { userEmailAddress, userPassword } =
      req.body as TUserCredentialInterface;
    if (!userEmailAddress || !userPassword) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field!!!",
      });
    }
    const user = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (user) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "User already exist!!!",
      });
    }
    const newUserObject = new UserCredential({
      userUniqueId: await generateUniqueId("isAdmin", "RK"),
      userEmailAddress: userEmailAddress,
      userPassword: userPassword,
      userCountryCode: null,
      userPhoneNumber: null,
      accountActivated: true,
    });
    const registeredUser = await newUserObject.save();
    if (!registeredUser) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    const userdetails = new EmployeeDetails({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userdevice = new UserDevice({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userorganization = new EmployeeOfficialDetails({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userprofileimage = new UserProfileImage({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const userrole = new UserRole({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
      isSuperAdmin: true,
    });
    const userPrivacy = new UserPrivacy({
      userId: registeredUser._id,
      userUniqueId: registeredUser.userUniqueId,
    });
    const savedata = await Promise.all([
      userdetails.save(),
      userdevice.save(),
      userorganization.save(),
      userprofileimage.save(),
      userrole.save(),
      userPrivacy.save(),
    ]);
    if (!savedata) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    return res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Registered successful!!!",
      Data: generateToken(String(registeredUser._id)),
    });
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

// Add Employee registration
export const addEmployeeRegistration: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unknown Api call!!!",
      });
    }
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    if (!loggedInUser?.isSuperAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { userEmailAddress, userCountryCode, userPhoneNumber } =
      req.body as TUserCredentialInterface;
    const {
      userFirstName,
      userLastName,
      userGender,
      userDateOfBirth,
      userAddress1,
      userAddress2,
      userCountry,
      userState,
      userPinCode,
    } = req.body as TEmployeeDetailsInterface;
    const { userDepartment, userDesignation, userJoiningDate } =
      req.body as TEmployeeOfficialDetailInterface;
    if (
      !userEmailAddress ||
      !userCountryCode ||
      !userPhoneNumber ||
      !userFirstName ||
      !userLastName ||
      !userGender ||
      !userDateOfBirth ||
      !userAddress1 ||
      !userAddress2 ||
      !userCountry ||
      !userState ||
      !userPinCode ||
      !userDepartment ||
      !userDesignation ||
      !userJoiningDate
    ) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field!!!",
      });
    }
    const existingUser = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (existingUser) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "User already exist!!!",
      });
    }
    const newCredential = new UserCredential({
      userUniqueId: await generateUniqueId("isAdmin", userDepartment),
      userEmailAddress: userEmailAddress,
      userPassword: await generateRandomPassword(8),
      userCountryCode: userCountryCode,
      userPhoneNumber: userPhoneNumber,
      accountActivated: true,
    });
    const registeredEmployee = await newCredential.save();
    if (!registeredEmployee) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    const registeredEmployeeDetails = new EmployeeDetails({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userGender: userGender,
      userDateOfBirth: userDateOfBirth,
      userAddress1: userAddress1,
      userAddress2: userAddress2,
      userCountry: userCountry,
      userState: userState,
      userPinCode: userPinCode,
    });
    const registeredEmployeeOfficialDetails = new EmployeeOfficialDetails({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      userDepartment: userDepartment,
      userDesignation: userDesignation,
      userJoiningDate: userJoiningDate,
    });
    const registeredEmployeeDeviceDetails = new UserDevice({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
    });
    const registeredEmployeeProfileImageDetails = new UserProfileImage({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
    });
    const registeredEmployeeRoleDetails = new UserRole({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
      isEmployee: true,
    });
    const registeredEmployeeUserPrivacy = new UserPrivacy({
      userId: registeredEmployee._id,
      userUniqueId: registeredEmployee.userUniqueId,
    });

    await Promise.all([
      registeredEmployeeDetails.save(),
      registeredEmployeeOfficialDetails.save(),
      registeredEmployeeDeviceDetails.save(),
      registeredEmployeeProfileImageDetails.save(),
      registeredEmployeeRoleDetails.save(),
      registeredEmployeeUserPrivacy.save(),
    ]);
    return res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Registered successful!!!",
    });
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

// Add Student registration
export const addStudentRegistration: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unknown Api call!!!",
      });
    }
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    if (!loggedInUser?.isSuperAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { userEmailAddress, userCountryCode, userPhoneNumber } =
      req.body as TUserCredentialInterface;
    const {
      userFirstName,
      userLastName,
      userGender,
      userDateOfBirth,
      userAddress1,
      userAddress2,
      userCountry,
      userState,
      userPinCode,
      userDocuments,
      userFatherName,
      userMotherName,
      userFatherOccupation,
      userMotherOccupation,
      userLocalGuardianName,
      userBloodGroup,
    } = req.body as TStudentDetailsInterface;
    const { userDepartment, userBranch, userFaculty, userAdmissionDate } =
      req.body as TStudetOfficialDetailsInterface;
    if (
      !userEmailAddress ||
      !userCountryCode ||
      !userPhoneNumber ||
      !userFirstName ||
      !userLastName ||
      !userGender ||
      !userDateOfBirth ||
      !userAddress1 ||
      !userAddress2 ||
      !userCountry ||
      !userState ||
      !userPinCode ||
      !userDocuments ||
      !userFatherName ||
      !userMotherName ||
      !userFatherOccupation ||
      !userMotherOccupation ||
      !userLocalGuardianName ||
      !userBloodGroup ||
      !userDepartment ||
      !userBranch ||
      !userFaculty ||
      !userAdmissionDate
    ) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field!!!",
      });
    }
    const existingUser = await UserCredential.findOne({
      userEmailAddress: userEmailAddress,
    });
    if (existingUser) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "User already exist!!!",
      });
    }
    const newCredential = new UserCredential({
      userUniqueId: await generateUniqueId("isStudent", userDepartment),
      userEmailAddress: userEmailAddress,
      userPassword: await generateRandomPassword(8),
      userCountryCode: userCountryCode,
      userPhoneNumber: userPhoneNumber,
      accountActivated: true,
    });
    const registeredStudent = await newCredential.save();
    if (!registeredStudent) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong!!!",
      });
    }
    const registeredStudentDetails = new StudentDetails({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userGender: userGender,
      userDateOfBirth: userDateOfBirth,
      userAddress1: userAddress1,
      userAddress2: userAddress2,
      userCountry: userCountry,
      userState: userState,
      userPinCode: userPinCode,
      userDocuments: userDocuments,
      userFatherName: userFatherName,
      userMotherName: userMotherName,
      userFatherOccupation: userFatherOccupation,
      userMotherOccupation: userMotherOccupation,
      userLocalGuardianName: userLocalGuardianName,
      userBloodGroup: userBloodGroup,
    });
    const registeredStudentOfficialDetails = new StudentOfficialDetails({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
      userDepartment: userDepartment,
      userBranch: userBranch,
      userFaculty: userFaculty,
      userAdmissionDate: userAdmissionDate,
    });
    const registeredStudentDeviceDetails = new UserDevice({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
    });
    const registeredStudentProfileImageDetails = new UserProfileImage({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
    });
    const registeredStudentRoleDetails = new UserRole({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
      isStudent: true,
    });
    const registeredStudentUserPrivacy = new UserPrivacy({
      userId: registeredStudent._id,
      userUniqueId: registeredStudent.userUniqueId,
    });

    await Promise.all([
      registeredStudentDetails.save(),
      registeredStudentOfficialDetails.save(),
      registeredStudentDeviceDetails.save(),
      registeredStudentProfileImageDetails.save(),
      registeredStudentRoleDetails.save(),
      registeredStudentUserPrivacy.save(),
    ]);
    return res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Registered successful!!!",
    });
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

// All users list
export const allUsersListsWithFilter: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unknown Api call!!!",
      });
    }
    const authorizationData = req.headers.authorization;
    const loggedInUser = await decodeToken(authorizationData as string);
    if (!loggedInUser?.isSuperAdmin) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access!!!",
      });
    }
    const { isStudent, isAdmin, isEmployee, isSuperAdmin } =
      req.body as TUserRoleInterface;

    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    let query = {};

    if (isAdmin || isEmployee || isSuperAdmin || isStudent) {
      query = {
        $or: [
          ...(isAdmin ? [{ isAdmin: isAdmin }] : []),
          ...(isEmployee ? [{ isEmployee: isEmployee }] : []),
          ...(isSuperAdmin ? [{ isSuperAdmin: isSuperAdmin }] : []),
          ...(isStudent ? [{ isStudent: isStudent }] : []),
        ],
      };
    }

    const allUsers = await UserRole.find(query)
      .sort({ $natural: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (!allUsers || allUsers.length < 0) {
      return res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "No user found!!!",
      });
    }
    const userList = await Promise.all(
      allUsers.map(async (user) => {
        const studentDetails = await StudentDetails.findOne({
          userId: user.userId,
        });
        const employeeDetails = await EmployeeDetails.findOne({
          userId: user.userId,
        });
        const userProfileImage = await UserProfileImage.findOne({
          userId: user.userId,
        });
        const userCredentials = await UserCredential.findOne({
          _id: user.userId,
        });
        const employeeOfficialDetails = await EmployeeOfficialDetails.findOne({
          userId: user.userId,
        });
        const studentOfficialDetails = await StudentOfficialDetails.findOne({
          userId: user.userId,
        });

        return {
          userId: user.userId,
          userUniqueId: user.userUniqueId,
          userFirstName: user.isStudent
            ? studentDetails?.userFirstName
            : employeeDetails?.userFirstName,
          userLastName: user.isStudent
            ? studentDetails?.userLastName
            : employeeDetails?.userLastName,
          userProfileImage: userProfileImage?.profileImage.filter(
            (filter) => filter.status
          ),
          userEmailAddress: userCredentials?.userEmailAddress,
          userCountryCode: userCredentials?.userCountryCode,
          userPhoneNumber: userCredentials?.userPhoneNumber,
          userDepartment: user.isStudent
            ? studentOfficialDetails?.userDepartment
            : employeeOfficialDetails?.userDepartment,
          userBranch: user.isStudent
            ? studentOfficialDetails?.userBranch
            : undefined,
          userDesignation: !user.isStudent
            ? employeeOfficialDetails?.userDesignation
            : undefined,
          userFaculty: user.isStudent
            ? studentOfficialDetails?.userFaculty
            : undefined,
          userAdmissionDate: user.isStudent
            ? studentOfficialDetails?.userAdmissionDate
            : undefined,
          userJoiningDate: !user.isStudent
            ? employeeOfficialDetails?.userJoiningDate
            : undefined,
          userRole: user.isAdmin
            ? "admin"
            : user.isSuperAdmin
              ? "superadmin"
              : user.isEmployee
                ? "employee"
                : "student",
        };
      })
    );
    return res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "User list fetched successfully!!!",
      Data: {
        totalPages: Math.ceil(allUsers.length / pageSize),
        currentPage: page,
        users: userList,
      },
    });
  } catch (error) {
    return res.json({
      Type: "Success",
      Success: false,
      Status: 500,
      Message: "Internal server error!!!",
    });
  }
};

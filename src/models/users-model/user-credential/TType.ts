export interface TPasswordType {
  userOldPassword: string;
  userNewPassword: string;
}
export interface TUserCredentialInterface {
  userUniqueId: string;
  userEmailAddress: string | null;
  userPassword: string;
  userCountryCode: number | null;
  userPhoneNumber: number | null;
  accountActivated: boolean;
  accountDeleted: boolean;
  timeStamps: Date;
}

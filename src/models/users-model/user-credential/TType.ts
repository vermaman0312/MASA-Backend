export interface TUserCredentialInterface {
  userUniqueId: string;
  userEmailAddress: string | null;
  userPassword: string;
  userCountryCode: number | null;
  userPhoneNumber: number | null;
  userOtp: string;
  user2FA: boolean;
  accountActivated: boolean;
  accountDeleted: boolean;
  timeStamps: Date;
}

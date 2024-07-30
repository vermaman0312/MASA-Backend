export interface TAsymetricEncryptionModel {
    decryptedMessage: string
    authorizationHeader: string;
}

export interface TAsymetricDecryptionModel {
    encryptedMessage: string
    authorizationHeader: string;
}

export interface TAsymetricResponse {
    data: string
}
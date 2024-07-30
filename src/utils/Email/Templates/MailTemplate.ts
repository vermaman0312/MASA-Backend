import { IMailOptionType } from "../Model/Mail.Option.DataType";

export const registrationSuccessMailTemplate = ({
    userEmailAddress,
    userName,
    link,
}: IMailOptionType) => {
    return {
        from: '"Versa" <versa@demomailtrap.com>',
        to: userEmailAddress,
        subject: "Registration Successful",
        html: `
            <p><img src="{Logo}" alt="Versa Logo" style="max-width: 100%; height: auto;"></p>
            <p>Welcome to Versa!</p><br /><br /><br />
            <p>Hello ${userName},</p>
            <p>Congratulations! Your registration was successful.</p>
            <p>Please click the following link to activate your account:</p>
            <p><a href="${link}">Activate Account</a></p>
            <p>If you did not sign up for an account on Versa, you can ignore this email.</p>
            <p>Thank you,</p>
            <p>The Versa Team</p>
        `,
    };
};

export const resetPasswordMailTemplate = () => {
    return {

    }
}

export const forgotPasswordMailTemplate = () => {
    return {

    }
}

export const otpSendMailTemplate = () => {
    return {

    }
}

export const friendRequestMailTemplate = () => {
    return {

    }
}

export const friendRequestAcceptMailTemplate = () => {
    return {

    }
}

export const messageMailTemplate = () => {
    return {

    }
}

export const followSendMailTemplate = () => {
    return {

    }
}

export const followAcceptMailTemplate = () => {
    return {

    }
}

export const likeMailTemplate = () => {
    return {

    }
}

export const dislikeMailTemplate = () => {
    return {

    }
}

export const commentMailTemplate = () => {
    return {

    }
}

export const accountBlockMailTemplate = () => {
    return {

    }
}

export const unBlockAccountMailTemplate = () => {
    return {

    }
}

export const verifyAccountMailTemplate = () => {
    return {

    }
}

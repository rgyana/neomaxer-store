export const AuthenticationApi = {
    REFRESH_TOKEN_API: `/auth/refreshtoken`,

    HAS_USER_API: (mobile: string) => `/authentication/has-user?mobile=${mobile}`,

    AUTHENTICATION_LOGIN_API: '/auth/authenticate',

    SEND_OTP_API: '/auth/send/otp',

    VERIFY_OTP_API: '/auth/verify/otp',

    RESEND_OTP_API: (mobile: string) => `/auth/resend/otp/${mobile}`,

    SET_PASSWORD_API: '/authentication/set/password',

    RESET_PASSWORD_API: (mobile: string) => `/auth/resetPassword?username=${mobile}`,

    SAVE_PASSWORD_API: `/auth/savePassword`,
}
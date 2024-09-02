export type DiarizationStatus =
    | 'processing'
    | 'processed';
export type DiarizationFlag =
    | 'L' // Label
    | 'S'; // Segment



export interface GoogleUser {
    email: string;
    name: string;
    picture: string;
}

export interface UserTokens {
    accessToken: string;
    refreshToken: string;
}



export const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
export const COOKIE_ACCESS_TOKEN = 'PSPD_AT';
export const COOKIE_REFRESH_TOKEN = 'PSPD_RT';
export const COOKIE_UNAUTH_USER = 'PSPD_UA';


export const DIARIZATION_ENDPOINT = process.env.DIARIZATION_ENDPOINT!;
export const API_ENDPOINT = process.env.API_ENDPOINT!;

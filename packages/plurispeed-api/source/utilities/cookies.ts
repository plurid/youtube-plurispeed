import type {
    Request,
    Response,
} from 'express';

import {
    UserTokens,

    COOKIE_ACCESS_TOKEN,
    COOKIE_REFRESH_TOKEN,
    COOKIE_UNAUTH_USER,
    ONE_YEAR,
} from '@/source/data';



export const setAuthCookies = (
    response: Response,
    tokens: UserTokens,
) => {
    response.cookie(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ONE_YEAR,
    });
    response.cookie(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ONE_YEAR,
    });
}


export const clearAuthCookies = (
    response: Response,
) => {
    response.clearCookie(COOKIE_UNAUTH_USER);
    response.clearCookie(COOKIE_ACCESS_TOKEN);
    response.clearCookie(COOKIE_REFRESH_TOKEN);
}


export const getAuthCookies = (
    request: Request,
): UserTokens => {
    const accessToken = request.cookies[COOKIE_ACCESS_TOKEN] || '';
    const refreshToken = request.cookies[COOKIE_REFRESH_TOKEN] || '';

    return {
        accessToken,
        refreshToken,
    };
}

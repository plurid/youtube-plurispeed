import type {
    Request,
    Response,
} from 'express';

import {
    eq,
} from 'drizzle-orm';

import { v4 as uuid } from 'uuid';

import {
    UserTokens,
    GoogleUser,

    COOKIE_UNAUTH_USER,
    ONE_YEAR,
} from '@/source/data';

import database from '@/source/database';
import {
    users,
} from '@/source/database/schema/users';

import newGoogleClient from '@/source/services/google';

import {
    setAuthCookies,
    getAuthCookies,
    clearAuthCookies,
} from '@/source/utilities/cookies';



function generateUnauthID(): string {
    return 'UA' + uuid().replace(/-/g, '');
}


export const getGoogleUser = async (
    tokens: UserTokens,
    response?: Response,
): Promise<GoogleUser | null> => {
    const googleClient = newGoogleClient();
    googleClient.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
    });

    let result: any = null;

    try {
        result = await googleClient.getTokenInfo(tokens.accessToken);
    } catch (error) {
        result = await new Promise((resolve, _reject) => {
            googleClient.refreshAccessToken(async (error, tokens) => {
                if (error
                    || !tokens
                    || !tokens.access_token
                    || !tokens.refresh_token
                ) {
                    resolve(null);
                    return;
                }

                if (response) {
                    setAuthCookies(response, {
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                    });
                }

                const data = await googleClient.getTokenInfo(tokens.access_token);
                resolve(data);
            });
        });
    }

    return result;
}


export const getTokensUser = async (
    request: Request,
    response: Response,
): Promise<string | GoogleUser | null> => {
    const tokens = getAuthCookies(request);

    if (!tokens.accessToken || !tokens.refreshToken) {
        const unauthUserID = request.cookies[COOKIE_UNAUTH_USER] || generateUnauthID();

        clearAuthCookies(response);

        response.cookie(COOKIE_UNAUTH_USER, unauthUserID, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ONE_YEAR,
        });

        return unauthUserID;
    }

    const user = await getGoogleUser(tokens, response);

    return user;
}


export const getDatabaseUser = async (
    user: any,
) => {
    return await database.query.users.findFirst({
        where: eq(users.email, user.email),
    });
}

import type {
    Request,
    Response,
} from 'express';

import {
    jwtDecode,
} from 'jwt-decode';

import {
    eq,
} from 'drizzle-orm';

import database from '@/source/database';
import {
    users,
} from '@/source/database/schema/users';

import {
    NewUser,
} from '@/source/models/user';

import newGoogleClient from '@/source/services/google';

import {
    logger,
} from '@/source/utilities';

import {
    setAuthCookies,
    clearAuthCookies,
} from '@/source/utilities/cookies';



export default async function handler(
    request: Request,
    response: Response,
) {
    try {
        const googleClient = newGoogleClient();
        const { tokens } = await googleClient.getToken(request.body.code);
        const decoded: any = jwtDecode(tokens.id_token || '');

        if (!tokens.access_token || !tokens.refresh_token) {
            response.status(400).json({
                status: false,
            });
            return;
        }

        const {
            email,
            name,
            picture,
        } = decoded;


        clearAuthCookies(response);
        setAuthCookies(response, {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        });

        const databaseUser = await database.query.users.findFirst({
            where: eq(users.email, email),
        });
        const newUser = NewUser(
            email,
            name,
            picture,
        );
        if (!databaseUser) {
            await database.insert(users).values({
                ...newUser,
            });
        }

        const user = databaseUser || newUser;


        response.json({
            status: true,
            data: {
                ...user,
            },
        });
    } catch (error) {
        logger('error', error);

        response.status(500).json({
            status: false,
        });
    }
}

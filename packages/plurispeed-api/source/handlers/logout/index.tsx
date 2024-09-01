import type {
    Request,
    Response,
} from 'express';

import {
    logger,
} from '@/source/utilities';

import {
    clearAuthCookies,
} from '@/source/utilities/cookies';



export default async function handler(
    _request: Request,
    response: Response,
) {
    try {
        clearAuthCookies(response);

        response.json({
            status: true,
        });
    } catch (error) {
        logger('error', error);

        response.status(500).json({
            status: false,
        });
    }
}

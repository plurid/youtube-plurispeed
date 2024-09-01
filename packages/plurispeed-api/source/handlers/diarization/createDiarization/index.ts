import type {
    Request,
    Response,
} from 'express';

import { v4 as uuid } from 'uuid';

import {
    APICreateDiarization,
} from '@/source/data/api';

import database from '@/source/database';
import {
    diarizations,
} from '@/source/database/schema/diarizations';

import {
    getTokensUser,
} from '@/source/logic/user';

import {
    logger,
} from '@/source/utilities';



export default async function handler(
    request: Request,
    response: Response,
) {
    try {
        const {
            url,
            data,
        } = APICreateDiarization.parse(request.body);


        // const tokensUser = await getTokensUser(request, response);
        // if (!tokensUser) {
        //     logger('warn', 'User not found');

        //     response.status(404).json({
        //         status: false,
        //     });
        //     return;
        // }


        const id = uuid();
        const createdAt = new Date().toISOString();
        const createdBy = 'system';

        await database.insert(diarizations).values({
            id,
            createdBy,
            createdAt,
            url,
            data: JSON.stringify(data),
        });


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

import type {
    Request,
    Response,
} from 'express';

import { eq } from 'drizzle-orm';

import {
    APIFlagDiarization,
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
            id,
            flag,
        } = APIFlagDiarization.parse(request.body);


        // const tokensUser = await getTokensUser(request, response);
        // if (!tokensUser) {
        //     logger('warn', 'User not found');

        //     response.status(404).json({
        //         status: false,
        //     });
        //     return;
        // }


        const diarization = await database
            .query
            .diarizations
            .findFirst({
                where: eq(diarizations.id, id),
            });
        if (!diarization) {
            response.status(404).json({
                status: false,
            });
            return;
        }

        await database
            .update(diarizations)
            .set({
                flags: JSON.stringify([
                    ...JSON.parse(diarization.flags),
                    flag,
                ]),
            })
            .where(
                eq(diarizations.id, diarization.id),
            );


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

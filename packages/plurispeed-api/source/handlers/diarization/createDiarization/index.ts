import type {
    Request,
    Response,
} from 'express';

import { eq } from 'drizzle-orm';

import {
    APICreateDiarization,
} from '@/source/data/api';

import database from '@/source/database';
import {
    diarizations,
} from '@/source/database/schema/diarizations';

import {
    NewDiarization,
} from '@/source/models/diarization';

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


        const parsedURL = new URL(url);
        if (parsedURL.hostname === 'localhost') {
            response.status(400).json({
                status: false,
            });
            return;
        }

        const diarization = await database
            .query
            .diarizations
            .findFirst({
                where: eq(diarizations.url, url),
            });
        if (!diarization) {
            const newDiarization = NewDiarization(url);

            await database.insert(diarizations).values({
                ...newDiarization,
                data: JSON.stringify(data),
                status: 'processed',
            });

            response.json({
                status: true,
            });
            return;
        }

        if (diarization.status === 'processing') {
            await database
                .update(diarizations)
                .set({
                    data: JSON.stringify(data),
                    status: 'processed',
                })
                .where(
                    eq(diarizations.id, diarization.id),
                );

            return;
        }

        // Already existing.
        response.status(409).json({
            status: false,
        });
    } catch (error) {
        logger('error', error);

        response.status(500).json({
            status: false,
        });
    }
}

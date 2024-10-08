import type {
    Request,
    Response,
} from 'express';

import { eq } from 'drizzle-orm';

import {
    APIRequestDiarization,
} from '@/source/data/api';

import {
    DIARIZATION_ENDPOINT,
    API_ENDPOINT,
} from '@/source/data';

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
        } = APIRequestDiarization.parse(request.body);


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
                where: eq(diarizations.url, url),
            });
        if (diarization) {
            response.status(409).json({
                status: false,
            });
            return;
        }


        const newDiarization = NewDiarization(url);
        await database.insert(diarizations).values({
            ...newDiarization,
        });


        const diarizationRequest = await fetch(DIARIZATION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                webhook: API_ENDPOINT + '/create-diarization',
            }),
        });
        const diarizationResponse: any = await diarizationRequest.json();


        response.json({
            status: diarizationResponse.status,
        });
    } catch (error) {
        logger('error', error);

        response.status(500).json({
            status: false,
        });
    }
}

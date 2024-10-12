import type {
    Request,
    Response,
} from 'express';

import { eq } from 'drizzle-orm';

import {
    APIGetDiarization,
    TypeAPIGetDiarizationResponse,
} from '@/source/data/api';

import database from '@/source/database';
import {
    diarizations,
} from '@/source/database/schema/diarizations';

import {
    logger,
} from '@/source/utilities';



export default async function handler(
    request: Request,
    response: Response<TypeAPIGetDiarizationResponse>,
) {
    try {
        const {
            url,
        } = APIGetDiarization.parse(request.body);


        const diarization = await database
            .query
            .diarizations
            .findFirst({
                where: eq(diarizations.url, url),
            });

        if (!diarization) {
            response.status(404).json({
                status: false,
            });
            return;
        }

        if (diarization.status === 'processing') {
            response.json({
                status: true,
            });
            return;
        }

        response.json({
            status: true,
            data: JSON.parse(diarization.data),
        });
    } catch (error) {
        logger('error', error);

        response.status(500).json({
            status: false,
        });
    }
}

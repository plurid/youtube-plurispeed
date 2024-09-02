import { v4 as uuid } from 'uuid';

import {
    Diarization,
} from '@/source/database/schema/diarizations';



export const NewDiarization = (
    url: string,
): Diarization => ({
    id: uuid(),
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    url,
    data: JSON.stringify({
        labels: [],
        segments: [],
    }),
    status: 'processing',
    flags: JSON.stringify([]),
});

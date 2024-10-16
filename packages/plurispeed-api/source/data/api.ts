import { z } from 'zod';



export const DiarizationData = z.object({
    labels: z.array(z.string()),
    segments: z.array(
        z.tuple([
            z.number(), // speaker
            z.number(), // start
            z.number(), // end
            z.number(), // word count
        ]),
    ),
    wpmIntervals: z.array(
        z.number(),
    ),
}).strict();

const url = z.string().trim().url();


export const APIGetDiarization = z.object({
    url,
}).strict();

export const APIGetDiarizationResponse = z.object({
    status: z.boolean(),
    /**
     * status: false -> no diarization
     * status: true, data undefined -> diarization processing
     * status: true, data defined -> diarization processed
     */
    data: DiarizationData.optional(),
}).strict();

export type TypeAPIGetDiarizationResponse = z.infer<typeof APIGetDiarizationResponse>;

export const APICreateDiarization = z.object({
    url,
    data: DiarizationData,
}).strict();

export const APIRequestDiarization = z.object({
    url,
}).strict();

export const APIFlagDiarization = z.object({
    id: z.string(),
    // Label or Segment flag
    flag: z.literal('L').or(z.literal('S')),
}).strict();

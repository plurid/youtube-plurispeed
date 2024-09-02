import { z } from 'zod';



export const DiarizationData = z.object({
    labels: z.array(z.string()),
    segments: z.array(
        z.tuple([
            z.number(), // speaker
            z.number(), // start
            z.number()  // end
        ]),
    ),
}).strict();

const url = z.string().url();


export const APIGetDiarization = z.object({
    url,
}).strict();

export const APIGetDiarizationResponse = z.object({
    status: z.boolean(),
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

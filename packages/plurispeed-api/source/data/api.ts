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


export const APIGetDiarization = z.object({
    url: z.string(),
}).strict();

export const APIGetDiarizationResponse = z.object({
    status: z.boolean(),
    data: DiarizationData.optional(),
}).strict();

export type TypeAPIGetDiarizationResponse = z.infer<typeof APIGetDiarizationResponse>;

export const APICreateDiarization = z.object({
    url: z.string(),
    data: DiarizationData,
}).strict();

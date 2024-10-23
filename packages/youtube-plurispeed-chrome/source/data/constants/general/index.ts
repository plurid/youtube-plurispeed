// #region imports
    // #region external
    import {
        Options,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const IN_PRODUCTION = process.env.NODE_ENV === 'production';

export const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:9090';



export const defaultOptions: Options = {
    embeddedButton: true,
};


export const OPTIONS_KEY = 'youtubePluriSpeedOptions';


export const MESSAGE = {
    TOGGLE: 'TOGGLE',
    GET_STATE: 'GET_STATE',
    DATA: 'DATA',
    GET_DATA: 'GET_DATA',
    REQUEST_DIARIZATION: 'REQUEST_DIARIZATION',
    REQUEST_LABELS_CHECK: 'REQUEST_LABELS_CHECK',
    BG_P_DATA: 'DATA',
    BG_P_NO_DATA: 'NO_DATA',
    BG_P_PROCESSING: 'PROCESSING',
    UPDATE_SPEAKERS: 'UPDATE_SPEAKERS',
    UPDATE_SPEECH_SPEED: 'UPDATE_SPEECH_SPEED',
} as const;


export const SPEAKER = {
    SPEECHLESS: -2,
    OVERLAP: -1,
} as const;
// #endregion module

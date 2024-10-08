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
    BG_P_DATA: 'DATA',
    UPDATE_SPEAKERS: 'UPDATE_SPEAKERS',
} as const;


export const SPEAKER = {
    SPEECH_GAP: -2,
    OVERLAP: -1,
} as const;
// #endregion module

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
// #endregion module

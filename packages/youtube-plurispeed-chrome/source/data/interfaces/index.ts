// #region exports
export interface Options {
    embeddedButton: boolean;
};

export type Speaker = {
    id: number;
    name: string;
    speed: number;
}

export type SpeakersData = {
    labels: string[];
    // speaker ID = -2 => speech gap
    // speaker ID = -1 => overlap
    // speaker ID >= 0 => speaker ID
    // speaker ID, start, stop, word count
    segments: [number, number, number, number][];
}
// #endregion exports

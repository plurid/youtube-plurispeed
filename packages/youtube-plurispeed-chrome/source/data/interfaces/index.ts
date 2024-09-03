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
    segments: [number, number, number][];
}
// #endregion exports

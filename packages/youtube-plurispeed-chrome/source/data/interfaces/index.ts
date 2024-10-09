// #region exports
export interface Options {
    embeddedButton: boolean;
};

export type Speaker = {
    id: number;
    name: string;
    speed: number;
}

/**
 * ```
 * Speaker ID = -2 => speech gap
 * Speaker ID = -1 => overlap
 * Speaker ID >= 0 => speaker ID
 * [speaker_id, start, stop, word_count]
 * ```
 */
export type SpeakerSegment = [number, number, number, number];

export type SpeakersData = {
    labels: string[];
    segments: SpeakerSegment[];
    wpmIntervals: number[];
}
// #endregion exports

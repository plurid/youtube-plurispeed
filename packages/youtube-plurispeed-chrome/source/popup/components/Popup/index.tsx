// #region imports
    // #region libraries
    import React, {
        useRef,
        useState,
        useEffect,
    } from 'react';


    import {
        dewiki,
    } from '@plurid/plurid-themes';

    import {
        InputSwitch,
        PureButton,
        LinkButton,
        Slider,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        Options,
        Speaker,
    } from '~data/interfaces';

    import {
        OPTIONS_KEY,
        defaultOptions,
        MESSAGE,
    } from '~data/constants';

    import {
        getActiveTab,
    } from '~logic/utilities';
    // #endregion external


    // #region internal
    import {
        StyledPopup,
        inputStyle,
        sliderStyle,
    } from './styled';
    // #endregion internal
// #region imports



// #region module
export interface PopupProperties {
}

const Popup: React.FC<PopupProperties> = (
    _properties,
) => {
    // #region references
    const mounted = useRef(false);
    // #endregion references


    // #region state
    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        dataRequested,
        setDataRequested,
    ] = useState(false);

    const [
        dataExists,
        setDataExists,
    ] = useState<boolean | null>(null);

    const [
        dataProcessing,
        setDataProcessing,
    ] = useState<boolean | null>(null);

    const [
        activeTab,
        setActiveTab,
    ] = useState<chrome.tabs.Tab | null>(null);

    const [
        activeTabSpeakers,
        setActiveTabSpeakers,
    ] = useState<Speaker[]>([]);

    const [
        speechSpeedActive,
        setSpeechSpeedActive,
    ] = useState(false);

    const [
        speechWPM,
        setSpeechWPM,
    ] = useState(160);

    const [
        activated,
        setActivated,
    ] = useState(false);

    const [
        embeddedButton,
        setEmbeddedButton,
    ] = useState(defaultOptions.embeddedButton);
    // #endregion state


    // #region handlers
    const activate = async () => {
        try {
            setActivated(value => !value);
            const tab = await getActiveTab();
            await chrome.tabs.sendMessage(tab.id, {
                type: MESSAGE.TOGGLE,
            });
        } catch (error) {
            return;
        }
    }

    const requestDiarization = async () => {
        try {
            const tab = await getActiveTab();
            chrome.runtime.sendMessage({
                type: MESSAGE.REQUEST_DIARIZATION,
                url: tab.url,
            });
        } catch (error) {
            return;
        }
    }

    const reset = () => {
    }
    // #endregion handlers


    // #region effects
    /** Options */
    useEffect(() => {
        const load = async () => {
            try {
                const data = await chrome.storage.local.get(OPTIONS_KEY);
                if (!data || !data[OPTIONS_KEY]) {
                    setLoading(false);
                    return;
                }

                const {
                    embeddedButton,
                } = data[OPTIONS_KEY] as Options;

                setEmbeddedButton(embeddedButton);

                setLoading(false);
            } catch (error) {
                setLoading(false);
                return;
            }
        }

        load();
    }, []);

    useEffect(() => {
        if (!mounted.current) {
            return;
        }

        const save = async () => {
            try {
                const options: Options = {
                    embeddedButton,
                };

                await chrome.storage.local.set({
                    [OPTIONS_KEY]: options,
                });
            } catch (error) {
                return;
            }
        }

        save();
    }, [
        embeddedButton,
    ]);


    /** Tab Data */
    useEffect(() => {
        const getTabData = async () => {
            try {
                const tab = await getActiveTab();
                setActiveTab(tab);

                const response = await chrome.tabs.sendMessage(tab.id, {
                    type: MESSAGE.GET_STATE,
                });
                if (!response) {
                    return;
                }

                const {
                    toggled,
                    speakers,
                    speechSpeedActive,
                    speechWPM,
                } = response;

                if (speakers.length === 0) {
                    setDataExists(false);
                }

                if (toggled) {
                    setDataRequested(true);
                }

                setActivated(!!toggled);
                setActiveTabSpeakers(speakers);
                setSpeechSpeedActive(speechSpeedActive);
                setSpeechWPM(speechWPM);
            } catch (error) {
                return;
            }
        }

        getTabData();
    }, [
        activated,
    ]);

    /** Listen Data */
    useEffect(() => {
        const listenData = async (
            request: any, sender: any, sendResponse: any,
        ) => {
            try {
                switch (request.type) {
                    case MESSAGE.BG_P_DATA:
                        setDataRequested(true);
                        setDataExists(true);
                        setDataProcessing(false);
                        setActiveTabSpeakers(request.speakers);
                        break;
                    case MESSAGE.BG_P_NO_DATA:
                        setDataRequested(true);
                        setDataExists(false);
                        setDataProcessing(false);
                        break;
                    case MESSAGE.BG_P_PROCESSING:
                        setDataRequested(true);
                        setDataExists(false);
                        setDataProcessing(true);
                        break;
                }
            } catch (error) {
                return;
            }
        }

        chrome.runtime.onMessage.addListener(listenData);

        return () => {
            chrome.runtime.onMessage.removeListener(listenData);
        }
    }, []);

    /** Mount */
    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, []);
    // #endregion effects


    // #region render
    if (loading) {
        return (
            <StyledPopup
                theme={dewiki}
            >
            </StyledPopup>
        );
    }

    return (
        <StyledPopup
            theme={dewiki}
        >
            <h1>
                YouTube PluriSpeed
            </h1>

            <div>
                press alt/option (⌥) + P on a YouTube page to activate plurispeed
            </div>

            {activeTab
            && activeTab.url?.includes('youtube.com')
            && (
                <>
                <InputSwitch
                    name={`${activated ? 'deactivate' : 'activate'} [⌥ + P]`}
                    checked={activated}
                    atChange={() => {
                        activate();
                    }}
                    theme={dewiki}
                    style={{
                        ...inputStyle,
                    }}
                />

                {activated && (
                    <>
                        <InputSwitch
                            name="embedded button"
                            checked={embeddedButton}
                            atChange={() => {
                                setEmbeddedButton(value => !value);
                            }}
                            theme={dewiki}
                            style={{
                                ...inputStyle,
                            }}
                        />

                        {activeTabSpeakers.length > 0 && (
                            <div>
                                <InputSwitch
                                    name="speech speed"
                                    checked={speechSpeedActive}
                                    atChange={() => {
                                        const newSpeechSpeedActive = !speechSpeedActive;
                                        setSpeechSpeedActive(newSpeechSpeedActive);

                                        chrome.tabs.sendMessage(activeTab.id, {
                                            type: MESSAGE.UPDATE_SPEECH_SPEED,
                                            speechSpeedActive: newSpeechSpeedActive,
                                            speechWPM,
                                        });
                                    }}
                                    theme={dewiki}
                                    style={{
                                        ...inputStyle,
                                        marginBottom: '1.4rem',
                                    }}
                                />

                                {speechSpeedActive === true && (
                                    <div
                                        style={{
                                            padding: '0 1rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...sliderStyle,
                                            }}
                                        >
                                            <div>
                                                {speechWPM} WPM
                                            </div>

                                            <Slider
                                                name={'words per minute'}
                                                value={speechWPM}
                                                atChange={(value) => {
                                                    setSpeechWPM(value);

                                                    chrome.tabs.sendMessage(activeTab.id, {
                                                        type: MESSAGE.UPDATE_SPEECH_SPEED,
                                                        speechSpeedActive,
                                                        speechWPM: value,
                                                    });
                                                }}
                                                min={10}
                                                max={360}
                                                step={10}
                                                defaultValue={160}
                                                width={120}
                                                theme={dewiki}
                                                level={2}
                                            />
                                        </div>
                                    </div>
                                )}

                                {speechSpeedActive === false && (
                                    <div
                                        style={{
                                            paddingLeft: '1rem',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                textAlign: 'center',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            speakers
                                        </h2>

                                        {activeTabSpeakers.map(speaker => {
                                            return (
                                                <div
                                                    key={speaker.id}
                                                    style={{
                                                        ...sliderStyle,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            minWidth: '60px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                wordBreak: 'break-all',
                                                            }}
                                                        >
                                                            {speaker.name}
                                                        </span>
                                                        <br />
                                                        {speaker.speed === 1
                                                            ? 'normal'
                                                            : (speaker.speed).toFixed(1)
                                                        }
                                                    </div>

                                                    <Slider
                                                        name={speaker.name}
                                                        value={speaker.speed}
                                                        atChange={(value) => {
                                                            const newSpeakers = activeTabSpeakers.map(activeTabSpeaker => {
                                                                if (activeTabSpeaker.id === speaker.id) {
                                                                    return {
                                                                        ...activeTabSpeaker,
                                                                        speed: value,
                                                                    };
                                                                }

                                                                return {
                                                                    ...activeTabSpeaker,
                                                                };
                                                            });

                                                            setActiveTabSpeakers(newSpeakers);
                                                            chrome.tabs.sendMessage(activeTab.id, {
                                                                type: MESSAGE.UPDATE_SPEAKERS,
                                                                speakers: newSpeakers,
                                                            });
                                                        }}
                                                        min={0.1}
                                                        max={2.5}
                                                        step={0.1}
                                                        defaultValue={1}
                                                        width={100}
                                                        theme={dewiki}
                                                        level={2}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {dataRequested &&
                dataExists === false &&
                dataProcessing !== true && (
                    <PureButton
                        text="Request Diarization"
                        atClick={() => {
                            requestDiarization();
                        }}
                        theme={dewiki}
                        level={2}
                        style={{
                            marginTop: '2rem',
                        }}
                    />
                )}

                {dataProcessing === true && (
                    <div>
                        diarization processing
                    </div>
                )}

                <div>
                    <LinkButton
                        text="reset"
                        atClick={() => {
                            reset();
                        }}
                        theme={dewiki}
                        style={{
                            marginTop: '2rem',
                        }}
                        inline={true}
                    />
                </div>
                </>
            )}
        </StyledPopup>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Popup;
// #endregion exports

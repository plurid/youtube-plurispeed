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
        LinkButton,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        Options,
    } from '~data/interfaces';

    import {
        OPTIONS_KEY,
        defaultOptions,
    } from '~data/constants';

    import {
        getActiveTab,
    } from '~logic/utilities';
    // #endregion external


    // #region internal
    import {
        StyledPopup,
        inputStyle,
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
                type: 'TOGGLE',
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
                const response = await chrome.tabs.sendMessage(tab.id, {
                    type: 'GET_STATE',
                });
                if (!response) {
                    return;
                }

                const {
                    toggled,
                } = response;

                setActivated(!!toggled);
            } catch (error) {
                return;
            }
        }

        getTabData();
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
        </StyledPopup>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Popup;
// #endregion exports

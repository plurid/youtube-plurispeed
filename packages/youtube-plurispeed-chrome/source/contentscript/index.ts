// #region imports
    // #region external
    import {
        OPTIONS_KEY,
        defaultOptions,
        MESSAGE,
        SPEAKER,
    } from '~data/constants';

    import {
        Options,
        Speaker,
        SpeakersData,
        SpeakerSegment,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
let toggled = false;
let injectedButton = false;
let requestedData = false;
let speakers: Speaker[] = [];
let speakersData: SpeakersData = {
    labels: [],
    segments: [],
    wpmIntervals: [],
};
let speechSpeedActive = false;
let speechWPM = 140;

const SPEED = {
    NORMAL: 1,
};


function computeWPMPlayback(currentTime: number) {
    if (speakersData.wpmIntervals.length === 0) {
        return 1;
    }

    const intervalDuration = 30; // seconds
    const totalIntervals = speakersData.wpmIntervals.length;
    const intervalIndex = Math.floor(currentTime / intervalDuration);

    if (intervalIndex < 0 || intervalIndex >= totalIntervals) {
        // Out of range.
        return 1;
    }

    const actualWPM = speakersData.wpmIntervals[intervalIndex];
    if (actualWPM === 0) {
        return 1;
    }

    return speechWPM / actualWPM;
}


const getOptions = async (): Promise<Options> => {
    try {
        const options = await chrome.storage.local.get(OPTIONS_KEY)
            .catch(() => {});
        if (!options || !options[OPTIONS_KEY]) {
            return defaultOptions;
        }

        return options[OPTIONS_KEY] as Options;
    } catch (error) {
        return defaultOptions;
    }
}


function findActiveSegment(
    segments: SpeakerSegment[],
    currentTime: number,
): SpeakerSegment | null {
    let left = 0;
    let right = segments.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const [_, startTime, endTime] = segments[mid];

        if (currentTime >= startTime && currentTime <= endTime) {
            return segments[mid];
        } else if (currentTime < startTime) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return null;
}


const injectButton = () => {
    if (injectedButton) {
        return;
    }
    injectedButton = true;

    const settingsMenu = document.querySelector('.ytp-settings-menu') as HTMLDivElement;
    settingsMenu.style.height = parseFloat(settingsMenu.computedStyleMap().get('height') as string) + 40 + 'px';

    const panelContainer = document.querySelector('.ytp-settings-menu .ytp-panel') as HTMLDivElement;
    panelContainer.style.height = parseFloat(panelContainer.computedStyleMap().get('height') as string) + 40 + 'px';

    const panelMenu = document.querySelector('.ytp-settings-menu .ytp-panel-menu') as HTMLDivElement;
    panelMenu.style.height = parseFloat(panelMenu.computedStyleMap().get('height') as string) + 40 + 'px';


    const menuItem = document.createElement('div');
    menuItem.className = 'ytp-menuitem';

    const icon = document.createElement('div');
    icon.className = 'ytp-menuitem-icon';
    icon.innerHTML = `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" fill="white"></path></svg>`;

    const label = document.createElement('div');
    label.className = 'ytp-menuitem-label';
    label.innerText = 'PluriSpeed';

    const content = document.createElement('div');
    content.className = 'ytp-menuitem-content';

    menuItem.appendChild(icon);
    menuItem.appendChild(label);
    menuItem.appendChild(content);
    menuItem.setAttribute('aria-haspopup', 'true');
    menuItem.setAttribute('role', 'menuitem');
    menuItem.setAttribute('tabindex', '0');

    menuItem.onclick = () => {
        const panelChildren = panelMenu.children;
        const initialLength = panelChildren.length;
        for (let i = 0; i < panelChildren.length; i++) {
            const child = panelChildren[i] as HTMLDivElement;
            child.style.display = 'none';
        }


        const header = document.createElement('div');
        header.className = 'ytp-panel-header';
        const backButtonContainer = document.createElement('div');
        backButtonContainer.className = 'ytp-panel-back-button-container';
        const backButton = document.createElement('button');
        backButton.className = 'ytp-button ytp-panel-back-button';
        backButton.setAttribute('aria-label', 'Back to previous menu');
        backButtonContainer.appendChild(backButton);
        header.appendChild(backButtonContainer);
        const title = document.createElement('span');
        title.className = 'ytp-panel-title';
        title.innerText = 'PluriSpeed';
        header.appendChild(title);

        const menu = document.createElement('div');
        menu.className = 'ytp-panel-menu';
        menu.setAttribute('role', 'menu');


        // {
        //     const WPM = 140;

        //     const wpmMap = [
        //         { label: 'Very Slow', speedRange: [80, 100] },
        //         { label: 'Slow', speedRange: [100, 130] },
        //         { label: 'Normal', speedRange: [130, 160] },
        //         { label: 'Fast', speedRange: [160, 200] },
        //         { label: 'Very Fast', speedRange: [200, 240] }
        //     ];

        //     const wpmSpeed = wpmMap.find(wpm => {
        //         const [min, max] = wpm.speedRange;
        //         return WPM >= min && WPM < max;
        //     });

        //     const menuItem = document.createElement('div');
        //     menuItem.className = 'ytp-menuitem';
        //     menuItem.setAttribute('tabindex', '0');
        //     menuItem.setAttribute('role', 'menuitemcheckbox');
        //     menuItem.setAttribute('aria-checked', 'false');
        //     menuItem.style.pointerEvents = 'none';
        //     const label = document.createElement('div');
        //     label.className = 'ytp-menuitem-label';
        //     label.innerText = `Dynamic ${WPM} WPM · ${wpmSpeed.label}`;
        //     label.style.textAlign = 'center';
        //     const content = document.createElement('div');
        //     content.className = 'ytp-menuitem-content';
        //     const toggle = document.createElement('div');
        //     toggle.className = 'ytp-menuitem-toggle-checkbox';
        //     content.appendChild(toggle);
        //     menuItem.appendChild(label);
        //     menuItem.appendChild(content);

        //     const speedSliderComponent = document.createElement('div');
        //     speedSliderComponent.className = 'ytp-speedslider-component';
        //     speedSliderComponent.style.height = '50px';

        //     const sliderSection = document.createElement('div');
        //     sliderSection.className = 'ytp-slider-section';
        //     sliderSection.setAttribute('role', 'slider');
        //     sliderSection.setAttribute('tabindex', '0');
        //     sliderSection.setAttribute('aria-valuetext', '1');
        //     sliderSection.setAttribute('aria-valuenow', '1');
        //     sliderSection.setAttribute('aria-valuemin', '0.25');
        //     sliderSection.setAttribute('aria-valuemax', '2');

        //     const slider = document.createElement('div');
        //     slider.className = 'ytp-slider ytp-speedslider';
        //     slider.style.touchAction = 'none';
        //     slider.setAttribute('draggable', 'true');

        //     const sliderHandle = document.createElement('div');
        //     sliderHandle.className = 'ytp-slider-handle';
        //     sliderHandle.style.left = '50px';

        //     slider.appendChild(sliderHandle);
        //     sliderSection.appendChild(slider);
        //     speedSliderComponent.appendChild(sliderSection);


        //     menu.appendChild(menuItem);
        //     menu.appendChild(speedSliderComponent);
        // }


        for (const speaker of speakers) {
            const menuItem = document.createElement('div');
            menuItem.className = 'ytp-menuitem';
            menuItem.setAttribute('tabindex', '0');
            menuItem.style.pointerEvents = 'none';
            const label = document.createElement('div');
            label.className = 'ytp-menuitem-label';
            label.innerText = speaker.name + ` ${speaker.speed}x`;
            label.style.textAlign = 'center';
            menuItem.appendChild(label);


            const speedSliderComponent = document.createElement('div');
            speedSliderComponent.className = 'ytp-speedslider-component';
            speedSliderComponent.style.height = '50px';

            const sliderSection = document.createElement('div');
            sliderSection.className = 'ytp-slider-section';
            sliderSection.setAttribute('role', 'slider');
            sliderSection.setAttribute('tabindex', '0');
            sliderSection.setAttribute('aria-valuetext', '1');
            sliderSection.setAttribute('aria-valuenow', '1');
            sliderSection.setAttribute('aria-valuemin', '0.25');
            sliderSection.setAttribute('aria-valuemax', '2');

            const slider = document.createElement('div');
            slider.className = 'ytp-slider ytp-speedslider';
            slider.style.touchAction = 'none';
            slider.setAttribute('draggable', 'true');


            const minValue = 0.5;
            const maxValue = 2;

            slider.addEventListener('mousedown', function(event) {
                event.preventDefault();  // Prevent default drag behavior

                const onMouseMove = (event: any) => {
                    const containerRect = speedSliderComponent.getBoundingClientRect();

                    let newLeft = event.clientX - containerRect.left - slider.offsetWidth / 2;
                    // Keep the slider within the bounds of the container
                    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - slider.offsetWidth));

                    // Set the slider's new position
                    sliderHandle.style.left = newLeft + 'px';

                    speaker.speed = Number(
                        (0.25 + (newLeft / 100) * 1.75).toFixed(2),
                    );
                    label.innerText = speaker.name + ` ${speaker.speed}x`;
                }

                // Add mousemove and mouseup listeners to handle dragging
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', function() {
                    document.removeEventListener('mousemove', onMouseMove);
                }, { once: true });
            });


            const sliderHandle = document.createElement('div');
            sliderHandle.className = 'ytp-slider-handle';
            sliderHandle.style.left = '50px';

            slider.appendChild(sliderHandle);
            sliderSection.appendChild(slider);
            speedSliderComponent.appendChild(sliderSection);


            menu.appendChild(menuItem);
            menu.appendChild(speedSliderComponent);
        }

        menu.appendChild(menuItem);

        panelMenu.appendChild(header);
        panelMenu.appendChild(menu);


        const backFunction = () => {
            const panelChildren = panelMenu.children;

            for (let i = 0; i < panelChildren.length; i++) {
                const child = panelChildren[i] as HTMLDivElement;

                child.style.cssText = '';

                if (i === 6 || i === 7) {
                    child.style.display = 'none';
                }
            }
        };
        backButton.onclick = backFunction;
        title.onclick = backFunction;
    }

    panelMenu.prepend(menuItem);
}


const togglePluriSpeed = () => {
    try {
        if (!toggled && !requestedData) {
            requestedData = true;

            chrome.runtime.sendMessage({
                type: MESSAGE.GET_DATA,
            });
        }


        toggled = !toggled;


        const settingsButton = document.querySelector('.ytp-settings-button') as HTMLButtonElement;
        settingsButton.onclick = () => {
            setTimeout(() => {
                const expanded = settingsButton.getAttribute('aria-expanded');

                if (expanded === 'true') {
                    injectButton();
                }
            }, 200);
        }


        const video = document.querySelector('video');
        if (!video) {
            return;
        }

        const setVideoPlaybackRate = (playbackRate: number) => {
            if (video.playbackRate === playbackRate) {
                return;
            }

            video.playbackRate = playbackRate;
        }

        video.addEventListener('timeupdate', () => {
            try {
                if (!toggled) {
                    setVideoPlaybackRate(SPEED.NORMAL);
                    return;
                }

                const currentTime = video.currentTime;

                if (speechSpeedActive) {
                    // Handle speed based on WPM
                    const playbackRate = computeWPMPlayback(currentTime);
                    setVideoPlaybackRate(playbackRate);
                } else {
                    // Handle speed based on speakers
                    const activeSegment = findActiveSegment(
                        speakersData.segments,
                        currentTime,
                    );
                    if (!activeSegment) {
                        setVideoPlaybackRate(SPEED.NORMAL);
                        return;
                    }

                    const [
                        speakerID,
                        start,
                        end,
                    ] = activeSegment;

                    if (currentTime >= start && currentTime <= end) {
                        if (speakerID === SPEAKER.SPEECH_GAP) {
                            setVideoPlaybackRate(SPEED.NORMAL);
                            return;
                        }

                        if (speakerID === SPEAKER.OVERLAP) {
                            const overlapSpeed = speakers[speakers.length - 1].speed;
                            setVideoPlaybackRate(overlapSpeed);
                            return;
                        }

                        const speakerSpeed = speakers[speakerID].speed;
                        setVideoPlaybackRate(speakerSpeed);
                    }
                }
            } catch (error) {
                return;
            }
        });
    } catch (error) {
        return;
    }
}



const main = async () => {
    try {
        document.addEventListener('keydown', (event) => {
            try {
                if (event.altKey && event.code === 'KeyP') {
                    togglePluriSpeed();

                    return;
                }
            } catch (error) {
                return;
            }
        });

        chrome.storage.onChanged.addListener((changes) => {
            try {
                const options = changes[OPTIONS_KEY].newValue as Options;
                if (!options) {
                    return;
                }
            } catch (error) {
                return;
            }
        });

        chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
            try {
                switch (message.type) {
                    case MESSAGE.TOGGLE:
                        togglePluriSpeed();
                        break;
                    case MESSAGE.GET_STATE:
                        sendResponse({
                            toggled,
                            speakers,
                            speechSpeedActive,
                            speechWPM,
                        });
                        break;
                    case MESSAGE.DATA:
                        speakers = message.speakers;
                        speakersData = message.data;
                        break;
                    case MESSAGE.UPDATE_SPEAKERS:
                        speakers = message.speakers;
                        break;
                    case MESSAGE.UPDATE_SPEECH_SPEED:
                        speechSpeedActive = message.speechSpeedActive;
                        speechWPM = message.speechWPM;
                        break;
                }
            } catch (error) {
                return;
            }
        });
    } catch (error) {
        return;
    }
}

main().catch(() => {});
// #endregion module

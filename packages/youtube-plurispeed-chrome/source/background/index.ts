import {
    API_ENDPOINT,
    MESSAGE,
} from '~data/constants';



chrome.runtime.onMessage.addListener(
    async (message, sender, _sendResponse) => {
        try {
            switch (message.type) {
                case MESSAGE.REQUEST_DIARIZATION: {
                    const {
                        url,
                    } = message;
                    if (!url.includes('youtube.com/watch')) {
                        return;
                    }

                    const request = await fetch(API_ENDPOINT + '/request-diarization', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url,
                        }),
                    });
                    const {
                        status,
                    } = await request.json();
                    if (!status) {
                        return;
                    }

                    return;
                }
                case MESSAGE.GET_DATA: {
                    const tab = sender.tab;
                    const url = tab.url || '';
                    if (!url) {
                        return;
                    }

                    const request = await fetch(API_ENDPOINT + '/get-diarization', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url,
                        }),
                    });
                    const {
                        status,
                        data,
                    } = await request.json();
                    if (!status) {
                        chrome.runtime.sendMessage({
                            type: MESSAGE.BG_P_NO_DATA,
                        });
                        return;
                    }

                    if (!data) {
                        chrome.runtime.sendMessage({
                            type: MESSAGE.BG_P_PROCESSING,
                        });
                        return;
                    }

                    const speakers = (data.labels as string[]).map((label, index) => {
                        return {
                            id: index,
                            name: label,
                            speed: 1,
                        };
                    });
                    speakers.push({
                        id: -1,
                        name: 'Overlap',
                        speed: 1,
                    });

                    chrome.tabs.sendMessage(tab.id, {
                        type: MESSAGE.DATA,
                        speakers,
                        data,
                    });

                    chrome.runtime.sendMessage({
                        type: MESSAGE.BG_P_DATA,
                        speakers,
                    });

                    return;
                }
            }
        } catch (error) {
            return;
        }
    },
);

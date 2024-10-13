import {
    API_ENDPOINT,
    MESSAGE,
} from '~data/constants';



const apiRequest = async <D>(
    endpoint: string,
    data: D,
) => {
    const request = await fetch(API_ENDPOINT + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return await request.json();
}

const checkYouTubeWatchURL = (url: string) => {
    return url.includes('youtube.com/watch');
}


chrome.runtime.onMessage.addListener(
    async (message, sender, _sendResponse) => {
        try {
            switch (message.type) {
                case MESSAGE.REQUEST_DIARIZATION: {
                    const {
                        url,
                    } = message;
                    if (!checkYouTubeWatchURL(url)) {
                        return;
                    }

                    const {
                        status,
                    } = await apiRequest('/request-diarization', {
                        url,
                    });
                    if (!status) {
                        return;
                    }

                    return;
                }

                case MESSAGE.REQUEST_LABELS_CHECK: {
                    const {
                        id,
                    } = message;

                    const {
                        status,
                    } = await apiRequest('/flag-diarization', {
                        id,
                        flag: 'L',
                    });
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

                    const {
                        status,
                        data,
                    } = await apiRequest('/get-diarization', {
                        url,
                    });
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

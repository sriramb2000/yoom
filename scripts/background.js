const ALARM_SUFFIX = 'closeZoomTab'

chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.getSelected(null, tab => {
        chrome.alarms.create(`${tab.id}${ALARM_SUFFIX}`, {
            delayInMinutes: 0.1 // 6 seconds
        });
    });
}, {
    url: [
        {
            hostSuffix:'zoom.us',
            pathPrefix:'/j',
        },
        {
            hostSuffix:'zoom.us',
            pathPrefix:'/postattendee'
        }
    ]
});

chrome.alarms.onAlarm.addListener((alarm) => {
    const { name } = alarm;
    const tabId = name && parseInt(name.replace(ALARM_SUFFIX, ''));
    if (tabId) {
        chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) {
                // Tab has already been closed, no need to do anything
                return;
            } else {
                const { url } = tab;
                if (url.includes('zoom.us/j') || url.includes('zoom.us/postattendee')) {
                    chrome.tabs.remove(tabId);
                }
            }
        });
    }
});
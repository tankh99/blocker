function saveBlockedSites(siteList) {
  chrome.storage.sync.set({ blockedSites: siteList }, () => {
    console.log('Blocked sites updated:', siteList);
  });
}

function getBlockedSites(callback) {
  chrome.storage.sync.get({ blockedSites: [] }, (data) => {
    callback(data.blockedSites);
  });
}
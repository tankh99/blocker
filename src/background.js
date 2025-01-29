// Note: Must be in a service worker context for MV3
chrome.runtime.onInstalled.addListener(() => {
    initializeRules();
  });
  
  // This function reads the current block list from storage
  // and updates the declarativeNetRequest rules accordingly
  function initializeRules() {
    chrome.storage.sync.get({ blockedSites: [] }, (data) => {
      const blockedSites = data.blockedSites || [];
      updateBlockRules(blockedSites);
    });
  }
  
  // Listen for changes in storage to update rules in real time
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.blockedSites) {
      updateBlockRules(changes.blockedSites.newValue);
    }
  });
  
  function updateBlockRules(blockedSites) {
    // Construct an array of rules
    const rules = blockedSites.map((site, index) => {
      return {
        // Rule IDs must be unique
        "id": index + 1,
        "priority": 1,
        "action": { 
            "type": "redirect",
            "redirect": {
                "url": chrome.runtime.getURL("src/blocked.html")
            }
        },
        "condition": {
          // Match across any subdomain, e.g. *.example.com
          "urlFilter": site.value,
          "resourceTypes": ["main_frame", "sub_frame"]
        }
      }
    });

    // rules.push({
    //     // Rule IDs must be unique
    //     "id": rules.length + 1,
    //     "priority": 1,
    //     "action": { 
    //         "type": "redirect",
    //         "redirect": {
    //             "url": chrome.runtime.getURL("src/blocked.html")
    //         }
    //     },
    //     "condition": {
    //       // Match across any subdomain, e.g. *.example.com
    //       "urlFilter": "youtube.com",
    //       "resourceTypes": ["main_frame", "sub_frame"]
    //     }
    //   })
  
    // Clear existing rules, then set new rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1), // remove old
      addRules: rules
    }, () => {
      console.log('Rules updated for blocked sites:', blockedSites);
    });
  }
  

// background.js for manifest v2/firefox
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // If match, block by redirecting to an empty document
      return { cancel: true };
    },
    // Filter based on blocked sites
    {
      urls: [
        "*://*.youtube.com/*",
        "*://*.x.com/*"
      ]
    },
    // Need "blocking" permission in manifest
    ["blocking"]
  );
  


  const blockedSites = [
    "www.youtube.com",
    "www.anotherexample.com"
  ];
  
  // Listen for web requests
  chrome.webRequest.onBeforeRequest.addListener(

    function(request) {
        
      // Check if the requested URL is in the blocked sites list
      console.log(request.url)
      if (blockedSites.includes(request.url)) {
        // Redirect to a custom page (e.g., a blocked page)
        return { redirectUrl: chrome.runtime.getURL("blocked.html") };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
// setInterval(clearYouTubeData, 5000); // Clear every minute
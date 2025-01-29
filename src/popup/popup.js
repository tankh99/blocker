document.addEventListener('DOMContentLoaded', () => {
    const siteListDiv = document.getElementById('site-list');
    const newSiteInput = document.getElementById('new-site');
    const addSiteButton = document.getElementById('add-site');

    // Helper function to display current blocked sites
    function displayBlockedSites(blockedSites) {
      siteListDiv.innerHTML = '';
      blockedSites.forEach((site, index) => {
        const siteRow = document.createElement('div');
        siteRow.textContent = site.label;
  
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
          blockedSites.splice(index, 1);
          saveBlockedSites(blockedSites);
          displayBlockedSites(blockedSites);
        });
  
        siteRow.appendChild(removeButton);
        siteListDiv.appendChild(siteRow);
      });
    }
  
    // Load and display the blocked sites on popup open
    getBlockedSites((blockedSites) => {
      displayBlockedSites(blockedSites);
    });
  
    // Add a new site
    addSiteButton.addEventListener('click', () => {
      let newSite = newSiteInput.value.trim();
      if (!newSite) return;
      getBlockedSites((blockedSites) => {
        // Avoid duplicates
        if (!blockedSites.includes(newSite)) {
          const value = `*://*.${newSite}/*`
          const payload = {
            value,
            label: newSite
          }
          blockedSites.push(payload);
          saveBlockedSites(blockedSites);
          displayBlockedSites(blockedSites);
        }
        newSiteInput.value = '';
      });
    });
  });
  
  // Functions for saving/getting the list (same as before)
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

  
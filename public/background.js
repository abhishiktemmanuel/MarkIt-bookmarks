chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_SESSION') {
    chrome.storage.local.set({ supabaseSession: message.session }, () => {
      console.log('[MarkIt Extension] Session stored in storage.local.');
    });
  }
});

// Optional: Listen for storage changes to sync back if needed
// Or just let the popup query storage.local on initialization.

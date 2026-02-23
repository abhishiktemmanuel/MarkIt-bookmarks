(function() {
  // Listen for session broadcast from the web app
  window.addEventListener('message', (event) => {
    // Only accept messages from same window
    if (event.source !== window) return;

    if (event.data && event.data.type === 'SUPABASE_SESSION_SYNC') {
      const session = event.data.session;
      if (session) {
        chrome.runtime.sendMessage({ type: 'SYNC_SESSION', session: session });
        console.log('[MarkIt Extension] Session received via postMessage and sent to background.');
      } else {
        // Handle sign out
        chrome.runtime.sendMessage({ type: 'SYNC_SESSION', session: null });
        console.log('[MarkIt Extension] Sign-out detected and sent to background.');
      }
    }
  });

  // Also try to read the session from localStorage directly in case content script loaded late
  try {
    const sessionStr = localStorage.getItem('markit-extension-session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      chrome.runtime.sendMessage({ type: 'SYNC_SESSION', session: session });
      console.log('[MarkIt Extension] Session detected from localStorage and sent to background.');
    }
  } catch (e) {
    console.error('[MarkIt Extension] Failed to read session from localStorage:', e);
  }

  // Also try to request the session immediately in case content script loaded late
  window.postMessage({ type: 'REQUEST_SUPABASE_SESSION' }, '*');
})();

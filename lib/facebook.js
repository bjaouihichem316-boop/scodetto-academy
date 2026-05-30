/* ==========================================================================
   SCODETTO ACADEMY - Facebook SDK Integration
   ========================================================================== */

// ⚠️ IMPORTANT: Replace this App ID with your real Facebook App ID
// from https://developers.facebook.com
const FB_APP_ID = 'YOUR_FACEBOOK_APP_ID_HERE';
const FB_API_VERSION = 'v22.0';

let fbReady = false;
let fbInitPromise = null;

/**
 * Load and initialize the Facebook SDK asynchronously.
 * Returns a Promise that resolves to true when SDK is ready, false on failure.
 */
export function initFacebookSdk() {
  if (fbInitPromise) return fbInitPromise;
  
  fbInitPromise = new Promise((resolve) => {
    // If SKIP_FB_SDK is set in sessionStorage, skip loading (for dev/testing)
    if (sessionStorage.getItem('SKIP_FB_SDK') === 'true') {
      resolve(false);
      return;
    }

    // If FB_APP_ID is still the placeholder, don't attempt to load
    if (FB_APP_ID === 'YOUR_FACEBOOK_APP_ID_HERE') {
      console.info('Facebook: No App ID configured. Skipping SDK load.');
      resolve(false);
      return;
    }

    window.fbAsyncInit = function() {
      FB.init({
        appId: FB_APP_ID,
        autoLogAppEvents: false,
        xfbml: false,
        version: FB_API_VERSION
      });
      fbReady = true;
      resolve(true);
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      console.warn('Facebook SDK failed to load. FB login disabled.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return fbInitPromise;
}

/**
 * Check if Facebook SDK is initialized and ready to use.
 */
export function isFbReady() {
  return fbReady && FB_APP_ID !== 'YOUR_FACEBOOK_APP_ID_HERE';
}

/**
 * Open Facebook Login popup and fetch user profile data.
 * Requires the user to have already authorized the app.
 * 
 * @returns {Promise<{accessToken: string, userID: string, name: string, email: string, picture: string}>}
 */
export function fbLogin() {
  return new Promise((resolve, reject) => {
    if (!isFbReady()) {
      reject(new Error('Facebook SDK not ready'));
      return;
    }

    FB.login((response) => {
      if (response.status !== 'connected') {
        reject(new Error('Connexion Facebook annulée / تم إلغاء تسجيل الدخول عبر فيسبوك'));
        return;
      }

      const { accessToken, userID } = response.authResponse;

      FB.api('/me', { fields: 'name,email,picture.width(200).height(200)' }, (profile) => {
        if (profile.error) {
          reject(new Error(profile.error.message));
          return;
        }
        resolve({
          accessToken,
          userID,
          name: profile.name || '',
          email: profile.email || '',
          picture: profile.picture?.data?.url || ''
        });
      });
    }, { scope: 'public_profile,email' });
  });
}

/**
 * Log out of Facebook (clears FB session).
 * @returns {Promise<boolean>}
 */
export function fbLogout() {
  return new Promise((resolve) => {
    if (!isFbReady()) {
      resolve(false);
      return;
    }
    FB.logout(() => resolve(true));
  });
}

/**
 * Get the configured App ID (for display/debug purposes).
 */
export function getFbAppId() {
  return FB_APP_ID;
}

/* ==========================================================================
   SCODETTO ACADEMY - APPLICATION BOOTSTRAP (Entry Point)
   ========================================================================== */

// Import UI components
import { renderHero } from './components/Hero.js';
import { renderCoaches } from './components/Coaches.js';
import { renderAdminDashboard } from './components/AdminDashboard.js';
import { renderParentPortal } from './components/ParentPortal.js';
import { initAuthModal } from './components/AuthModal.js';

// Import core modules
import { state } from './state.js';
import { navigateTo, registerRoute, setToast as setRouterToast } from './lib/router.js';
import { initPersistence } from './lib/persist.js';
import { initPremiumBgCanvas } from './lib/canvas.js';
import { showToast } from './lib/notifications.js';
import { playWhistleSound, playCrowdCheerSound, triggerConfettiCelebration } from './lib/audio.js';
import { loginUser, logoutUser, pushParentAlert, setToast as setAuthToast, setAudioFns } from './lib/auth.js';

// Re-exports for backward compatibility (components will import directly in future)
export { state };
export { navigateTo };
export { showToast };
export { loginUser };
export { logoutUser };
export { pushParentAlert };
export { playWhistleSound, playCrowdCheerSound, triggerConfettiCelebration };

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // Initialize luxury background connected particle canvas
  initPremiumBgCanvas();

  // Initialize persistence (hydrate state from localStorage before first render)
  initPersistence();

  // Register toast + audio functions for router and auth (avoids circular dependencies)
  setRouterToast(showToast);
  setAuthToast(showToast);
  setAudioFns({ whistle: playWhistleSound, crowdCheer: playCrowdCheerSound });

  // Register all routes with their render functions
  registerRoute('#home', (viewport) => {
    renderHero(viewport);
    renderCoaches(viewport);
  });
  registerRoute('#philosophy', (viewport) => {
    renderHero(viewport);
    renderCoaches(viewport);
    setTimeout(() => {
      document.getElementById('philosophy-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  });
  registerRoute('#coaches', (viewport) => {
    renderHero(viewport);
    renderCoaches(viewport);
    setTimeout(() => {
      document.getElementById('coaches-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  });
  registerRoute('#admin', (viewport) => {
    renderAdminDashboard(viewport, state);
  });
  registerRoute('#parent', (viewport) => {
    renderParentPortal(viewport, state);
  });

  // Bind global navigation link click events
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const hash = this.getAttribute('href');
      navigateTo(hash);
    });
  });

  // Bind logout button
  document.getElementById('btn-logout')?.addEventListener('click', logoutUser);

  // Initialize modular AuthModal controller
  initAuthModal();

  // Run initial routing on startup
  const startHash = window.location.hash || '#home';
  navigateTo(startHash, true);

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    navigateTo(window.location.hash, true);
  });
});

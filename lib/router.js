/* ==========================================================================
   SCODETTO ACADEMY - ROUTER MODULE (Hash-based SPA Router)
   ========================================================================== */

import { state } from '../state.js';

// ── Internal State ──────────────────────────────────────────────────────────
let toastFn = () => {};
const routeMap = {};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Register a toast function for access-denied messages.
 * Avoids circular dependency with app.js (where showToast lives).
 */
export function setToast(fn) {
  toastFn = fn;
}

/**
 * Register a route handler.
 * @param {string} name - Route hash like '#home'
 * @param {function} renderFn - Function that receives the viewport element
 */
export function registerRoute(name, renderFn) {
  routeMap[name] = renderFn;
}

/**
 * Navigate to a hash route.
 * @param {string} hash - Route hash like '#home' or '#admin'
 * @param {boolean} skipHashUpdate - If true, don't push to history (used for popstate)
 */
export function navigateTo(hash, skipHashUpdate = false) {
  const viewport = document.getElementById('app-viewport');
  if (!viewport) return;
  
  const route = hash || '#home';
  
  if (!skipHashUpdate) {
    history.pushState(null, null, route);
  }

  // Update navigation link visual highlights
  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    if (link.getAttribute('href') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Render wrapper function utilizing native View Transition API
  const renderContent = () => {
    viewport.innerHTML = '';
    
    // Auth route guards
    if (route === '#admin' && (!state.user || state.user.role !== 'admin')) {
      toastFn("Accès Refusé. Autorisation d'entraîneur requise. / دخول مرفوض. مطلوب حساب مدرب.", true);
      navigateTo('#home');
      return;
    }
    if (route === '#parent' && (!state.user || state.user.role !== 'parent')) {
      toastFn("Accès Refusé. Inscription requise. / دخول مرفوض. مطلوب حساب ولي أمر.", true);
      navigateTo('#home');
      return;
    }

    // Route matching — fallback to home for unknown routes
    if (routeMap[route]) {
      routeMap[route](viewport);
    } else {
      routeMap['#home']?.(viewport);
    }
  };

  // If browser supports the modern View Transitions API
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      renderContent();
    });
  } else {
    viewport.classList.add('portal-container');
    renderContent();
    setTimeout(() => {
      viewport.classList.remove('portal-container');
    }, 500);
  }
}

/**
 * Get the current route hash.
 */
export function getCurrentRoute() {
  return window.location.hash || '#home';
}

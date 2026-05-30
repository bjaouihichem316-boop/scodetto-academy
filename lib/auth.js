/* ==========================================================================
   SCODETTO ACADEMY - AUTH MODULE (Login, Logout, PIN validation)
   ========================================================================== */

import { state } from '../state.js';
import { navigateTo } from './router.js';
import { defaultPinRegistry } from '../data/defaults.js';

// ── Dependency Injection (avoids circular imports with app.js) ──────────────
let toastFn = () => {};
let audioWhistleFn = () => {};
let audioCrowdFn = () => {};

export function setToast(fn) { toastFn = fn; }
export function setAudioFns({ whistle, crowdCheer }) {
  audioWhistleFn = whistle;
  audioCrowdFn = crowdCheer;
}

// ── PIN Validation ──────────────────────────────────────────────────────────
const pinRegistry = { ...defaultPinRegistry };

export function validatePin(identifier, pin) {
  const stored = pinRegistry[identifier];
  return stored !== undefined && stored === String(pin);
}

// ── User login callback ─────────────────────────────────────────────────────
export function loginUser(role, name) {
  state.user = { role, name };
  
  // Show / Hide navbar options based on role
  const guestActions = document.getElementById('guest-nav-actions');
  const userActions = document.getElementById('user-nav-actions');
  const userRoleBadge = document.getElementById('nav-user-role');
  const userNameText = document.getElementById('nav-user-name');
  
  if (guestActions && userActions && userRoleBadge && userNameText) {
    guestActions.classList.add('hidden');
    userActions.classList.remove('hidden');
    
    userRoleBadge.textContent = role === 'admin' ? 'Coach / مدرب' : 'Parent / ولي';
    userRoleBadge.className = `user-role-badge ${role === 'admin' ? 'admin-role' : ''}`;
    userNameText.textContent = name.split(' ')[0];
  }
  
  toastFn(`Connexion Réussie. Bienvenue ${name}! / تم الدخول بنجاح. أهلاً بك!`);
  
  if (role === 'admin') {
    navigateTo('#admin');
  } else {
    navigateTo('#parent');
  }

  // Stadium Welcome Audio — ADMIN/COACH logins only
  if (role === 'admin') {
    setTimeout(() => { audioWhistleFn(); }, 350);
    setTimeout(() => { audioCrowdFn(); }, 580);
  }
}

// ── User logout callback ────────────────────────────────────────────────────
export function logoutUser() {
  state.user = null;
  
  const guestActions = document.getElementById('guest-nav-actions');
  const userActions = document.getElementById('user-nav-actions');
  
  if (guestActions && userActions) {
    guestActions.classList.remove('hidden');
    userActions.classList.add('hidden');
  }
  toastFn(`Déconnexion réussie. Au revoir! / تم تسجيل الخروج. إلى اللقاء!`);
  navigateTo('#home');
}

// ── Push a new coach-written alert to all parents or a specific group ──────────
export function pushParentAlert(title, body, targetGroup = 'all') {
  if (!state.user || state.user.role !== 'admin') {
    toastFn('Permission refusée. / صلاحية مرفوضة.', true);
    return false;
  }
  const newAlert = {
    id: Date.now(),
    type: 'coach',
    title,
    body,
    targetGroup,
    sentBy: `Coach ${state.user.name}`,
    time: 'À l\'instant / الآن',
    unread: true
  };
  state.parentAlerts = [newAlert, ...state.parentAlerts];
  toastFn(`Alerte envoyée aux ${targetGroup === 'all' ? 'tous les parents' : targetGroup}. / تم إرسال التنبيه.`);
  return true;
}

// ── Facebook Login ──────────────────────────────────────────────────────
export function loginWithFacebook(fbData) {
  // fbData: { accessToken, userID, name, email, picture }
  const parents = state.parents || [];
  
  // Try to match by Facebook userID first (for returning users)
  let match = parents.find(p => p.facebookId === fbData.userID);
  
  // If no match by FB ID, try by email
  if (!match && fbData.email) {
    match = parents.find(p => p.email && p.email.toLowerCase() === fbData.email.toLowerCase());
  }
  
  // If still no match, try by normalized name
  if (!match && fbData.name) {
    const fbName = fbData.name.toLowerCase().trim();
    match = parents.find(p => p.parentName.toLowerCase().trim() === fbName);
  }
  
  if (!match) {
    return { success: false, reason: 'no_match' };
  }
  
  // Link Facebook ID to parent record (first time or re-link)
  if (match.facebookId !== fbData.userID) {
    const updated = state.parents.map(p =>
      p.parentName === match.parentName
        ? { ...p, facebookId: fbData.userID, linkedAt: new Date().toISOString() }
        : p
    );
    state.parents = updated;
  }
  
  // Log the user in
  loginUser('parent', match.parentName);
  
  return { success: true, parentName: match.parentName };
}

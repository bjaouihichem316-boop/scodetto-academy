/* ==========================================================================
   SCODETTO ACADEMY - PERSISTENCE MODULE (localStorage)
   ========================================================================== */

import { getSnapshot, applySnapshot, subscribe } from '../state.js';

// Keys that trigger auto-save when changed
const PERSIST_KEYS = [
  'user', 'roster', 'scheduler', 'childProfiles', 'coaches',
  'notifications', 'weeklyPerformer', 'legendRecords',
  'dailyTasks', 'coachNotes', 'publicSettings', 'parentAlerts'
];

let saveTimer = null;

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem('scodetto-state', JSON.stringify(getSnapshot()));
    } catch (e) {
      /* quota exceeded or private mode */
    }
  }, 300);
}

/**
 * Initialize persistence: hydrate from localStorage and subscribe to changes.
 * Call this once at app bootstrap, BEFORE the first navigateTo() call.
 */
export function initPersistence() {
  // 1. Hydrate state from localStorage
  try {
    const saved = localStorage.getItem('scodetto-state');
    if (saved) {
      applySnapshot(JSON.parse(saved));
    }
  } catch (e) {
    /* ignore parse errors */
  }

  // 2. Subscribe to all state keys for auto-save
  PERSIST_KEYS.forEach(key => subscribe(key, scheduleSave));
}

/**
 * Manually trigger a save snapshot immediately (bypasses debounce).
 */
export function saveSnapshot() {
  if (saveTimer) clearTimeout(saveTimer);
  try {
    localStorage.setItem('scodetto-state', JSON.stringify(getSnapshot()));
  } catch (e) {
    /* quota exceeded or private mode */
  }
}

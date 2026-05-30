/* ==========================================================================
   SCODETTO ACADEMY - STATE MODULE WITH PUB/SUB (BILINGUAL ESM)
   ========================================================================== */

// ── Import Default Data ──────────────────────────────────────────────────────
import { defaultRoster } from './data/roster.js';
import { defaultSchedule } from './data/schedule.js';
import { defaultChildProfiles } from './data/profiles.js';
import { defaultCoaches } from './data/coaches.js';
import { defaultParents } from './data/parents.js';
import { defaultNotifications } from './data/notifications.js';
import {
  defaultWeeklyPerformer,
  defaultLegendRecords,
  defaultDailyTasks,
  defaultCoachNotes,
  defaultPublicSettings,
  defaultParentAlerts
} from './data/defaults.js';

// ── Pub/Sub System ──────────────────────────────────────────────────────────
const subscribers = {};

export function subscribe(key, callback) {
  if (!subscribers[key]) subscribers[key] = new Set();
  subscribers[key].add(callback);
  // Return unsubscribe function
  return () => subscribers[key].delete(callback);
}

function notify(key, value) {
  if (subscribers[key]) {
    subscribers[key].forEach(cb => cb(value));
  }
}

// ── Private State Store ──────────────────────────────────────────────────────
const privateState = {
  user: null,
  roster: [...defaultRoster],
  scheduler: [...defaultSchedule],
  childProfiles: { ...defaultChildProfiles },
  coaches: [...defaultCoaches],
  parents: [...defaultParents],
  notifications: [...defaultNotifications],
  weeklyPerformer: { ...defaultWeeklyPerformer },
  legendRecords: [...defaultLegendRecords],
  dailyTasks: [...defaultDailyTasks],
  coachNotes: [...defaultCoachNotes],
  publicSettings: { ...defaultPublicSettings },
  parentAlerts: [...defaultParentAlerts]
};

// ── Snapshot for persistence (excludes sensitive data) ────────────────────────
export function getSnapshot() {
  return { ...privateState };
}

// ── Hydrate state from a saved snapshot ──────────────────────────────────────
export function applySnapshot(data) {
  for (const key of Object.keys(data)) {
    if (key in privateState) {
      privateState[key] = data[key];
    }
  }
}

// Global application state (mocking a reactive memory DB)
export const state = {
  // Encapsulated dynamic read-write store with role boundary verification guards
  get user() {
    return privateState.user;
  },
  set user(val) {
    privateState.user = val;
  },
  
  get roster() {
    // Strict Guard: If logged in as parent, DO NOT allow reading or leaks of the player roster
    if (privateState.user && privateState.user.role === 'parent') {
      return [];
    }
    return privateState.roster;
  },
  set roster(val) {
    if (privateState.user && privateState.user.role === 'parent') {
      console.warn("Security Alert: Unauthorized roster write attempt blocked.");
      return;
    }
    privateState.roster = val;
    notify('roster', val);
  },
  
  get scheduler() {
    return privateState.scheduler;
  },
  set scheduler(val) {
    privateState.scheduler = val;
    notify('scheduler', val);
  },
  
  get childProfiles() {
    // Strict Guard: If logged in as parent, strictly limit visibility to ONLY their own registered child profile
    if (privateState.user && privateState.user.role === 'parent') {
      const parentName = privateState.user.name;
      const filtered = {};
      if (privateState.childProfiles[parentName]) {
        filtered[parentName] = privateState.childProfiles[parentName];
      }
      return filtered;
    }
    return privateState.childProfiles;
  },
  set childProfiles(val) {
    if (privateState.user && privateState.user.role === 'parent') {
      console.warn("Security Alert: Unauthorized child profiles write attempt blocked.");
      return;
    }
    privateState.childProfiles = val;
    notify('childProfiles', val);
  },
  
  get coaches() {
    return privateState.coaches;
  },
  set coaches(val) {
    privateState.coaches = val;
    notify('coaches', val);
  },

  get parents() {
    return privateState.parents;
  },
  set parents(val) {
    privateState.parents = val;
    notify('parents', val);
  },

  get notifications() {
    return privateState.notifications;
  },
  set notifications(val) {
    privateState.notifications = val;
    notify('notifications', val);
  },

  get weeklyPerformer() {
    return privateState.weeklyPerformer;
  },
  set weeklyPerformer(val) {
    privateState.weeklyPerformer = val;
    notify('weeklyPerformer', val);
    // Broadcast to Hero.js and any listening component for live updates
    window.dispatchEvent(new CustomEvent('weekly-performer-updated', { detail: val }));
  },

  get legendRecords() {
    return privateState.legendRecords;
  },
  set legendRecords(val) {
    privateState.legendRecords = val;
    notify('legendRecords', val);
  },

  get dailyTasks() {
    return privateState.dailyTasks;
  },
  set dailyTasks(val) {
    privateState.dailyTasks = val;
    notify('dailyTasks', val);
  },

  get coachNotes() {
    return privateState.coachNotes;
  },
  set coachNotes(val) {
    privateState.coachNotes = val;
    notify('coachNotes', val);
  },

  // publicSettings — writable only by admin, readable by all for landing page
  get publicSettings() {
    return { ...privateState.publicSettings };
  },
  set publicSettings(val) {
    if (privateState.user && privateState.user.role !== 'admin') {
      console.warn('Security: Only admins can update public settings.');
      return;
    }
    privateState.publicSettings = { ...privateState.publicSettings, ...val };
    notify('publicSettings', val);
    // Broadcast so landing page blocks can re-render their live values
    window.dispatchEvent(new CustomEvent('public-settings-updated', { detail: privateState.publicSettings }));
  },

  // parentAlerts — writable by admin, readable filtered by role
  get parentAlerts() {
    // Admin sees everything; parents see only alerts targeting their child's group or 'all'
    if (!privateState.user) return [];
    if (privateState.user.role === 'admin') return privateState.parentAlerts;
    // For parents: find which group their child belongs to
    const childProfile = privateState.childProfiles[privateState.user.name];
    const childGroup = childProfile?.group || null;
    return privateState.parentAlerts.filter(a =>
      a.targetGroup === 'all' ||
      a.targetGroup === childGroup ||
      a.targetGroup === privateState.user.name
    );
  },
  set parentAlerts(val) {
    privateState.parentAlerts = val;
    notify('parentAlerts', val);
    window.dispatchEvent(new CustomEvent('parent-alerts-updated', { detail: val }));
  }
};

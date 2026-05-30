import { state } from '../state.js';

/* ==========================================================================
   Coach Dashboard — Mobile-First Responsive
   ========================================================================== */

export function renderCoaches(container) {
  if (container.querySelector('.coaches-dashboard')) return;

  container.insertAdjacentHTML('beforeend', buildDashboardHTML());

  setupQuickActions();
  setupFifaCardsTilt();
  bindCoachesClicks();
}

/* ── Dashboard HTML ──────────────────────────────────────────────────── */

function buildDashboardHTML() {
  const coach = state.coaches?.[0];
  const squad = state.roster || [];
  const sessions = state.scheduler || [];
  const todayEn = getTodayEnglish();

  const dayNamesFR = {
    Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi',
    Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche'
  };

  return `
    <section class="section-wrapper coaches-dashboard" id="coaches-dashboard">

      <!-- ═══ Coach Header Bar ═══ -->
      <div class="coach-header">
        <div class="coach-avatar-mini">
          <span>${coach?.nameFr?.split(' ')[1]?.[0] || 'C'}</span>
        </div>
        <div class="coach-header-info">
          <h2 class="coach-header-name">${coach?.nameFr || 'Coach'}</h2>
          <span class="coach-header-role">${coach?.roleFr || ''}</span>
        </div>
        <div class="coach-header-stats">
          <div class="coach-stat-badge">
            <span class="csb-value">${coach?.rating || 0}</span>
            <span class="csb-label">OVR</span>
          </div>
          <div class="coach-stat-badge">
            <span class="csb-value">${coach?.achievementsFr?.length || 0}</span>
            <span class="csb-label">Trophées</span>
          </div>
          <div class="coach-stat-badge">
            <span class="csb-value">${squad.length}</span>
            <span class="csb-label">Joueurs</span>
          </div>
        </div>
      </div>

      <!-- ═══ Dashboard Grid ═══ -->
      <div class="dashboard-grid">

        <!-- ── Squad Overview ── -->
        <details class="dash-section" open>
          <summary class="dash-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Effectif / التشكيلة</span>
            <span class="dash-count-badge">${squad.length}</span>
          </summary>
          <div class="dash-section-body">
            ${buildSquadList(squad)}
          </div>
        </details>

        <!-- ── Training Schedule ── -->
        <details class="dash-section" open>
          <summary class="dash-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Séances / الحصص</span>
            ${todaySessionsCount(sessions, todayEn) ? `<span class="dash-count-badge today-dot">${todaySessionsCount(sessions, todayEn)} aujourd'hui</span>` : ''}
          </summary>
          <div class="dash-section-body">
            ${buildScheduleBlock(sessions, todayEn, dayNamesFR)}
          </div>
        </details>

        <!-- ── Quick Actions ── -->
        <details class="dash-section" open>
          <summary class="dash-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Actions Rapides / إجراءات سريعة</span>
          </summary>
          <div class="dash-section-body">
            <div class="quick-actions-grid">
              ${buildQuickActions()}
            </div>
          </div>
        </details>

        <!-- ── Staff Profiles (Original FIFA Cards) ── -->
        <details class="dash-section staff-section">
          <summary class="dash-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Staff Technique / الطاقم الفني</span>
            <span class="dash-count-badge">${state.coaches.length}</span>
          </summary>
          <div class="dash-section-body">
            <div class="coaches-grid" id="coaches-grid-staff">
              ${buildFifaCardHTML()}
            </div>
          </div>
        </details>

      </div>
    </section>
  `;
}

/* ── Helper: get today's English day name ───────────────────────────── */

function getTodayEnglish() {
  const map = { 1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday',0:'Sunday' };
  return map[new Date().getDay()] || 'Monday';
}

/* ── Helper: count today's sessions ─────────────────────────────────── */

function todaySessionsCount(sessions, todayEn) {
  return sessions.filter(s => s.day === todayEn).length;
}

/* ── Squad List Builder ─────────────────────────────────────────────── */

function buildSquadList(squad) {
  const groups = {};
  squad.forEach(p => {
    const g = p.group || 'Non assigné';
    if (!groups[g]) groups[g] = [];
    groups[g].push(p);
  });
  const groupKeys = Object.keys(groups).sort();

  if (!groupKeys.length) {
    return '<div class="squad-empty"><span>Aucun joueur / لا يوجد لاعبين</span></div>';
  }

  return `<div class="squad-list">
    ${groupKeys.map(gk => `
      <div class="squad-group">
        <div class="squad-group-header">
          <span>${gk}</span>
          <span class="sg-count">${groups[gk].length}</span>
        </div>
        ${groups[gk].map(p => `
          <div class="squad-player-row">
            <div class="squad-player-avatar">${p.name.charAt(0).toUpperCase()}</div>
            <div class="squad-player-info">
              <span class="squad-player-name">${p.name}</span>
              <span class="squad-player-meta">${p.age} ans · ${p.parent}</span>
            </div>
            <span class="squad-player-status ${p.status === 'paid' ? 'paid' : 'unpaid'}" title="${p.status === 'paid' ? 'Payé / مدفوع' : 'Impayé / غير مدفوع'}">
              ${p.status === 'paid' ? '✓' : '!'}
            </span>
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>`;
}

/* ── Schedule Block Builder ─────────────────────────────────────────── */

function buildScheduleBlock(sessions, todayEn, dayNamesFR) {
  const todaySessions = sessions.filter(s => s.day === todayEn);
  const upcomingSessions = sessions.filter(s => s.day !== todayEn).slice(0, 4);

  const renderSession = (s) => `
    <div class="schedule-item ${s.day === todayEn ? 'today' : ''}">
      <div class="schedule-item-time">
        <span class="si-day">${dayNamesFR[s.day] || s.day}</span>
        <span class="si-time">${s.time}</span>
      </div>
      <div class="schedule-item-info">
        <span class="si-title">${s.title}</span>
        <span class="si-meta">Terrain ${s.field} · ${s.coach}</span>
      </div>
      <span class="si-group-badge ${s.group === 'All' ? 'all' : ''}">${s.group}</span>
    </div>
  `;

  let html = '';

  if (todaySessions.length) {
    html += `<div class="schedule-group-label today-label">Aujourd'hui / اليوم</div>`;
    html += todaySessions.map(renderSession).join('');
  } else {
    html += `<div class="schedule-empty"><span>Aucune séance aujourd'hui / لا توجد حصص اليوم</span></div>`;
  }

  if (upcomingSessions.length) {
    html += `<div class="schedule-group-label upcoming-label">À venir / القادم</div>`;
    html += upcomingSessions.map(renderSession).join('');
  }

  return html;
}

/* ── Quick Actions Builder ──────────────────────────────────────────── */

function buildQuickActions() {
  const iconsSVG = {
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    check: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  };

  const actions = [
    { id: 'roster', icon: 'users', label: 'Effectif', desc: 'Gérer les joueurs / إدارة اللاعبين' },
    { id: 'schedule', icon: 'calendar', label: 'Planning', desc: 'Voir le calendrier / عرض الجدول' },
    { id: 'attendance', icon: 'check', label: 'Présences', desc: 'Pointer les présents / تسجيل الحضور' },
    { id: 'stats', icon: 'chart', label: 'Stats', desc: 'Performances / الإحصائيات' },
    { id: 'addplayer', icon: 'plus', label: 'Ajouter', desc: 'Nouveau joueur / إضافة لاعب' },
    { id: 'message', icon: 'message', label: 'Message', desc: 'Aux parents / إلى الأولياء' },
  ];

  return actions.map(a => `
    <button class="qa-btn" data-action="${a.id}" aria-label="${a.label}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${iconsSVG[a.icon]}
      </svg>
      <span class="qa-btn-label">${a.label}</span>
      <span class="qa-btn-desc">${a.desc}</span>
    </button>
  `).join('');
}

/* ── Quick Actions Setup ────────────────────────────────────────────── */

function setupQuickActions() {
  const buttons = document.querySelectorAll('.qa-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const { navigateTo } = requireRouter();
      switch (action) {
        case 'roster': navigateTo('admin'); break;
        case 'schedule': navigateTo('admin'); break;
        case 'addplayer': navigateTo('admin'); break;
        case 'attendance': showComingSoon('Présences / الحضور'); break;
        case 'stats': showComingSoon('Statistiques / الإحصائيات'); break;
        case 'message': showComingSoon('Messages / الرسائل'); break;
      }
    });
  });
}

function requireRouter() {
  // Dynamic import fallback — router is a singleton on window
  // but we try module import first
  try {
    // Inline the navigation to avoid circular deps
    const hash = window.location.hash;
    return {
      navigateTo: (route) => {
        window.location.hash = route;
      }
    };
  } catch (e) {
    return { navigateTo: (route) => { window.location.hash = route; } };
  }
}

function showComingSoon(feature) {
  // Use existing toast if available
  const { showToast } = requireNotifications();
  if (showToast) {
    showToast(`${feature} — Bientôt disponible / قريباً`, 'info');
  } else {
    alert(`${feature} — Coming soon`);
  }
}

function requireNotifications() {
  try {
    // Try to get showToast from app.js exports
    return { showToast: window.__scodettoToast || null };
  } catch (e) {
    return { showToast: null };
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   PRESERVED: Original FIFA Staff Cards + CV Drawer
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Build Original FIFA Cards HTML ──────────────────────────────────── */

function buildFifaCardHTML() {
  return `
    <!-- Mohamed: Academy Head (Gold FUT Card) -->
    <div class="fifa-card-container">
      <div class="fifa-rating-card coach-gold" id="card-mohamed">
        <div class="fifa-card-glow"></div>
        <div class="fifa-card-bg-mesh"></div>
        <div class="fifa-card-top">
          <div class="fifa-score-block">
            <span class="fifa-rating">92</span>
            <span class="fifa-position" style="font-size:0.75rem;">DIR / مدير</span>
          </div>
          <div class="fifa-badges">
            <svg width="24" height="16" viewBox="0 0 24 16">
              <rect width="24" height="16" fill="#D61A22" rx="2"/>
              <circle cx="12" cy="8" r="4.5" fill="white"/>
              <circle cx="11.2" cy="8" r="3.2" fill="#D61A22"/>
              <circle cx="12.8" cy="8" r="2.7" fill="white"/>
              <polygon points="14.5,6.8 14.9,8.0 16.0,8.0 15.1,8.7 15.4,9.9 14.5,9.2 13.6,9.9 13.9,8.7 13.0,8.0 14.1,8.0" fill="#D61A22"/>
            </svg>
            <svg width="20" height="24" viewBox="0 0 100 100">
              <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D4AF37" stroke-width="8"/>
            </svg>
          </div>
        </div>
        <div class="fifa-avatar-container">
          <svg class="fifa-avatar-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="2"/>
            <path d="M50,15 C58,15 65,22 65,30 C65,38 58,45 50,45 C42,45 35,38 35,30 C35,22 42,15 50,15 Z" fill="#D4AF37"/>
            <path d="M20,80 C20,62 33,52 50,52 C67,52 80,62 80,80 Z" fill="#0A2540" stroke="#D4AF37" stroke-width="3"/>
            <path d="M35,25 Q50,10 65,25 Q50,15 35,25 Z" fill="#2c3e50"/>
            <polygon points="50,58 44,52 56,52" fill="#D61A22"/>
          </svg>
        </div>
        <h3 class="fifa-card-name" style="font-family:'Outfit','Cairo',sans-serif;">Mohamed</h3>
        <div class="fifa-stats-grid">
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">TAC / تكتيك</span>
            <span class="fifa-stat-value">95</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">DRI / مراوغة</span>
            <span class="fifa-stat-value">88</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">LDR / قيادة</span>
            <span class="fifa-stat-value">96</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">PAS / تمرير</span>
            <span class="fifa-stat-value">91</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">STR / تخطيط</span>
            <span class="fifa-stat-value">85</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">ANA / تحليل</span>
            <span class="fifa-stat-value">94</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(212,175,55,0.15);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(212,175,55,0.6));flex-shrink:0;">
            <rect x="8" y="2" width="8" height="4" rx="1" fill="rgba(212,175,55,0.15)"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" style="filter:drop-shadow(0 0 4px rgba(212,175,55,0.5));flex-shrink:0;">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <span style="font-size:0.6rem;color:rgba(212,175,55,0.7);font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Outfit',sans-serif;">Tactique &bull; Stratégie</span>
        </div>
      </div>
    </div>

    <!-- Monta: Assistant Coach (Red FUT Card) -->
    <div class="fifa-card-container">
      <div class="fifa-rating-card coach-red" id="card-monta">
        <div class="fifa-card-glow"></div>
        <div class="fifa-card-bg-mesh"></div>
        <div class="fifa-card-top">
          <div class="fifa-score-block">
            <span class="fifa-rating">88</span>
            <span class="fifa-position" style="font-size:0.75rem;">ADJ / مساعد</span>
          </div>
          <div class="fifa-badges">
            <svg width="24" height="16" viewBox="0 0 24 16">
              <rect width="24" height="16" fill="#D61A22" rx="2"/>
              <circle cx="12" cy="8" r="4.5" fill="white"/>
              <circle cx="11.2" cy="8" r="3.2" fill="#D61A22"/>
              <circle cx="12.8" cy="8" r="2.7" fill="white"/>
              <polygon points="14.5,6.8 14.9,8.0 16.0,8.0 15.1,8.7 15.4,9.9 14.5,9.2 13.6,9.9 13.9,8.7 13.0,8.0 14.1,8.0" fill="#D61A22"/>
            </svg>
            <svg width="20" height="24" viewBox="0 0 100 100">
              <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D61A22" stroke-width="8"/>
            </svg>
          </div>
        </div>
        <div class="fifa-avatar-container">
          <svg class="fifa-avatar-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(214,26,34,0.2)" stroke-width="2"/>
            <path d="M50,15 C58,15 65,22 65,30 C65,38 58,45 50,45 C42,45 35,38 35,30 C35,22 42,15 50,15 Z" fill="#D61A22"/>
            <path d="M20,80 C20,62 33,52 50,52 C67,52 80,62 80,80 Z" fill="#0A2540" stroke="#D61A22" stroke-width="3"/>
            <path d="M30,26 Q50,12 70,26 L65,16 Q50,10 35,16 Z" fill="#1a2530"/>
            <path d="M35,26 L65,26 L70,30 L30,30 Z" fill="#D61A22"/>
            <line x1="50" y1="52" x2="50" y2="65" stroke="white" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="fifa-card-name" style="font-family:'Outfit','Cairo',sans-serif;">Monta</h3>
        <div class="fifa-stats-grid">
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">VIT / سرعة</span>
            <span class="fifa-stat-value">91</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">DRI / مراوغة</span>
            <span class="fifa-stat-value">86</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">EXO / تمارين</span>
            <span class="fifa-stat-value">94</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">PAS / تمرير</span>
            <span class="fifa-stat-value">84</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">PHY / بدني</span>
            <span class="fifa-stat-value">93</span>
          </div>
          <div class="fifa-stat-item">
            <span class="fifa-stat-label">MEN / ذهن</span>
            <span class="fifa-stat-value">90</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(214,26,34,0.18);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D61A22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(214,26,34,0.6));flex-shrink:0;">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(214,26,34,0.12)"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D61A22" stroke-width="2" stroke-linecap="round" style="filter:drop-shadow(0 0 4px rgba(214,26,34,0.5));flex-shrink:0;">
            <circle cx="16" cy="4" r="2"/>
            <path d="M14 10l-4 1-3 7"/>
            <path d="M14 10l2 5 4 2"/>
            <path d="M10 11l-2 6"/>
          </svg>
          <span style="font-size:0.6rem;color:rgba(214,26,34,0.75);font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Outfit',sans-serif;">Vitesse &bull; Physique</span>
        </div>
      </div>
    </div>
  `;
}

/* ── Bind Coach Card Clicks ──────────────────────────────────────────── */

function bindCoachesClicks() {
  const cards = [
    { id: 'mohamed', el: document.getElementById('card-mohamed') },
    { id: 'monta', el: document.getElementById('card-monta') }
  ];

  cards.forEach(item => {
    if (item.el) {
      const parentContainer = item.el.closest('.fifa-card-container');
      if (parentContainer) parentContainer.style.cursor = 'pointer';

      item.el.addEventListener('click', () => {
        openCoachCVDrawer(item.id);
      });
    }
  });
}

/* ── Open Coach CV Drawer ───────────────────────────────────────────── */

function openCoachCVDrawer(coachId) {
  const coach = state.coaches.find(c => c.id === coachId);
  if (!coach) return;

  let backdrop = document.querySelector('.cv-drawer-backdrop');
  let drawer = document.querySelector('.cv-drawer');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'cv-drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'cv-drawer';
    document.body.appendChild(drawer);
  }

  drawer.innerHTML = `
    <div class="cv-drawer-header">
      <div class="cv-drawer-title">
        <h2 style="font-family:'Outfit','Cairo',sans-serif;font-weight:800;color:var(--color-accent-gold);">${coach.nameFr}</h2>
        <span style="font-size:0.8rem;color:var(--color-text-muted);display:block;margin-top:2px;">${coach.roleFr} / ${coach.roleAr}</span>
      </div>
      <button class="dialog-close-btn" id="btn-close-cv-drawer" style="position:static;" aria-label="Fermer / إغلاق">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="cv-drawer-body">
      <div class="cv-section">
        <div class="cv-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Bio / السيرة الذاتية
        </div>
        <p class="cv-bio-p" style="font-size:0.88rem;line-height:1.6;margin-bottom:10px;">${coach.bioFr}</p>
        <p class="cv-bio-p arabic-txt" style="font-size:0.88rem;line-height:1.6;color:var(--color-accent-gold);">${coach.bioAr}</p>
      </div>
      <div class="cv-section">
        <div class="cv-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
          Diplômes / الشهادات والخبرات
        </div>
        <ul class="cv-list">
          ${coach.certificationsFr.map((cert, idx) => `
            <li class="cv-list-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-accent-gold);margin-top:3px;flex-shrink:0;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <strong>${cert}</strong>
                <span class="arabic-txt" style="display:block;font-size:0.75rem;color:var(--color-text-muted);margin-top:2px;">${coach.certificationsAr[idx]}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="cv-section">
        <div class="cv-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15 8.5 22 9 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9 9 8.5 12 2"/>
          </svg>
          Palmarès / كؤوس وألقاب المدرب
        </div>
        <ul class="cv-list">
          ${coach.achievementsFr.map((ach, idx) => `
            <li class="cv-list-item" style="border-color:rgba(212,175,55,0.2);background:rgba(212,175,55,0.03);">
              <span style="font-size:1.1rem;margin-top:2px;flex-shrink:0;">🏆</span>
              <div>
                <strong style="color:var(--color-accent-gold);">${ach}</strong>
                <span class="arabic-txt" style="display:block;font-size:0.75rem;color:var(--color-text-muted);margin-top:2px;">${coach.achievementsAr[idx]}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

  setTimeout(() => {
    backdrop.classList.add('open');
    drawer.classList.add('open');
  }, 10);

  const closeCV = () => {
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
  };

  drawer.querySelector('#btn-close-cv-drawer')?.addEventListener('click', closeCV);
  backdrop.addEventListener('click', closeCV);
}

/* ── 3D Tilt Effect (Disabled on Touch Devices) ─────────────────────── */

function setupFifaCardsTilt() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const cards = document.querySelectorAll('.fifa-rating-card');

  cards.forEach(card => {
    const glow = card.querySelector('.fifa-card-glow');

    // On touch devices: apply a subtle static CSS glow instead of dynamic tilt
    if (isTouch) {
      card.style.transform = 'none';
      if (glow) {
        glow.style.setProperty('--glow-x', '50%');
        glow.style.setProperty('--glow-y', '50%');
        glow.style.opacity = '0.15';
      }
      return;
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;

      const rotateX = -py * 20;
      const rotateY = px * 20;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

      if (glow) {
        glow.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        glow.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      if (glow) {
        glow.style.setProperty('--glow-x', '50%');
        glow.style.setProperty('--glow-y', '50%');
      }
    });
  });
}

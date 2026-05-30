/* ==========================================================================
   ADMIN DASHBOARD MODULE - BILINGUAL COHESION
   ========================================================================== */

import { navigateTo } from '../lib/router.js';
import { showToast } from '../lib/notifications.js';

export function renderAdminDashboard(container, dbState) {
  
  // Local active state — resolve coach from logged-in user name
  let activePlayerId = dbState.roster[0]?.id || null;
  // Find coach whose nameFr contains the logged-in user's name (case-insensitive)
  const loggedInName = (dbState.user?.name || '').toLowerCase();
  const resolvedCoach = dbState.coaches.find(c => c.nameFr.toLowerCase().includes(loggedInName) || c.id === loggedInName);
  let activeCoachId = resolvedCoach?.id || dbState.coaches[0]?.id || 'mohamed';

  // Render bilingual Roster Rows
  const renderRosterListHTML = (rosterData) => {
    if (rosterData.length === 0) {
      return '<div class="roster-row"><p style="text-align:center;width:100%;color:var(--color-text-muted);">Aucun athlète trouvé. / لا يوجد أي لاعب.</p></div>';
    }
    return rosterData.map(player => {
      const isActive = player.id === activePlayerId;
      return `
        <div class="roster-row ${isActive ? 'active-row-highlight' : ''}" data-id="${player.id}" style="cursor:pointer; transition: all 0.3s ease; border: 1.5px solid ${isActive ? 'var(--color-accent-gold)' : 'var(--glass-border)'}; background: ${isActive ? 'rgba(212,175,55,0.05)' : 'var(--glass-bg)'}; margin-bottom: 10px; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div class="player-meta-info" style="display:flex; align-items:center; gap:12px;">
            <div class="player-init-badge" style="width:40px; height:40px; border-radius:50%; background:var(--color-primary-navy-light); color:var(--color-accent-gold); display:flex; align-items:center; justify-content:center; font-weight:700; border:1px solid var(--color-accent-gold-glow); font-family:var(--font-display);">${player.name.split(' ').map(n=>n[0]).join('')}</div>
            <div class="player-details">
              <h4 style="font-family:'Outfit','Cairo',sans-serif; margin:0; font-size:1rem; color:white;">${player.name}</h4>
              <p style="margin:4px 0 0; font-size:0.78rem; color:var(--color-text-muted);">${player.age} ans / سنة &bull; ${player.group} &bull; Parent: ${player.parent}</p>
            </div>
          </div>
          <div class="player-action-controls" style="display:flex; align-items:center; gap:15px;">
            <span class="player-phone-lbl" style="font-size:0.8rem; color:var(--color-text-muted);">${player.phone}</span>
            <button class="btn-delete-player" data-id="${player.id}" title="Supprimer / حذف">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
            <button class="payment-status-pill ${player.status}" data-id="${player.id}">
              <span class="status-indicator"></span>
              ${player.status === 'paid' ? 'Payé / خلاص' : 'Non Payé / غير خالص'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  };

  const calculateFinancials = () => {
    const totalPlayers = dbState.roster.length;
    const paidPlayers = dbState.roster.filter(p => p.status === 'paid').length;
    const unpaidPlayers = totalPlayers - paidPlayers;
    
    const revenue = paidPlayers * 120;
    const outstanding = unpaidPlayers * 120;
    
    return { totalPlayers, paidPlayers, unpaidPlayers, revenue, outstanding };
  };

  const updateStats = () => {
    const fin = calculateFinancials();
    const statPlayers = container.querySelector('#stat-players');
    const statRevenue = container.querySelector('#stat-revenue');
    const statOutstanding = container.querySelector('#stat-outstanding');
    
    if (statPlayers) statPlayers.textContent = fin.totalPlayers;
    if (statRevenue) statRevenue.textContent = `${fin.revenue} TND`;
    if (statOutstanding) statOutstanding.textContent = `${fin.outstanding} TND`;
  };

  const renderSchedulerGrid = (activeField = "A") => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysBilingual = {
      "Monday": "Lundi / الاثنين",
      "Tuesday": "Mardi / الثلاثاء",
      "Wednesday": "Mercredi / الأربعاء",
      "Thursday": "Jeudi / الخميس",
      "Friday": "Vendredi / الجمعة",
      "Saturday": "Samedi / السبت"
    };
    const slots = ["16:00", "17:30", "19:00"];
    
    let calendarHTML = `
      <table class="scheduler-calendar">
        <thead>
          <tr>
            <th>Time</th>
            ${days.map(d=>`<th style="font-family:'Cairo',sans-serif;font-size:0.75rem;">${daysBilingual[d]}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;
    
    slots.forEach(slot => {
      calendarHTML += `<tr><td style="font-weight:700;font-family:var(--font-display);font-size:0.8rem;color:var(--color-text-muted);">${slot}</td>`;
      days.forEach(day => {
        // Find if slot is booked
        const session = dbState.scheduler.find(s => s.day === day && s.time === slot && s.field === activeField);
        
        calendarHTML += `
          <td class="calendar-slot-cell" data-day="${day}" data-time="${slot}" data-field="${activeField}">
            <span class="slot-time-lbl"></span>
            ${session ? `
              <div class="scheduled-session ${activeField === 'B' ? 'field-b-session' : ''}" data-id="${session.id}" style="position:relative;">
                <strong style="font-size:0.75rem;">${session.title}</strong><br>
                <span style="font-size:0.7rem;opacity:0.9;">Coach ${session.coach} (${session.group})</span>
                <button class="btn-delete-session" data-id="${session.id}" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);border:none;color:#ef4444;cursor:pointer;font-size:0.65rem;padding:1px 4px;border-radius:3px;line-height:1;z-index:5;" title="Supprimer / حذف">✕</button>
              </div>
            ` : `<span style="font-size:0.7rem;color:rgba(255,255,255,0.05);cursor:pointer;">Libre / شاغر</span>`}
          </td>
        `;
      });
      calendarHTML += '</tr>';
    });
    
    calendarHTML += '</tbody></table>';
    return calendarHTML;
  };

  const renderCoachSwitcherHTML = () => {
    return `
      <div class="coach-switcher-container">
        <label for="dash-coach-select" style="font-size:0.75rem;color:var(--color-text-muted);font-weight:700;font-family:'Cairo',sans-serif;margin:0;">Entraîneur Actif / المدرب:</label>
        <select id="dash-coach-select">
          ${dbState.coaches.map(c => `<option value="${c.id}" ${c.id === activeCoachId ? 'selected' : ''}>${c.nameFr} (${c.position.split(' ')[0]})</option>`).join('')}
        </select>
        <button class="btn btn-sm btn-outline" id="btn-open-coach-drawer" style="padding:4px 10px;font-size:0.7rem;border-radius:20px;margin-left:5px;cursor:pointer;">+ Entraîneur / مدرب</button>
      </div>
    `;
  };

  const fin = calculateFinancials();
  
  const dashboardHTML = `
    <div class="portal-container admin-portal-dashboard">
      
      <!-- Top billing header -->
      <div class="portal-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom:30px;">
        <div class="portal-title-block">
          <h1 style="font-family:'Outfit','Cairo',sans-serif; margin:0;">Direction Administrative / إدارة الأكاديمية</h1>
          <p style="margin:5px 0 0; color:var(--color-text-muted); font-size:0.9rem;">Tableau de Bord &bull; Suivi Technique des Joueurs &bull; La Marsa, Tunis</p>
        </div>
        <div style="display:flex; align-items:center; gap:15px; flex-wrap:wrap;">
          <div id="coach-switcher-viewport">
            ${renderCoachSwitcherHTML()}
          </div>
          <button class="btn btn-outline" id="btn-dashboard-back-home">Site Public / Site &larr;</button>
        </div>
      </div>
      
      <!-- Key Stats Row -->
      <div class="stats-summary-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
          </div>
          <div class="stat-details">
            <h3 style="font-family:'Cairo',sans-serif;font-size:0.75rem;">Garçons Inscrits / اللاعبون</h3>
            <div class="stat-number" id="stat-players">${fin.totalPlayers}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background:rgba(16,185,129,0.1);color:#10b981;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div class="stat-details">
            <h3 style="font-family:'Cairo',sans-serif;font-size:0.75rem;">Frais Collectés / المستخلصات</h3>
            <div class="stat-number" id="stat-revenue" style="color:#10b981;">${fin.revenue} TND</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background:rgba(239,68,68,0.1);color:#ef4444;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="stat-details">
            <h3 style="font-family:'Cairo',sans-serif;font-size:0.75rem;">En Suspens / مستحقات متأخرة</h3>
            <div class="stat-number" id="stat-outstanding" style="color:#ef4444;">${fin.outstanding} TND</div>
          </div>
        </div>
      </div>
      
      <!-- Double Column Panel Layout -->
      <div class="portal-grid-two-cols">
        
        <!-- Left: Player Directory -->
        <div class="portal-card-block">
          <div class="block-header">
            <h2 style="font-family:'Outfit','Cairo',sans-serif;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Roster des Garçons / قائمة اللاعبين
            </h2>
            <button class="btn btn-sm btn-accent" id="btn-open-drawer">Ajouter / تسجيل لاعب</button>
          </div>
          
          <div class="filter-search-row">
            <div class="search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" class="input-field" id="search-player-input" placeholder="Rechercher par nom ou parent / بحث باسم اللاعب...">
            </div>
            
            <select class="select-field" id="filter-group-select" style="font-family:'Cairo',sans-serif;">
              <option value="All">Tous / جميع الفئات</option>
              <option value="U6">Scodetto Bambinos</option>
              <option value="U10">U10 Sparks</option>
              <option value="U12">U12 Elite</option>
              <option value="U14">U14 Tactique</option>
            </select>
          </div>
          
          <div class="roster-list" id="roster-list-container">
            ${renderRosterListHTML(dbState.roster)}
          </div>
        </div>
        
        <!-- Right: Field Scheduler -->
        <div class="portal-card-block">
          <div class="block-header">
            <h2 style="font-family:'Outfit','Cairo',sans-serif;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Planning Terrains / جدول الملاعب
            </h2>
            <div class="field-selector-tabs">
              <button class="field-tab-btn active" id="tab-field-a">Terrain A / الملعب أ</button>
              <button class="field-tab-btn" id="tab-field-b">Terrain B / الملعب ب</button>
            </div>
          </div>
          
          <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:15px;line-height:1.4;">
            Affectation des créneaux horaires à La Marsa. Cliquez sur un créneau libre pour planifier.<br>
            انقر على حصة فارغة لجدولة حصة تدريبية.
          </p>
          
          <div class="scheduler-table-container" id="scheduler-table-viewport" style="overflow-x:auto;">
            ${renderSchedulerGrid("A")}
          </div>
          <div class="add-session-form" style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.05);display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
            <input type="text" id="new-session-day" placeholder="Jour / اليوم (Ex: Monday)" style="padding:10px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.8rem;">
            <input type="text" id="new-session-time" placeholder="Heure / الوقت (Ex: 18:00)" style="padding:10px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.8rem;">
            <input type="text" id="new-session-title" placeholder="Titre / العنوان" style="padding:10px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.8rem;">
            <input type="text" id="new-session-field" placeholder="Terrain / الملعب (A or B)" style="padding:10px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.8rem;" value="A">
            <button id="btn-add-session" class="btn btn-primary btn-sm" style="padding:10px 16px;font-size:0.8rem;">➕ Ajouter Séance / إضافة حصة</button>
          </div>
        </div>
        
      </div>

      <!-- CORE NEW INTERACTIVE PLAYER EDITOR CARD -->
      <div id="player-editor-container" class="portal-card-block admin-player-editor-block">
        <!-- Rendered dynamically by renderPlayerEditor() -->
      </div>

      <!-- ═══ WEEKLY PERFORMER MANAGER — Live-publish spotlight player to public site ═══ -->
      <div class="portal-card-block" id="weekly-perf-manager-panel" style="margin-top:30px;">
        <div class="block-header" style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:15px;margin-bottom:20px;">
          <h2 style="font-family:'Outfit','Cairo',sans-serif;display:flex;align-items:center;gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Performance de la Semaine / أداء الأسبوع
          </h2>
          <span class="live-update-badge">🔴 LIVE</span>
        </div>
        <p style="font-size:0.83rem;color:var(--color-text-muted);line-height:1.5;margin-bottom:18px;">Sélectionnez l'athlète de la semaine visible sur le site public. / اختر لاعب الأسبوع ليظهر على الموقع العام.</p>
        <form id="weekly-perf-form" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="form-group">
            <label for="wk-player-sel" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.8rem;">Athlète de la Semaine / لاعب الأسبوع</label>
            <select class="form-control" id="wk-player-sel" style="font-family:'Cairo',sans-serif;">
              ${dbState.roster.map(p => `<option value="${p.id}">${p.name} (${p.group})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="wk-metric-type" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.8rem;">Type de Performance / نوع الأداء</label>
            <select class="form-control" id="wk-metric-type" style="font-family:'Cairo',sans-serif;">
              <option value="🎯|Meilleur Passeur / أفضل مُمرِّر">🎯 Meilleur Passeur / أفضل مُمرِّر</option>
              <option value="⚽|Top Buteur / أفضل هداف">⚽ Top Buteur / أفضل هداف</option>
              <option value="🛡️|Meilleur Défenseur / أفضل مدافع">🛡️ Meilleur Défenseur / أفضل مدافع</option>
              <option value="⚡|Vitesse Explosive / سرعة انفجارية">⚡ Vitesse Explosive / سرعة انفجارية</option>
              <option value="🌟|Esprit d'Équipe / روح الفريق">🌟 Esprit d'Équipe / روح الفريق</option>
              <option value="🎖️|Golden Response / الرد الذهبي">🎖️ Golden Response / الرد الذهبي</option>
            </select>
          </div>
          <div class="form-group">
            <label for="wk-metric-val" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.8rem;">Description / وصف الأداء</label>
            <input type="text" class="form-control" id="wk-metric-val" placeholder="Ex: 5 buts cette semaine / 5 أهداف هذا الأسبوع">
          </div>
          <div class="form-group">
            <label for="wk-week-label" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.8rem;">Période / فترة الأسبوع</label>
            <input type="text" class="form-control" id="wk-week-label" value="Semaine du ${new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'})}">
          </div>
          <div class="form-group" style="grid-column:1/-1;display:flex;justify-content:flex-end;">
            <button type="submit" class="btn btn-primary" style="padding:11px 28px;display:flex;align-items:center;gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Publier sur Site / نشر على الموقع
            </button>
          </div>
        </form>
      </div>

      <!-- ═══ LEGEND FILE MANAGER — Elite transfer records registry ═══ -->
      <div class="portal-card-block" id="legend-file-manager-panel" style="margin-top:30px;">
        <div class="block-header" style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:15px;margin-bottom:20px;">
          <h2 style="font-family:'Outfit','Cairo',sans-serif;display:flex;align-items:center;gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
            Fichiers Légendes — Transferts / السجل الذهبي
          </h2>
          <button class="btn btn-sm btn-accent" id="btn-toggle-add-legend" style="font-size:0.73rem;padding:5px 12px;">+ Nouveau Transfert / إضافة</button>
        </div>
        <div id="legend-records-list">
          <div class="legend-record-item">
            <div style="width:34px;height:34px;border-radius:7px;background:#D61A22;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:900;color:white;flex-shrink:0;">CA</div>
            <div style="flex:1;">
              <div class="legend-club-name">Club Africain</div>
              <div class="legend-transfer-names">Malek B., Hamza S., Rayen K.</div>
              <div class="legend-transfer-years">📅 2023, 2024, 2025</div>
            </div>
            <span style="font-size:0.72rem;font-weight:700;color:var(--color-accent-gold);background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);padding:3px 10px;border-radius:20px;">3 transferts</span>
          </div>
          <div class="legend-record-item">
            <div style="width:34px;height:34px;border-radius:7px;background:#27ae60;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:900;color:white;flex-shrink:0;">ASM</div>
            <div style="flex:1;">
              <div class="legend-club-name">Avenir Sportif de La Marsa (AS Marsa)</div>
              <div class="legend-transfer-names">Youssef B., Skander L., Yassine G.</div>
              <div class="legend-transfer-years">📅 2024, 2025, 2026</div>
            </div>
            <span style="font-size:0.72rem;font-weight:700;color:var(--color-accent-gold);background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);padding:3px 10px;border-radius:20px;">3 transferts</span>
          </div>
        </div>
        <div id="add-legend-form-wrap" style="display:none;margin-top:20px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.06);">
          <h3 style="font-family:'Cairo',sans-serif;font-size:0.88rem;color:var(--color-accent-gold);margin:0 0 14px;">Nouveau Dossier de Transfert / ملف انتقال جديد</h3>
          <form id="add-legend-form" style="display:grid;grid-template-columns:1fr 1fr;gap:11px;">
            <div class="form-group">
              <label style="font-family:'Cairo',sans-serif;font-size:0.78rem;font-weight:700;">Club Destinataire / النادي</label>
              <input type="text" class="form-control" id="leg-club-name" placeholder="Ex: Espérance Sportive de Tunis">
            </div>
            <div class="form-group">
              <label style="font-family:'Cairo',sans-serif;font-size:0.78rem;font-weight:700;">Abréviation / الرمز</label>
              <input type="text" class="form-control" id="leg-club-abbr" placeholder="Ex: EST" maxlength="4">
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label style="font-family:'Cairo',sans-serif;font-size:0.78rem;font-weight:700;">Joueurs Transférés (séparés par virgule) / أسماء اللاعبين</label>
              <input type="text" class="form-control" id="leg-players" placeholder="Ex: Karim H., Ziad B.">
            </div>
            <div class="form-group">
              <label style="font-family:'Cairo',sans-serif;font-size:0.78rem;font-weight:700;">Années / السنوات</label>
              <input type="text" class="form-control" id="leg-years" placeholder="Ex: 2025, 2026">
            </div>
            <div class="form-group">
              <label style="font-family:'Cairo',sans-serif;font-size:0.78rem;font-weight:700;">Couleur du Club</label>
              <input type="color" class="form-control" id="leg-club-color" value="#D61A22" style="height:42px;cursor:pointer;">
            </div>
            <div class="form-group" style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
              <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-legend">Annuler / إلغاء</button>
              <button type="submit" class="btn btn-primary btn-sm">✓ Enregistrer / حفظ</button>
            </div>
          </form>
        </div>
      <!-- ═══ DAILY TASKS MANAGER ═══ -->
      <div class="portal-card-block" id="daily-tasks-panel" style="margin-top:30px;">
        <div class="block-header" style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:15px;margin-bottom:20px;">
          <h2 style="font-family:'Outfit','Cairo',sans-serif;display:flex;align-items:center;gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Tâches Quotidiennes / المهام اليومية
          </h2>
          <span style="font-size:0.75rem;color:var(--color-text-muted);font-family:'Cairo',sans-serif;">${dbState.dailyTasks ? dbState.dailyTasks.length : 0} tâches</span>
        </div>
        <div id="daily-tasks-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${(dbState.dailyTasks || []).map(task => `
            <div class="daily-task-row" data-id="${task.id}" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;transition:all 0.2s ease;">
              <input type="checkbox" ${task.done ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;accent-color:var(--color-accent-gold);flex-shrink:0;">
              <span style="flex:1;font-size:0.85rem;color:${task.done ? 'var(--color-text-muted)' : 'var(--color-text-light)'};text-decoration:${task.done ? 'line-through' : 'none'};font-family:'Cairo',sans-serif;">${task.text}</span>
              <span style="font-size:0.7rem;color:var(--color-text-muted);">${task.date || ''}</span>
              <button class="btn-delete-task" data-id="${task.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:2px 6px;border-radius:4px;transition:all 0.2s ease;line-height:1;" title="Supprimer / حذف">✕</button>
            </div>
          `).join('')}
        </div>
        <form id="add-task-form" style="display:flex;gap:10px;align-items:center;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
          <input type="text" id="task-input" placeholder="Nouvelle tâche / مهمة جديدة..." style="flex:1;padding:10px 14px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.85rem;outline:none;" required>
          <button type="submit" class="btn btn-primary btn-sm" style="padding:10px 18px;white-space:nowrap;font-size:0.8rem;">Ajouter / إضافة</button>
        </form>
      </div>


      <!-- ═══ COACH NOTES ═══ -->
      <div class="portal-card-block" id="coach-notes-panel" style="margin-top:30px;">
        <div class="block-header" style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:15px;margin-bottom:20px;">
          <h2 style="font-family:'Outfit','Cairo',sans-serif;display:flex;align-items:center;gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            📝 Notes Personnelles / ملاحظاتي
          </h2>
          <span style="font-size:0.75rem;color:var(--color-text-muted);font-family:'Cairo',sans-serif;">${(dbState.coachNotes || []).length} notes</span>
        </div>
        <div id="coach-notes-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
          ${(dbState.coachNotes || []).map(note => `
            <div class="coach-note-row" data-id="${note.id}" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:rgba(212,175,55,0.03);border:1px solid rgba(212,175,55,0.1);border-radius:10px;border-left:3px solid var(--color-accent-gold);transition:all 0.2s ease;">
              <div style="flex:1;">
                <p style="margin:0;font-size:0.85rem;color:var(--color-text-light);line-height:1.5;font-family:'Cairo',sans-serif;">${note.text}</p>
                <span style="font-size:0.7rem;color:var(--color-text-muted);margin-top:4px;display:block;">${note.date || ''}</span>
              </div>
              <button class="btn-delete-note" data-id="${note.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:2px 6px;border-radius:4px;transition:all 0.2s ease;line-height:1;flex-shrink:0;" title="Supprimer / حذف">✕</button>
            </div>
          `).join('')}
        </div>
        <form id="add-note-form" style="display:flex;flex-direction:column;gap:10px;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
          <textarea id="note-input" rows="2" placeholder="Écrire une note... / اكتب ملاحظة..." style="width:100%;padding:10px 14px;background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:8px;color:white;font-size:0.85rem;outline:none;resize:vertical;font-family:'Cairo',sans-serif;" required></textarea>
          <div style="display:flex;justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 20px;font-size:0.8rem;">Ajouter Note / إضافة ملاحظة</button>
          </div>
        </form>
      </div>

    </div>
    
    <!-- Drawer Form Backdrop -->
    <div class="drawer-backdrop" id="drawer-bg"></div>
    
    <!-- Sliding Add Player Drawer -->
    <div class="slide-drawer" id="player-form-drawer">
      <div class="drawer-header">
        <h3 style="font-family:'Cairo',sans-serif;">Nouveau Joueur / تسجيل لاعب جديد</h3>
        <button class="dialog-close-btn" id="btn-close-drawer" style="position:static;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form id="add-player-form" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="form-group">
          <label for="reg-name">Nom complet du garçon / اسم اللاعب ثنائي</label>
          <input type="text" class="form-control" id="reg-name" required placeholder="Ex: Yassine Belhadj">
        </div>
        
        <div class="form-group">
          <label for="reg-age">Âge / العمر</label>
          <input type="number" class="form-control" id="reg-age" required min="6" max="17" placeholder="Ex: 11">
        </div>
        
        <div class="form-group">
          <label for="reg-group">Squad Allocation / الفئة</label>
          <select class="form-control" id="reg-group" required style="font-family:'Cairo',sans-serif;">
            <option value="Scodetto Bambinos">Scodetto Bambinos (4-6 ans)</option>
            <option value="U10 Sparks">U10 Sparks (7-9 ans)</option>
            <option value="U12 Elite">U12 Elite (10-12 ans)</option>
            <option value="U14 Tactique">U14 Tactique (13-16 ans)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="reg-parent">Nom du Parent / اسم ولي الأمر</label>
          <input type="text" class="form-control" id="reg-parent" required placeholder="Ex: Slim Belhadj">
        </div>
        
        <div class="form-group">
          <label for="reg-phone">Téléphone du Parent / رقم الهاتف</label>
          <input type="tel" class="form-control" id="reg-phone" required placeholder="Ex: +216 98 555 666">
        </div>
        
        <div class="form-group">
          <label for="reg-status">Cotisation Initiale / الاشتراك الأول</label>
          <select class="form-control" id="reg-status" required style="font-family:'Cairo',sans-serif;">
            <option value="paid">Payé / خلاص (120 TND)</option>
            <option value="unpaid">Non Payé / غير خالص</option>
          </select>
        </div>
        
        <div class="drawer-actions" style="grid-column:1/-1;">
          <button type="button" class="btn btn-outline" id="btn-cancel-drawer">Annuler / إلغاء</button>
          <button type="submit" class="btn btn-primary">Ajouter / تسجيل</button>
        </div>
      </form>
    </div>
  `;

  // ── Append content management panels (Mohamed only) ───────────────────────
  const isMohamed = loggedInName.includes('mohamed') || activeCoachId === 'mohamed';
  const settingsPanelsHTML = `
    <!-- ══ Section: Live Content Management (Mohamed Admin Only) ══ -->
    <div class="portal-container" style="max-width:900px;margin:0 auto;padding-bottom:60px;">

      <div class="public-settings-panel" id="public-settings-panel">
        <h3 class="settings-panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Gestion du Contenu Public / إدارة المحتوى العام
          <span class="live-badge">● LIVE</span>
        </h3>

        <div class="settings-field">
          <label>Prix de la séance / سعر الحصة</label>
          <input type="text" id="set-prix" value="${dbState.publicSettings.prix}" placeholder="Ex: 120 TND / mois" />
        </div>
        <div class="settings-field">
          <label>Prix en Arabe / السعر بالعربية</label>
          <input type="text" id="set-prix-ar" value="${dbState.publicSettings.prixAr}" placeholder="مثال: 120 دينار / شهر" />
        </div>
        <div class="settings-field">
          <label>Téléphone de Contact / رقم الاتصال</label>
          <input type="tel" id="set-contact" value="${dbState.publicSettings.contact}" placeholder="+216 XX XXX XXX" />
        </div>
        <div class="settings-field">
          <label>Note Horaires / ملاحظة الجدول</label>
          <textarea id="set-schedule-notes">${dbState.publicSettings.scheduleNotes}</textarea>
        </div>

        <button class="settings-save-btn" id="btn-save-public-settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Sauvegarder et Publier / حفظ ونشر
        </button>
      </div>

      <!-- ══ Section: Push Alert to Parents ══ -->
      <div class="push-alert-panel" id="push-alert-panel">
        <h3 class="settings-panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Alertes Directes aux Parents / تنبيهات مباشرة للأولياء
        </h3>

        <div class="settings-field">
          <label>Titre de l'Alerte / عنوان التنبيه</label>
          <input type="text" id="alert-title-input" placeholder="Ex: Match annulé / مباراة ملغاة" />
        </div>
        <div class="settings-field">
          <label>Message (Fr/Ar) / الرسالة</label>
          <textarea id="alert-body-input" placeholder="Entrez le message complet ici... / أدخل الرسالة الكاملة هنا..."></textarea>
        </div>
        <div class="settings-field">
          <label>Destinataires / المستهدفون</label>
          <select id="alert-group-select">
            <option value="all">Tous les parents / جميع الأولياء</option>
            <option value="Scodetto Bambinos">Scodetto Bambinos seulement</option>
            <option value="U10 Sparks">U10 Sparks seulement</option>
            <option value="U12 Elite">U12 Elite seulement</option>
            <option value="U14 Tactique">U14 Tactique seulement</option>
          </select>
        </div>

        <button class="push-send-btn" id="btn-push-alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Envoyer l'Alerte / إرسال التنبيه
        </button>
      </div>

    </div>
  `;

  container.innerHTML = dashboardHTML + settingsPanelsHTML;

  // Back home button
  container.querySelector('#btn-dashboard-back-home')?.addEventListener('click', () => {
    navigateTo('#home');
  });

  // ── Public Settings Panel: Save & Publish ──────────────────────────────────
  container.querySelector('#btn-save-public-settings')?.addEventListener('click', () => {
    const prix    = container.querySelector('#set-prix')?.value?.trim();
    const prixAr  = container.querySelector('#set-prix-ar')?.value?.trim();
    const contact = container.querySelector('#set-contact')?.value?.trim();
    const scheduleNotes = container.querySelector('#set-schedule-notes')?.value?.trim();

    if (!prix || !contact) {
      showToast('Remplissez au moins le prix et le contact. / أكمل حقل السعر والاتصال.', true);
      return;
    }

    // Commit to state (triggers CustomEvent 'public-settings-updated')
    dbState.publicSettings = { prix, prixAr, contact, scheduleNotes };

    // Flash button to confirm
    const btn = container.querySelector('#btn-save-public-settings');
    if (btn) {
      btn.textContent = '✓ Publié !';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#15803d)';
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Sauvegarder et Publier / حفظ ونشر';
        btn.style.background = '';
      }, 2500);
    }

    showToast('Contenu public mis à jour et publié. / تم تحديث المحتوى العام ونشره.');
  });

  // ── Push Alert Panel: Send Direct Alert ───────────────────────────────────
  container.querySelector('#btn-push-alert')?.addEventListener('click', async () => {
    // Import dynamically to avoid circular reference at load time
    const { pushParentAlert } = await import('../lib/auth.js');

    const title       = container.querySelector('#alert-title-input')?.value?.trim();
    const body        = container.querySelector('#alert-body-input')?.value?.trim();
    const targetGroup = container.querySelector('#alert-group-select')?.value || 'all';

    if (!title || !body) {
      showToast('Veuillez saisir un titre et un message. / أدخل عنوان ورسالة التنبيه.', true);
      return;
    }

    const success = pushParentAlert(title, body, targetGroup);
    if (success) {
      // Clear the form
      const titleInput = container.querySelector('#alert-title-input');
      const bodyInput  = container.querySelector('#alert-body-input');
      if (titleInput) titleInput.value = '';
      if (bodyInput)  bodyInput.value  = '';
    }
  });

  // Drawer handlers
  const drawer = container.querySelector('#player-form-drawer');
  const drawerBg = container.querySelector('#drawer-bg');
  
  const openDrawer = () => {
    drawer.classList.add('open');
    drawerBg.classList.add('open');
  };
  
  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawerBg.classList.remove('open');
  };

  container.querySelector('#btn-open-drawer')?.addEventListener('click', openDrawer);
  container.querySelector('#btn-close-drawer')?.addEventListener('click', closeDrawer);
  container.querySelector('#btn-cancel-drawer')?.addEventListener('click', closeDrawer);
  drawerBg?.addEventListener('click', closeDrawer);

  // Search & Filter players
  const searchInput = container.querySelector('#search-player-input');
  const groupSelect = container.querySelector('#filter-group-select');
  const rosterContainer = container.querySelector('#roster-list-container');
  
  const performFiltering = () => {
    const query = searchInput.value.toLowerCase().trim();
    const groupFilter = groupSelect.value;
    
    const filtered = dbState.roster.filter(player => {
      const matchQuery = player.name.toLowerCase().includes(query) || player.parent.toLowerCase().includes(query);
      const matchGroup = groupFilter === 'All' || player.group.includes(groupFilter);
      return matchQuery && matchGroup;
    });
    
    rosterContainer.innerHTML = renderRosterListHTML(filtered);
    bindSubscriptionToggles();
    bindRosterClicks();
    bindDeletePlayerButtons();
  };

  searchInput?.addEventListener('input', performFiltering);
  groupSelect?.addEventListener('change', performFiltering);

  // Subscription state switches
  const bindSubscriptionToggles = () => {
    rosterContainer.querySelectorAll('.payment-status-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop row click trigger
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const player = dbState.roster.find(p => p.id === id);
        if (!player) return;
        
        player.status = player.status === 'paid' ? 'unpaid' : 'paid';
        showToast(`Statut paiement modifié pour ${player.name} / تم تعديل الاشتراك بنجاح.`);
        
        performFiltering();
        updateStats();
      });
    });
  };

  // Row selection clicks
  const bindRosterClicks = () => {
    rosterContainer.querySelectorAll('.roster-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.payment-status-pill')) return;
        
        const id = parseInt(row.getAttribute('data-id'), 10);
        activePlayerId = id;
        
        // Re-render roster to show visual active row highlight
        performFiltering();
        
        // Render editor panel
        renderPlayerEditor(activePlayerId);
        
        // Scroll to editor container smoothly
        container.querySelector('#player-editor-container')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  };

  // Delete player buttons
  const bindDeletePlayerButtons = () => {
    rosterContainer.querySelectorAll('.btn-delete-player').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const player = dbState.roster.find(p => p.id === id);
        if (!player) return;
        
        const confirmMsg = `Confirmer la suppression de "${player.name}" ? / تأكيد حذف "${player.name}" ؟`;
        if (!confirm(confirmMsg)) return;
        
        // Remove from roster
        const rosterIndex = dbState.roster.findIndex(p => p.id === id);
        if (rosterIndex !== -1) dbState.roster.splice(rosterIndex, 1);
        
        // Remove from childProfiles if exists
        if (dbState.childProfiles[player.parent]) {
          delete dbState.childProfiles[player.parent];
        }
        
        // Reset active player if deleted
        if (activePlayerId === id) {
          activePlayerId = dbState.roster[0]?.id || null;
        }
        
        showToast(`Joueur "${player.name}" supprimé. / تم حذف اللاعب بنجاح.`);
        
        // Re-render everything
        performFiltering();
        updateStats();
        renderPlayerEditor(activePlayerId);
        
        // Persist state
      });
    });
  };

  // Scheduler tab selectors
  const tabFieldA = container.querySelector('#tab-field-a');
  const tabFieldB = container.querySelector('#tab-field-b');
  const scheduleViewport = container.querySelector('#scheduler-table-viewport');
  
  tabFieldA?.addEventListener('click', () => {
    tabFieldA.classList.add('active');
    tabFieldB.classList.remove('active');
    scheduleViewport.innerHTML = renderSchedulerGrid("A");
    bindSchedulerClicks();
    if (typeof bindSessionActions === 'function') bindSessionActions();
  });
  
  tabFieldB?.addEventListener('click', () => {
    tabFieldB.classList.add('active');
    tabFieldA.classList.remove('active');
    scheduleViewport.innerHTML = renderSchedulerGrid("B");
    bindSchedulerClicks();
    if (typeof bindSessionActions === 'function') bindSessionActions();
  });

  // Calendar slot scheduler bookings
  const bindSchedulerClicks = () => {
    scheduleViewport.querySelectorAll('.calendar-slot-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const day = cell.getAttribute('data-day');
        const time = cell.getAttribute('data-time');
        const field = cell.getAttribute('data-field');
        
        const session = dbState.scheduler.find(s => s.day === day && s.time === time && s.field === field);
        if (session) {
          showToast(`Créneau alloué: "${session.title}" (Coach ${session.coach})`);
          return;
        }

        const title = prompt(`Entrez le titre de la séance pour le Terrain ${field} (Jour: ${day}, Heure: ${time}):`, "Entraînement Tactique");
        if (title) {
          const coach = prompt("Assigner un entraîneur (Mohamed / Monta):", "Mohamed");
          const group = prompt("Affecter une catégorie (U10 / U12 / U14):", "U12");
          
          const newSession = {
            id: Date.now(),
            day,
            time,
            field,
            title,
            coach: coach || "Mohamed",
            group: group || "U12"
          };
          
          dbState.scheduler.push(newSession);
          showToast(`Créneau affecté avec succès ! / تم حجز الحصة بنجاح !`);
          
          const activeField = tabFieldA.classList.contains('active') ? "A" : "B";
          scheduleViewport.innerHTML = renderSchedulerGrid(activeField);
          bindSchedulerClicks();
          if (typeof bindSessionActions === 'function') bindSessionActions();
        }
      });
    });
  };

  // Add Athlete submit form
  const addForm = container.querySelector('#add-player-form');
  addForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = container.querySelector('#reg-name').value;
    const age = parseInt(container.querySelector('#reg-age').value, 10);
    const group = container.querySelector('#reg-group').value;
    const parent = container.querySelector('#reg-parent').value;
    const phone = container.querySelector('#reg-phone').value;
    const status = container.querySelector('#reg-status').value;
    
    const newAthlete = {
      id: Date.now(),
      name,
      age,
      group,
      parent,
      phone,
      status,
      date: new Date().toISOString().split('T')[0]
    };
    
    dbState.roster.push(newAthlete);
    showToast(`Athlète "${name}" inscrit dans le groupe ${group}! / تم تسجيل اللاعب بنجاح !`);
    
    addForm.reset();
    closeDrawer();
    
    // Set newly added athlete as active to edit their card immediately!
    activePlayerId = newAthlete.id;
    
    performFiltering();
    updateStats();
    renderPlayerEditor(activePlayerId);
  });

  // Render the core Interactive Player Editor block
  const renderPlayerEditor = (playerId) => {
    const editorContainer = container.querySelector('#player-editor-container');
    if (!editorContainer) return;

    const player = dbState.roster.find(p => p.id === playerId);
    if (!player) {
      editorContainer.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:30px 0;font-family:\'Cairo\',sans-serif;">Sélectionnez un athlète dans le roster pour modifier sa fiche FIFA. / اختر لاعباً من القائمة لتعديل بطاقة مهارات فيفا.</p>';
      return;
    }

    // Resolve or initialize profile in childProfiles
    let profile = dbState.childProfiles[player.parent];
    if (!profile) {
      profile = {
        name: player.name,
        group: player.group,
        avatar: player.name.split(' ').map(n=>n[0]).join(''),
        rating: 75,
        stats: { pac: 70, dri: 70, sho: 70, pas: 70, phy: 70, def: 70 },
        skills: ["Technique Pro / مهارات ممتازة"],
        stars: 3,
        captain: false,
        remarks: ""
      };
      dbState.childProfiles[player.parent] = profile;
    }

    const overall = Math.round((profile.stats.pac + profile.stats.dri + profile.stats.sho + profile.stats.pas + profile.stats.phy + profile.stats.def) / 6);
    profile.rating = overall;

    editorContainer.innerHTML = `
      <div class="block-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:15px; margin-bottom:20px;">
        <h2 style="font-family:'Outfit','Cairo',sans-serif; margin:0; display:flex; align-items:center; gap:8px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-accent-gold);">
            <polygon points="12 2 15 8.5 22 9 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9 9 8.5 12 2"/>
          </svg>
          Éditeur de Carte de Compétences FIFA / تعديل بطاقة مهارات اللاعب
        </h2>
        <span style="font-size:0.85rem;color:var(--color-accent-gold);font-weight:700;font-family:'Cairo',sans-serif;">Athlète Actif: ${player.name} (${player.group})</span>
      </div>
      
      <div class="editor-two-cols">
        
        <!-- FUT Card Live Preview -->
        <div class="editor-card-preview-col">
          <div class="glowing-fut-badge" id="editor-fut-card-preview">
            <div class="fifa-rating-card coach-gold" style="width:250px;height:380px;padding:18px;position:relative;">
              <div class="fifa-card-glow"></div>
              <div class="fifa-card-bg-mesh"></div>
              
              <div class="fifa-card-top" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:flex-start;">
                <div class="fifa-score-block" style="display:flex; flex-direction:column; align-items:center;">
                  <span class="fifa-rating" style="font-size:2.4rem;" id="preview-overall">${profile.rating}</span>
                  <span class="fifa-position" style="font-size:0.7rem;">ATT / هجوم</span>
                </div>
                <div class="fifa-badges" style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                  <!-- Authentic Tunisian Flag: red bg · white disc · red crescent · red star -->
                  <svg width="18" height="12" viewBox="0 0 24 16">
                    <rect width="24" height="16" fill="#D61A22" rx="2"/>
                    <circle cx="12" cy="8" r="4.5" fill="white"/>
                    <circle cx="11.2" cy="8" r="3.2" fill="#D61A22"/>
                    <circle cx="12.8" cy="8" r="2.7" fill="white"/>
                    <polygon points="14.5,6.8 14.9,8.0 16.0,8.0 15.1,8.7 15.4,9.9 14.5,9.2 13.6,9.9 13.9,8.7 13.0,8.0 14.1,8.0" fill="#D61A22"/>
                  </svg>
                  <!-- Academy Shield Mini -->
                  <svg width="16" height="20" viewBox="0 0 100 100">
                    <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D4AF37" stroke-width="8"/>
                  </svg>
                </div>
              </div>
              
              <!-- FUT Armband Overlay -->
              <div class="captain-armband-badge ${profile.captain ? '' : 'hidden'}" id="preview-captain-armband">C</div>
              
              <!-- Avatar -->
              <div class="fifa-avatar-container" style="width:115px;height:115px;margin:5px auto 10px;">
                <svg class="fifa-avatar-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1.5"/>
                  <path d="M50,15 C56,15 62,21 62,28 C62,35 56,41 50,41 C44,41 38,35 38,28 C38,21 44,15 50,15 Z" fill="#D4AF37"/>
                  <path d="M25,75 C25,60 36,50 50,50 C64,50 75,60 75,75 Z" fill="#0A2540" stroke="#D4AF37" stroke-width="2.5"/>
                  <rect x="36" y="24" width="28" height="5" fill="#D61A22" rx="1"/>
                  <path d="M60,24 L68,20 L68,26 Z" fill="#D61A22"/>
                </svg>
              </div>
              
              <h3 class="fifa-card-name" style="font-size:1.15rem;margin:2px 0 5px;font-family:'Outfit','Cairo',sans-serif;">${player.name.split(' ')[0]}</h3>
              
              <div class="fifa-stats-grid" style="gap:3px 8px;font-size:0.75rem;">
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">VIT / سرعة</span>
                  <span class="fifa-stat-value" id="preview-vit">${profile.stats.pac}</span>
                </div>
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">DRI / مراوغة</span>
                  <span class="fifa-stat-value" id="preview-dri">${profile.stats.dri}</span>
                </div>
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">TIR / تسديد</span>
                  <span class="fifa-stat-value" id="preview-tir">${profile.stats.sho}</span>
                </div>
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">DEF / دفاع</span>
                  <span class="fifa-stat-value" id="preview-def">${profile.stats.def}</span>
                </div>
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">PAS / تمرير</span>
                  <span class="fifa-stat-value" id="preview-pas">${profile.stats.pas}</span>
                </div>
                <div class="fifa-stat-item">
                  <span class="fifa-stat-label">PHY / بدني</span>
                  <span class="fifa-stat-value" id="preview-phy">${profile.stats.phy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Editor Sliders & Control Panel -->
        <div class="editor-controls-col" style="display:flex; flex-direction:column; gap:20px;">
          <h3 style="font-family:'Cairo',sans-serif;font-size:1rem;color:white;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:8px;margin:0 0 5px;">Ajuster les Aptitudes / تعديل مستويات المهارات</h3>
          
          <div class="stats-sliders-block">
            <!-- Pace Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>VITESSE (VIT) / السرعة</span>
                <span id="lbl-val-pac" style="color:var(--color-accent-gold);">${profile.stats.pac}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-pac" min="40" max="99" value="${profile.stats.pac}">
            </div>
            
            <!-- Dribbling Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>DRIBBLE (DRI) / مراوغة</span>
                <span id="lbl-val-dri" style="color:var(--color-accent-gold);">${profile.stats.dri}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-dri" min="40" max="99" value="${profile.stats.dri}">
            </div>
            
            <!-- Shooting Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>TIR (TIR) / تسديد</span>
                <span id="lbl-val-sho" style="color:var(--color-accent-gold);">${profile.stats.sho}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-sho" min="40" max="99" value="${profile.stats.sho}">
            </div>
            
            <!-- Defending Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>DÉFENSE (DEF) / دفاع</span>
                <span id="lbl-val-def" style="color:var(--color-accent-gold);">${profile.stats.def}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-def" min="40" max="99" value="${profile.stats.def}">
            </div>
            
            <!-- Passing Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>PASSE (PAS) / تمرير</span>
                <span id="lbl-val-pas" style="color:var(--color-accent-gold);">${profile.stats.pas}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-pas" min="40" max="99" value="${profile.stats.pas}">
            </div>
            
            <!-- Physical Slider -->
            <div class="slider-group">
              <div class="slider-group-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>PHYSIQUE (PHY) / بدني</span>
                <span id="lbl-val-phy" style="color:var(--color-accent-gold);">${profile.stats.phy}</span>
              </div>
              <input type="range" class="stat-slider-control" id="slider-phy" min="40" max="99" value="${profile.stats.phy}">
            </div>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:20px;margin-top:10px;">
            <!-- Team Captain & Star Rating Column -->
            <div style="display:flex;flex-direction:column;gap:15px;">
              <!-- Team Captain Checkbox -->
              <div class="form-group" style="display:flex;align-items:center;gap:10px;margin:0;">
                <input type="checkbox" id="chk-captain" ${profile.captain ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;accent-color:var(--color-accent-gold);">
                <label for="chk-captain" style="margin:0;cursor:pointer;font-family:'Cairo',sans-serif;font-weight:700;font-size:0.85rem;color:var(--color-accent-gold);">Capitaine d'équipe / شارة القيادة</label>
              </div>
              
              <!-- Star Rating selector -->
              <div class="form-group" style="margin:0;">
                <label style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.82rem;color:var(--color-text-muted);display:block;margin-bottom:6px;">Étoiles de Performance / منح النجوم</label>
                <div class="star-rating-select" id="stars-selector" style="display:flex; gap:6px; font-size:1.5rem;">
                  ${[1,2,3,4,5].map(starNum => `
                    <span class="star-item ${starNum <= (profile.stars || 3) ? 'filled' : ''}" data-value="${starNum}" style="cursor:pointer;">★</span>
                  `).join('')}
                </div>
              </div>

              <!-- Special Skills Text Input -->
              <div class="form-group" style="margin:0;">
                <label for="txt-skills" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.82rem;color:var(--color-text-muted);display:block;margin-bottom:6px;">Aptitudes Spéciales / المهارات (Séparées par virgules)</label>
                <input type="text" class="form-control" id="txt-skills" value="${(profile.skills || []).join(', ')}" placeholder="Ex: Vitesse Éclair, Dribbleur" style="font-size:0.8rem; background:rgba(0,0,0,0.2); border-color:rgba(255,255,255,0.08); color:white; padding:8px 12px; border-radius:6px; width:100%;">
              </div>
            </div>
            
            <!-- Remarks/Coach Notes -->
            <div class="form-group" style="margin:0;">
              <label for="txt-remarks" style="font-family:'Cairo',sans-serif;font-weight:700;font-size:0.85rem;color:var(--color-text-muted);">Remarques du Coach / ملاحظات المدرب</label>
              <textarea class="form-control" id="txt-remarks" rows="3" placeholder="Écrire les observations sur l'athlète... / أكتب ملاحظات التقييم والتحسين هنا..." style="font-size:0.8rem; background:rgba(0,0,0,0.2); border-color:rgba(255,255,255,0.08); color:white;">${profile.remarks || ''}</textarea>
            </div>
          </div>
          
          <div style="display:flex;justify-content:flex-end;gap:15px;margin-top:10px;border-top:1px solid rgba(255,255,255,0.05);padding-top:15px;">
            <button type="button" class="btn btn-primary btn-sm" id="btn-save-player-card" style="padding:10px 24px;box-shadow: 0 4px 15px var(--color-accent-gold-glow); cursor:pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Sauvegarder Fiche / حفظ بطاقة المهارات
            </button>
          </div>
        </div>
        
      </div>
    `;

    // Dynamic ranges sliders listeners for live card update
    const slPac = editorContainer.querySelector('#slider-pac');
    const slDri = editorContainer.querySelector('#slider-dri');
    const slSho = editorContainer.querySelector('#slider-sho');
    const slDef = editorContainer.querySelector('#slider-def');
    const slPas = editorContainer.querySelector('#slider-pas');
    const slPhy = editorContainer.querySelector('#slider-phy');

    const liveUpdatePreview = () => {
      const pacVal = parseInt(slPac.value, 10);
      const driVal = parseInt(slDri.value, 10);
      const shoVal = parseInt(slSho.value, 10);
      const defVal = parseInt(slDef.value, 10);
      const pasVal = parseInt(slPas.value, 10);
      const phyVal = parseInt(slPhy.value, 10);

      // Update labels
      editorContainer.querySelector('#lbl-val-pac').textContent = pacVal;
      editorContainer.querySelector('#lbl-val-dri').textContent = driVal;
      editorContainer.querySelector('#lbl-val-sho').textContent = shoVal;
      editorContainer.querySelector('#lbl-val-def').textContent = defVal;
      editorContainer.querySelector('#lbl-val-pas').textContent = pasVal;
      editorContainer.querySelector('#lbl-val-phy').textContent = phyVal;

      // Update card values
      editorContainer.querySelector('#preview-vit').textContent = pacVal;
      editorContainer.querySelector('#preview-dri').textContent = driVal;
      editorContainer.querySelector('#preview-tir').textContent = shoVal;
      editorContainer.querySelector('#preview-def').textContent = defVal;
      editorContainer.querySelector('#preview-pas').textContent = pasVal;
      editorContainer.querySelector('#preview-phy').textContent = phyVal;

      // Recalculate Overall
      const currentOverall = Math.round((pacVal + driVal + shoVal + pasVal + phyVal + defVal) / 6);
      editorContainer.querySelector('#preview-overall').textContent = currentOverall;
    };

    [slPac, slDri, slSho, slDef, slPas, slPhy].forEach(slider => {
      slider?.addEventListener('input', liveUpdatePreview);
    });

    // Team Captain live preview
    const chkCap = editorContainer.querySelector('#chk-captain');
    const previewCap = editorContainer.querySelector('#preview-captain-armband');
    chkCap?.addEventListener('change', () => {
      if (chkCap.checked) {
        previewCap.classList.remove('hidden');
      } else {
        previewCap.classList.add('hidden');
      }
    });

    // Star rating selector
    let selectedStars = profile.stars || 3;
    const starsGroup = editorContainer.querySelector('#stars-selector');
    starsGroup?.querySelectorAll('.star-item').forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        selectedStars = val;
        starsGroup.querySelectorAll('.star-item').forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'), 10);
          if (sVal <= val) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
      });
    });

    // Save button action
    editorContainer.querySelector('#btn-save-player-card')?.addEventListener('click', () => {
      const pacVal = parseInt(slPac.value, 10);
      const driVal = parseInt(slDri.value, 10);
      const shoVal = parseInt(slSho.value, 10);
      const defVal = parseInt(slDef.value, 10);
      const pasVal = parseInt(slPas.value, 10);
      const phyVal = parseInt(slPhy.value, 10);
      const isCaptain = chkCap.checked;
      const remarksText = editorContainer.querySelector('#txt-remarks').value;
      const skillsText = editorContainer.querySelector('#txt-skills').value;

      const finalOverall = Math.round((pacVal + driVal + shoVal + pasVal + phyVal + defVal) / 6);

      // Save in DB childProfiles
      profile.stats.pac = pacVal;
      profile.stats.dri = driVal;
      profile.stats.sho = shoVal;
      profile.stats.def = defVal;
      profile.stats.pas = pasVal;
      profile.stats.phy = phyVal;
      profile.captain = isCaptain;
      profile.stars = selectedStars;
      profile.remarks = remarksText;
      profile.skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      profile.rating = finalOverall;

      // Update in roster if needed or just sync
      showToast(`Fiche de ${player.name} mise à jour avec succès (Note: ${finalOverall}) ! / تم حفظ تقييم مهارات اللاعب بنجاح !`);
    });
    
    // Tilt Preview card inside editor too
    const previewCard = editorContainer.querySelector('.fifa-rating-card');
    if (previewCard) {
      const glow = previewCard.querySelector('.fifa-card-glow');
      previewCard.addEventListener('mousemove', (e) => {
        const rect = previewCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width - 0.5) * 2;
        const py = (y / rect.height - 0.5) * 2;
        previewCard.style.transform = `rotateX(${-py * 20}deg) rotateY(${px * 20}deg) scale(1.03)`;
        if (glow) {
          glow.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
          glow.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
        }
      });
      previewCard.addEventListener('mouseleave', () => {
        previewCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }
  };

  // Switch Active Coach Dropdown Handler
  const bindCoachSwitcherEvents = () => {
    const switcherSelect = container.querySelector('#dash-coach-select');
    switcherSelect?.addEventListener('change', () => {
      activeCoachId = switcherSelect.value;
      const coach = dbState.coaches.find(c => c.id === activeCoachId);
      if (coach) {
        showToast(`Coach actif changé : ${coach.nameFr} / تم تغيير المدرب الحالي.`);
      }
    });

    // Plus Entraîneur click to slide out coach add form drawer
    container.querySelector('#btn-open-coach-drawer')?.addEventListener('click', () => {
      openAddCoachDialog();
    });
  };

  // Open Dynamic Add Coach Form Drawer
  const openAddCoachDialog = () => {
    let backdrop = container.querySelector('#coach-drawer-bg');
    let drawer = container.querySelector('#coach-form-drawer');
    
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'drawer-backdrop';
      backdrop.id = 'coach-drawer-bg';
      container.appendChild(backdrop);
    }
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'slide-drawer';
      drawer.id = 'coach-form-drawer';
      container.appendChild(drawer);
    }
    
    drawer.innerHTML = `
      <div class="drawer-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">
        <h3 style="font-family:'Cairo',sans-serif; margin:0;">Nouvel Entraîneur / تسجيل مدرب جديد</h3>
        <button class="dialog-close-btn" id="btn-close-coach-drawer" style="position:static;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form id="add-coach-form" style="display:flex; flex-direction:column; gap:15px; margin-top:20px;">
        <div class="form-group">
          <label for="c-name-fr">Nom du Coach (FR)</label>
          <input type="text" class="form-control" id="c-name-fr" required placeholder="Ex: Coach Khalil">
        </div>
        <div class="form-group">
          <label for="c-name-ar">Nom du Coach (AR)</label>
          <input type="text" class="form-control" id="c-name-ar" required placeholder="Ex: المدرب خليل" dir="rtl">
        </div>
        <div class="form-group">
          <label for="c-role-fr">Rôle / Position (FR)</label>
          <input type="text" class="form-control" id="c-role-fr" required placeholder="Ex: Entraîneur des Gardiens">
        </div>
        <div class="form-group">
          <label for="c-role-ar">Rôle / Position (AR)</label>
          <input type="text" class="form-control" id="c-role-ar" required placeholder="Ex: مدرب حراس المرمى" dir="rtl">
        </div>
        <div class="form-group">
          <label for="c-bio-fr">Bio / Expérience (FR)</label>
          <textarea class="form-control" id="c-bio-fr" rows="3" required placeholder="Ex: Ancien gardien de but professionnel avec 8 ans d'expérience..."></textarea>
        </div>
        <div class="form-group">
          <label for="c-bio-ar">Bio / Expérience (AR)</label>
          <textarea class="form-control" id="c-bio-ar" rows="3" required placeholder="Ex: حارس مرمى محترف سابق يملك 8 سنوات خبرة..." dir="rtl"></textarea>
        </div>
        
        <div class="drawer-actions" style="margin-top:15px; display:flex; gap:12px; justify-content:flex-end;">
          <button type="button" class="btn btn-outline" id="btn-cancel-coach-drawer">Annuler / إلغاء</button>
          <button type="submit" class="btn btn-primary">Enregistrer / تسجيل</button>
        </div>
      </form>
    `;
    
    const openDrawer = () => {
      drawer.classList.add('open');
      backdrop.classList.add('open');
    };
    
    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    };
    
    setTimeout(openDrawer, 10);
    
    drawer.querySelector('#btn-close-coach-drawer')?.addEventListener('click', closeDrawer);
    drawer.querySelector('#btn-cancel-coach-drawer')?.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    
    drawer.querySelector('#add-coach-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameFr = drawer.querySelector('#c-name-fr').value;
      const nameAr = drawer.querySelector('#c-name-ar').value;
      const roleFr = drawer.querySelector('#c-role-fr').value;
      const roleAr = drawer.querySelector('#c-role-ar').value;
      const bioFr = drawer.querySelector('#c-bio-fr').value;
      const bioAr = drawer.querySelector('#c-bio-ar').value;
      
      const newId = nameFr.toLowerCase().replace(/\s+/g, '-');
      
      const newCoach = {
        id: newId,
        nameFr,
        nameAr,
        roleFr,
        roleAr,
        rating: 85,
        position: roleFr.substring(0,3).toUpperCase(),
        bioFr,
        bioAr,
        certificationsFr: ["Certificat de Formation Scodetto Academy"],
        certificationsAr: ["شهادة تكوين من أكاديمية سكوديتو"],
        achievementsFr: ["Nouveau Staff Technique"],
        achievementsAr: ["طاقم فني جديد"]
      };
      
      dbState.coaches.push(newCoach);
      showToast(`Coach "${nameFr}" enregistré avec succès ! / تم تسجيل المدرب الجديد بنجاح !`);
      closeDrawer();
      
      // Update switcher dropdown choices dynamically!
      const switcherSelect = container.querySelector('#dash-coach-select');
      if (switcherSelect) {
        switcherSelect.innerHTML = dbState.coaches.map(c => `<option value="${c.id}">${c.nameFr} (${c.position.split(' ')[0]})</option>`).join('');
        switcherSelect.value = newId;
        activeCoachId = newId;
      }
    });
  };

  // Perform initial binding & rendering
  performFiltering();
  updateStats();
  bindCoachSwitcherEvents();
  bindSchedulerClicks(); // FIX: bind scheduler on initial mount so cells are immediately interactive
  renderPlayerEditor(activePlayerId);

  // ══ Session Delete & Add Binders ══
  const bindSessionActions = () => {
    // Delete session buttons
    scheduleViewport.querySelectorAll('.btn-delete-session').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const session = dbState.scheduler.find(s => s.id === id);
        if (!session) return;
        
        if (!confirm(`Supprimer "${session.title}" ? / حذف "${session.title}" ؟`)) return;
        
        const idx = dbState.scheduler.findIndex(s => s.id === id);
        if (idx !== -1) dbState.scheduler.splice(idx, 1);
        
        showToast(`Séance supprimée / تم حذف الحصة`);
        const activeField = (container.querySelector('#tab-field-a')?.classList.contains('active')) ? "A" : "B";
        scheduleViewport.innerHTML = renderSchedulerGrid(activeField);
        bindSchedulerClicks();
        bindSessionActions();
      });
    });

    // Add session button
    container.querySelector('#btn-add-session')?.addEventListener('click', () => {
      const day = container.querySelector('#new-session-day')?.value.trim();
      const time = container.querySelector('#new-session-time')?.value.trim();
      const title = container.querySelector('#new-session-title')?.value.trim();
      const field = container.querySelector('#new-session-field')?.value.trim().toUpperCase() || "A";
      
      if (!day || !time || !title) {
        showToast("Veuillez remplir tous les champs / الرجاء ملء جميع الحقول", true);
        return;
      }
      
      const newSession = {
        id: Date.now(),
        day,
        time,
        field: field === "B" ? "B" : "A",
        title,
        coach: dbState.user?.name || "Mohamed",
        group: "U12"
      };
      
      dbState.scheduler.push(newSession);
      showToast(`Séance ajoutée : "${title}" / تمت إضافة الحصة`);
      
      const activeField = (container.querySelector('#tab-field-a')?.classList.contains('active')) ? "A" : "B";
      scheduleViewport.innerHTML = renderSchedulerGrid(activeField);
      bindSchedulerClicks();
      bindSessionActions();
    });
  };

  bindSessionActions();

  // ══ Weekly Performer Manager ════════════════════════════════════════════════════
  container.querySelector('#weekly-perf-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerSel = container.querySelector('#wk-player-sel');
    const metricSel = container.querySelector('#wk-metric-type');
    const metricValInp = container.querySelector('#wk-metric-val');
    const weekLabelInp = container.querySelector('#wk-week-label');
    const selectedPlayer = dbState.roster.find(p => p.id === parseInt(playerSel.value, 10));
    if (!selectedPlayer) return;
    const [badge, metric] = metricSel.value.split('|');
    const profile = dbState.childProfiles[selectedPlayer.parent];
    dbState.weeklyPerformer = {
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      playerGroup: selectedPlayer.group,
      avatar: selectedPlayer.name.charAt(0),
      rating: profile?.rating || 75,
      stats: profile?.stats || { pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70 },
      metric,
      metricValue: metricValInp.value || 'Performance exceptionnelle cette semaine',
      badge,
      coachUpdated: `Coach ${dbState.user?.name || 'Mohamed'}`,
      week: weekLabelInp.value
    };
    showToast(`Athlète de la semaine mis à jour : ${selectedPlayer.name} / تم تحديث لاعب الأسبوع بنجاح !`);
    e.target.reset();
    weekLabelInp.value = dbState.weeklyPerformer.week;
  });

  // ══ Legend File Manager ═════════════════════════════════════════════════════
  const btnToggleLegend = container.querySelector('#btn-toggle-add-legend');
  const legendFormWrap = container.querySelector('#add-legend-form-wrap');
  btnToggleLegend?.addEventListener('click', () => {
    const hidden = legendFormWrap.style.display === 'none';
    legendFormWrap.style.display = hidden ? '' : 'none';
    btnToggleLegend.textContent = hidden ? '✕ Fermer / إغلاق' : '+ Nouveau Transfert / إضافة';
  });
  container.querySelector('#btn-cancel-legend')?.addEventListener('click', () => {
    legendFormWrap.style.display = 'none';
    btnToggleLegend.textContent = '+ Nouveau Transfert / إضافة';
  });
  container.querySelector('#add-legend-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const clubName = container.querySelector('#leg-club-name').value;
    const clubAbbr = container.querySelector('#leg-club-abbr').value.toUpperCase();
    const playersStr = container.querySelector('#leg-players').value;
    const yearsStr = container.querySelector('#leg-years').value;
    const clubColor = container.querySelector('#leg-club-color').value;
    const players = playersStr.split(',').map(s => s.trim()).filter(Boolean);
    const years = yearsStr.split(',').map(s => s.trim()).filter(Boolean);
    dbState.legendRecords.push({ club: clubName, clubAbbr, players, years, clubColor, count: players.length });
    const recordHTML = `
      <div class="legend-record-item">
        <div style="width:34px;height:34px;border-radius:7px;background:${clubColor};display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:900;color:white;flex-shrink:0;">${clubAbbr}</div>
        <div style="flex:1;"><div class="legend-club-name">${clubName}</div><div class="legend-transfer-names">${players.join(', ')}</div><div class="legend-transfer-years">📅 ${years.join(', ')}</div></div>
        <span style="font-size:0.72rem;font-weight:700;color:var(--color-accent-gold);background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);padding:3px 10px;border-radius:20px;">${players.length} transferts</span>
      </div>`;
    container.querySelector('#legend-records-list').insertAdjacentHTML('beforeend', recordHTML);
    showToast(`Dossier "${clubName}" enregistré ! / تم حفظ ملف الانتقال !`);
    legendFormWrap.style.display = 'none';
    btnToggleLegend.textContent = '+ Nouveau Transfert / إضافة';
    e.target.reset();
    container.querySelector('#leg-club-color').value = '#D61A22';
  });

  // ══ Daily Tasks Binders ══
  const bindDailyTasksEvents = () => {
    const tasksList = container.querySelector('#daily-tasks-list');
    const addForm = container.querySelector('#add-task-form');
    const taskInput = container.querySelector('#task-input');
    
    // Delete task
    tasksList?.querySelectorAll('.btn-delete-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const idx = dbState.dailyTasks.findIndex(t => t.id === id);
        if (idx !== -1) {
          const taskText = dbState.dailyTasks[idx].text;
          dbState.dailyTasks.splice(idx, 1);
          showToast(`Tâche supprimée / تم حذف المهمة`);
          
          // Re-render tasks
          const tasksCount = container.querySelector('#daily-tasks-panel .block-header span:last-child');
          if (tasksCount) tasksCount.textContent = `${dbState.dailyTasks.length} tâches`;
          
          const taskRows = tasksList.querySelectorAll('.daily-task-row');
          btn.closest('.daily-task-row')?.remove();
          
        }
      });
    });
    
    // Checkbox toggle
    tasksList?.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const row = chk.closest('.daily-task-row');
        const id = parseInt(row.getAttribute('data-id'), 10);
        const task = dbState.dailyTasks.find(t => t.id === id);
        if (task) {
          task.done = chk.checked;
          const textSpan = row.querySelector('span');
          if (textSpan) {
            textSpan.style.color = chk.checked ? 'var(--color-text-muted)' : 'var(--color-text-light)';
            textSpan.style.textDecoration = chk.checked ? 'line-through' : 'none';
          }
        }
      });
    });
    
    // Add new task
    addForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;
      
      const newTask = {
        id: Date.now(),
        text: text,
        done: false,
        date: new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})
      };
      
      dbState.dailyTasks.push(newTask);
      
      // Add to DOM
      const taskHTML = `
        <div class="daily-task-row" data-id="${newTask.id}" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;transition:all 0.2s ease;">
          <input type="checkbox" style="width:18px;height:18px;cursor:pointer;accent-color:var(--color-accent-gold);flex-shrink:0;">
          <span style="flex:1;font-size:0.85rem;color:var(--color-text-light);font-family:'Cairo',sans-serif;">${text}</span>
          <span style="font-size:0.7rem;color:var(--color-text-muted);">${newTask.date}</span>
          <button class="btn-delete-task" data-id="${newTask.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:2px 6px;border-radius:4px;transition:all 0.2s ease;line-height:1;" title="Supprimer / حذف">✕</button>
        </div>
      `;
      tasksList.insertAdjacentHTML('beforeend', taskHTML);
      
      // Update count
      const tasksCount = container.querySelector('#daily-tasks-panel .block-header span:last-child');
      if (tasksCount) tasksCount.textContent = `${dbState.dailyTasks.length} tâches`;
      
      // Re-bind events for new task
      bindDailyTasksEvents();
      
      taskInput.value = '';
      showToast(`Tâche ajoutée / تمت إضافة المهمة`);
    });
  };
  
  // ══ Coach Notes Binders ══
  const bindNotesEvents = () => {
    const notesList = container.querySelector('#coach-notes-list');
    const addForm = container.querySelector('#add-note-form');
    const noteInput = container.querySelector('#note-input');
    
    // Delete note
    notesList?.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const idx = dbState.coachNotes.findIndex(n => n.id === id);
        if (idx !== -1) {
          dbState.coachNotes.splice(idx, 1);
          showToast(`Note supprimée / تم حذف الملاحظة`);
          btn.closest('.coach-note-row')?.remove();
          
          const notesCount = container.querySelector('#coach-notes-panel .block-header span:last-child');
          if (notesCount) notesCount.textContent = `${dbState.coachNotes.length} notes`;
          
        }
      });
    });
    
    // Add note
    addForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = noteInput.value.trim();
      if (!text) return;
      
      const newNote = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})
      };
      
      dbState.coachNotes.push(newNote);
      
      const noteHTML = `
        <div class="coach-note-row" data-id="${newNote.id}" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:rgba(212,175,55,0.03);border:1px solid rgba(212,175,55,0.1);border-radius:10px;border-left:3px solid var(--color-accent-gold);transition:all 0.2s ease;">
          <div style="flex:1;">
            <p style="margin:0;font-size:0.85rem;color:var(--color-text-light);line-height:1.5;font-family:'Cairo',sans-serif;">${text}</p>
            <span style="font-size:0.7rem;color:var(--color-text-muted);margin-top:4px;display:block;">${newNote.date}</span>
          </div>
          <button class="btn-delete-note" data-id="${newNote.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:2px 6px;border-radius:4px;transition:all 0.2s ease;line-height:1;flex-shrink:0;" title="Supprimer / حذف">✕</button>
        </div>
      `;
      notesList.insertAdjacentHTML('beforeend', noteHTML);
      
      const notesCount = container.querySelector('#coach-notes-panel .block-header span:last-child');
      if (notesCount) notesCount.textContent = `${dbState.coachNotes.length} notes`;
      
      noteInput.value = '';
      showToast(`Note ajoutée / تمت إضافة الملاحظة`);
      
      // Re-bind
      bindNotesEvents();
      
    });
  };
  
  bindDailyTasksEvents();
  bindNotesEvents();

}

/* ==========================================================================
   PARENT PORTAL MODULE - BILINGUAL & BOYS-ONLY
   ========================================================================== */

import { navigateTo } from '../lib/router.js';
import { showToast } from '../lib/notifications.js';
import { fbLogin, isFbReady } from '../lib/facebook.js';
import { loginWithFacebook } from '../lib/auth.js';

export function renderParentPortal(container, dbState) {
  
  // Resolve current active parent kids (Boys Only)
  const parentName = dbState.user?.name;
  if (!parentName || !dbState.childProfiles[parentName]) {
    container.innerHTML = '<div class="portal-container" style="padding:40px;text-align:center;"><p style="color:var(--color-text-muted);font-family:\'Cairo\',sans-serif;font-size:1.1rem;">Aucun profil d\'athlète trouvé pour votre compte. / لا يوجد ملف رياضي مرتبط بحسابك.</p></div>';
    return;
  }
  const kidsList = Object.keys(dbState.childProfiles);
  
  let activeKidParent = kidsList[0];
  let kidData = dbState.childProfiles[activeKidParent];

  const renderFutBadgeHTML = (data) => {
    return `
      <!-- FIFA FUT Card Youssef/Yassine -->
      <div class="glowing-fut-badge">
        <div class="fifa-rating-card coach-gold" style="width:280px;height:420px;padding:20px;position:relative;">
          <div class="fifa-card-glow"></div>
          <div class="fifa-card-bg-mesh"></div>
          
          <div class="fifa-card-top" style="margin-bottom:0;">
            <div class="fifa-score-block">
              <span class="fifa-rating" style="font-size:2.8rem;">${data.rating}</span>
              <span class="fifa-position" style="font-size:0.75rem;">ATT / هجوم</span>
            </div>
            <div class="fifa-badges">
              <!-- Tunisia Flag -->
              <svg width="20" height="14" viewBox="0 0 24 16">
                <rect width="24" height="16" fill="#D61A22" rx="2"/>
                <circle cx="12" cy="8" r="4.5" fill="white"/>
                <circle cx="13" cy="8" r="3.5" fill="#D61A22"/>
              </svg>
              <!-- Academy Shield Mini -->
              <svg width="18" height="22" viewBox="0 0 100 100">
                <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D4AF37" stroke-width="8"/>
              </svg>
            </div>
          </div>
          
          <!-- Glowing Gold Captain Armband Badge Overlay -->
          <div class="captain-armband-badge ${data.captain ? '' : 'hidden'}" id="parent-captain-armband">C</div>
          
          <!-- Animated Kid Avatar in Shield -->
          <div class="fifa-avatar-container" style="width:130px;height:130px;margin:5px auto 10px;">
            <svg class="fifa-avatar-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1.5"/>
              <!-- Young Athlete Figure -->
              <path d="M50,15 C56,15 62,21 62,28 C62,35 56,41 50,41 C44,41 38,35 38,28 C38,21 44,15 50,15 Z" fill="#D4AF37"/>
              <path d="M25,75 C25,60 36,50 50,50 C64,50 75,60 75,75 Z" fill="#0A2540" stroke="#D4AF37" stroke-width="2.5"/>
              <!-- Anime Sports Headband -->
              <rect x="36" y="24" width="28" height="5" fill="#D61A22" rx="1"/>
              <path d="M60,24 L68,20 L68,26 Z" fill="#D61A22"/>
            </svg>
          </div>
          
          <h3 class="fifa-card-name" style="font-size:1.3rem;margin:5px 0 10px;padding-bottom:5px;font-family:'Outfit','Cairo',sans-serif;">${data.name.split(' ')[0]}</h3>
          
          <div class="fifa-stats-grid" style="gap:4px 10px;font-size:0.8rem;">
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">VIT / سرعة</span>
              <span class="fifa-stat-value">${data.stats.pac}</span>
            </div>
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">DRI / مراوغة</span>
              <span class="fifa-stat-value">${data.stats.dri}</span>
            </div>
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">TIR / تسديد</span>
              <span class="fifa-stat-value">${data.stats.sho}</span>
            </div>
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">DEF / دفاع</span>
              <span class="fifa-stat-value">${data.stats.def}</span>
            </div>
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">PAS / تمرير</span>
              <span class="fifa-stat-value">${data.stats.pas}</span>
            </div>
            <div class="fifa-stat-item">
              <span class="fifa-stat-label">PHY / بدني</span>
              <span class="fifa-stat-value">${data.stats.phy}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSkillsHTML = (data) => {
    return `
      <div class="skill-bar-row">
        <div class="skill-bar-header">
          <span>VITESSES / السرعة</span>
          <span style="color:var(--color-accent-gold);">${data.stats.pac}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${data.stats.pac}%"></div>
        </div>
      </div>
      <div class="skill-bar-row">
        <div class="skill-bar-header">
          <span>DRIBBLE & CONTRÔLE / المراوغة والتحكم</span>
          <span style="color:var(--color-accent-gold);">${data.stats.dri}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${data.stats.dri}%"></div>
        </div>
      </div>
      <div class="skill-bar-row">
        <div class="skill-bar-header">
          <span>PASSES & VISION / التمرير والرؤية</span>
          <span style="color:var(--color-accent-gold);">${data.stats.pas}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${data.stats.pas}%"></div>
        </div>
      </div>
      <div class="skill-bar-row">
        <div class="skill-bar-header">
          <span>RÉSISTANCE PHYSIQUE / القوة والتحمل</span>
          <span style="color:var(--color-accent-gold);">${data.stats.phy}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${data.stats.phy}%"></div>
        </div>
      </div>
    `;
  };

  const renderRemarksPanelHTML = (data) => {
    return `
      <div class="luxury-remarks-panel" style="margin-top:15px; width:100%;">
        <div class="remarks-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-accent-gold);">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Remarques du Coach / ملاحظات المدرب
        </div>
        <div class="remarks-stars-display" style="display:flex; gap:4px; margin-bottom:8px;">
          ${Array.from({ length: 5 }, (_, i) => `
            <span style="color:${i < (data.stars || 3) ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.1)'}; font-size:1.20rem;">★</span>
          `).join('')}
        </div>
        <p class="remarks-content">
          ${data.remarks || "Pas de remarques particulières pour le moment. L'athlète s'entraîne avec sérieux. / لا توجد ملاحظات خاصة حالياً. اللاعب يتدرب بكل جدية."}
        </p>
      </div>
    `;
  };

  const renderNotificationsHTML = () => {
    return dbState.notifications.map(note => `
      <div class="notification-alert ${note.unread ? 'unread' : ''} ${note.type === 'info' ? 'info-alert' : ''}" data-id="${note.id}">
        <div class="alert-icon-wrapper">
          ${note.type === 'match' ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/>
            </svg>
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          `}
        </div>
        <div class="alert-content" style="flex-grow:1;">
          <h4 style="font-family:'Cairo',sans-serif;font-size:0.85rem;">${note.title}</h4>
          <p style="font-size:0.75rem;line-height:1.4;margin-top:2px;">${note.body}</p>
          <span style="font-size:0.7rem;color:var(--color-text-muted);margin-top:4px;display:block;">${note.time}</span>
        </div>
        ${note.unread ? `
          <button class="btn btn-sm btn-outline btn-mark-read" data-id="${note.id}" style="padding:4px 8px;font-size:0.7rem;border-radius:4px;font-family:'Cairo',sans-serif;">Lu / قرأت</button>
        ` : ''}
      </div>
    `).join('');
  };

  const renderSkillsTagsHTML = (data) => {
    return (data.skills || []).map(sk => `
      <span style="font-size:0.75rem;font-weight:700;padding:4px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;color:var(--color-accent-gold);font-family:'Cairo',sans-serif;">${sk}</span>
    `).join('');
  };

  const updateParentViewport = () => {
    const badgeWrapper = container.querySelector('#fut-badge-wrapper');
    if (badgeWrapper) badgeWrapper.innerHTML = renderFutBadgeHTML(kidData);
    
    const skillsBars = container.querySelector('#skills-bars-container');
    if (skillsBars) skillsBars.innerHTML = renderSkillsHTML(kidData);

    const remarksPanel = container.querySelector('#remarks-panel-viewport');
    if (remarksPanel) remarksPanel.innerHTML = renderRemarksPanelHTML(kidData);

    const skillsTags = container.querySelector('#skills-tags-container');
    if (skillsTags) skillsTags.innerHTML = renderSkillsTagsHTML(kidData);
    
    setupParentCardTilt();
  };

  // Build dynamic child tabs from dbState.childProfiles keys (respects state security guard)
  const profileKeys = Object.keys(dbState.childProfiles);
  const tabColors = ['#D4AF37', '#D61A22', '#27ae60', '#3498db', '#9b59b6'];
  const dynamicTabsHTML = profileKeys.map((pKey, idx) => {
    const profile = dbState.childProfiles[pKey];
    const avatarLetter = profile.name.charAt(0).toUpperCase();
    const color = tabColors[idx % tabColors.length];
    const isActive = idx === 0 ? 'active' : '';
    return `
      <button class="child-avatar-tab ${isActive}" data-parent="${pKey}">
        <span class="icon-lbl" style="background:${color};color:${color === '#D4AF37' ? '#0A2540' : 'white'};">${avatarLetter}</span>
        <span>${profile.name.split(' ')[0]}</span>
      </button>
    `;
  }).join('');

  const mainPortalHTML = `
    <div class="portal-container parent-portal-dashboard">
      
      <!-- Top header selector -->
      <div class="portal-header">
        <div class="portal-title-block">
          <h1 style="font-family:'Outfit','Cairo',sans-serif;">Suivi des Garçons / متابعة أداء اللاعبين</h1>
          <p>Espace Parent &bull; Roster d'Élite &bull; La Marsa, Tunis</p>
        </div>
        <!-- Tabs generated dynamically from dbState.childProfiles (respects role-security guard) -->
        <div class="child-profile-selector" id="profiles-tabs">
          ${dynamicTabsHTML}
        </div>
        <!-- Facebook Sync Status -->
        <div id="fb-sync-status" style="margin-top:8px;"></div>
      
      </div>
      <!-- Grid Columns -->
      <div class="portal-grid-two-cols">
        
        <!-- Left: FUT Card & Progress Meters -->
        <div class="portal-card-block">
          <div class="block-header">
            <h2 style="font-family:'Outfit','Cairo',sans-serif;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Fiche Athlétique / مهارات اللاعب
            </h2>
            <span style="font-size:0.8rem;font-weight:700;color:var(--color-accent-gold);text-transform:uppercase;letter-spacing:1px;" id="lbl-kid-squad">Squad: ${kidData.group}</span>
          </div>
          
          <div style="display:flex;gap:40px;align-items:center;flex-wrap:wrap;justify-content:center;">
            <div class="badge-col" id="fut-badge-wrapper">
              ${renderFutBadgeHTML(kidData)}
            </div>
            
            <div style="flex-grow:1;min-width:280px;display:flex;flex-direction:column;gap:20px;">
              <h3 style="font-family:'Outfit','Cairo',sans-serif;font-size:1.15rem;font-weight:700;color:white;">Statistiques de Performance / نسب المهارات البدنية</h3>
              <div class="skills-progress-bars" id="skills-bars-container">
                ${renderSkillsHTML(kidData)}
              </div>
              <div id="skills-tags-container" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                ${renderSkillsTagsHTML(kidData)}
              </div>
              
              <!-- Luxury Remarks and Stars -->
              <div id="remarks-panel-viewport">
                ${renderRemarksPanelHTML(kidData)}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right: Agenda & Notifications -->
        <div style="display:flex;flex-direction:column;gap:30px;">
          
          <!-- Timeline Agenda -->
          <div class="portal-card-block" style="margin-bottom:0;">
            <div class="block-header">
              <h2 style="font-family:'Outfit','Cairo',sans-serif;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 8v4l3 3M22 12A10 10 0 1 1 12 2v2a8 8 0 1 0 0 16v2"/>
                </svg>
                Agenda d'Entraînement / مواعيد الحصص القادمة
              </h2>
            </div>
            
            <div class="agenda-timeline">
              <div class="agenda-item">
                <span class="agenda-time" style="font-size:0.8rem;">LUN / الاثنين 17:30</span>
                <div class="agenda-details">
                  <h4>Jeu Tactique U12 / تكتيك فئة U12</h4>
                  <p>Terrain A / الملعب أ &bull; Coach Mohamed</p>
                </div>
              </div>
              
              <div class="agenda-item">
                <span class="agenda-time" style="font-size:0.8rem;">MER / الأربعاء 16:00</span>
                <div class="agenda-details">
                  <h4>Défense d'élite U12 / دفاع النخبة U12</h4>
                  <p>Terrain A / الملعب أ &bull; Coach Mohamed</p>
                </div>
              </div>
              
              <div class="agenda-item session-match">
                <span class="agenda-time" style="font-size:0.8rem;">SAM / السبت 09:00</span>
                <div class="agenda-details">
                  <h4>Coupe des Académies vs Sahel Juniors</h4>
                  <p>Terrain B / الملعب ب &bull; Match de Coupe / مباراة الكأس</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Parent Alert Feed (reactive — updates on coach push) -->
          <div class="portal-card-block alerts-feed-section" style="margin-bottom:0;" id="alerts-feed-block">
            <div class="alerts-feed-header">
              <div class="alerts-feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Alertes & Infos / تنبيهات ومعلومات
                <span class="unread-count-badge" id="unread-alerts-count"></span>
              </div>
            </div>
            <div id="alerts-feed-viewport">
              <!-- Populated by renderAlertFeed() -->
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  `;

  container.innerHTML = mainPortalHTML;

  // Bind child tabs
  const profileButtons = container.querySelectorAll('.child-avatar-tab');
  profileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      profileButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeKidParent = btn.getAttribute('data-parent');
      kidData = dbState.childProfiles[activeKidParent];
      
      const lblSquad = container.querySelector('#lbl-kid-squad');
      if (lblSquad) lblSquad.textContent = `Squad: ${kidData.group}`;
      
      updateParentViewport();
      showToast(`Profil sélectionné: ${kidData.name} / تم تغيير ملف المتابعة.`);
    });
  });

  // ── Reactive alert feed ────────────────────────────────────────────────────
  const ALERT_ICONS = {
    match: { emoji: '⚽', cls: 'match-icon' },
    event: { emoji: '🏆', cls: 'event-icon' },
    coach: { emoji: '📣', cls: 'coach-icon' },
    info:  { emoji: 'ℹ️',  cls: 'info-icon'  }
  };

  const renderAlertFeed = () => {
    const alerts = dbState.parentAlerts; // already filtered by state getter
    const viewport = container.querySelector('#alerts-feed-viewport');
    const badge    = container.querySelector('#unread-alerts-count');
    if (!viewport) return;

    const unread = alerts.filter(a => a.unread).length;
    if (badge) badge.textContent = unread > 0 ? unread : '';

    if (alerts.length === 0) {
      viewport.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.85rem;text-align:center;padding:20px 0;">Aucune alerte pour l\'instant / لا توجد تنبيهات حتى الآن.</p>';
      return;
    }

    viewport.innerHTML = alerts.map(a => {
      const icon = ALERT_ICONS[a.type] || ALERT_ICONS.info;
      return `
        <div class="alert-card type-${a.type} ${a.unread ? 'unread' : ''}" data-alert-id="${a.id}">
          <div class="alert-icon ${icon.cls}">${icon.emoji}</div>
          <div class="alert-body">
            <p class="alert-title">${a.title}</p>
            <p class="alert-text">${a.body}</p>
            <div class="alert-meta">
              <span class="alert-sender">${a.sentBy}</span>
              <span>&bull;</span>
              <span>${a.time}</span>
            </div>
          </div>
          ${a.unread ? '<span class="alert-unread-dot"></span>' : ''}
        </div>
      `;
    }).join('');

    // Mark as read on click
    viewport.querySelectorAll('.alert-card[data-alert-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.alertId, 10);
        const updatedAlerts = dbState.parentAlerts.map(a =>
          a.id === id ? { ...a, unread: false } : a
        );
        dbState.parentAlerts = updatedAlerts;
        renderAlertFeed();
      });
    });
  };


  // ── Facebook Sync Status ─────────────────────────────────────────────────
  const renderFbSyncStatus = () => {
    const parentName = dbState.user?.name;
    const parents = dbState.parents || [];
    const parentData = parents.find(p => p.parentName === parentName);
    const isLinked = parentData?.facebookId != null;
    
    const statusEl = container.querySelector('#fb-sync-status');
    if (!statusEl) return;
    
    if (isLinked) {
      statusEl.innerHTML = `
        <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(24,119,242,0.08);border:1px solid rgba(24,119,242,0.15);border-radius:20px;font-size:0.75rem;font-weight:600;color:#1877F2;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook Connecté / متصل ✅</span>
        </div>
      `;
    } else if (isFbReady()) {
      statusEl.innerHTML = `
        <button id="btn-fb-link" style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(24,119,242,0.08);border:1px solid rgba(24,119,242,0.15);border-radius:20px;font-size:0.75rem;font-weight:600;color:#1877F2;cursor:pointer;transition:all 0.2s ease;font-family:inherit;border:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Lier mon compte Facebook / ربط حساب فيسبوك</span>
        </button>
      `;
      statusEl.querySelector('#btn-fb-link')?.addEventListener('click', async () => {
        try {
          const fbData = await fbLogin();
          const result = loginWithFacebook(fbData);
          if (result.success) {
            showToast('Compte Facebook lié ✅ / تم ربط الحساب');
            renderFbSyncStatus();
          }
        } catch (err) {
          showToast(err.message || 'Erreur de connexion / خطأ في الاتصال', true);
        }
      });
    } else {
      // FB SDK not ready — show nothing (App ID probably not configured)
      statusEl.innerHTML = '';
    }
  };

  renderFbSyncStatus();
  renderAlertFeed();

  // Live re-render when coach pushes a new alert
  const alertsHandler = () => renderAlertFeed();
  window.addEventListener('parent-alerts-updated', alertsHandler);

  // Cleanup listener when portal is replaced
  const observer = new MutationObserver(() => {
    if (!document.contains(container)) {
      window.removeEventListener('parent-alerts-updated', alertsHandler);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Bind mark as read on old notifications
  const bindNotificationActions = () => {};

  // Setup parent card tilts
  const setupParentCardTilt = () => {
    const pCard = container.querySelector('.fifa-rating-card');
    if (!pCard) return;
    
    const glowLayer = pCard.querySelector('.fifa-card-glow');
    
    pCard.addEventListener('mousemove', (e) => {
      const rect = pCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;
      
      pCard.style.transform = `rotateX(${-py * 20}deg) rotateY(${px * 20}deg) scale(1.04)`;
      if (glowLayer) {
        glowLayer.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        glowLayer.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
      }
    });
    
    pCard.addEventListener('mouseleave', () => {
      pCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      if (glowLayer) {
        glowLayer.style.setProperty('--glow-x', '50%');
        glowLayer.style.setProperty('--glow-y', '50%');
      }
    });
  };

  setupParentCardTilt();
}

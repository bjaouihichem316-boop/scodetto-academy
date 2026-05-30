import { state } from '../state.js';

export function renderCoaches(container) {
  if (container.querySelector('.coaches-section')) return;

  const coachesHTML = `
    <!-- Coaches Display Grid -->
    <section class="section-wrapper coaches-section" id="coaches-section">
      <div class="section-header">
        <span class="section-label">Staff d'Élite / الطاقم الفني</span>
        <h2 class="section-title">Les Experts Tactiques / المدربون المحترفون</h2>
      </div>
      
      <div class="coaches-grid">
        
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
                <!-- Authentic Tunisian Flag: red bg · white disc · red crescent · red star -->
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <rect width="24" height="16" fill="#D61A22" rx="2"/>
                  <circle cx="12" cy="8" r="4.5" fill="white"/>
                  <circle cx="11.2" cy="8" r="3.2" fill="#D61A22"/>
                  <circle cx="12.8" cy="8" r="2.7" fill="white"/>
                  <polygon points="14.5,6.8 14.9,8.0 16.0,8.0 15.1,8.7 15.4,9.9 14.5,9.2 13.6,9.9 13.9,8.7 13.0,8.0 14.1,8.0" fill="#D61A22"/>
                </svg>
                <!-- Scodetto Shield Mini -->
                <svg width="20" height="24" viewBox="0 0 100 100">
                  <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D4AF37" stroke-width="8"/>
                </svg>
              </div>
            </div>
            
            <!-- Animated SVG Avatar Coach Mohamed -->
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

            <!-- Sport Role Icon: Tactical Clipboard (Mohamed's speciality) -->
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
        
        <!-- Monta: Coach/Assistant (Red FUT Card) -->
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
                <!-- Authentic Tunisian Flag: red bg · white disc · red crescent · red star -->
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <rect width="24" height="16" fill="#D61A22" rx="2"/>
                  <circle cx="12" cy="8" r="4.5" fill="white"/>
                  <circle cx="11.2" cy="8" r="3.2" fill="#D61A22"/>
                  <circle cx="12.8" cy="8" r="2.7" fill="white"/>
                  <polygon points="14.5,6.8 14.9,8.0 16.0,8.0 15.1,8.7 15.4,9.9 14.5,9.2 13.6,9.9 13.9,8.7 13.0,8.0 14.1,8.0" fill="#D61A22"/>
                </svg>
                <!-- Scodetto Shield Mini -->
                <svg width="20" height="24" viewBox="0 0 100 100">
                  <path d="M50,5 L85,20 C85,60 50,95 50,95 C50,95 15,60 15,20 Z" fill="none" stroke="#D61A22" stroke-width="8"/>
                </svg>
              </div>
            </div>
            
            <!-- Animated SVG Avatar Coach Monta -->
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

            <!-- Sport Role Icon: Lightning Sprint / Physical Prep (Monta's speciality) -->
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(214,26,34,0.18);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D61A22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(214,26,34,0.6));flex-shrink:0;">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(214,26,34,0.12)"/>
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D61A22" stroke-width="2" stroke-linecap="round" style="filter:drop-shadow(0 0 4px rgba(214,26,34,0.5));flex-shrink:0;">
                <!-- Running figure -->
                <circle cx="16" cy="4" r="2"/>
                <path d="M14 10l-4 1-3 7"/>
                <path d="M14 10l2 5 4 2"/>
                <path d="M10 11l-2 6"/>
              </svg>
              <span style="font-size:0.6rem;color:rgba(214,26,34,0.75);font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Outfit',sans-serif;">Vitesse &bull; Physique</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  `;

  container.insertAdjacentHTML('beforeend', coachesHTML);

  // Setup pointer 3D tilt effects
  setupFifaCardsTilt();
  
  // Bind Coaches Click side-drawers
  bindCoachesClicks();
}

function bindCoachesClicks() {
  const cards = [
    { id: 'mohamed', el: document.getElementById('card-mohamed') },
    { id: 'monta', el: document.getElementById('card-monta') }
  ];

  cards.forEach(item => {
    if (item.el) {
      // Find parent container to set pointer cursor style
      const parentContainer = item.el.closest('.fifa-card-container');
      if (parentContainer) parentContainer.style.cursor = 'pointer';
      
      item.el.addEventListener('click', () => {
        openCoachCVDrawer(item.id);
      });
    }
  });
}

function openCoachCVDrawer(coachId) {
  const coach = state.coaches.find(c => c.id === coachId);
  if (!coach) return;

  // Check if drawer already exists
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

  // Render CV content
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

  // Trigger Slide in animations
  setTimeout(() => {
    backdrop.classList.add('open');
    drawer.classList.add('open');
  }, 10);

  // Close handlers
  const closeCV = () => {
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
  };

  drawer.querySelector('#btn-close-cv-drawer')?.addEventListener('click', closeCV);
  backdrop.addEventListener('click', closeCV);
}

function setupFifaCardsTilt() {
  const cards = document.querySelectorAll('.fifa-rating-card');
  
  cards.forEach(card => {
    const glow = card.querySelector('.fifa-card-glow');
    
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

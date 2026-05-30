/* ==========================================================================
   HERO COMPONENT - BILINGUAL, CINEMATIC UX, AUDIO & PARENT REGISTRATION
   ========================================================================== */

import { state } from '../state.js';
import { showToast } from '../lib/notifications.js';
import { playWhistleSound, playCrowdCheerSound, triggerConfettiCelebration } from '../lib/audio.js';

export function renderHero(container) {
  if (container.querySelector('.hero-section')) return;

  const heroHTML = `
    <section class="hero-section" id="hero-landing">

      <!-- BLOCK 1: Logo + Typography (fully separated from images) -->
      <div class="hero-identity-block">

        <div class="hero-logo-wrap">
          <img
            src="./assets/logo_official.jpg"
            alt="Scodetto Academy – Logo Officiel"
            class="hero-logo-img"
            loading="eager"
            decoding="async"
          />
        </div>

        <span class="hero-badge">Est. 2019 &bull; La Marsa, Tunis</span>

        <h1 class="hero-title">
          <span class="hero-title-fr">Formation d'&Eacute;lite pour Gar&ccedil;ons</span>
          <span class="hero-title-ar highlight-gold">تطوير نخبة مواهب الفتيان الكروية</span>
        </h1>

        <p class="hero-desc">
          L&apos;acad&eacute;mie de football de r&eacute;f&eacute;rence &agrave; La Marsa, Tunis.
          Entra&icirc;nements rigoureux, suivi de statistiques FIFA personnalis&eacute;es
          et pr&eacute;paration comp&eacute;titive d&apos;&eacute;lite.<br>
          <span class="arabic-txt">الأكاديمية الكروية المرجعية بالمرسى، تونس. تمارين احترافية، تتبع دقيق لإحصائيات فيفا الفردية وإعداد نخبة أبطال الغد.</span>
        </p>

        <div class="hero-actions">
          <a href="#parent-register-form-section" class="btn btn-primary" id="btn-hero-register-scroll">S&apos;inscrire / تسجيل اللاعب</a>
          <a href="#philosophy" class="btn btn-outline">Philosophie / فلسفتنا</a>
        </div>

      </div>

      <!-- BLOCK 2: Image Strip (images only, no text behind/above) -->
      <div class="hero-image-strip" id="hero-photo-showcase">

        <div class="hip hip-main" id="hip-team">
          <img src="./assets/team_main.jpg" alt="Équipe officielle Scodetto" class="hip-img" loading="eager" decoding="async" />
          <div class="hip-gradient"></div>
          <span class="hip-caption">Équipe Officielle / الفريق الرسمي</span>
          <div class="hip-border"></div>
        </div>

        <div class="hip hip-sub" id="hip-awards">
          <img src="./assets/team_awards.jpg" alt="Palmàres Scodetto" class="hip-img" loading="lazy" decoding="async" />
          <div class="hip-gradient"></div>
          <span class="hip-caption">Palmàrès &amp; Trophées / الكؤوس</span>
          <div class="hip-border"></div>
        </div>

        <div class="hip hip-sub" id="hip-tournament">
          <img src="./assets/team_tournament.jpg" alt="Tournois Scodetto" class="hip-img" loading="lazy" decoding="async" />
          <div class="hip-gradient"></div>
          <span class="hip-caption">Tournois &amp; Comp&eacute;titions / البطولات</span>
          <div class="hip-border"></div>
        </div>

      </div>

    </section>


    <!-- Bilingual Pricing, Contact & Schedules Block Grid -->
    <section class="section-wrapper" id="curriculum-schedule-block">
      <div class="bilingual-addons-grid">
        
        <!-- Left: Structured schedules table -->
        <div class="curriculum-table-block">
          <div class="block-header">
            <h2 style="font-family:'Outfit','Cairo',sans-serif;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Schedules des Entraînements / جدول التمارين
            </h2>
          </div>
          <p style="font-size:0.85rem;color:var(--color-text-muted);line-height:1.4;">
            Roster d'entraînements hebdomadaires des garçons à la Scodetto Arena, La Marsa.<br>أوقات الحصص التدريبية الأسبوعية للفتيان بملعب سكوديتو، المرسى.
          </p>
          
          <div style="overflow-x:auto;">
            <table class="curriculum-table">
              <thead>
                <tr>
                  <th>Groupe / الفئة</th>
                  <th>Âges / الأعمار</th>
                  <th>Séances / الحصص</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="font-weight:700;color:white;">Scodetto Bambinos</td>  <td>4 • 6 ans</td>  <td>Éveil moteur / وعي حركي</td>  <td>Samedi 10:00</td>        <td>Monta</td></tr>
                                <tr>
                  <td style="font-weight:700;color:white;">U10 Sparks</td>
                  <td>7 &bull; 9 ans / سنوات</td>
                  <td style="font-weight:600;color:var(--color-accent-gold);">Lundi & Mercredi &bull; 16:00 - 17:30<br><span class="arabic-txt" style="font-size:0.75rem;">الإثنين والأربعاء 16:00</span></td>
                </tr>
                <tr>
                  <td style="font-weight:700;color:white;">U12 Elite</td>
                  <td>10 &bull; 12 ans / سنوات</td>
                  <td style="font-weight:600;color:var(--color-accent-gold);">Lundi & Mercredi &bull; 17:30 - 19:00<br><span class="arabic-txt" style="font-size:0.75rem;">الإثنين والأربعاء 17:30</span></td>
                </tr>
                <tr>
                  <td style="font-weight:700;color:white;">U14 Tactique</td>
                  <td>13 &bull; 16 ans / سنوات</td>
                  <td style="font-weight:600;color:var(--color-accent-gold);">Mardi & Jeudi &bull; 16:00 - 17:30<br><span class="arabic-txt" style="font-size:0.75rem;">الثلاثاء والخميس 16:00</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Right: Price & Contact Info -->
        <div class="lux-info-cards-column" style="display:flex;flex-direction:column;gap:30px;">

          <!-- Price Card -->
          <div class="lux-info-card price-card" style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;padding:30px;display:flex;gap:20px;align-items:center;backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);box-shadow:0 10px 30px var(--glass-shadow);">
            <div class="lux-info-icon-wrapper" style="width:60px;height:60px;border-radius:14px;background:rgba(214,26,34,0.1);color:var(--color-accent-red);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(214,26,34,0.2);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            </div>
            <div class="lux-info-meta">
              <h3 style="font-family:'Outfit','Cairo',sans-serif;font-size:1.25rem;font-weight:700;color:white;margin:0;">Prix de la séance / سعر الحصة</h3>
              <p style="font-size:0.9rem;color:var(--color-text-muted);margin-top:4px;line-height:1.5;">Tarifs d'adhésion flexibles pour les séances ou forfait mensuel standard.<br>معاليم اشتراك مرنة لكل حصة أو خلاص شهري موحد.</p>
              <span id="live-prix-fr" class="lux-info-highlight live-prix-value" style="font-family:'Outfit','Cairo',sans-serif;font-size:1.5rem;font-weight:800;color:var(--color-accent-red);display:block;margin-top:8px;">${state.publicSettings.prix}</span>
              <span id="live-prix-ar" class="lux-info-highlight live-prix-value" style="font-family:'Cairo',sans-serif;font-size:1.15rem;font-weight:700;color:var(--color-accent-gold);display:block;margin-top:4px;">${state.publicSettings.prixAr}</span>
            </div>
          </div>

          <!-- Contact Card with WhatsApp -->
          <div class="lux-info-card" style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;padding:30px;display:flex;gap:20px;align-items:center;backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);box-shadow:0 10px 30px var(--glass-shadow);transition:border-color 0.3s ease;">
            <div class="lux-info-icon-wrapper" style="width:60px;height:60px;border-radius:14px;background:rgba(212,175,55,0.1);color:var(--color-accent-gold);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(212,175,55,0.2);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div class="lux-info-meta">
              <h3 style="font-family:'Outfit','Cairo',sans-serif;font-size:1.25rem;font-weight:700;color:white;margin:0;">Contactez-nous / اتصل بنا</h3>
              <p style="font-size:0.9rem;color:var(--color-text-muted);margin-top:4px;line-height:1.5;">${state.publicSettings.scheduleNotes}</p>
              <a id="live-contact-link" href="https://wa.me/${state.publicSettings.contact.replace(/[^0-9+]/g,'')}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;margin-top:8px;">
                <span id="live-contact-text" class="lux-info-highlight live-contact-value" style="font-family:'Outfit','Cairo',sans-serif;font-size:1.35rem;font-weight:800;color:var(--color-accent-gold);letter-spacing:0.5px;transition:color 0.2s ease;">${state.publicSettings.contact}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <p style="font-size:0.75rem;color:var(--color-text-muted);margin-top:4px;">E-mail: contact@scodetto.tn</p>
              <a href="https://www.facebook.com/scodettoAcademy" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;margin-top:12px;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2" stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z/></svg>
                <span style="font-family:'Outfit','Cairo',sans-serif;font-size:0.9rem;font-weight:600;color:#1877F2;transition:opacity 0.2s ease;">Facebook / فيسبوك</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- NEW FEATURE: Beautiful Luxury Palmarès & Trophées / السجل الذهبي والكؤوس -->
    <section class="section-wrapper palmares-section" id="academy-palmares">
      <div class="section-header">
        <span class="section-label">Palmarès & Trophées / السجل الذهبي والكؤوس</span>
        <h2 class="section-title">Notre Histoire Dorée / تاريخنا المليء بالبطولات</h2>
      </div>
      <p style="font-size:0.95rem;color:var(--color-text-muted);line-height:1.6;max-width:800px;">
        Depuis notre création en 2019, nos jeunes champions ont brillamment dominé les compétitions locales de Tunis et de La Marsa, remportant de prestigieux tournois et forgeant des souvenirs inoubliables de victoires collectives.<br>
        <span class="arabic-txt" style="font-size:0.9rem;color:var(--color-text-muted);">منذ تأسيسنا في 2019، حقق أبطالنا الصغار سيطرة مطلقة على البطولات المحلية بالمرسى وتونس العاصمة، متوجين بالعديد من الكؤوس المرموقة التي تؤكد تفوق منهجنا الرياضي وصناعة أبطال المستقبل.</span>
      </p>
      
      <div class="palmares-grid">
        <!-- Trophy 1 -->
        <div class="trophy-card">
          <div class="trophy-icon-wrapper">🏆</div>
          <div class="trophy-meta">
            <h3 style="font-family:'Outfit','Cairo',sans-serif;">Coupe des Académies de Tunis</h3>
            <p><strong>Vainqueur (U12) &bull; 2022, 2024</strong><br>Victoire historique en finale face à Sahel Juniors à la Marsa Arena.<br>بطل كأس تونس للأكاديميات فئة U12 مرتين متتاليتين.</p>
          </div>
        </div>
        
        <!-- Trophy 2 -->
        <div class="trophy-card">
          <div class="trophy-icon-wrapper">🥇</div>
          <div class="trophy-meta">
            <h3 style="font-family:'Outfit','Cairo',sans-serif;">Ligue des Champions de La Marsa</h3>
            <p><strong>Champions Invaincus (U10) &bull; 2023</strong><br>Saison parfaite avec 12 victoires consécutives sous la direction du Coach Monta.<br>بطل دوري المرسى فئة U10 دون أي هزيمة طيلة الموسم.</p>
          </div>
        </div>
        
        <!-- Trophy 3 -->
        <div class="trophy-card">
          <div class="trophy-icon-wrapper">🎗️</div>
          <div class="trophy-meta">
            <h3 style="font-family:'Outfit','Cairo',sans-serif;">Tournoi des Étoiles de Tunis</h3>
            <p><strong>Vainqueur de la Coupe d'Or &bull; 2021</strong><br>Compétition nationale regroupant les 16 meilleures académies du grand Tunis.<br>بطل دورة نجوم تونس الكبرى وتتويج بالكأس الذهبية الممتازة.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW FEATURE: Beautiful Floating/Interactive Parent Registration Form Panel -->
    <section class="section-wrapper" id="parent-register-form-section">
      <div class="registration-form-block">
        <div class="block-header">
          <h2 style="font-family:'Outfit','Cairo',sans-serif;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <polyline points="16 11 18 13 22 9"/>
            </svg>
            Demande d'Inscription / نافذة طلب التسجيل
          </h2>
        </div>
        <p style="font-size:0.9rem;color:var(--color-text-muted);line-height:1.5;max-width:800px;">
          Inscrivez votre garçon à Scodetto Academy, La Marsa. Après soumission, le sifflet retentira et les clameurs du stade célébreront son adhésion d'élite !<br>
          <span class="arabic-txt" style="font-size:0.85rem;color:var(--color-text-muted);">سجل ابنك الآن في الأكاديمية. عند إتمام التسجيل، ستطلق صافرة الحكم وتهتز مدرجات الملعب ترحيباً بالبطل الصغير !</span>
        </p>

        <form id="landing-parent-registration-form" style="margin-top:24px;">
          <div class="registration-form-grid">
            
            <!-- Nom de l'enfant -->
            <div class="form-group">
              <label for="parent-form-child-name" style="font-family:'Cairo',sans-serif;font-weight:700;">Nom de l'enfant / اسم الطفل</label>
              <input type="text" class="form-control" id="parent-form-child-name" required placeholder="Ex: Rayan Ben Chaabane">
            </div>
            
            <!-- Age / Année de naissance -->
            <div class="form-group">
              <label for="parent-form-child-age" style="font-family:'Cairo',sans-serif;font-weight:700;">Âge (7 à 16 ans) / العمر</label>
              <input type="number" class="form-control" id="parent-form-child-age" required min="7" max="16" placeholder="Ex: 11">
            </div>
            
            <!-- Téléphone du parent -->
            <div class="form-group">
              <label for="parent-form-parent-phone" style="font-family:'Cairo',sans-serif;font-weight:700;">Téléphone du parent / رقم هاتف الولي</label>
              <input type="tel" class="form-control" id="parent-form-parent-phone" required placeholder="Ex: +216 98 765 432">
            </div>

            <!-- Squad Allocation preview (Read Only auto) -->
            <div class="form-group">
              <label style="font-family:'Cairo',sans-serif;font-weight:700;">Squad Estimé / الفئة المتوقعة</label>
              <input type="text" class="form-control" id="parent-form-squad-preview" readonly value="U12 Elite" style="background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.05);color:var(--color-accent-gold);font-weight:700;">
            </div>
            
            <!-- Remarques particulières -->
            <div class="form-group form-group-full">
              <label for="parent-form-remarks" style="font-family:'Cairo',sans-serif;font-weight:700;">Remarques particulières (Santé, clubs précédents...) / ملاحظات إضافية</label>
              <textarea class="form-control" id="parent-form-remarks" rows="3" placeholder="Ex: Très agile, gaucher, a déjà joué dans un club scolaire... / مهارات خاصة، يساري، يعاني من الحساسية..."></textarea>
            </div>
            
          </div>
          
          <div style="display:flex;justify-content:center;margin-top:30px;">
            <button type="submit" class="btn btn-primary btn-sm" style="padding:14px 40px;font-size:1.1rem;box-shadow: 0 4px 20px var(--color-accent-gold-glow);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px;">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              S'inscrire / تسجيل لاعب جديد
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- NEW ELITE SECTION: Des Prodiges aux Légendes / مشاريع أساطير -->
    <section class="section-wrapper legends-section" id="academy-legends" style="margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.05);">
      <div class="section-header">
        <span class="section-label">Elite Stepping Stone / مشاريع أساطير</span>
        <h2 class="section-title">Des Prodiges aux Légendes / من البراعم إلى الاحتراف</h2>
      </div>
      <p style="font-size:0.95rem;color:var(--color-text-muted);line-height:1.6;max-width:800px;margin-bottom:30px;">
        Scodetto Academy est plus qu'un loisir : c'est un incubateur d'élite pour le football professionnel tunisien. Sous la tutelle rigoureuse des coachs Mohamed et Monta, nos meilleurs prodiges rejoignent chaque année les centres de formation des plus grands clubs professionnels de Tunisie.<br>
        <span class="arabic-txt" style="font-size:0.9rem;color:var(--color-text-muted);display:block;margin-top:5px;">سكوديتو ليست مجرد هواية، بل هي ممر حقيقي نحو الاحتراف. بفضل التدريب الأكاديمي عالي المستوى، ينتقل خيرة مواهبنا سنوياً إلى أعرق الأندية التونسية.</span>
      </p>

      <div class="legends-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:30px; margin-top:35px;">
        <!-- Legend Card 1: Club Africain transfers -->
        <div class="legend-card" style="background:var(--glass-bg); border:1.5px solid var(--glass-border-glow); border-radius:20px; padding:30px; display:flex; flex-direction:column; gap:20px; transition:all 0.3s ease; position:relative; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <!-- Club Africain badge: Red shield, white vertical stripes, correct crescent+star -->
              <svg width="45" height="45" viewBox="0 0 100 110" style="filter: drop-shadow(0 0 8px rgba(214,26,34,0.45));">
                <defs>
                  <clipPath id="ca-shield-clip">
                    <path d="M50,4 C74,4 85,24 85,52 C85,78 50,100 50,100 C50,100 15,78 15,52 C15,24 26,4 50,4 Z"/>
                  </clipPath>
                </defs>
                <!-- Shield fill: white base -->
                <path d="M50,4 C74,4 85,24 85,52 C85,78 50,100 50,100 C50,100 15,78 15,52 C15,24 26,4 50,4 Z" fill="white" stroke="#D61A22" stroke-width="3"/>
                <!-- Red vertical stripes clipped to shield -->
                <g clip-path="url(#ca-shield-clip)">
                  <rect x="15" y="4" width="14" height="96" fill="#D61A22"/>
                  <rect x="43" y="4" width="14" height="96" fill="#D61A22"/>
                  <rect x="71" y="4" width="14" height="96" fill="#D61A22"/>
                </g>
                <!-- Red circle center panel -->
                <circle cx="50" cy="48" r="18" fill="#D61A22" stroke="white" stroke-width="2"/>
                <!-- Crescent: two-circle subtraction technique (reliable cross-browser) -->
                <!-- White filled circle -->
                <circle cx="47" cy="45" r="11" fill="white"/>
                <!-- Red covering circle shifts it to crescent shape -->
                <circle cx="51" cy="45" r="9" fill="#D61A22"/>
                <!-- White 5-point star -->
                <polygon points="57,44 58.5,48.5 63,48.5 59.5,51.5 61,56 57,53 53,56 54.5,51.5 51,48.5 55.5,48.5" fill="white"/>
              </svg>
              <div>
                <h3 style="font-family:'Outfit','Cairo',sans-serif; font-size:1.15rem; margin:0; color:white;">Club Africain</h3>
                <span class="arabic-txt" style="font-size:0.8rem; color:var(--color-accent-red); display:block;">النادي الإفريقي &bull; Bab Jedid</span>
              </div>
            </div>
            <span style="font-size:0.8rem; font-weight:700; background:rgba(214,26,34,0.15); border:1px solid var(--color-accent-red); color:white; padding:4px 12px; border-radius:20px; font-family:'Cairo',sans-serif;">3 Transferts / ٣ انتقال</span>
          </div>
          <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.5; margin:0;">
            Trois de nos joueurs d'élite de la génération U12 ont rejoint le centre de formation de Bab Jedid après avoir dominé la Ligue de La Marsa.<br>
            <span class="arabic-txt" style="display:block; margin-top:6px; font-size:0.8rem;">ثلاثة من أبرز لاعبينا انتقلوا رسمياً لمركز تكوين الشبان بباب الجديد بعد تألقهم في المرسى.</span>
          </p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px; margin-top:5px;">
            <div>
              <span style="font-size:0.72rem; color:var(--color-text-muted); display:block; text-transform:uppercase;">Joueurs Transférés / المنتقلون</span>
              <strong style="color:var(--color-accent-gold); font-size:0.82rem; display:block; margin-top:2px;">Malek B., Hamza S., Rayen K.</strong>
            </div>
            <div>
              <span style="font-size:0.72rem; color:var(--color-text-muted); display:block; text-transform:uppercase;">Années / السنوات</span>
              <strong style="color:white; font-size:0.85rem; display:block; margin-top:2px;">2023, 2024, 2025</strong>
            </div>
          </div>
          
          <div style="background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:10px; border:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:0.75rem; color:var(--color-accent-gold); font-weight:700; font-family:'Cairo',sans-serif;">Indicateurs Athlétiques / مؤشرات النمو:</span>
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:0.8rem; color:var(--color-text-light);">
              <span>Vitesse & VMA: +18%</span>
              <span>Intuitivité Tactique: Élite</span>
            </div>
          </div>
        </div>

        <!-- Legend Card 2: Avenir Sportif de La Marsa transfers -->
        <div class="legend-card" style="background:var(--glass-bg); border:1.5px solid var(--glass-border-glow); border-radius:20px; padding:30px; display:flex; flex-direction:column; gap:20px; transition:all 0.3s ease; position:relative; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <!-- AS Marsa (Avenir Sportif de La Marsa) badge: Green & Yellow shield -->
              <svg width="45" height="45" viewBox="0 0 100 110" style="filter: drop-shadow(0 0 8px rgba(39,174,96,0.45));">
                <defs>
                  <linearGradient id="asm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2ecc71"/>
                    <stop offset="100%" stop-color="#27ae60"/>
                  </linearGradient>
                  <clipPath id="asm-shield-clip">
                    <path d="M50,4 C74,4 85,24 85,52 C85,78 50,100 50,100 C50,100 15,78 15,52 C15,24 26,4 50,4 Z"/>
                  </clipPath>
                </defs>
                <!-- Shield base: green -->
                <path d="M50,4 C74,4 85,24 85,52 C85,78 50,100 50,100 C50,100 15,78 15,52 C15,24 26,4 50,4 Z" fill="url(#asm-grad)" stroke="#f1c40f" stroke-width="3"/>
                <!-- Diagonal yellow band -->
                <g clip-path="url(#asm-shield-clip)">
                  <polygon points="15,60 85,20 85,36 15,76" fill="#f1c40f" opacity="0.85"/>
                </g>
                <!-- White circle center -->
                <circle cx="50" cy="50" r="16" fill="white" opacity="0.92"/>
                <!-- ASM lettering in green -->
                <text x="50" y="55" fill="#27ae60" font-family="Outfit,sans-serif" font-size="11" font-weight="900" text-anchor="middle">ASM</text>
              </svg>
              <div>
                <h3 style="font-family:'Outfit','Cairo',sans-serif; font-size:1.15rem; margin:0; color:white;">Avenir Sportif de La Marsa</h3>
                <span class="arabic-txt" style="font-size:0.8rem; color:#27ae60; display:block;">أفريقي المرسى &bull; AS Marsa</span>
              </div>
            </div>
            <span style="font-size:0.8rem; font-weight:700; background:rgba(39,174,96,0.15); border:1px solid #27ae60; color:white; padding:4px 12px; border-radius:20px; font-family:'Cairo',sans-serif;">Elite Club local</span>
          </div>
          <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.5; margin:0;">
            Partenaire naturel de notre académie à La Marsa, plusieurs de nos diplômés intègrent chaque saison les équipes compétitives de l'<strong>Avenir Sportif de La Marsa (AS Marsa)</strong>.<br>
            <span class="arabic-txt" style="display:block; margin-top:6px; font-size:0.8rem;">الشريك الطبيعي لأكاديميتنا بالمرسى (أفريقي المرسى / أس مرسى)، يلتحق خريجونا سنوياً بفرق الصفوة التنافسية.</span>
          </p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px; margin-top:5px;">
            <div>
              <span style="font-size:0.72rem; color:var(--color-text-muted); display:block; text-transform:uppercase;">Joueurs Transférés / المنتقلون</span>
              <strong style="color:var(--color-accent-gold); font-size:0.82rem; display:block; margin-top:2px;">Youssef B., Skander L., Yassine G.</strong>
            </div>
            <div>
              <span style="font-size:0.72rem; color:var(--color-text-muted); display:block; text-transform:uppercase;">Dernières Vagues</span>
              <strong style="color:white; font-size:0.85rem; display:block; margin-top:2px;">2024, 2025, 2026</strong>
            </div>
          </div>
          
          <div style="background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:10px; border:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:0.75rem; color:var(--color-accent-gold); font-weight:700; font-family:'Cairo',sans-serif;">Indicateurs Athlétiques / مؤشرات النمو:</span>
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:0.8rem; color:var(--color-text-light);">
              <span>VMA & Endurance: +22%</span>
              <span>Dribble efficace: U14 Sparks</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academy Philosophy Section (Bilingualized) -->
    <section class="section-wrapper" id="philosophy-section">
      <div class="section-header">
        <span class="section-label">Méthodologie / منهجنا</span>
        <h2 class="section-title">Philosophie & Curriculum / فلسفتنا التدريبية</h2>
      </div>
      
      <div class="philosophy-grid">
        <div class="philosophy-card">
          <div class="philosophy-card-icon">
            <!-- Tactical clipboard SVG icon -->
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-red)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px var(--color-accent-red-glow));">
              <rect x="8" y="2" width="8" height="4" rx="1" fill="rgba(214,26,34,0.1)"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <path d="M9 14h6"/>
              <path d="M9 18h6"/>
              <path d="M9 10h3"/>
            </svg>
          </div>
          <h3 style="font-family:'Outfit','Cairo',sans-serif;">Rigueur Tactique / الانضباط التكتيكي</h3>
          <p>Nous introduisons les bases spatiales tôt. Les garçons apprennent le positionnement et le jeu d'équipe sous la supervision tactique du coach Mohamed.<br><span class="arabic-txt" style="font-size:0.8rem;color:var(--color-text-muted);">تعلّم التمركز الذكي، اللعب الجماعي والوعي التكتيكي مبكراً تحت إشراف الكابتن محمد.</span></p>
        </div>
        
        <div class="philosophy-card">
          <div class="philosophy-card-icon">
            <!-- Moving whistle SVG icon -->
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px var(--color-accent-gold-glow));">
              <path d="M12 22a7 7 0 0 0 7-7V9a4 4 0 0 0-8 0v6a3 3 0 0 1-6 0"/>
              <path d="M15 15h4"/>
              <path d="M6 9 C6 9 9 6 13 6" stroke-dasharray="2,2"/>
            </svg>
          </div>
          <h3 style="font-family:'Outfit','Cairo',sans-serif;">Vitesse & Puissance / السرعة والقوة</h3>
          <p>Le coach Monta cible la vitesse explosive, la motricité, la coordination et la puissance athlétique des garçons pour les coupes locales.<br><span class="arabic-txt" style="font-size:0.8rem;color:var(--color-text-muted);">تحسين السرعة الانفجارية، التناسق البدني والرشاقة والتحمل العالي تحت قيادة الكابتن مونتا.</span></p>
        </div>
        
        <div class="philosophy-card">
          <div class="philosophy-card-icon">
            <!-- Premium shield with star SVG icon -->
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px var(--color-accent-gold-glow));">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(212,175,55,0.08)"/>
              <polygon points="12 7 13.5 10.5 17 11 14.5 13.5 15 17 12 15 9 17 9.5 13.5 7 11 10.5 10.5 12 7" fill="var(--color-accent-gold)"/>
            </svg>
          </div>
          <h3 style="font-family:'Outfit','Cairo',sans-serif;">Suivi FIFA / تتبع مهارات فيفا</h3>
          <p>Chaque garçon dispose d'une carte de compétences de style FIFA FUT en ligne. Les statistiques physiques sont actualisées mensuellement.<br><span class="arabic-txt" style="font-size:0.8rem;color:var(--color-text-muted);">كل لاعب يمتلك بطاقة مهارات رقمية تحاكي نظام بطاقات فيفا، مع تحيين شهري لمستوى الأداء البدني.</span></p>
        </div>
        <div class="philosophy-card">
          <div class="philosophy-card-icon">
            <!-- Coach / CAF Badge SVG icon -->
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-red)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px var(--color-accent-red-glow));">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 style="font-family:'Outfit','Cairo',sans-serif;">Encadrement d'Élite / إشراف نخبوي</h3>
          <p>Encadré par un professeur d'éducation physique spécialisé en football ⚽️ (CAF B). Notre mission est de transmettre la passion du football aux jeunes athlètes et de les aider à développer leur plein potentiel. Nous offrons un entraînement complet qui allie technique, condition physique, tactique et intelligence de jeu. À partir de 4 ans — tout le monde est le bienvenu !<br><span class="arabic-txt" style="font-size:0.8rem;color:var(--color-text-muted);display:block;margin-top:6px;">تحت إشراف أستاذ تربية بدنية اختصاص كرة قدم ⚽️ CAF B. مهمتنا هي نقل شغف كرة القدم إلى الرياضيين الشباب، مع مساعدتهم على تطوير إمكاناتهم إلى أقصى حد. نقدم تدريبًا شاملاً يجمع بين التقنية والبدنية والتكتيكات وذكاء اللعبة. ابتداءً من 4 سنوات ومرحباً بالجميع.</span></p>
        </div>
      </div>
    </section>
  `;

  container.insertAdjacentHTML('afterbegin', heroHTML);

  // ── Live publicSettings binding ─────────────────────────────────────────────
  // Apply current state values to the price/contact nodes
  const applyPublicSettings = (settings) => {
    const s = settings || state.publicSettings;
    const prixFr   = document.getElementById('live-prix-fr');
    const prixAr   = document.getElementById('live-prix-ar');
    const contactT = document.getElementById('live-contact-text');
    const contactL = document.getElementById('live-contact-link');
    if (prixFr)  { prixFr.textContent  = s.prix;   prixFr.classList.add('live-updated'); setTimeout(() => prixFr.classList.remove('live-updated'), 700); }
    if (prixAr)  { prixAr.textContent  = s.prixAr; prixAr.classList.add('live-updated'); setTimeout(() => prixAr.classList.remove('live-updated'), 700); }
    if (contactT) { contactT.textContent = s.contact; contactT.classList.add('live-updated'); setTimeout(() => contactT.classList.remove('live-updated'), 700); }
    if (contactL)  contactL.href = `https://wa.me/${(s.contact||'').replace(/[^0-9+]/g,'')}`;
  };

  // Subscribe to live admin updates — fires when Mohamed saves from dashboard
  const settingsHandler = (e) => applyPublicSettings(e.detail);
  window.addEventListener('public-settings-updated', settingsHandler);

  // Cleanup subscription when hero is removed from DOM
  const heroCleanupObserver = new MutationObserver(() => {
    if (!document.getElementById('hero-landing')) {
      window.removeEventListener('public-settings-updated', settingsHandler);
      heroCleanupObserver.disconnect();
    }
  });
  heroCleanupObserver.observe(document.body, { childList: true, subtree: true });

  // Smooth scroll — register button
  container.querySelector('#btn-hero-register-scroll')?.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('parent-register-form-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Staggered entrance — image panels fade up
  requestAnimationFrame(() => {
    container.querySelectorAll('.hip').forEach((panel, i) => {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(24px)';
      setTimeout(() => {
        panel.style.transition = 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }, 80 + i * 120);
    });
  });


  // Dynamically update squad preview on age change
  const ageInput = document.getElementById('parent-form-child-age');
  const squadPreview = document.getElementById('parent-form-squad-preview');
  ageInput?.addEventListener('input', () => {
    const age = parseInt(ageInput.value, 10);
    if (!age) return;
    
    if (age >= 13) {
      squadPreview.value = "U14 Tactique (13-16 ans)";
    } else if (age >= 10) {
      squadPreview.value = "U12 Elite (10-12 ans)";
    } else if (age >= 7) {
      squadPreview.value = "U10 Sparks (7-9 ans)";
    } else {
      squadPreview.value = "Scodetto Bambinos (4-6 ans)";
    }
  });

  // Parent Registration Form Submit Hook
  const registerForm = document.getElementById('landing-parent-registration-form');
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const childName = document.getElementById('parent-form-child-name').value;
    const age = parseInt(document.getElementById('parent-form-child-age').value, 10);
    const phone = document.getElementById('parent-form-parent-phone').value;
    const remarks = document.getElementById('parent-form-remarks').value;
    
    // Squad category allocation
    const group = age >= 13 ? "U14 Tactique" : (age >= 10 ? "U12 Elite" : (age >= 7 ? "U10 Sparks" : "Scodetto Bambinos"));
    
    const newAthlete = {
      id: Date.now(),
      name: childName,
      age: age,
      group: group,
      parent: "Parent Invité",
      phone: phone,
      status: "unpaid", // Needs payment
      date: new Date().toISOString().split('T')[0]
    };
    
    // Add player dynamically to db Roster
    state.roster.push(newAthlete);
    
    // AUDIO TRIGGERS Spatial
    playWhistleSound();
    
    // Staggered stadium crowd cheer audio!
    setTimeout(() => {
      playCrowdCheerSound();
    }, 150);
    
    // Dynamic golden and red confetti animation overlay cascade!
    triggerConfettiCelebration();
    
    // Successful notification
    showToast(`BRAVO ! ${childName} inscrit d'élite dans ${group}! / تهانينا ! تم تسجيل البطل الصغير بنجاح !`);
    
    // Reset Form
    registerForm.reset();
    squadPreview.value = "U12 Elite";
  });

  // Add floating WhatsApp CTA button
  addFloatingWhatsAppButton();
}


// Floating WhatsApp Button for Public Site
function addFloatingWhatsAppButton() {
  // Remove existing if any
  const existing = document.getElementById('floating-whatsapp-btn');
  if (existing) return;
  
  const btn = document.createElement('a');
  btn.id = 'floating-whatsapp-btn';
  btn.href = 'https://wa.me/21698123456';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Contactez-nous sur WhatsApp / تواصل معنا عبر واتساب');
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 9999;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #25D366;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
  `;
  
  btn.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  `;
  
  // Hover effect
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.12)';
    btn.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.6)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.4)';
  });
  
  // Gentle pulse animation via CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes whatsapp-pulse {
      0% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
      50% { box-shadow: 0 4px 25px rgba(37, 211, 102, 0.7); }
      100% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
    }
    #floating-whatsapp-btn {
      animation: whatsapp-pulse 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(btn);
}

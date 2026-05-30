/* ==========================================================================
   SCODETTO ACADEMY - Default Miscellaneous Data
   ========================================================================== */

export const defaultWeeklyPerformer = {
  playerId: 1,
  playerName: "Youssef Chaabani",
  playerGroup: "U12 Elite",
  avatar: "Y",
  rating: 86,
  stats: { pac: 88, sho: 82, pas: 85, dri: 90, def: 74, phy: 80 },
  metric: "Meilleur Passeur / أفضل مُمرِّر",
  metricValue: "12 passes décisives / 12 تمريرة حاسمة",
  badge: "🎯",
  coachUpdated: "Coach Mohamed",
  week: "Semaine du 19 — 25 Mai 2026"
};

export const defaultLegendRecords = [];

export const defaultDailyTasks = [
  { id: 1, text: "Vérifier les présences / تسجيل الحضور", done: false, date: "2026-05-25" },
  { id: 2, text: "Préparer le matériel d'entraînement / تجهيز معدات التمرين", done: false, date: "2026-05-25" },
  { id: 3, text: "Mettre à jour les fiches FIFA / تحيين بطاقات فيفا", done: false, date: "2026-05-25" }
];

export const defaultCoachNotes = [
  { id: 1, text: "Contacter le parent de Firas pour la cotisation / الاتصال بولي أمر فراس بخصوص الاشتراك", date: "2026-05-24" },
  { id: 2, text: "Préparer le programme de la semaine prochaine / تحضير برنامج الأسبوع القادم", date: "2026-05-25" }
];

export const defaultPinRegistry = {
  // Parents — keyed by parent name exactly as in roster
  "Slim Chaabani":   "1234",
  "Kamel Touati":    "2345",
  "Radhouane Melliti": "3456",
  "Naim Ghoula":     "4567",
  "Hichem Ben Youssef": "5678",
  "Mehdi Trabelsi":  "6789",
  // Coaches — keyed by id
  "mohamed": "0000",
  "monta":   "1111"
};

export const defaultPublicSettings = {
  prix: "120 TND / mois",
  prixAr: "120 دينار / شهر",
  contact: "+216 98 765 432",
  contactNote: "Disponible Lun–Sam 09:00–20:00 / متاح الاثنين–السبت 9ص–8م",
  scheduleNotes: "Entraînements à La Marsa Arena, rue Habib Bourguiba. / التمارين بملعب المرسى أرينا، شارع الحبيب بورقيبة."
};

export const defaultParentAlerts = [
  {
    id: 601,
    type: "match",
    title: "Match Officiel — Samedi / مباراة رسمية — السبت",
    body: "Scodetto U12 vs Sahel Juniors • Samedi 09:00 (Terrain B, La Marsa Arena). Tenue complète obligatoire. / سكوديتو U12 ضد ساحل جونيورز • السبت 09:00 (ملعب ب). الزي الرياضي الكامل إلزامي.",
    targetGroup: "U12 Elite",
    sentBy: "Coach Mohamed",
    time: "Il y a 4h / منذ 4 ساعات",
    unread: true
  },
  {
    id: 602,
    type: "info",
    title: "Cotisations de Mai / اشتراكات شهر ماي",
    body: "Les cotisations de mai sont dues avant le 31/05. Règlement en espèces ou virement. / اشتراكات شهر ماي واجبة قبل 31 ماي. الدفع نقداً أو تحويل بنكي.",
    targetGroup: "all",
    sentBy: "Coach Mohamed",
    time: "Il y a 1 jour / منذ يوم",
    unread: false
  },
  {
    id: 603,
    type: "event",
    title: "Gala de Fin de Saison / حفل نهاية الموسم",
    body: "Le Gala annuel de remise des trophées aura lieu le Samedi 14 Juin 2026 à 17:00. Familles bienvenues. / حفل التتويج السنوي يوم السبت 14 جوان 2026 على الساعة 17:00. الأسر مدعوة.",
    targetGroup: "all",
    sentBy: "Système / نظام",
    time: "Il y a 2 jours / منذ يومين",
    unread: true
  },
  {
    id: 604,
    type: "info",
    title: "Portes Ouvertes Bambinos / أبواب مفتوحة للصغار",
    body: "Séance d\'essai gratuite pour les 4-6 ans, samedi 10:00. Inscription sur place. / حصة تجريبية مجانية للأعمار 4-6 سنوات، السبت 10:00. تسجيل ميداني.",
    targetGroup: "Scodetto Bambinos",
    sentBy: "Coach Monta",
    time: "Il y a 3 jours / منذ 3 أيام",
    unread: true
  }
];

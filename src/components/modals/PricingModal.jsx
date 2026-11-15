import { X, Check, Crown, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useCreator } from "../../context/CreatorContext";
import { useState } from "react";

const PRICING_TEXTS = {
  tr: {
    badge: "CREATORFLOW PRO STÜDYO",
    title: "İçerik Üretiminizi Sınırsız Hale Getirin",
    subtitle:
      "Çoklu kanal yönetimi, sınırsız video fikri ve çapraz platform analizleriyle kanallarınızı büyütün.",
    monthly: "Aylık Ödeme",
    yearly: "Yıllık Ödeme",
    discount: "%20 İndirim",
    freeTitle: "Başlangıç (Free)",
    freeDesc: "Yeni başlayan tek kanallı üreticiler için",
    proTitle: "Creator Pro",
    proDesc: "Birden fazla kanal yöneten ciddi üreticiler için",
    perMonth: "/ ay",
    billedYearly: "Yıllık faturalandırılır ($84/yıl)",
    billedMonthly: "Aylık faturalandırılır",
    currentPlan: "Mevcut Planınız",
    upgradeBtn: "Pro Plana Geç",
    downgradeBtn: "Free Plana Dön (Test)",
    upgrading: "İşleniyor...",
    secureNote:
      "256-bit SSL güvenli altyapı • İstediğiniz zaman tek tıkla iptal edin",
    freeFeatures: [
      "Maksimum 15 aktif video kartı",
      "2 kanala kadar yönetim",
      "Temel Kanban üretim panosu",
      "Standart Hook Bankası şablonları",
    ],
    proFeatures: [
      "Sınırsız video fikri ve senaryo kartı",
      "Sınırsız YouTube, Reels ve TikTok kanalı",
      "Gelişmiş Çapraz Platform Analizi",
      "Özel Hook Şablonları kaydetme",
      "Haftalık Sürükle-Bırak Yayın Takvimi",
      "5 dilde global çalışma alanı",
    ],
  },
  en: {
    badge: "CREATORFLOW PRO STUDIO",
    title: "Scale Your Short-Form Production",
    subtitle:
      "Unlock unlimited channels, video ideas, and cross-platform analytics to grow faster.",
    monthly: "Monthly",
    yearly: "Yearly",
    discount: "Save 20%",
    freeTitle: "Starter (Free)",
    freeDesc: "For solo creators just starting out",
    proTitle: "Creator Pro",
    proDesc: "For serious creators managing multiple channels",
    perMonth: "/ month",
    billedYearly: "Billed annually ($84/yr)",
    billedMonthly: "Billed monthly",
    currentPlan: "Current Plan",
    upgradeBtn: "Upgrade to Pro",
    downgradeBtn: "Switch to Free (Test)",
    upgrading: "Processing...",
    secureNote: "256-bit SSL secure checkout • Cancel anytime with one click",
    freeFeatures: [
      "Up to 15 active video cards",
      "Manage up to 2 channels",
      "Core Kanban production board",
      "Standard Hook Bank templates",
    ],
    proFeatures: [
      "Unlimited video ideas & script cards",
      "Unlimited YouTube, Reels & TikTok channels",
      "Full Cross-Platform Analytics suite",
      "Save custom viral Hook templates",
      "Drag & drop Release Calendar",
      "Multi-language global workspace",
    ],
  },
  es: {
    badge: "ESTUDIO CREATORFLOW PRO",
    title: "Lleva tu Producción al Siguiente Nivel",
    subtitle:
      "Desbloquea canales ilimitados, ideas de video y analítica multiplataforma.",
    monthly: "Mensual",
    yearly: "Anual",
    discount: "-20%",
    freeTitle: "Inicial (Gratis)",
    freeDesc: "Para creadores que recién comienzan",
    proTitle: "Creator Pro",
    proDesc: "Para creadores con múltiples canales",
    perMonth: "/ mes",
    billedYearly: "Facturado anualmente ($84/año)",
    billedMonthly: "Facturado mensualmente",
    currentPlan: "Plan Actual",
    upgradeBtn: "Actualizar a Pro",
    downgradeBtn: "Volver a Gratis (Test)",
    upgrading: "Procesando...",
    secureNote: "Pago seguro SSL • Cancela cuando quieras con un clic",
    freeFeatures: [
      "Hasta 15 videos activos",
      "Hasta 2 canales",
      "Tablero Kanban básico",
      "Plantillas de Hook estándar",
    ],
    proFeatures: [
      "Ideas de video y guiones ilimitados",
      "Canales ilimitados (YT, Reels, TikTok)",
      "Analítica multiplataforma avanzada",
      "Plantillas de Hook personalizadas",
      "Calendario de publicación semanal",
      "Soporte completo en 5 idiomas",
    ],
  },
  fr: {
    badge: "STUDIO CREATORFLOW PRO",
    title: "Passez votre Production au Niveau Supérieur",
    subtitle:
      "Débloquez des chaînes illimitées, des idées de vidéos et des analyses complètes.",
    monthly: "Mensuel",
    yearly: "Annuel",
    discount: "-20%",
    freeTitle: "Débutant (Gratuit)",
    freeDesc: "Pour les créateurs qui débutent",
    proTitle: "Creator Pro",
    proDesc: "Pour gérer plusieurs chaînes efficacement",
    perMonth: "/ mois",
    billedYearly: "Facturé annuellement (84$/an)",
    billedMonthly: "Facturé mensuellement",
    currentPlan: "Plan Actuel",
    upgradeBtn: "Passer à Pro",
    downgradeBtn: "Passer à Gratuit (Test)",
    upgrading: "Traitement...",
    secureNote: "Paiement sécurisé SSL • Annulez à tout moment",
    freeFeatures: [
      "Jusqu'à 15 vidéos actives",
      "Jusqu'à 2 chaînes",
      "Tableau Kanban de base",
      "Modèles de Hooks standards",
    ],
    proFeatures: [
      "Idées de vidéos et scripts illimités",
      "Chaînes illimitées (YT, Reels, TikTok)",
      "Analytique multiplateforme avancée",
      "Modèles de Hooks personnalisés",
      "Calendrier de publication interactif",
      "Interface disponible en 5 langues",
    ],
  },
  de: {
    badge: "CREATORFLOW PRO STUDIO",
    title: "Unbegrenzte Kurzvideo-Produktion",
    subtitle:
      "Schalten Sie unbegrenzte Kanäle, Video-Ideen und plattformübergreifende Analysen frei.",
    monthly: "Monatlich",
    yearly: "Jährlich",
    discount: "20% sparen",
    freeTitle: "Starter (Kostenlos)",
    freeDesc: "Für Einsteiger mit einem Kanal",
    proTitle: "Creator Pro",
    proDesc: "Für Creator mit mehreren Kanälen",
    perMonth: "/ Monat",
    billedYearly: "Jährliche Abrechnung (84$/Jahr)",
    billedMonthly: "Monatliche Abrechnung",
    currentPlan: "Aktueller Plan",
    upgradeBtn: "Upgrade auf Pro",
    downgradeBtn: "Zu Free wechseln (Test)",
    upgrading: "Wird bearbeitet...",
    secureNote: "256-Bit SSL-Sicherheit • Jederzeit mit einem Klick kündbar",
    freeFeatures: [
      "Bis zu 15 aktive Videokarten",
      "Bis zu 2 Kanäle verwalten",
      "Basis Kanban-Board",
      "Standard Hook-Vorlagen",
    ],
    proFeatures: [
      "Unbegrenzte Video-Ideen & Skripte",
      "Unbegrenzte Kanäle (YT, Reels, TikTok)",
      "Plattformübergreifende Analysen",
      "Eigene Hook-Vorlagen speichern",
      "Interaktiver Veröffentlichungskalender",
      "Mehrsprachiger Arbeitsbereich",
    ],
  },
};

export default function PricingModal() {
  const {
    isPricingModalOpen,
    setIsPricingModalOpen,
    user,
    upgradeUserPlan,
    language,
  } = useCreator();
  const [billingCycle, setBillingCycle] = useState("yearly"); // 'monthly' | 'yearly'
  const [loading, setLoading] = useState(false);

  if (!isPricingModalOpen) return null;

  const ui = PRICING_TEXTS[language] || PRICING_TEXTS.en;
  const isPro = user?.plan === "pro";
  const proPrice = billingCycle === "yearly" ? 7 : 9;

  const handlePlanChange = async (targetPlan) => {
    setLoading(true);
    try {
      await upgradeUserPlan(targetPlan);
      setIsPricingModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-[#161920] border border-slate-800 rounded-3xl w-full max-w-3xl p-6 md:p-8 shadow-2xl">
        {/* Kapat Butonu */}
        <button
          onClick={() => setIsPricingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Üst Başlık */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            {ui.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            {ui.title}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {ui.subtitle}
          </p>
        </div>

        {/* Aylık / Yıllık Seçici */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex items-center bg-[#0F1115] border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {ui.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {ui.yearly}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                {ui.discount}
              </span>
            </button>
          </div>
        </div>

        {/* Paket Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sol Kart: Free Plan */}
          <div className="bg-[#0F1115] border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{ui.freeTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{ui.freeDesc}</p>

              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400">{ui.perMonth}</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                {ui.freeFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!isPro ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800/70 text-slate-400 border border-slate-700/60 cursor-default"
              >
                {ui.currentPlan}
              </button>
            ) : (
              <button
                onClick={() => handlePlanChange("free")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                {ui.downgradeBtn}
              </button>
            )}
          </div>

          {/* Sağ Kart: Creator Pro Plan */}
          <div className="relative bg-gradient-to-b from-indigo-950/40 to-[#0F1115] border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-indigo-500/10">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  {ui.proTitle}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  POPULAR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{ui.proDesc}</p>

              <div className="my-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    ${proPrice}
                  </span>
                  <span className="text-xs text-slate-400">{ui.perMonth}</span>
                </div>
                <span className="text-[11px] text-indigo-300">
                  {billingCycle === "yearly"
                    ? ui.billedYearly
                    : ui.billedMonthly}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                {ui.proFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isPro ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              >
                ✓ {ui.currentPlan}
              </button>
            ) : (
              <button
                onClick={() => handlePlanChange("pro")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                {loading ? ui.upgrading : ui.upgradeBtn}
              </button>
            )}
          </div>
        </div>

        {/* Alt Güvenlik Notu */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{ui.secureNote}</span>
        </div>
      </div>
    </div>
  );
}

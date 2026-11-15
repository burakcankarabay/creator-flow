import { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  Tag,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

const HOOK_UI_TEXTS = {
  tr: {
    allCategories: "Tümü",
    addHookTitle: "Kendi Viral Hook Şablonunu Ekle",
    categoryPlaceholder: "Kategori (Örn: Merak, Korku, İpucu)",
    hookTextPlaceholder: "Örn: Kimsenin bilmediği [Konu] gerçeği...",
    impactHigh: "Çok Yüksek",
    impactMedium: "Yüksek",
    addBtn: "Şablon Ekle",
    copied: "Kopyalandı",
    copyBtn: "Kopyala",
    emptyHooks: "Bu kategoride henüz bir hook şablonu bulunmuyor.",
  },
  en: {
    allCategories: "All",
    addHookTitle: "Add Custom Viral Hook Template",
    categoryPlaceholder: "Category (e.g. Curiosity, Fear, Tip)",
    hookTextPlaceholder: "e.g. The untold truth about [Topic]...",
    impactHigh: "Very High",
    impactMedium: "High",
    addBtn: "Add Template",
    copied: "Copied",
    copyBtn: "Copy",
    emptyHooks: "No hook templates found in this category.",
  },
  es: {
    allCategories: "Todos",
    addHookTitle: "Añadir Plantilla de Gancho Viral",
    categoryPlaceholder: "Categoría (ej. Curiosidad, Misterio)",
    hookTextPlaceholder: "ej. La verdad oculta sobre [Tema]...",
    impactHigh: "Muy Alto",
    impactMedium: "Alto",
    addBtn: "Añadir Plantilla",
    copied: "Copiado",
    copyBtn: "Copiar",
    emptyHooks: "No hay plantillas en esta categoría.",
  },
  fr: {
    allCategories: "Tous",
    addHookTitle: "Ajouter un Modèle de Hook Viral",
    categoryPlaceholder: "Catégorie (ex. Curiosité, Mystère)",
    hookTextPlaceholder: "ex. La vérité cachée sur [Sujet]...",
    impactHigh: "Très Élevé",
    impactMedium: "Élevé",
    addBtn: "Ajouter",
    copied: "Copié",
    copyBtn: "Copier",
    emptyHooks: "Aucun modèle trouvé dans cette catégorie.",
  },
  de: {
    allCategories: "Alle",
    addHookTitle: "Eigene Hook-Vorlage hinzufügen",
    categoryPlaceholder: "Kategorie (z.B. Neugier, Geheimnis)",
    hookTextPlaceholder: "z.B. Die unbekannte Wahrheit über [Thema]...",
    impactHigh: "Sehr Hoch",
    impactMedium: "Hoch",
    addBtn: "Hinzufügen",
    copied: "Kopiert",
    copyBtn: "Kopieren",
    emptyHooks: "Keine Vorlagen in dieser Kategorie gefunden.",
  },
};

export default function HookBankView() {
  const {
    hookTemplates = [],
    dispatch,
    openNewIdeaWithHook,
    t,
    language,
  } = useCreator();
  const ui = HOOK_UI_TEXTS[language] || HOOK_UI_TEXTS.tr;

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [newCategory, setNewCategory] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [newImpact, setNewImpact] = useState(ui.impactHigh);
  const [copiedId, setCopiedId] = useState(null);

  // Mevcut şablonlardan benzersiz kategorileri çıkar
  const categories = [
    "ALL",
    ...new Set(hookTemplates.map((h) => h.category).filter(Boolean)),
  ];

  const filteredHooks =
    selectedCategory === "ALL"
      ? hookTemplates
      : hookTemplates.filter((h) => h.category === selectedCategory);

  const handleAddCustomHook = (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newTemplate.trim()) return;

    dispatch({
      type: "ADD_CUSTOM_HOOK",
      payload: {
        category: newCategory.trim(),
        template: newTemplate.trim(),
        impact: newImpact || ui.impactHigh,
      },
    });

    setNewCategory("");
    setNewTemplate("");
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161920] border border-slate-800/90 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              {t("hookBankTitle")}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t("hookBankDesc")}</p>
        </div>

        {/* Kategori Filtre Sekmeleri */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-[#0F1115] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat === "ALL" ? ui.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Yeni Özel Hook Ekleme Formu */}
      <form
        onSubmit={handleAddCustomHook}
        className="bg-[#161920] border border-slate-800/90 rounded-2xl p-5 space-y-4"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          {ui.addHookTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            placeholder={ui.categoryPlaceholder}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="md:col-span-3 bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <input
            type="text"
            placeholder={ui.hookTextPlaceholder}
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            className="md:col-span-5 bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={newImpact}
            onChange={(e) => setNewImpact(e.target.value)}
            className="md:col-span-2 bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value={ui.impactHigh}>{ui.impactHigh}</option>
            <option value={ui.impactMedium}>{ui.impactMedium}</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{ui.addBtn}</span>
          </button>
        </div>
      </form>

      {/* Şablon Kartları Listesi */}
      {filteredHooks.length === 0 ? (
        <div className="bg-[#161920] border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500 text-xs">
          {ui.emptyHooks}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHooks.map((item) => {
            const isCustom = !String(item.id).startsWith("h");

            return (
              <div
                key={item.id}
                className="bg-[#161920] border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ⚡ {item.impact} {t("impactSuffix")}
                      </span>

                      {isCustom && (
                        <button
                          onClick={() =>
                            dispatch({
                              type: "DELETE_CUSTOM_HOOK",
                              payload: item.id,
                            })
                          }
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Şablonu Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed mb-5">
                    "{item.template}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleCopy(item.id, item.template)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#0F1115] hover:bg-slate-800 text-slate-300 text-xs font-medium py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{ui.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{ui.copyBtn}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openNewIdeaWithHook(item.template)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold py-2 rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
                  >
                    <span>{t("useHookBtn")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

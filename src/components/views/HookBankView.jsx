import useState from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight, Plus, Trash2, X } from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

export default function HookBankView() {
  const { openNewIdeaWithHook, t, hookTemplates, dispatch, language } =
    useCreator();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [impact, setImpact] = useState("");

  const handleUseHook = (hookText) => {
    navigate(`/board${location.search}`);
    openNewIdeaWithHook(hookText);
  };

  const handleCreateHook = (e) => {
    e.preventDefault();
    if (!text.trim() || !category.trim()) return;

    dispatch({
      type: "ADD_CUSTOM_HOOK",
      payload: {
        category: category.trim(),
        text: text.trim(),
        impact: impact.trim() || "Viral Hook",
        language,
      },
    });

    setCategory("");
    setText("");
    setImpact("");
    setIsAdding(false);
  };

  const handleDeleteHook = (id) => {
    dispatch({
      type: "DELETE_CUSTOM_HOOK",
      payload: id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Üst Bar: Başlık ve + Yeni Hook Şablonu Ekle Butonu */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">{t("navHooks")}</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? t("cancel") : t("addHookBtn")}
        </button>
      </div>

      {/* Yeni Hook Şablonu Ekleme Formu */}
      {isAdding && (
        <form
          onSubmit={handleCreateHook}
          className="bg-[#161920] border border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t("category")} *
              </label>
              <input
                type="text"
                required
                placeholder="Mystery & History, Ocean, Comedy..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t("hookImpactLabel")}
              </label>
              <input
                type="text"
                placeholder="High Curiosity / Shock Value"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-400 mb-1.5">
              {t("hookTextLabel")} *
            </label>
            <textarea
              rows={2}
              required
              placeholder={t("hookPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl cursor-pointer"
            >
              {t("saveHookBtn")}
            </button>
          </div>
        </form>
      )}

      {/* Hook Şablonları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hookTemplates.map((hook) => (
          <div
            key={hook.id}
            className="group bg-[#161920] border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400">
                    {hook.category}
                  </span>
                  {hook.isCustom && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {t("customBadge")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {hook.impact}
                  </span>
                  {hook.isCustom && (
                    <button
                      onClick={() => handleDeleteHook(hook.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-slate-100 italic mb-4 leading-relaxed">
                "{hook.text}"
              </p>
            </div>

            <button
              onClick={() => handleUseHook(hook.text)}
              className="self-start flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {t("useHookBtn")} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

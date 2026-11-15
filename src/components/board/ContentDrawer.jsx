import { useState, useRef, useEffect } from "react";
import {
  X,
  Trash2,
  Sparkles,
  BarChart2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useCreator, COLUMNS } from "../../context/CreatorContext";

export default function ContentDrawer() {
  const { selectedVideo, setSelectedVideoId, dispatch, saveStatus, t } =
    useCreator();

  const [copiedField, setCopiedField] = useState(null);
  const debounceTimerRef = useRef(null);
  const pendingUpdatesRef = useRef({});

  const flushPendingSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const pending = pendingUpdatesRef.current;
    if (pending && Object.keys(pending).length > 0 && pending.id) {
      dispatch({
        type: "UPDATE_VIDEO",
        payload: pending,
      });
      pendingUpdatesRef.current = {};
    }
  };

  useEffect(() => {
    return () => flushPendingSave();
  }, [selectedVideo?.id]);

  if (!selectedVideo) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDebouncedUpdate = (updates) => {
    const payload = { id: selectedVideo.id, ...updates };

    dispatch({
      type: "UPDATE_VIDEO_LOCAL",
      payload,
    });

    pendingUpdatesRef.current = {
      ...pendingUpdatesRef.current,
      ...payload,
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatch({
        type: "UPDATE_VIDEO",
        payload: pendingUpdatesRef.current,
      });
      pendingUpdatesRef.current = {};
      debounceTimerRef.current = null;
    }, 500);
  };

  const handleFieldChange = (field, value) => {
    handleDebouncedUpdate({ [field]: value });
  };

  const handlePlatformViewsChange = (platformKey, viewsValue) => {
    const num = Math.max(0, parseInt(viewsValue, 10) || 0);
    const updatedPlatforms = {
      ...selectedVideo.platforms,
      [platformKey]: {
        ...selectedVideo.platforms[platformKey],
        views: num,
        published:
          num > 0 ? true : selectedVideo.platforms[platformKey].published,
      },
    };
    handleDebouncedUpdate({ platforms: updatedPlatforms });
  };

  const handleClose = () => {
    flushPendingSave();
    setSelectedVideoId(null);
  };

  const handleDelete = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    pendingUpdatesRef.current = {};
    dispatch({ type: "DELETE_VIDEO", payload: selectedVideo.id });
    setSelectedVideoId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#161920] border-l border-slate-800 h-full flex flex-col justify-between p-6 overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {t("drawerHeader")}
              </span>

              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t("saving")}
                </span>
              )}

              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {t("saved")}
                </span>
              )}

              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {t("saveError")}
                </span>
              )}
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {t("videoTitle")}
            </label>
            <input
              type="text"
              value={selectedVideo.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t("scheduledDateLabel")}
              </label>
              <input
                type="date"
                value={selectedVideo.scheduledDate || ""}
                onChange={(e) =>
                  handleFieldChange("scheduledDate", e.target.value)
                }
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 scheme-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t("prodStage")}
              </label>
              <select
                value={selectedVideo.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.titleKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t("categoryTag")}
              </label>
              <input
                type="text"
                value={selectedVideo.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* HOOK ALANI + KOPYALA BUTONU */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> {t("hookLabel")}
              </label>
              <button
                type="button"
                onClick={() => handleCopy(selectedVideo.hookText, "hook")}
                disabled={!selectedVideo.hookText}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {copiedField === "hook" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={2}
              value={selectedVideo.hookText}
              onChange={(e) => handleFieldChange("hookText", e.target.value)}
              placeholder={t("hookPlaceholder")}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* SCRIPT / PROMPT ALANI + KOPYALA BUTONU */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-400">
                {t("scriptLabel")}
              </label>
              <button
                type="button"
                onClick={() => handleCopy(selectedVideo.scriptNotes, "script")}
                disabled={!selectedVideo.scriptNotes}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {copiedField === "script" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={6}
              value={selectedVideo.scriptNotes}
              onChange={(e) => handleFieldChange("scriptNotes", e.target.value)}
              placeholder={t("scriptPlaceholder")}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              {t("platformViews")}
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0F1115] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-red-400 block mb-1">
                  YouTube Shorts
                </span>
                <input
                  type="number"
                  value={selectedVideo.platforms.youtube.views}
                  onChange={(e) =>
                    handlePlatformViewsChange("youtube", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>

              <div className="bg-[#0F1115] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-pink-400 block mb-1">
                  Instagram Reels
                </span>
                <input
                  type="number"
                  value={selectedVideo.platforms.instagram.views}
                  onChange={(e) =>
                    handlePlatformViewsChange("instagram", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>

              <div className="bg-[#0F1115] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                  TikTok
                </span>
                <input
                  type="number"
                  value={selectedVideo.platforms.tiktok.views}
                  onChange={(e) =>
                    handlePlatformViewsChange("tiktok", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> {t("deleteVideo")}
          </button>

          <button
            onClick={handleClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            {t("done")}
          </button>
        </div>
        {/* HOOK ALANI + ÇOKLU DİL DESTEKLİ KOPYALA BUTONU */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> {t("hookLabel")}
            </label>
            <button
              type="button"
              onClick={() => handleCopy(selectedVideo.hookText, "hook")}
              disabled={!selectedVideo.hookText}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {copiedField === "hook" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t("copy")}</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={2}
            value={selectedVideo.hookText}
            onChange={(e) => handleFieldChange("hookText", e.target.value)}
            placeholder={t("hookPlaceholder")}
            className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* SCRIPT / PROMPT ALANI + ÇOKLU DİL DESTEKLİ KOPYALA BUTONU */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-400">
              {t("scriptLabel")}
            </label>
            <button
              type="button"
              onClick={() => handleCopy(selectedVideo.scriptNotes, "script")}
              disabled={!selectedVideo.scriptNotes}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {copiedField === "script" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t("copy")}</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={6}
            value={selectedVideo.scriptNotes}
            onChange={(e) => handleFieldChange("scriptNotes", e.target.value)}
            placeholder={t("scriptPlaceholder")}
            className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

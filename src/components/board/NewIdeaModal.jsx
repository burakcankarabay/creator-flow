import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

// Yerel saat dilimine göre YYYY-MM-DD üretir
function getLocalDateString(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function NewIdeaModal() {
  const {
    state,
    dispatch,
    isNewModalOpen,
    setIsNewModalOpen,
    prefilledHook,
    t,
  } = useCreator();

  const [title, setTitle] = useState("");
  const [hookText, setHookText] = useState("");
  const [category, setCategory] = useState("Mystery & History");
  const [channelId, setChannelId] = useState(state.channels[0]?.id || "");
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    if (isNewModalOpen) {
      setHookText(prefilledHook || "");
      if (state.activeChannelId !== "all") {
        setChannelId(state.activeChannelId);
      } else if (state.channels.length > 0) {
        setChannelId(state.channels[0].id);
      }
    }
  }, [isNewModalOpen, prefilledHook, state.activeChannelId, state.channels]);

  if (!isNewModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: "ADD_VIDEO",
      payload: {
        channelId: channelId || state.channels[0]?.id,
        title: title.trim(),
        category: category.trim() || "General",
        hookText: hookText.trim(),
        scriptNotes: "",
        status: "idea",
        scheduledDate: scheduledDate || "",
        platforms: {
          youtube: { published: false, views: 0 },
          instagram: { published: false, views: 0 },
          tiktok: { published: false, views: 0 },
        },
      },
    });

    setTitle("");
    setHookText("");
    setScheduledDate("");
    setIsNewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-[#161920] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">{t("modalHeader")}</h3>
          <button
            onClick={() => setIsNewModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t("videoTitle")} *
            </label>
            <input
              type="text"
              required
              placeholder="Dyatlov Pass Incident..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {t("channel")}
              </label>
              <select
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {state.channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {t("category")}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Opsiyonel Planlanan Yayın Tarihi Seçici */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {t("scheduledDateLabel")}
              </label>

              {/* Hızlı Tarih Kısayolları */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setScheduledDate(getLocalDateString(0))}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setScheduledDate(getLocalDateString(1))}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  +1d
                </button>
                {scheduledDate && (
                  <button
                    type="button"
                    onClick={() => setScheduledDate("")}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 scheme-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-400 mb-1">
              {t("hookLabel")}
            </label>
            <textarea
              rows={3}
              placeholder={t("hookPlaceholder")}
              value={hookText}
              onChange={(e) => setHookText(e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl cursor-pointer"
            >
              {t("addToPool")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

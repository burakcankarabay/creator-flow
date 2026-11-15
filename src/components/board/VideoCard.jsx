import React from "react";
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import { useCreator, COLUMNS } from "../../context/CreatorContext";

export default function VideoCard({ video }) {
  const { state, dispatch, setSelectedVideoId, t, language } = useCreator();

  const channel = state.channels.find((c) => c.id === video.channelId);
  const currentColIndex = COLUMNS.findIndex((c) => c.id === video.status);

  const localeMap = {
    tr: "tr-TR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };
  const activeLocale = localeMap[language] || "tr-TR";

  // YYYY-MM-DD tarihini yerel saat dilimi kayması olmadan okunabilir formata çevirir
  const getScheduleBadgeInfo = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;

    const targetDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = targetDate.getTime() === today.getTime();
    const isPast = targetDate.getTime() < today.getTime();

    const formatted = targetDate.toLocaleDateString(activeLocale, {
      day: "numeric",
      month: "short",
    });

    // Yayında değilse ve tarihi geçmişse kırmızı, bugünse sarı, gelecekteyse indigo rozet
    let styleClass = "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
    if (video.status === "published") {
      styleClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else if (isPast) {
      styleClass = "bg-red-500/15 text-red-400 border-red-500/30";
    } else if (isToday) {
      styleClass = "bg-amber-500/15 text-amber-300 border-amber-500/30";
    }

    return { formatted, styleClass };
  };

  const scheduleInfo = getScheduleBadgeInfo(video.scheduledDate);

  const handlePlatformToggle = (e, platformKey) => {
    e.stopPropagation();
    dispatch({
      type: "TOGGLE_PLATFORM",
      payload: { videoId: video.id, platform: platformKey },
    });
  };

  const handleStepMove = (e, direction) => {
    e.stopPropagation();
    const targetIndex = currentColIndex + direction;
    if (targetIndex >= 0 && targetIndex < COLUMNS.length) {
      dispatch({
        type: "MOVE_STATUS",
        payload: { id: video.id, status: COLUMNS[targetIndex].id },
      });
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", video.id);
  };

  const totalViews =
    (video.platforms.youtube?.views || 0) +
    (video.platforms.instagram?.views || 0) +
    (video.platforms.tiktok?.views || 0);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedVideoId(video.id)}
      className="group bg-[#1E222B] hover:bg-[#252A35] border border-slate-800/90 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {channel && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white"
              style={{ backgroundColor: channel.color }}
            >
              {channel.name}
            </span>
          )}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
            #{video.category}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {currentColIndex > 0 && (
            <button
              onClick={(e) => handleStepMove(e, -1)}
              title={t("prevStage")}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {currentColIndex < COLUMNS.length - 1 && (
            <button
              onClick={(e) => handleStepMove(e, 1)}
              title={t("nextStage")}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
        {video.title}
      </h3>

      {video.hookText && (
        <p className="text-xs italic text-slate-400 line-clamp-2 mb-3 bg-[#161920]/70 p-2 rounded-lg border border-slate-800/60">
          "{video.hookText}"
        </p>
      )}

      {/* Planlanan Yayın Tarihi Rozeti */}
      {scheduleInfo && (
        <div className="mb-3 flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${scheduleInfo.styleClass}`}
          >
            <Calendar className="w-3 h-3" />
            {scheduleInfo.formatted}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => handlePlatformToggle(e, "youtube")}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
              video.platforms.youtube?.published
                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                : "bg-slate-800/70 text-slate-500 hover:text-slate-300"
            }`}
          >
            YT{" "}
            {video.status === "published" &&
              `• ${video.platforms.youtube.views}`}
          </button>

          <button
            onClick={(e) => handlePlatformToggle(e, "instagram")}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
              video.platforms.instagram?.published
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                : "bg-slate-800/70 text-slate-500 hover:text-slate-300"
            }`}
          >
            IG{" "}
            {video.status === "published" &&
              `• ${video.platforms.instagram.views}`}
          </button>

          <button
            onClick={(e) => handlePlatformToggle(e, "tiktok")}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
              video.platforms.tiktok?.published
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "bg-slate-800/70 text-slate-500 hover:text-slate-300"
            }`}
          >
            TT{" "}
            {video.status === "published" &&
              `• ${video.platforms.tiktok.views}`}
          </button>
        </div>

        {totalViews > 0 && (
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {totalViews.toLocaleString(activeLocale)}
          </span>
        )}
      </div>
    </div>
  );
}

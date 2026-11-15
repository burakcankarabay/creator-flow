import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  X,
} from "lucide-react";
import { useCreator, COLUMNS } from "../../context/CreatorContext";

import { useState } from "react";

// Yerel saat dilimine göre YYYY-MM-DD üretir
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Verilen tarihin bulunduğu haftanın Pazartesi gününü bulur
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function CalendarView() {
  const { state, dispatch, setSelectedVideoId, t, language } = useCreator();
  const [currentMonday, setCurrentMonday] = useState(() =>
    getMonday(new Date()),
  );

  const localeMap = {
    tr: "tr-TR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };
  const activeLocale = localeMap[language] || "tr-TR";

  // Haftanın 7 gününü oluştur (Pazartesi -> Pazar)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(currentMonday);
    dayDate.setDate(currentMonday.getDate() + i);
    const dateKey = formatDateKey(dayDate);
    const isToday = dateKey === formatDateKey(new Date());

    return {
      date: dayDate,
      dateKey,
      isToday,
      dayName: dayDate.toLocaleDateString(activeLocale, { weekday: "short" }),
      dayNumber: dayDate.getDate(),
      monthName: dayDate.toLocaleDateString(activeLocale, { month: "short" }),
    };
  });

  // Seçili kanala göre videoları filtrele
  const filteredVideos = state.videos.filter(
    (v) =>
      state.activeChannelId === "all" || v.channelId === state.activeChannelId,
  );

  // Tarihi henüz atanmamış videolar
  const unscheduledVideos = filteredVideos.filter((v) => !v.scheduledDate);

  const handlePrevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleToday = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  const handleDragStart = (e, videoId) => {
    e.dataTransfer.setData("text/plain", videoId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDay = (e, targetDateKey) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData("text/plain");
    if (videoId) {
      dispatch({
        type: "UPDATE_VIDEO",
        payload: { id: videoId, scheduledDate: targetDateKey },
      });
    }
  };

  const handleClearDate = (e, videoId) => {
    e.stopPropagation();
    dispatch({
      type: "UPDATE_VIDEO",
      payload: { id: videoId, scheduledDate: "" },
    });
  };

  const weekRangeLabel = `${weekDays[0].dayNumber} ${weekDays[0].monthName} - ${weekDays[6].dayNumber} ${weekDays[6].monthName} ${weekDays[6].date.getFullYear()}`;

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
      {/* Sol Panel: Tarihi Planlanmamış Videolar Havuzu */}
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnDay(e, "")}
        className="w-full xl:w-72 bg-[#161920] border border-slate-800/80 rounded-2xl p-4 flex flex-col shrink-0"
      >
        <div className="mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {t("unscheduledPool")}
            </h3>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
              {unscheduledVideos.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t("unscheduledHint")}
          </p>
        </div>

        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 max-h-[540px]">
          {unscheduledVideos.map((video) => {
            const channel = state.channels.find(
              (c) => c.id === video.channelId,
            );
            const col = COLUMNS.find((c) => c.id === video.status);

            return (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => handleDragStart(e, video.id)}
                onClick={() => setSelectedVideoId(video.id)}
                className="bg-[#1E222B] hover:bg-[#252A35] border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  {channel && (
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white truncate"
                      style={{ backgroundColor: channel.color }}
                    >
                      {channel.name}
                    </span>
                  )}
                  {col && (
                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {t(col.titleKey)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-100 line-clamp-2">
                  {video.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sağ Panel: 7 Günlük Haftalık Yayın Takvimi */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Takvim Üst Navigasyon Barı */}
        <div className="flex items-center justify-between bg-[#161920] border border-slate-800/80 rounded-2xl px-5 py-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white capitalize">
              {weekRangeLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              {t("todayBtn")}
            </button>
            <div className="flex items-center bg-[#0F1115] border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 7 Sütunlu Gün Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 flex-1">
          {weekDays.map((day) => {
            const dayVideos = filteredVideos.filter(
              (v) => v.scheduledDate === day.dateKey,
            );

            return (
              <div
                key={day.dateKey}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnDay(e, day.dateKey)}
                className={`bg-[#161920] rounded-2xl p-3 flex flex-col min-h-[420px] border transition-colors ${
                  day.isToday
                    ? "border-indigo-500/70 shadow-lg shadow-indigo-500/5"
                    : "border-slate-800/80"
                }`}
              >
                {/* Gün Başlığı */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                      {day.dayName}
                    </span>
                    <span
                      className={`text-base font-bold ${
                        day.isToday ? "text-indigo-400" : "text-white"
                      }`}
                    >
                      {day.dayNumber} {day.monthName}
                    </span>
                  </div>
                  {dayVideos.length > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      {dayVideos.length}
                    </span>
                  )}
                </div>

                {/* O Güne Planlanan Videolar */}
                <div className="space-y-2.5 flex-1">
                  {dayVideos.map((video) => {
                    const channel = state.channels.find(
                      (c) => c.id === video.channelId,
                    );

                    return (
                      <div
                        key={video.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, video.id)}
                        onClick={() => setSelectedVideoId(video.id)}
                        className="group relative bg-[#1E222B] hover:bg-[#252A35] border border-slate-800 hover:border-indigo-500/50 rounded-xl p-2.5 cursor-pointer transition-all"
                      >
                        <button
                          onClick={(e) => handleClearDate(e, video.id)}
                          title={t("clearDate")}
                          className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-1 rounded bg-slate-800/90 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {channel && (
                          <span
                            className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded text-white mb-1.5"
                            style={{ backgroundColor: channel.color }}
                          >
                            {channel.name}
                          </span>
                        )}

                        <h4 className="text-xs font-semibold text-slate-100 leading-snug mb-2 pr-4">
                          {video.title}
                        </h4>

                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              video.platforms.youtube?.published
                                ? "bg-red-500/20 text-red-400"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            YT
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              video.platforms.instagram?.published
                                ? "bg-pink-500/20 text-pink-400"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            IG
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              video.platforms.tiktok?.published
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            TT
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {dayVideos.length === 0 && (
                    <div className="h-24 border border-dashed border-slate-800/70 rounded-xl flex items-center justify-center text-[11px] text-slate-600 text-center px-2">
                      {t("noVideoDay")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

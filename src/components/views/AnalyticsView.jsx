import React from "react";
import {
  CheckCircle2,
  TrendingUp,
  Trophy,
  Layers,
  Download,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

const ANALYTICS_EXTRA_TEXTS = {
  tr: {
    publishedVideos: "Yayınlanan Video",
    completionRate: "tamamlanma oranı",
    avgViews: "Video Başına Ort. İzlenme",
    acrossPlatforms: "tüm platformlar dahil",
    topChannel: "En Başarılı Kanal",
    totalChannelViews: "toplam kanal izlenmesi",
    totalAllPlatforms: "Tüm Platformlar Toplamı",
    shareOfTotal: "toplam izlenme payı",
    channelCol: "Kanal",
    totalCol: "Toplam İzlenme",
    exportCsvBtn: "CSV Olarak İndir (Excel)",
  },
  en: {
    publishedVideos: "Published Videos",
    completionRate: "completion rate",
    avgViews: "Avg. Views per Video",
    acrossPlatforms: "across all platforms",
    topChannel: "Top Performing Channel",
    totalChannelViews: "total channel views",
    totalAllPlatforms: "All Platforms Combined",
    shareOfTotal: "share of total views",
    channelCol: "Channel",
    totalCol: "Total Views",
    exportCsvBtn: "Export CSV (Excel)",
  },
  es: {
    publishedVideos: "Videos Publicados",
    completionRate: "tasa de finalización",
    avgViews: "Promedio por Video",
    acrossPlatforms: "en todas las plataformas",
    topChannel: "Canal Más Exitoso",
    totalChannelViews: "vistas totales del canal",
    totalAllPlatforms: "Total Multiplataforma",
    shareOfTotal: "del total de vistas",
    channelCol: "Canal",
    totalCol: "Vistas Totales",
    exportCsvBtn: "Exportar CSV (Excel)",
  },
  fr: {
    publishedVideos: "Vidéos Publiées",
    completionRate: "taux de complétion",
    avgViews: "Moy. de Vues par Vidéo",
    acrossPlatforms: "toutes plateformes confondues",
    topChannel: "Meilleure Chaîne",
    totalChannelViews: "vues totales de la chaîne",
    totalAllPlatforms: "Total Toutes Plateformes",
    shareOfTotal: "part des vues totales",
    channelCol: "Chaîne",
    totalCol: "Total des Vues",
    exportCsvBtn: "Exporter CSV (Excel)",
  },
  de: {
    publishedVideos: "Veröffentlichte Videos",
    completionRate: "Abschlussrate",
    avgViews: "Ø Aufrufe pro Video",
    acrossPlatforms: "über alle Plattformen",
    topChannel: "Erfolgreichster Kanal",
    totalChannelViews: "Gesamtaufrufe des Kanals",
    totalAllPlatforms: "Alle Plattformen Gesamt",
    shareOfTotal: "Anteil an Gesamtaufrufen",
    channelCol: "Kanal",
    totalCol: "Gesamtaufrufe",
    exportCsvBtn: "CSV exportieren (Excel)",
  },
};

export default function AnalyticsView() {
  const { state, t, language } = useCreator();
  const ui = ANALYTICS_EXTRA_TEXTS[language] || ANALYTICS_EXTRA_TEXTS.en;

  const localeMap = {
    tr: "tr-TR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };
  const activeLocale = localeMap[language] || "tr-TR";

  // Seçili kanala göre videoları filtrele
  const filteredVideos = state.videos.filter(
    (v) =>
      state.activeChannelId === "all" || v.channelId === state.activeChannelId,
  );

  // Platform bazlı toplam izlenmeler
  const totals = filteredVideos.reduce(
    (acc, v) => {
      acc.youtube += v.platforms.youtube?.views || 0;
      acc.instagram += v.platforms.instagram?.views || 0;
      acc.tiktok += v.platforms.tiktok?.views || 0;
      return acc;
    },
    { youtube: 0, instagram: 0, tiktok: 0 },
  );

  const grandTotalViews = totals.youtube + totals.instagram + totals.tiktok;

  // 1. Metrik: Yayınlanan Video Sayısı ve Tamamlanma Oranı
  const publishedCount = filteredVideos.filter(
    (v) => v.status === "published",
  ).length;
  const totalVideoCount = filteredVideos.length;
  const completionRate =
    totalVideoCount > 0
      ? Math.round((publishedCount / totalVideoCount) * 100)
      : 0;

  // 2. Metrik: Video Başına Ortalama İzlenme
  const divisor = publishedCount > 0 ? publishedCount : totalVideoCount;
  const avgViewsPerVideo =
    divisor > 0 ? Math.round(grandTotalViews / divisor) : 0;

  // 3. Metrik: En Başarılı Kanalı Hesapla
  const channelPerformance = state.channels.map((ch) => {
    const chVideos = state.videos.filter((v) => v.channelId === ch.id);
    const chViews = chVideos.reduce(
      (sum, v) =>
        sum +
        (v.platforms.youtube?.views || 0) +
        (v.platforms.instagram?.views || 0) +
        (v.platforms.tiktok?.views || 0),
      0,
    );
    return { ...ch, totalViews: chViews, videoCount: chVideos.length };
  });

  const bestChannel =
    channelPerformance.length > 0
      ? channelPerformance.reduce((prev, current) =>
          current.totalViews > prev.totalViews ? current : prev,
        )
      : null;

  // Platform payı yüzdeleri
  const ytShare =
    grandTotalViews > 0
      ? Math.round((totals.youtube / grandTotalViews) * 100)
      : 0;
  const igShare =
    grandTotalViews > 0
      ? Math.round((totals.instagram / grandTotalViews) * 100)
      : 0;
  const ttShare =
    grandTotalViews > 0
      ? Math.round((totals.tiktok / grandTotalViews) * 100)
      : 0;

  // CSV / Excel Dışa Aktarma Fonksiyonu
  const handleExportCSV = () => {
    if (filteredVideos.length === 0) return;

    const headers = [
      t("videoTitle"),
      ui.channelCol,
      t("category"),
      t("prodStage"),
      t("scheduledDateLabel"),
      "YouTube Shorts",
      "Instagram Reels",
      "TikTok",
      ui.totalCol,
      t("bestPlatform"),
    ];

    const rows = filteredVideos.map((v) => {
      const channel = state.channels.find((c) => c.id === v.channelId);
      const yt = v.platforms.youtube?.views || 0;
      const ig = v.platforms.instagram?.views || 0;
      const tt = v.platforms.tiktok?.views || 0;
      const rowTotal = yt + ig + tt;
      const max = Math.max(yt, ig, tt);
      const best =
        max === 0
          ? t("noData")
          : max === ig
            ? "Instagram Reels"
            : max === yt
              ? "YouTube Shorts"
              : "TikTok";

      // CSV hücrelerinde virgül veya çift tırnak varsa güvenli hale getir
      const escapeCell = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

      return [
        escapeCell(v.title),
        escapeCell(channel ? channel.name : "-"),
        escapeCell(v.category),
        escapeCell(v.status),
        escapeCell(v.scheduledDate || "-"),
        yt,
        ig,
        tt,
        rowTotal,
        escapeCell(best),
      ].join(",");
    });

    // UTF-8 BOM (\uFEFF) sayesinde Excel Türkçe ve özel karakterleri bozmadan açar
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const todayStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `-analytics-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Üst Satır: Genel Üretim ve Kanal Başarı Özeti (4 Kart) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#161920] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400">
              {ui.totalAllPlatforms}
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">
              {grandTotalViews.toLocaleString(activeLocale)}
            </p>
            <span className="text-[11px] text-slate-400">
              YouTube + Reels + TikTok {t("viewsUnit")}
            </span>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">
              {ui.publishedVideos}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">
              {publishedCount}{" "}
              <span className="text-sm font-semibold text-slate-500">
                / {totalVideoCount}
              </span>
            </p>
            <span className="text-[11px] text-slate-400">
              %{completionRate} {ui.completionRate}
            </span>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">
              {ui.avgViews}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">
              {avgViewsPerVideo.toLocaleString(activeLocale)}
            </p>
            <span className="text-[11px] text-slate-400">
              {ui.acrossPlatforms}
            </span>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400">
              {ui.topChannel}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            {bestChannel && bestChannel.totalViews > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: bestChannel.color }}
                  />
                  <p className="text-lg font-extrabold text-white truncate">
                    {bestChannel.name}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {bestChannel.totalViews.toLocaleString(activeLocale)}{" "}
                  {ui.totalChannelViews}
                </span>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-slate-500">
                  {t("noData")}
                </p>
                <span className="text-[11px] text-slate-500">—</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orta Satır: Platform Bazlı Dağılım ve Yüzde Çubukları (3 Kart) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-red-400">
              {t("ytTotal")}
            </span>
            <span className="text-xs font-bold text-slate-400">%{ytShare}</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {totals.youtube.toLocaleString(activeLocale)}{" "}
            <span className="text-xs font-normal text-slate-400">
              {t("viewsUnit")}
            </span>
          </p>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${ytShare}%` }}
            />
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-pink-400">
              {t("igTotal")}
            </span>
            <span className="text-xs font-bold text-slate-400">%{igShare}</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {totals.instagram.toLocaleString(activeLocale)}{" "}
            <span className="text-xs font-normal text-slate-400">
              {t("viewsUnit")}
            </span>
          </p>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-pink-500 rounded-full"
              style={{ width: `${igShare}%` }}
            />
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-cyan-400">
              {t("ttTotal")}
            </span>
            <span className="text-xs font-bold text-slate-400">%{ttShare}</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {totals.tiktok.toLocaleString(activeLocale)}{" "}
            <span className="text-xs font-normal text-slate-400">
              {t("viewsUnit")}
            </span>
          </p>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${ttShare}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alt Satır: Çapraz Platform Performans Kıyaslama Tablosu */}
      <div className="bg-[#161920] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white">
            {t("crossPlatformTitle")}
          </h3>
          <button
            onClick={handleExportCSV}
            disabled={filteredVideos.length === 0}
            className="flex items-center gap-1.5 bg-[#0F1115] hover:bg-indigo-600/20 disabled:opacity-40 text-indigo-400 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {ui.exportCsvBtn}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                <th className="p-4">{t("videoTitle")}</th>
                <th className="p-4">{ui.channelCol}</th>
                <th className="p-4">YouTube Shorts</th>
                <th className="p-4">Instagram Reels</th>
                <th className="p-4">TikTok</th>
                <th className="p-4">{ui.totalCol}</th>
                <th className="p-4">{t("bestPlatform")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredVideos.map((v) => {
                const channel = state.channels.find(
                  (c) => c.id === v.channelId,
                );
                const yt = v.platforms.youtube?.views || 0;
                const ig = v.platforms.instagram?.views || 0;
                const tt = v.platforms.tiktok?.views || 0;
                const rowTotal = yt + ig + tt;
                const max = Math.max(yt, ig, tt);
                const best =
                  max === 0
                    ? t("noData")
                    : max === ig
                      ? "Instagram Reels"
                      : max === yt
                        ? "YouTube Shorts"
                        : "TikTok";

                return (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 font-semibold text-white">{v.title}</td>
                    <td className="p-4">
                      {channel && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: channel.color }}
                        >
                          {channel.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300">
                      {yt.toLocaleString(activeLocale)}
                    </td>
                    <td className="p-4 text-slate-300">
                      {ig.toLocaleString(activeLocale)}
                    </td>
                    <td className="p-4 text-slate-300">
                      {tt.toLocaleString(activeLocale)}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {rowTotal.toLocaleString(activeLocale)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {best}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  BarChart3,
  Sparkles,
  Plus,
  Video,
  Crown,
  Globe,
  Trash2,
  Lock,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

export default function Sidebar() {
  const {
    state,
    dispatch,
    language,
    setLanguage,
    t,
    LANGUAGES,
    user,
    setIsPricingModalOpen,
  } = useCreator();

  const location = useLocation();
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const isPro = user?.plan === "pro";
  const freeChannelLimit = 2;
  const freeVideoLimit = 15;
  const isChannelLimitReached =
    !isPro && state.channels.length >= freeChannelLimit;

  // "+ Ekle" butonuna tıklandığında kanal sınırını kontrol et
  const handleAddChannelClick = () => {
    if (isChannelLimitReached) {
      setIsPricingModalOpen(true);
      return;
    }
    setIsAddingChannel(!isAddingChannel);
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    if (isChannelLimitReached) {
      setIsAddingChannel(false);
      setIsPricingModalOpen(true);
      return;
    }

    const colors = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    dispatch({
      type: "ADD_CHANNEL",
      payload: {
        name: newChannelName.trim(),
        niche: "Shorts Channel",
        color: randomColor,
      },
    });
    setNewChannelName("");
    setIsAddingChannel(false);
  };

  const handleDeleteChannel = (e, channelId, channelName) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `${channelName}: ${t("confirmDeleteChannel")}`,
    );
    if (confirmed) {
      dispatch({ type: "DELETE_CHANNEL", payload: channelId });
    }
  };

  const navItems = [
    { path: "/board", label: t("navBoard"), icon: LayoutGrid },
    { path: "/calendar", label: t("navCalendar"), icon: Calendar },
    { path: "/analytics", label: t("navAnalytics"), icon: BarChart3 },
    { path: "/hooks", label: t("navHooks"), icon: Sparkles },
  ];

  const usagePercent = isPro
    ? 100
    : Math.min(100, Math.round((state.videos.length / freeVideoLimit) * 100));

  return (
    <aside className="w-64 bg-[#161920] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              CreatorFlow
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${
                  isPro
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30"
                }`}
              >
                {isPro ? "PRO" : "FREE"}
              </button>
            </h1>
            <p className="text-xs text-slate-400">{t("subtitle")}</p>
          </div>
        </div>

        <nav className="space-y-1 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={`${item.path}${location.search}`}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("myChannels")}{" "}
              <span className="text-slate-500 font-normal">
                ({state.channels.length}/{isPro ? "∞" : freeChannelLimit})
              </span>
            </span>
            <button
              onClick={handleAddChannelClick}
              className={`text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isChannelLimitReached
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-indigo-400 hover:text-indigo-300"
              }`}
            >
              {isChannelLimitReached ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {t("add")}
            </button>
          </div>

          {isAddingChannel && (
            <form onSubmit={handleCreateChannel} className="mb-3 px-1">
              <input
                type="text"
                placeholder={t("channelPlaceholder")}
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </form>
          )}

          <div className="space-y-1">
            <button
              onClick={() => dispatch({ type: "SET_CHANNEL", payload: "all" })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                state.activeChannelId === "all"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <span>{t("allChannels")}</span>
              <span className="text-[11px] bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300">
                {state.videos.length}
              </span>
            </button>

            {state.channels.map((ch) => {
              const count = state.videos.filter(
                (v) => v.channelId === ch.id,
              ).length;
              const isSelected = state.activeChannelId === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() =>
                    dispatch({ type: "SET_CHANNEL", payload: ch.id })
                  }
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="truncate">{ch.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChannel(e, ch.id, ch.name)}
                      title={t("deleteChannelTitle")}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 border-t border-slate-800/60">
        <div
          onClick={() => setIsPricingModalOpen(true)}
          className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/60 hover:border-indigo-500/60 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />{" "}
              {t("activeQuota")}
            </span>
            <span className="text-xs font-bold text-white">
              {state.videos.length} / {isPro ? "∞" : freeVideoLimit}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-2.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPro ? "bg-emerald-500" : "bg-indigo-500"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t("upgradeProText")}
          </p>
        </div>

        <div className="flex items-center justify-between bg-[#0F1115] border border-slate-800/90 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t("languageLabel")}</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-[#161920] text-white"
              >
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

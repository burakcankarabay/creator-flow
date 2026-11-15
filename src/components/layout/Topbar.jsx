import { useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  LogOut,
  User as UserIcon,
  X,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

export default function Topbar() {
  const {
    state,
    dispatch,
    searchQuery,
    setSearchQuery,
    openNewIdeaWithHook,
    t,
    user,
    logoutUser,
    language,
    setIsProfileModalOpen,
  } = useCreator();

  const searchInputRef = useRef(null);

  // Ctrl + K veya Cmd + K ile arama kutusuna odaklan
  useEffect(() => {
    const handleSearchShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  const logoutLabels = {
    tr: "Çıkış Yap",
    en: "Sign Out",
    es: "Cerrar Sesión",
    fr: "Déconnexion",
    de: "Abmelden",
  };

  return (
    <header className="h-16 bg-[#161920]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#0F1115] border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={state.activeChannelId}
            onChange={(e) =>
              dispatch({ type: "SET_CHANNEL", payload: e.target.value })
            }
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#161920]">
              {t("allChannels")}
            </option>
            {state.channels.map((ch) => (
              <option key={ch.id} value={ch.id} className="bg-[#161920]">
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Arama Kutusu + Ctrl K Kısayol Rozeti */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-9 pr-16 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/70 rounded-md">
              Ctrl K
            </kbd>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => openNewIdeaWithHook("")}
          title="Kısayol: Alt + N"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newIdeaBtn")}</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-indigo-700/80 text-indigo-200 rounded border border-indigo-400/30">
            Alt N
          </kbd>
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-[#0F1115] hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl px-3 py-2 transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-slate-200">
                {user.name}
              </span>
            </button>

            <button
              onClick={logoutUser}
              title={logoutLabels[language] || "Sign Out"}
              className="p-2 rounded-xl bg-[#0F1115] hover:bg-red-500/15 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

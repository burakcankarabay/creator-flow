import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  TRANSLATIONS,
  LANGUAGES,
  HOOK_TEMPLATES_BY_LANG,
} from "./translations";

const CreatorContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const COLUMNS = [
  {
    id: "idea",
    titleKey: "colIdea",
    title: "Fikir Havuzu",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    id: "scripting",
    titleKey: "colScripting",
    title: "Senaryo & Görsel",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    id: "editing",
    titleKey: "colEditing",
    title: "Kurgu & Ses",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "published",
    titleKey: "colPublished",
    title: "Yayında",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];

const INITIAL_DATA = {
  channels: [],
  videos: [],
  customHooks: [],
  isLoading: true,
  error: null,
};

function creatorReducer(state, action) {
  switch (action.type) {
    case "INIT_DATA":
      return {
        ...state,
        channels: action.payload.channels,
        videos: action.payload.videos,
        customHooks: action.payload.customHooks || [],
        isLoading: false,
        error: null,
      };
    case "RESET_DATA":
      return { ...INITIAL_DATA, isLoading: false };
    case "SET_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_CHANNEL":
      return {
        ...state,
        channels: [...state.channels, action.payload],
      };
    case "DELETE_CHANNEL":
      return {
        ...state,
        channels: state.channels.filter((c) => c.id !== action.payload),
        videos: state.videos.filter((v) => v.channelId !== action.payload),
      };
    case "ADD_VIDEO":
      return { ...state, videos: [action.payload, ...state.videos] };
    case "UPDATE_VIDEO_LOCAL":
    case "UPDATE_VIDEO":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.id ? { ...v, ...action.payload } : v,
        ),
      };
    case "DELETE_VIDEO":
      return {
        ...state,
        videos: state.videos.filter((v) => v.id !== action.payload),
      };
    case "MOVE_STATUS":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.id
            ? { ...v, status: action.payload.status }
            : v,
        ),
      };
    case "TOGGLE_PLATFORM": {
      const { videoId, platform } = action.payload;
      return {
        ...state,
        videos: state.videos.map((v) => {
          if (v.id !== videoId) return v;
          const current = v.platforms[platform];
          return {
            ...v,
            platforms: {
              ...v.platforms,
              [platform]: { ...current, published: !current.published },
            },
          };
        }),
      };
    }
    case "ADD_CUSTOM_HOOK":
      return {
        ...state,
        customHooks: [action.payload, ...state.customHooks],
      };
    case "DELETE_CUSTOM_HOOK":
      return {
        ...state,
        customHooks: state.customHooks.filter((h) => h.id !== action.payload),
      };
    default:
      return state;
  }
}

export function CreatorProvider({ children }) {
  const [baseState, rawDispatch] = useReducer(creatorReducer, INITIAL_DATA);

  // Auth State (Token & User)
  const [token, setToken] = useState(
    () => localStorage.getItem("creator_flow_token") || null,
  );
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("creator_flow_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [saveStatus, setSaveStatus] = useState("idle");
  const statusTimeoutRef = useRef(null);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("creator_flow_lang") || "tr";
  });

  useEffect(() => {
    localStorage.setItem("creator_flow_lang", language);
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.tr[key] || key;
  };

  const defaultHooks =
    HOOK_TEMPLATES_BY_LANG[language] || HOOK_TEMPLATES_BY_LANG.tr;
  const hookTemplates = [...baseState.customHooks, ...defaultHooks];

  // URL Query Parametreleri (?channel=... & ?video=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChannelId = searchParams.get("channel") || "all";
  const selectedVideoId = searchParams.get("video") || null;

  const setActiveChannel = (channelId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!channelId || channelId === "all") {
        next.delete("channel");
      } else {
        next.set("channel", channelId);
      }
      return next;
    });
  };

  const setSelectedVideoId = (videoId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!videoId) {
        next.delete("video");
      } else {
        next.set("video", videoId);
      }
      return next;
    });
  };

  // Ortak Authorization Header üretici
  const getAuthHeaders = (customToken = token) => ({
    "Content-Type": "application/json",
    ...(customToken ? { Authorization: `Bearer ${customToken}` } : {}),
  });

  // Giriş Fonksiyonu
  const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Giriş yapılamadı");

    localStorage.setItem("creator_flow_token", data.token);
    localStorage.setItem("creator_flow_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  // Kayıt Fonksiyonu
  const registerUser = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Kayıt oluşturulamadı");

    localStorage.setItem("creator_flow_token", data.token);
    localStorage.setItem("creator_flow_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  // Çıkış Fonksiyonu
  const logoutUser = () => {
    localStorage.removeItem("creator_flow_token");
    localStorage.removeItem("creator_flow_user");
    setToken(null);
    setUser(null);
    setSearchParams({});
    rawDispatch({ type: "RESET_DATA" });
  };

  // Plan Yükseltme / Değiştirme Fonksiyonu
  const upgradeUserPlan = async (plan = "pro") => {
    const res = await fetch(`${API_BASE}/auth/plan`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Plan güncellenemedi");

    localStorage.setItem("creator_flow_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // Profil ve Şifre Güncelleme Fonksiyonu
  const updateUserProfile = async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Profil güncellenemedi");

    localStorage.setItem("creator_flow_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Token değiştiğinde kullanıcının kendi verilerini çek
  useEffect(() => {
    if (!token) {
      rawDispatch({ type: "RESET_DATA" });
      return;
    }

    const controller = new AbortController();

    async function fetchInitialData() {
      try {
        const headers = getAuthHeaders(token);
        const [channelsRes, videosRes, hooksRes] = await Promise.all([
          fetch(`${API_BASE}/channels`, { headers, signal: controller.signal }),
          fetch(`${API_BASE}/videos`, { headers, signal: controller.signal }),
          fetch(`${API_BASE}/hooks`, { headers, signal: controller.signal }),
        ]);

        if (channelsRes.status === 401 || videosRes.status === 401) {
          logoutUser();
          return;
        }

        const channels = await channelsRes.json();
        const videos = await videosRes.json();
        const customHooks = hooksRes.ok ? await hooksRes.json() : [];

        rawDispatch({
          type: "INIT_DATA",
          payload: { channels, videos, customHooks },
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("API bağlantı hatası:", err);
          rawDispatch({ type: "SET_ERROR", payload: err.message });
        }
      }
    }

    fetchInitialData();
    return () => controller.abort();
  }, [token]);

  const markSaved = () => {
    setSaveStatus("saved");
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => {
      setSaveStatus("idle");
    }, 2000);
  };

  const dispatch = async (action) => {
    try {
      const headers = getAuthHeaders();

      switch (action.type) {
        case "SET_CHANNEL": {
          setActiveChannel(action.payload);
          break;
        }

        case "ADD_CHANNEL": {
          const { name, niche, color } = action.payload;
          const res = await fetch(`${API_BASE}/channels`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name, niche, color }),
          });
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Kanal eklenemedi");
          }
          const savedChannel = await res.json();
          rawDispatch({ type: "ADD_CHANNEL", payload: savedChannel });
          setActiveChannel(savedChannel.id);
          break;
        }

        case "DELETE_CHANNEL": {
          const channelId = action.payload;
          rawDispatch({ type: "DELETE_CHANNEL", payload: channelId });
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (next.get("channel") === channelId) next.delete("channel");
            next.delete("video");
            return next;
          });
          await fetch(`${API_BASE}/channels/${channelId}`, {
            method: "DELETE",
            headers,
          });
          break;
        }

        case "ADD_VIDEO": {
          const { id, ...videoData } = action.payload;
          if (!videoData.channelId || videoData.channelId.startsWith("ch-")) {
            videoData.channelId =
              baseState.channels[0]?.id || videoData.channelId;
          }

          const res = await fetch(`${API_BASE}/videos`, {
            method: "POST",
            headers,
            body: JSON.stringify(videoData),
          });
          const savedVideo = await res.json();
          rawDispatch({ type: "ADD_VIDEO", payload: savedVideo });
          break;
        }

        case "UPDATE_VIDEO_LOCAL": {
          setSaveStatus("saving");
          rawDispatch(action);
          break;
        }

        case "UPDATE_VIDEO": {
          setSaveStatus("saving");
          rawDispatch(action);
          const { id, ...updates } = action.payload;
          const res = await fetch(`${API_BASE}/videos/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(updates),
          });
          if (!res.ok) throw new Error("Güncelleme başarısız");
          markSaved();
          break;
        }

        case "MOVE_STATUS": {
          rawDispatch(action);
          const { id, status } = action.payload;
          await fetch(`${API_BASE}/videos/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ status }),
          });
          break;
        }

        case "TOGGLE_PLATFORM": {
          rawDispatch(action);
          const { videoId, platform } = action.payload;
          await fetch(`${API_BASE}/videos/${videoId}/toggle-platform`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ platform }),
          });
          break;
        }

        case "DELETE_VIDEO": {
          const videoId = action.payload;
          rawDispatch(action);
          if (selectedVideoId === videoId) {
            setSelectedVideoId(null);
          }
          await fetch(`${API_BASE}/videos/${videoId}`, {
            method: "DELETE",
            headers,
          });
          break;
        }

        case "ADD_CUSTOM_HOOK": {
          const res = await fetch(`${API_BASE}/hooks`, {
            method: "POST",
            headers,
            body: JSON.stringify(action.payload),
          });
          const savedHook = await res.json();
          rawDispatch({ type: "ADD_CUSTOM_HOOK", payload: savedHook });
          break;
        }

        case "DELETE_CUSTOM_HOOK": {
          rawDispatch(action);
          const hookId = action.payload;
          await fetch(`${API_BASE}/hooks/${hookId}`, {
            method: "DELETE",
            headers,
          });
          break;
        }

        default:
          rawDispatch(action);
      }
    } catch (err) {
      console.error(`API İşlem Hatası (${action.type}):`, err);
      setSaveStatus("error");
    }
  };

  const state = {
    ...baseState,
    activeChannelId,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [prefilledHook, setPrefilledHook] = useState("");

  const selectedVideo =
    state.videos.find((v) => v.id === selectedVideoId) || null;

  const openNewIdeaWithHook = (hookText = "") => {
    if (user?.plan !== "pro" && state.videos.length >= 15) {
      setIsPricingModalOpen(true);
      return;
    }
    setPrefilledHook(hookText);
    setIsNewModalOpen(true);
  };

  return (
    <CreatorContext.Provider
      value={{
        state,
        dispatch,
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        upgradeUserPlan,
        updateUserProfile,
        saveStatus,
        language,
        setLanguage,
        t,
        LANGUAGES,
        hookTemplates,
        searchQuery,
        setSearchQuery,
        selectedVideo,
        setSelectedVideoId,
        isNewModalOpen,
        setIsNewModalOpen,
        isPricingModalOpen,
        setIsPricingModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        prefilledHook,
        openNewIdeaWithHook,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error("useCreator must be used within a CreatorProvider");
  }
  return context;
}

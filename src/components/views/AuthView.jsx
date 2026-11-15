import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Globe,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

const AUTH_TEXTS = {
  tr: {
    loginSubtitle: "Kısa video üretim stüdyonuza giriş yapın",
    registerSubtitle: "Yeni içerik üreticisi hesabınızı oluşturun",
    loginTab: "Giriş Yap",
    registerTab: "Kayıt Ol",
    nameLabel: "Ad Soyad veya Üretici Adı",
    namePlaceholder: "Burak Can",
    emailLabel: "E-posta Adresi",
    emailPlaceholder: "ornek@mail.com",
    passwordLabel: "Şifre",
    passwordPlaceholder: "En az 6 karakter...",
    loadingBtn: "Lütfen bekleyin...",
    loginBtn: "Stüdyoya Giriş Yap",
    registerBtn: "Hesabımı Oluştur ve Başla",
    defaultError: "İşlem başarısız oldu",
  },
  en: {
    loginSubtitle: "Sign in to your short-form production studio",
    registerSubtitle: "Create your new creator workspace account",
    loginTab: "Sign In",
    registerTab: "Sign Up",
    nameLabel: "Full Name or Creator Handle",
    namePlaceholder: "Alex Rivera",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters...",
    loadingBtn: "Please wait...",
    loginBtn: "Sign In to Studio",
    registerBtn: "Create Account & Start",
    defaultError: "Authentication failed",
  },
  es: {
    loginSubtitle: "Inicia sesión en tu estudio de producción",
    registerSubtitle: "Crea tu nueva cuenta de creador",
    loginTab: "Iniciar Sesión",
    registerTab: "Registrarse",
    nameLabel: "Nombre Completo o Alias",
    namePlaceholder: "Carlos Mendoza",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "correo@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Mínimo 6 caracteres...",
    loadingBtn: "Por favor espera...",
    loginBtn: "Entrar al Estudio",
    registerBtn: "Crear Cuenta y Empezar",
    defaultError: "Error en la operación",
  },
  fr: {
    loginSubtitle: "Connectez-vous à votre studio de production",
    registerSubtitle: "Créez votre nouveau compte créateur",
    loginTab: "Connexion",
    registerTab: "Inscription",
    nameLabel: "Nom Complet ou Pseudo",
    namePlaceholder: "Lucas Martin",
    emailLabel: "Adresse E-mail",
    emailPlaceholder: "vous@exemple.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Au moins 6 caractères...",
    loadingBtn: "Veuillez patienter...",
    loginBtn: "Accéder au Studio",
    registerBtn: "Créer mon Compte",
    defaultError: "Échec de l'opération",
  },
  de: {
    loginSubtitle: "Melden Sie sich in Ihrem Produktionsstudio an",
    registerSubtitle: "Erstellen Sie Ihr neues Creator-Konto",
    loginTab: "Anmelden",
    registerTab: "Registrieren",
    nameLabel: "Vollständiger Name oder Creator-Name",
    namePlaceholder: "Max Mustermann",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "name@beispiel.de",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Mindestens 6 Zeichen...",
    loadingBtn: "Bitte warten...",
    loginBtn: "Im Studio anmelden",
    registerBtn: "Konto erstellen & starten",
    defaultError: "Vorgang fehlgeschlagen",
  },
};

export default function AuthView() {
  const { loginUser, registerUser, language, setLanguage, LANGUAGES } =
    useCreator();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Seçili dile göre metinleri al (yoksa İngilizce/Türkçe yedekli)
  const ui = AUTH_TEXTS[language] || AUTH_TEXTS.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      navigate("/board", { replace: true });
    } catch (err) {
      setError(err.message || ui.defaultError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0F1115] text-slate-100 flex flex-col justify-between p-6 font-sans">
      {/* Üst Bar: Dil Seçici */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-[#161920] border border-slate-800 rounded-xl px-3 py-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-[#161920]"
              >
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orta Kısım: Giriş / Kayıt Kartı */}
      <div className="w-full max-w-md mx-auto bg-[#161920] border border-slate-800/90 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            CreatorFlow
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? ui.loginSubtitle : ui.registerSubtitle}
          </p>
        </div>

        {/* Sekme Geçişi */}
        <div className="grid grid-cols-2 gap-1 bg-[#0F1115] p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {ui.loginTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {ui.registerTab}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {ui.nameLabel}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={ui.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {ui.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={ui.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {ui.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder={ui.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer mt-2"
          >
            {loading ? ui.loadingBtn : isLogin ? ui.loginBtn : ui.registerBtn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-slate-500">
        CreatorFlow SaaS © 2026 • Shorts, Reels & TikTok Production Suite
      </div>
    </div>
  );
}

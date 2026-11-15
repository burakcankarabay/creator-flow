import { useState, useEffect } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Crown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

const PROFILE_TEXTS = {
  tr: {
    title: "Profil ve Güvenlik Ayarları",
    nameLabel: "Ad Soyad / Üretici Adı",
    emailLabel: "E-posta Adresi (Değiştirilemez)",
    planLabel: "Aktif Abonelik Planı",
    managePlan: "Planı Yönet",
    passwordSection: "Şifre Değiştir (Opsiyonel)",
    currentPassLabel: "Mevcut Şifre",
    newPassLabel: "Yeni Şifre (En az 6 karakter)",
    passPlaceholder: "Değiştirmek istemiyorsanız boş bırakın...",
    cancel: "İptal",
    saveBtn: "Değişiklikleri Kaydet",
    saving: "Kaydediliyor...",
    successMsg: "Profil bilgileriniz başarıyla güncellendi!",
  },
  en: {
    title: "Profile & Security Settings",
    nameLabel: "Full Name / Creator Handle",
    emailLabel: "Email Address (Read-only)",
    planLabel: "Active Subscription Plan",
    managePlan: "Manage Plan",
    passwordSection: "Change Password (Optional)",
    currentPassLabel: "Current Password",
    newPassLabel: "New Password (Min. 6 characters)",
    passPlaceholder: "Leave blank to keep current password...",
    cancel: "Cancel",
    saveBtn: "Save Changes",
    saving: "Saving...",
    successMsg: "Profile updated successfully!",
  },
  es: {
    title: "Ajustes de Perfil y Seguridad",
    nameLabel: "Nombre Completo / Alias",
    emailLabel: "Correo Electrónico",
    planLabel: "Plan de Suscripción Activo",
    managePlan: "Gestionar Plan",
    passwordSection: "Cambiar Contraseña (Opcional)",
    currentPassLabel: "Contraseña Actual",
    newPassLabel: "Nueva Contraseña (Mín. 6 caracteres)",
    passPlaceholder: "Dejar en blanco para no cambiar...",
    cancel: "Cancelar",
    saveBtn: "Guardar Cambios",
    saving: "Guardando...",
    successMsg: "¡Perfil actualizado correctamente!",
  },
  fr: {
    title: "Paramètres du Profil et Sécurité",
    nameLabel: "Nom Complet / Pseudo",
    emailLabel: "Adresse E-mail",
    planLabel: "Abonnement Actif",
    managePlan: "Gérer le Plan",
    passwordSection: "Changer le Mot de Passe (Optionnel)",
    currentPassLabel: "Mot de Passe Actuel",
    newPassLabel: "Nouveau Mot de Passe (Min. 6 caractères)",
    passPlaceholder: "Laisser vide pour conserver l'actuel...",
    cancel: "Annuler",
    saveBtn: "Enregistrer",
    saving: "Enregistrement...",
    successMsg: "Profil mis à jour avec succès !",
  },
  de: {
    title: "Profil- & Sicherheitseinstellungen",
    nameLabel: "Vollständiger Name / Creator-Name",
    emailLabel: "E-Mail-Adresse",
    planLabel: "Aktives Abonnement",
    managePlan: "Plan verwalten",
    passwordSection: "Passwort ändern (Optional)",
    currentPassLabel: "Aktuelles Passwort",
    newPassLabel: "Neues Passwort (Mind. 6 Zeichen)",
    passPlaceholder: "Leer lassen, um es nicht zu ändern...",
    cancel: "Abbrechen",
    saveBtn: "Änderungen speichern",
    saving: "Speichert...",
    successMsg: "Profil erfolgreich aktualisiert!",
  },
};

export default function ProfileModal() {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    setIsPricingModalOpen,
    user,
    updateUserProfile,
    language,
  } = useCreator();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isProfileModalOpen && user) {
      setName(user.name || "");
      setCurrentPassword("");
      setNewPassword("");
      setError("");
      setSuccess(false);
    }
  }, [isProfileModalOpen, user]);

  if (!isProfileModalOpen || !user) return null;

  const ui = PROFILE_TEXTS[language] || PROFILE_TEXTS.en;
  const isPro = user.plan === "pro";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await updateUserProfile({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setIsProfileModalOpen(false);
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#161920] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            {ui.title}
          </h3>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{ui.successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {ui.nameLabel}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              {ui.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#0F1115]/60 border border-slate-800/60 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Aktif Plan Özeti */}
          <div className="flex items-center justify-between bg-[#0F1115] border border-slate-800 rounded-xl p-3">
            <div>
              <span className="text-[11px] text-slate-400 block">
                {ui.planLabel}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {isPro ? "Creator Pro" : "Starter (Free)"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsPricingModalOpen(true);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 cursor-pointer"
            >
              {ui.managePlan}
            </button>
          </div>

          {/* Şifre Değiştirme Bölümü */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <span className="block text-xs font-semibold text-amber-400">
              {ui.passwordSection}
            </span>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {ui.currentPassLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder={ui.passPlaceholder}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {ui.newPassLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder={ui.passPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0F1115] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              {ui.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              {loading ? ui.saving : ui.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

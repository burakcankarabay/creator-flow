import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ContentDrawer from "../board/ContentDrawer";
import NewIdeaModal from "../board/NewIdeaModal";
import PricingModal from "../modals/PricingModal";
import ProfileModal from "../board/ProfileModal";
import { useCreator } from "../../context/CreatorContext";

export default function AppLayout() {
  const {
    isNewModalOpen,
    setIsNewModalOpen,
    isPricingModalOpen,
    setIsPricingModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    selectedVideo,
    setSelectedVideoId,
    openNewIdeaWithHook,
  } = useCreator();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. ESCAPE: Açık olan modalı veya sağ çekmeceyi kapat
      if (e.key === "Escape") {
        if (isPricingModalOpen) {
          setIsPricingModalOpen(false);
          return;
        }
        if (isProfileModalOpen) {
          setIsProfileModalOpen(false);
          return;
        }
        if (isNewModalOpen) {
          setIsNewModalOpen(false);
          return;
        }
        if (selectedVideo) {
          setSelectedVideoId(null);
          return;
        }
        // Eğer bir input içindeyse odağı kaldır (blur)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // 2. ALT + N: Hızlı Yeni Video Fikri Modalı Aç
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        openNewIdeaWithHook("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isNewModalOpen,
    isPricingModalOpen,
    isProfileModalOpen,
    selectedVideo,
    setIsNewModalOpen,
    setIsPricingModalOpen,
    setIsProfileModalOpen,
    setSelectedVideoId,
    openNewIdeaWithHook,
  ]);

  return (
    <div className="flex h-screen w-screen bg-[#0F1115] text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ContentDrawer />
      <NewIdeaModal />
      <PricingModal />
      <ProfileModal />
    </div>
  );
}

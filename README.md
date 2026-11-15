<div align="center">

# ⚡ SparkGrid

**Modern Content & Multi-Channel SaaS Production Suite**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-SparkGrid_Studio-indigo?style=for-the-badge&logo=render&logoColor=white)](https://creator-flow-api.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

<div align="center">

# 🎬 Studio — SaaS Production Suite

**Full-Stack Multi-Channel Short-Form Video Production & Analytics Platform**  
_Built for YouTube Shorts, Instagram Reels & TikTok Creators_

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

[🇬🇧 English](#-english-documentation) • [🇹🇷 Türkçe Dokümantasyon](#-türkçe-dokümantasyon)

</div>

---

## 🇬🇧 English Documentation

### 🚀 Overview

\***\* is a full-stack MERN SaaS web application designed for short-form content creators managing multiple channels across **YouTube Shorts, Instagram Reels, and TikTok\*\*. It streamlines the entire content lifecycle—from viral hook ideation and visual scripting to drag-and-drop scheduling and cross-platform performance analytics.

### ✨ Key Features

- **🗂️ Interactive Kanban Production Board:** Track videos across 4 production stages (_Idea Pool_, _Script & Visuals_, _Editing & Audio_, _Published_) with instant status transitions.
- **📅 Drag & Drop Weekly Release Calendar:** Native HTML5 Drag & Drop calendar with week-by-week navigation (`Prev / Today / Next`) and persistent scheduling in MongoDB.
- **📊 Cross-Platform Analytics & CSV Export:** Real-time KPI cards (_Total Views_, _Completion Rate_, _Average Views/Video_, _Top Performing Channel_), platform share bars, and one-click **UTF-8 BOM Excel (`.csv`) export**.
- **🪝 Viral Hook Bank:** Pre-loaded viral hook templates categorized by psychological triggers + ability to save custom user hooks to MongoDB.
- **🔐 Multi-Tenant Authentication & Security:** JWT-based authentication, `bcryptjs` 12-round password hashing, profile/password management, and strict user-level data isolation (`userId` scoping).
- **👑 SaaS Subscription & Quota Engine:** Dynamic **Starter (Free)** vs. **Creator Pro** tiers. Enforces Free tier limits (max 2 channels, 15 active videos) on both Frontend and Backend with an interactive **Monthly/Yearly Pricing Modal**.
- **🌍 5-Language Localization (i18n):** Instant UI & template switching between **Turkish, English, Spanish, French, and German**.
- **⌨️ Power-User Keyboard Shortcuts & URL Sync:** Deep-linked URL query states (`?channel=...&video=...`) using `useSearchParams`, plus `Ctrl+K` (quick search), `Alt+N` (new idea), and `Esc` (close modals/drawers).

### 🛠️ Tech Stack

| Layer               | Technologies                                                                                              |
| :------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Frontend**        | React (Vite), React Router v6 (`useSearchParams`), Context API + `useReducer`, Tailwind CSS, Lucide Icons |
| **Backend**         | Node.js, Express.js (ES Modules), RESTful API Architecture                                                |
| **Database**        | MongoDB Atlas, Mongoose ODM                                                                               |
| **Security & Auth** | JSON Web Tokens (JWT), `bcryptjs`, Protected Route Middleware                                             |

---

## 🇹🇷 Türkçe Dokümantasyon

### 🚀 Proje Hakkında

\***\*, **YouTube Shorts, Instagram Reels ve TikTok** için çoklu kanal yöneten içerik üreticileri adına geliştirilmiş uçtan uca (Full-Stack) bir **MERN SaaS\*\* üretim stüdyosudur. Fikir aşamasından viral kanca (hook) yazımına, haftalık yayın takviminden çapraz platform izlenme analizlerine kadar tüm iş akışını tek bir karanlık mod (dark mode) arayüzünde toplar.

### ✨ Öne Çıkan Özellikler

- **🗂️ Kanban Üretim Panosu:** Videoları _Fikir Havuzu_, _Senaryo & Görsel_, _Kurgu & Ses_ ve _Yayında_ aşamaları arasında yönetme ve sağdan açılan `ContentDrawer` ile otomatik kaydetme (auto-save).
- **📅 Sürükle-Bırak (Drag & Drop) Yayın Takvimi:** Videoları günler arasında sürükleyerek yayın tarihini güncelleme ve haftalar arası gezinme.
- **📊 Çapraz Platform Analizi & Excel (CSV) Çıktısı:** Toplam izlenme, yayınlanma oranı, video başına ortalama izlenme ve en başarılı kanal özet kartları; tek tıkla Türkçe karakter uyumlu `.csv` indirme.
- **🪝 Viral Hook Bankası:** Kategori filtreli hazır kanca şablonları ve kullanıcıya özel yeni şablon ekleme/silme.
- **🔐 Çok Kullanıcılı (Multi-Tenant) Güvenlik:** Her kullanıcının kanalları, videoları ve şablonları JWT ve `userId` izolasyonu ile korunur; şifreler `bcryptjs` ile hashlenerek saklanır.
- **👑 SaaS Paket ve Kota Yönetimi:** **Starter (Free)** planda maksimum 2 kanal ve 15 aktif video sınırı (hem arayüzde hem sunucuda kontrol edilir) ve Aylık/Yıllık **Creator Pro** yükseltme ekranı.
- **🌍 5 Dil Desteği:** Türkçe, İngilizce, İspanyolca, Fransızca ve Almanca tam arayüz çevirisi.
- **⌨️ Klavye Kısayolları & URL Durum Yönetimi:** Seçili kanal ve açık video çekmecesini URL'de (`?channel=...&video=...`) tutma; `Ctrl+K` ile arama, `Alt+N` ile yeni fikir ekleme ve `Esc` ile pencereleri kapatma.

---

### 🔌 API Uç Noktaları (REST API Endpoints)

| Metot        | Endpoint             | Açıklama                                                             | Yetki  |
| :----------- | :------------------- | :------------------------------------------------------------------- | :----- |
| `POST`       | `/api/auth/register` | Yeni üretici hesabı oluşturur ve varsayılan kanalları tanımlar       | Açık   |
| `POST`       | `/api/auth/login`    | Kullanıcı girişi yapar ve JWT Token döndürür                         | Açık   |
| `PATCH`      | `/api/auth/plan`     | Abonelik planını (`free` / `pro`) günceller                          | 🔒 JWT |
| `PATCH`      | `/api/auth/profile`  | Kullanıcı adını ve şifresini günceller                               | 🔒 JWT |
| `GET / POST` | `/api/channels`      | Kullanıcının kanallarını listeler / yeni kanal ekler (Kota korumalı) | 🔒 JWT |
| `DELETE`     | `/api/channels/:id`  | Kanalı ve bağlı videoları siler                                      | 🔒 JWT |
| `GET / POST` | `/api/videos`        | Videoları listeler / yeni video kartı oluşturur                      | 🔒 JWT |
| `PATCH`      | `/api/videos/:id`    | Video senaryosunu, tarihini veya platform izlenmelerini günceller    | 🔒 JWT |
| `GET / POST` | `/api/hooks`         | Kullanıcının özel hook şablonlarını listeler / yenisini ekler        | 🔒 JWT |

---

### 💻 Yerel Kurulum (Local Development Setup)

**1. Backend Kurulumu (`SparkGrid-api`):**

```bash
cd SparkGrid-api
npm install
```

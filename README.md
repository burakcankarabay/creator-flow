# ⚡ SparkGrid — Content Creator Workflow & Production SaaS

[![Live Demo](https://img.shields.io/badge/Live%20Demo-SparkGrid-4f46e5?style=for-the-badge&logo=render&logoColor=white)](https://spark-grid-kzqt.onrender.com)
[![Backend API](<https://img.shields.io/badge/⚙️_API_Status-Online_(24/7)-10b981?style=for-the-badge>)](https://creator-flow-api.onrender.com/api/health)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_Vite-0f172a?style=for-the-badge&logo=react)](#)

**SparkGrid**, kısa form video içerik üreticilerinin (YouTube Shorts, Instagram Reels, TikTok) fikir aşamasından senaryo yazımına, yayın takviminden çapraz platform izlenme analizlerine kadar tüm üretim süreçlerini tek bir merkezden yönetebildiği Full-Stack bir SaaS uygulamasıdır.

🔗 **Canlı Uygulama (Live Demo):** [https://spark-grid-kzqt.onrender.com/board](https://spark-grid-kzqt.onrender.com/board)

---

## ✨ Öne Çıkan Özellikler

- **📋 Kanban Üretim Panosu:** Video fikirlerini üretim aşamalarına (_Idea, Scripting, Filming, Editing, Published_) göre kategorize etme ve takip etme.
- **⚡ Debounced Auto-Save (Otomatik Kayıt):** İçerik çekmecesinde (`ContentDrawer`) yapılan her değişikliği 500ms gecikmeli (debounced) olarak veritabanına anında ve yormadan kaydetme.
- **📎 Tek Tıkla Kopyalama (Copy-to-Clipboard):** Video **Hook** ve **Script / Prompt** metinlerini içerik üretim araçlarında veya yayın ekranlarında hızla kullanmak için tek tıkla panoya kopyalama.
- **📊 Çapraz Platform Analitiği:** YouTube Shorts, Instagram Reels ve TikTok izlenmelerini video bazlı takip etme ve otomatik yayın durumu güncelleme.
- **🌍 Çoklu Dil Desteği (i18n):** Tek tıkla **Türkçe (TR)** ve **İngilizce (EN)** arayüz geçişi.
- **🔐 Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) ve `bcrypt` tabanlı kullanıcı kayıt ve oturum yönetimi.
- **🟢 7/24 Kesintisiz API (Zero Cold-Start):** UptimeRobot entegrasyonu ve `/api/health` uç noktası ile uyku moduna girmeyen aktif sunucu mimarisi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### Frontend

- **React 18 (Vite)** — Hızlı ve modern bileşen mimarisi
- **Context API & `useReducer`** — Merkezi state ve aksiyon yönetimi
- **Tailwind CSS** — Karanlık tema (Dark Mode) odaklı modern arayüz
- **Lucide React** — İkon seti

### Backend & DevOps

- **Node.js & Express.js** — RESTful API mimarisi
- **MongoDB Atlas & Mongoose** — Bulut tabanlı NoSQL veritabanı
- **JWT & Bcrypt.js** — Kimlik doğrulama ve veri güvenliği
- **Render & UptimeRobot** — CI/CD otomatik dağıtım ve 7/24 sunucu izleme

---

## 🚀 Yerel Kurulum (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Repoyu Klonlayın

```bash
git clone [https://github.com/KULLANICI_ADIN/sparkgrid.git](https://github.com/KULLANICI_ADIN/sparkgrid.git)
cd sparkgrid
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`backend` klasörü içinde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Sunucuyu başlatın:

```bash
npm run dev
```

### 3. Frontend Kurulumu

Yeni bir terminal açıp `frontend` dizinine geçin:

```bash
cd frontend
npm install
```

`frontend` klasörü içinde bir `.env` dosyası oluşturun:

```env
VITE_API_URL=http://localhost:5000/api
```

Uygulamayı başlatın:

```bash
npm run dev
```

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

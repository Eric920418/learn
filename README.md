# TISCLLB 台灣臨床下肢生物力學國際學會

官方網站 — TAIWAN INTERNATIONAL SOCIETY OF CLINICAL LOWER LIMB BIOMECHANICS

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router, TypeScript) |
| 樣式 | Tailwind CSS v4 |
| 資料庫 | Neon PostgreSQL (亞洲區域) |
| ORM | Drizzle ORM |
| 認證 | NextAuth.js v5 (Credentials + JWT) |
| 圖片儲存 | Vercel Blob |
| 部署 | Vercel (hkg1) |

## 本地開發

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local`，填入以下變數：

```env
DATABASE_URL=postgresql://...          # Neon PostgreSQL 連線字串
AUTH_SECRET=xxx                        # NextAuth 密鑰 (openssl rand -base64 32)
AUTH_URL=http://localhost:3000         # 開發環境
BLOB_READ_WRITE_TOKEN=xxx             # Vercel Blob token (部署時需要)
```

### 3. 資料庫設定

```bash
pnpm db:generate   # 生成遷移檔案
pnpm db:push       # 推送 schema 到資料庫
pnpm db:seed       # 填入初始資料（含 admin 帳號）
pnpm db:studio     # 開啟 Drizzle Studio（瀏覽資料庫）
```

### 4. 啟動開發伺服器

```bash
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## CMS 後台管理

### 登入

訪問 `/admin/login`，使用以下帳號：

- **帳號**: `TIS00662829`
- **密碼**: `00662829`

> ⚠️ 此帳號為臨時測試用，帳號字串塞在 `users.email` 欄位內（非真正 email 格式），登入頁 input 已改為 `type="text"` 以繞過瀏覽器 email 原生驗證。email 相關功能（寄信、驗證、忘記密碼）在此帳號下不可用。正式上線前請改回真正的 email、或為 schema 新增獨立的 `username` 欄位。
>
> ⚠️ **Neon 資料庫密碼已在對話紀錄中明文出現，請立刻到 Neon Console 執行 Reset Password，並同步更新 `.env.local` 與 Vercel 的 `DATABASE_URL`。**

### 後台功能

| 路徑 | 功能 |
|------|------|
| `/admin` | Dashboard 總覽 |
| `/admin/hero` | 編輯首頁 Hero 區塊（文字、圖片） |
| `/admin/philosophy` | 管理倡導理念條目（目標/願景 CRUD） |
| `/admin/events` | 活動管理（新增/編輯/刪除/發布） |
| `/admin/board-members` | 組織成員管理（含照片上傳） |
| `/admin/members` | 會員名單管理 |
| `/admin/about` | 關於本會各區塊（Aims/Directors/Purposes/引言/學會價值圖片/組織成員介紹） |
| `/admin/recruit` | 招募會員頁面內容 |
| `/admin/contact` | 聯絡我們頁面歡迎文字 |
| `/admin/gallery` | 活動錦集管理（相簿 CRUD + 照片上傳管理） |
| `/admin/settings` | 全站設定（聯絡資訊、版權文字） |

> Blog 功能（`/admin/blog`、`/blog`）程式碼與資料表保留，但 Sidebar 入口暫時隱藏，前台導覽列也未連結，需直接輸入網址才能進入。

### 內容架構

所有前台頁面內容由資料庫驅動，透過後台即可動態更新：

- **單行表**：全站設定 (site_settings)、首頁 Hero (hero_content)
- **列表表**：倡導理念、組織成員、會員、活動、Aims、Directors、Purposes、Focus Items
- **通用文字區塊**：page_sections（研討會文字、研發文字、領導力引言等）
- **活動錦集**：相簿 (gallery_albums)、照片 (gallery_photos)
- **Blog 系統**：文章、分類、標籤

## 專案結構

```
src/
├── app/
│   ├── (admin-auth)/admin/login/  # 登入頁（不受 admin layout 保護）
│   ├── admin/                      # 後台管理（受 auth guard 保護）
│   │   ├── layout.tsx              # Admin layout + sidebar
│   │   ├── hero/                   # Hero 編輯
│   │   ├── philosophy/             # 倡導理念 CRUD
│   │   ├── events/                 # 活動 CRUD
│   │   ├── board-members/          # 組織成員 CRUD
│   │   ├── members/                # 會員 CRUD
│   │   ├── about/                  # About 各區塊
│   │   ├── recruit/                # 招募頁面內容
│   │   ├── contact/                # 聯絡我們頁面管理
│   │   ├── gallery/                 # 活動錦集（相簿 + 照片管理）
│   │   ├── blog/                   # Blog 管理
│   │   └── settings/               # 全站設定
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API
│   │   └── upload/                 # 圖片上傳 API (Vercel Blob)
│   ├── gallery/                    # 活動錦集前台
│   ├── about/                      # 關於本會
│   ├── blog/                       # Blog 前台
│   ├── contact/                    # 聯絡我們
│   ├── events/                     # 活動訊息
│   ├── members/                    # 會員名單
│   ├── philosophy/                 # 倡導理念
│   ├── recruit/                    # 招募會員
│   └── page.tsx                    # 首頁
├── components/
│   ├── admin/                      # 後台共用組件
│   │   ├── Sidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── FormField.tsx
│   │   ├── BilingualField.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── MultiImageUpload.tsx
│   │   ├── PhotoManager.tsx
│   │   ├── SubmitButton.tsx
│   │   ├── DeleteButton.tsx
│   │   └── ErrorDisplay.tsx
│   └── ui/                         # 前台 UI 組件
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── EventCard.tsx
├── lib/
│   ├── actions/                    # Server Actions (CRUD)
│   ├── queries/                    # 資料查詢函數
│   └── db/
│       ├── schema.ts               # Drizzle ORM schema (21 張表)
│       ├── index.ts                 # DB 連線
│       └── seed.ts                  # 初始資料
├── types/index.ts                   # TypeScript 類型擴展
└── auth.ts                          # NextAuth 配置
```

## 頁面

### 前台

| 路徑 | 內容 |
|------|------|
| `/` | Hero + 倡導理念 + 活動輪播 |
| `/about` | 本會簡介 + 組織成員 + 章程 |
| `/philosophy` | 倡導理念（目標 + 願景） |
| `/events` | 活動列表 |
| `/gallery` | 活動錦集（相簿列表） |
| `/gallery/[id]` | 活動相簿詳情（瀑布流照片） |
| `/members` | 會員名單表格 |
| `/recruit` | 招募會員 + 研討會 + 研發 |
| `/contact` | 聯絡資訊 |
| `/blog` | 文章列表 |
| `/blog/[slug]` | 文章內頁 |

## 響應式設計 (RWD)

所有頁面支援 Mobile-first 響應式設計，使用 Tailwind CSS v4 預設斷點：

| 斷點 | 寬度 | 說明 |
|------|------|------|
| 預設 | < 640px | 手機 |
| `sm:` | ≥ 640px | 大手機 / 小平板 |
| `md:` | ≥ 768px | 平板 |
| `lg:` | ≥ 1024px | 筆電 |
| `xl:` | ≥ 1280px | 桌面 |

## 部署

專案配置為部署到 Vercel 香港區域 (hkg1)。需要在 Vercel 設定以下環境變數：

- `DATABASE_URL` — Neon PostgreSQL 連線字串
- `AUTH_SECRET` — NextAuth 密鑰
- `AUTH_URL` — 正式網域 (例: https://tiscllb.org)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob 儲存 token

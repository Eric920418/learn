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
pnpm db:generate   # 生成遷移檔案（drizzle/000X_*.sql）
pnpm db:migrate    # 套用未執行的 migration（含資料回填 SQL，正規流程）
pnpm db:push       # 直接推 schema diff 到 DB（略過 .sql 檔，僅限純 schema 變更）
pnpm db:seed       # 填入初始資料（含 admin 帳號）
pnpm db:studio     # 開啟 Drizzle Studio（瀏覽資料庫）
```

> schema 變更時請使用 `pnpm db:generate` 產生 migration，**手動檢查並補上資料回填 SQL**，再以 `pnpm db:migrate` 套用。`db:push` 會略過 `.sql` 檔所以無法執行資料回填，僅適用於 dev 階段的純 schema 變更。**禁用 `--accept-data-loss` flag**。

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

> Admin 登入使用 `users.username` 欄位作為 key（migration `0002_fast_domino`）；`users.email` 欄位允許為 NULL，保留以供未來啟用 email 相關功能（密碼重設、通知等）。auth 邏輯見 `src/auth.ts`。
>
> ℹ️ Neon `neondb_owner` 密碼已於 2026-04-09 rotate，舊密碼已失效。新密碼已同步寫入 `.env.local` 與 Vercel 的 `DATABASE_URL`（Production + Preview）。**Production deployment 需重新部署才會套用新 env**，可執行 `vercel --prod` 或從 Vercel Dashboard 點 Redeploy。
>
> ⚠️ 新密碼目前仍在本次 Claude Code 對話紀錄與 shell history 中，建議日後透過 Neon Console 網頁手動再 rotate 一次，完全不經過 CLI/對話介面，才真正乾淨。

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

> Blog 功能前後台程式碼已全數移除（routes / actions / queries / dashboard 卡片）。資料表（`posts`、`categories`、`tags`、`post_tags`）刻意保留在 DB 與 `src/lib/db/schema.ts`，避免 drizzle migration 產生 `DROP TABLE` 而違反 `--accept-data-loss` 禁令。未來若要復活只需重建 routes/actions/queries，資料完整無損。

### 內容架構

所有前台頁面內容由資料庫驅動，透過後台即可動態更新：

- **單行表**：全站設定 (site_settings)、首頁 Hero (hero_content)
- **列表表**：倡導理念、組織成員、會員、活動、Aims、Directors、Purposes、Focus Items
- **通用文字區塊**：page_sections（研討會文字、研發文字、領導力引言等）
- **活動錦集**：相簿 (gallery_albums)、照片 (gallery_photos)

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
│   │   └── settings/               # 全站設定
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API
│   │   └── upload/                 # 圖片上傳 API (Vercel Blob)
│   ├── gallery/                    # 活動錦集前台
│   ├── about/                      # 關於本會
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

### 圖片上傳限制

限制值集中定義在 `src/lib/upload.ts`，前端驗證、後端驗證、`accept` 屬性都從這裡取，不要在別處寫死。

| 項目 | 值 |
| --- | --- |
| 格式 | JPG、PNG、WebP（不支援影片） |
| 大小 | 4MB |
| 權限 | 僅 `role === "admin"` |

> **為何是 4MB 不是 5MB？** Vercel Functions 的 request body 硬上限是 4.5MB，超過會在平台層直接回 413 HTML，根本進不到 route handler。4MB 留給 multipart 編碼的 overhead。若日後需要支援大檔或影片，得改用 Vercel Blob 的 client upload（瀏覽器直傳 Blob，不經過 function），而不是調高這個數字。

部署環境（`process.env.VERCEL` 存在）若沒有 `BLOB_READ_WRITE_TOKEN`，上傳 API 會直接回錯誤而**不會**退回寫本地檔案系統 —— Vercel 的 filesystem 唯讀且每次部署重建，退回只會產生誤導性的 fs 錯誤。本地開發沒有 token 時才會存到 `public/uploads/`（已 gitignore）。

### 渲染策略

所有前台公開頁（`/`、`/about`、`/events`、`/gallery`、`/members`、`/philosophy`、`/recruit`、`/contact`、`/gallery/[id]`）都標記了 `export const dynamic = "force-dynamic"`。

> **為何不用 SSG？** Vercel build container 在 `iad1`（美東），Neon 在 `ap-southeast-1`（新加坡）。Build 階段若 SSG prerender，會跨太平洋打 Neon HTTP API，網路抖動或 cold start 隨時可能 `ETIMEDOUT` 讓整個 build 失敗。改為 `force-dynamic` 後，build 不打 DB，runtime 由 hkg1 function 連 Neon（亞洲區內）每次 request server-render，latency 約 30–50ms，CMS 內容更新立即生效。`/admin/*` 因為 layout 用 `auth()` 已自動為 dynamic，不需顯式設定。

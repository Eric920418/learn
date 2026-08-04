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
| 媒體儲存 | Vercel Blob（圖片走 server proxy，影片走 client 直傳） |
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
| `/admin/gallery` | 活動錦集管理（相簿 CRUD + 相簿內照片與影片管理） |
| `/admin/settings` | 全站設定（聯絡資訊、版權文字） |

> 影片沒有獨立的後台入口。影片是相簿裡的一則媒體，在
> `/admin/gallery/[id]/photos`（「管理照片與影片」）內新增與排序。

> Blog 功能前後台程式碼已全數移除（routes / actions / queries / dashboard 卡片）。資料表（`posts`、`categories`、`tags`、`post_tags`）刻意保留在 DB 與 `src/lib/db/schema.ts`，避免 drizzle migration 產生 `DROP TABLE` 而違反 `--accept-data-loss` 禁令。未來若要復活只需重建 routes/actions/queries，資料完整無損。

### 內容架構

所有前台頁面內容由資料庫驅動，透過後台即可動態更新：

- **單行表**：全站設定 (site_settings)、首頁 Hero (hero_content)
- **列表表**：倡導理念、組織成員、會員、活動、Aims、Directors、Purposes、Focus Items
- **通用文字區塊**：page_sections（研討會文字、研發文字、領導力引言等）
- **活動錦集**：相簿 (gallery_albums)、相簿內媒體 (gallery_photos —— 同時存照片與影片，用 `media_type` 區分)

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
│   │   ├── gallery/                 # 活動錦集（相簿 + 相簿內照片與影片）
│   │   └── settings/               # 全站設定
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API
│   │   └── upload/                 # 圖片上傳 API（server proxy → Blob）
│   │       └── video/              # 影片上傳授權 API（簽發 client token，檔案不經過此處）
│   ├── gallery/                    # 活動錦集前台
│   ├── videos/                     # 影片前台
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
│   │   ├── VideoUpload.tsx         # 影片直傳 Blob（進度條 + 可播性探測）
│   │   ├── MediaManager.tsx        # 相簿內照片與影片的管理介面
│   │   ├── SubmitButton.tsx
│   │   ├── DeleteButton.tsx
│   │   └── ErrorDisplay.tsx
│   └── ui/                         # 前台 UI 組件
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── EventCard.tsx
│       ├── EventInfoModal.tsx
│       ├── MediaLightbox.tsx       # 照片/影片共用的燈箱（左右切換）
│       ├── AlbumMediaGrid.tsx      # 相簿內頁瀑布流（混合照片與影片）
│       ├── VideoGallery.tsx        # /videos 彙整頁的卡片 grid
│       └── useModalBehavior.ts     # Esc 關閉 + 背景捲動鎖（含 iOS workaround）
├── lib/
│   ├── actions/                    # Server Actions (CRUD)
│   ├── queries/                    # 資料查詢函數
│   ├── upload.ts                   # 圖片/影片上傳限制與驗證（前後端共用）
│   └── db/
│       ├── schema.ts               # Drizzle ORM schema (22 張表)
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
| `/gallery/[id]` | 活動相簿詳情（瀑布流，照片與影片混合，點擊開燈箱、可左右切換） |
| `/videos` | 活動影片彙整（列出所有相簿裡的影片，可連回所屬相簿） |
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
- `AUTH_URL` — 正式網域 (https://www.tiscllb.org.tw)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob 儲存 token

### 正式網址

驗證線上狀態時請用 `https://www.tiscllb.org.tw`。網域是 `.org.tw` 不是 `.org`
—— 後者不存在、DNS 解析不到，用錯會拿到「連不上」而誤以為站台掛了。

Vercel 專案 `learn` 綁定的網域：

| 網址 | 用途 |
| --- | --- |
| `www.tiscllb.org.tw` | 正式站（驗證用這個） |
| `tiscllb.org.tw` | 同上 |
| `learn-git-main-erics-projects-57e51613.vercel.app` | main 分支別名 |

部署由 push 到 `main` 自動觸發，約 30 秒完成。

### 影片存在哪裡

**影片沒有自己的資料表。** 它們是 `gallery_photos` 裡 `media_type = 'video'` 的列——跟照片同一張表、同一個相簿、同一組 `sort_order`，所以前台能把照片和影片依管理員指定的順序混合排列。

`image_url` 對兩種型別的語意都是「這一則在相片牆上顯示的那張圖」：

| `media_type` | `image_url` | `video_url` | `youtube_id` |
| --- | --- | --- | --- |
| `image` | 照片本身 | NULL | NULL |
| `video`（自架） | 封面圖 | Blob URL | NULL |
| `video`（YouTube） | 封面圖 | NULL | 11 字元 ID |

這個設計讓既有的 `image_url NOT NULL` 不用動（migration 只有 `ADD COLUMN`），而且順帶讓「影片一定要有封面」變成資料庫層的保證——前台不會出現黑色方塊。三種組合由 CHECK constraint `gallery_photos_media_payload_check` 強制，影片必須「恰好」有一個來源。

> `videos` 資料表**已停用**，沒有任何程式碼讀寫它。那是初版設計（影片獨立於相簿），
> 後來客戶確認影片要放在活動相簿裡而改掉。保留不刪的理由與 `posts` / `categories`
> 相同：避免 drizzle 產生 `DROP TABLE`。它是 0 筆資料的空表，不要往裡面寫東西。

### 媒體上傳限制

所有限制值集中定義在 `src/lib/upload.ts`，前端驗證、後端驗證、`accept` 屬性都從這裡取，不要在別處寫死。

| | 圖片 | 影片 |
| --- | --- | --- |
| 格式 | JPG、PNG、WebP | MP4、WebM（**H.264 + AAC**） |
| 大小 | 4MB | 100MB |
| 路徑 | `瀏覽器 → /api/upload → Blob` | `瀏覽器 → Blob`（直傳） |
| 權限 | 僅 `role === "admin"` | 僅 `role === "admin"` |

**為何圖片是 4MB 不是 5MB？** Vercel Functions 的 request body 硬上限是 4.5MB，超過會在平台層直接回 413 HTML，根本進不到 route handler。4MB 留給 multipart 編碼的 overhead。

**為何影片不走同一條路？** 100MB 穿不過那個 4.5MB 限制。影片改用 Vercel Blob 的 client upload：`/api/upload/video` 只簽發一張受限的 client token（`allowedContentTypes` + `maximumSizeInBytes` 會被 HMAC 簽章編進 token，由 Blob 服務端強制執行，是真的伺服器端驗證），檔案由瀏覽器直傳，完全不經過我們的 function。

**為何不用 `onUploadCompleted` 寫 DB？** 那是 Blob 服務反向呼叫我們的 URL，localhost 收不到。邏輯放那裡等於本地永遠測不出來、上線才爆。改由前端拿到 URL 後送表單，`addVideoToAlbum`（`src/lib/actions/gallery.ts`）寫入。

**為何擋 `.mov`？** iPhone 預設錄的是 HEVC 編碼的 `.mov`，管理員在 Mac Safari 上測會正常播放，但 Chrome / Firefox 訪客完全播不出來，而且不會有人回報。上傳時直接擋下並要求匯出 MP4。
注意這只擋掉一半：iPhone「高效率」設定匯出的 **`.mp4` 容器也可能裝 HEVC**，`file.type` 是 `video/mp4` 會通過白名單。`VideoUpload` 因此會在上傳前用瀏覽器實際解一次影片（`videoWidth > 0`）當第二道防線，但那只證明「上傳者這台瀏覽器解得開」。**請在 iPhone 的「設定 → 相機 → 格式」選「最相容」，或匯出時選 H.264。**

#### ⚠️ 本機開發會寫進正式環境

`.env.local` 的 `DATABASE_URL` 與 Vercel Production 是**同一個 Neon 資料庫**（見上方密碼 rotate 說明），而影片的 client upload **沒有本地檔案系統備援**（那是繞過 function 的唯一方式），所以也是寫進**正式 Blob store**。

也就是說：在 localhost 測試上傳並儲存的影片，會立刻出現在正式站上。

緩解措施：
- 影片存在相簿裡，是否對外由**相簿的 `published`** 決定。想安全地試，就先開一個未發布的相簿，測完連相簿一起刪（會連帶清掉裡面所有 Blob 檔案）
- 本機上傳的檔案會加上 `videos/dev/` 路徑前綴，可用 `vercel blob list --prefix videos/dev/` 一次找出來清掉
- 測試完請從後台刪除，`deleteVideo` 會一併清掉 Blob 檔案

#### Blob 檔案生命週期

影片是「檔案先進 Blob、DB row 後寫」，所以有孤兒檔案的風險。目前的處理：

| 情境 | 處理 |
| --- | --- |
| 刪除影片 | `deleteVideo` 一併 `del()` 影片與封面圖；失敗回 warning 不吞掉 |
| 換掉影片/封面後儲存 | `updateVideo` 刪掉被替換的舊檔案 |
| 上傳後又換一支 | `discardVideoBlob` 清掉前一顆 |
| 上傳後直接關掉分頁 | **無法處理**，會留下孤兒檔案。需要時用 `vercel blob list --prefix videos/` 比對 DB 手動清 |

| 刪除相簿 | `deleteAlbum` 清掉封面圖與相簿內所有照片、影片的 Blob 檔案 |

> 影片與照片共用 `gallery_photos` 之後，`deletePhoto` 原本不清 Blob 的 leak
> 就必須修掉了——同一支函式現在也會刪到 100MB 的影片。順帶把照片的 leak
> 一起補上。

#### 流量成本

Vercel Blob 按 Data Transfer 計費。一支 100MB 的自架影片被觀看 1000 次約產生 100GB 出流量（約 $5），而且 Blob 只是檔案儲存 —— 沒有轉檔、沒有自適應碼率，手機在慢速網路上就是硬啃 100MB。

**長片或高流量的影片請用 YouTube 來源**（後台表單可切換），那條路零儲存、零流量成本，且自動適應網速。自架適合短片、或不想出現 YouTube 品牌與推薦影片的場合。

> `public` 存取的 Blob URL 是公開的，`published: false` 只是讓它不出現在頁面上，拿到 URL 的人仍然存取得到。相簿照片也是同樣情況，只是 100MB 影片被外連的代價高很多。

#### 缺 token 的行為

| 環境 | 圖片 | 影片 |
| --- | --- | --- |
| 本機（無 token） | 存到 `public/uploads/`（已 gitignore） | **直接失敗**並提示缺設定 —— 沒有備援路徑 |
| Vercel（無 token） | 直接回錯誤，不退回檔案系統（唯讀且每次部署重建） | 直接失敗並提示缺設定 |

> `@vercel/blob` 的 `upload()` 在拿不到 token 時，會把我們回的 JSON 錯誤內容整個丟掉，一律換成英文的 `Failed to retrieve the client token`（`client.js:238`）。所以 `/api/upload/video` 另外提供一支 `GET`，前端在失敗後會再打一次，才問得到真正的原因是「登入過期」還是「伺服器沒設 token」。

### 渲染策略

所有前台公開頁（`/`、`/about`、`/events`、`/gallery`、`/members`、`/philosophy`、`/recruit`、`/contact`、`/gallery/[id]`）都標記了 `export const dynamic = "force-dynamic"`。

> **為何不用 SSG？** Vercel build container 在 `iad1`（美東），Neon 在 `ap-southeast-1`（新加坡）。Build 階段若 SSG prerender，會跨太平洋打 Neon HTTP API，網路抖動或 cold start 隨時可能 `ETIMEDOUT` 讓整個 build 失敗。改為 `force-dynamic` 後，build 不打 DB，runtime 由 hkg1 function 連 Neon（亞洲區內）每次 request server-render，latency 約 30–50ms，CMS 內容更新立即生效。`/admin/*` 因為 layout 用 `auth()` 已自動為 dynamic，不需顯式設定。

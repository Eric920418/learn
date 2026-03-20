# TISCLLB 台灣臨床下肢生物力學國際學會

官方網站 — TAIWAN INTERNATIONAL SOCIETY OF CLINICAL LOWER LIMB BIOMECHANICS

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router, TypeScript) |
| 樣式 | Tailwind CSS v4 |
| 資料庫 | Neon PostgreSQL (亞洲區域) |
| ORM | Drizzle ORM |
| 認證 | NextAuth.js v5 |
| 部署 | Vercel (hkg1) |

## 本地開發

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local`，填入你的 Neon 連線字串和 Auth Secret：

```bash
cp .env.example .env.local
```

### 3. 資料庫遷移

```bash
pnpm db:generate   # 生成遷移檔案
pnpm db:migrate    # 執行遷移
pnpm db:studio     # 開啟 Drizzle Studio（瀏覽資料庫）
```

### 4. 啟動開發伺服器

```bash
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 專案結構

```
src/
├── app/                  # Next.js App Router
│   ├── api/auth/         # NextAuth API routes
│   ├── events/           # 活動訊息獨立頁面
│   ├── blog/             # 部落格頁面
│   ├── admin/            # 後台管理（受保護）
│   ├── layout.tsx        # Root layout (Noto Sans TC 字體)
│   └── globals.css       # Tailwind v4 主題色彩系統
├── components/ui/        # UI 元件
│   ├── Header.tsx        # 頂部導覽列
│   ├── Footer.tsx        # 頁尾
│   └── EventCard.tsx     # 活動卡片輪播
├── lib/
│   ├── db/               # Drizzle ORM + Neon 設定
│   └── utils.ts          # cn() 工具函數
├── types/                # TypeScript 類型定義
├── auth.ts               # NextAuth 主配置
└── proxy.ts              # Next.js 16 session 代理
```

## 頁面

### 首頁 (`/`)
1. **Header** — 學會 Logo + 導覽列
2. **Hero** — 歡迎加入 TISCLLB + 醫療影像背景
3. **倡導理念** — 目標 + 願景
4. **活動訊息** — 活動卡片輪播
5. **Footer** — 聯絡資訊 + 導覽連結

### 活動訊息 (`/events`)
- 大標題 TISCLLB + 活動訊息
- 多個活動區塊（藍色/橘色漸層卡片 + 活動資訊文字）

### 招募會員 (`/recruit`)
- 大標題 TISCLLB + 招募會員
- 五大重點：Networking、Leadership Skills、Professional Development、Partner Programs、Business Growth
- 研討會及繼續教育（圖文交錯）
- 研究與發展

### 關於本會 (`/about`)
- 本會簡介 + Our Values 圓形圖
- Our Aim 我們的目標 + 國際網絡圖
- 本會章程（Why Have Directors、領導力引言、學會目的）
- 組織成員（第一屆理監事照片格）

### 倡導理念 (`/philosophy`)
- 與首頁倡導理念區塊一致（目標 + 願景）

### 會員名單 (`/members`)
- 大標題 TISCLLB + 會員名單
- 20 位會員表格（姓名中英文 + 工作單位 + Email）

## 響應式設計 (RWD)

所有頁面支援 Mobile-first 響應式設計，使用 Tailwind CSS v4 預設斷點：

| 斷點 | 寬度 | 說明 |
|------|------|------|
| 預設 | < 640px | 手機（iPhone SE ~ iPhone 14） |
| `sm:` | ≥ 640px | 大手機 / 小平板 |
| `md:` | ≥ 768px | 平板（iPad portrait） |
| `lg:` | ≥ 1024px | 筆電 / iPad landscape |
| `xl:` | ≥ 1280px | 桌面 |

- Header 在 `lg:` 以下自動切換為漢堡選單，極小螢幕（< 640px）隱藏英文副標題
- 所有頁面標題、內容 padding、文字大小在各斷點間平滑過渡
- 招募會員頁 Business Growth 三欄在手機自動堆疊為單欄
- 會員名單表格文字在手機端自動縮小以保持可讀性

## 部署

專案配置為部署到 Vercel 香港區域 (hkg1)。Push 到 GitHub 後連接 Vercel 即可自動部署。

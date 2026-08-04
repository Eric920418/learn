import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  integer,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============================================
// NextAuth 所需的表
// ============================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  username: varchar("username", { length: 50 }).unique(),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("session_token").unique().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ============================================
// 部落格相關的表
// ============================================

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  published: boolean("published").default(false).notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  categoryId: uuid("category_id").references(() => categories.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
});

export const postTags = pgTable("post_tags", {
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

// ============================================
// CMS 內容表
// ============================================

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: text("address").notNull(),
  tel: text("tel").notNull(),
  fax: text("fax").notNull(),
  email: text("email").notNull(),
  copyrightText: text("copyright_text"),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const heroContent = pgTable("hero_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleLine1: text("title_line1").notNull(),
  titleLine2: text("title_line2").notNull(),
  subtitleCn: text("subtitle_cn").notNull(),
  subtitleEn: text("subtitle_en").notNull(),
  announcementText: text("announcement_text"),
  heroImage: text("hero_image"),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const philosophyItems = pgTable("philosophy_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: varchar("category", { length: 20 }).notNull(),
  contentEn: text("content_en").notNull(),
  contentCn: text("content_cn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const boardMembers = pgTable("board_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameEn: text("name_en").notNull(),
  titleEn: text("title_en").notNull(),
  titleCn: text("title_cn").notNull(),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const aboutAims = pgTable("about_aims", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentEn: text("content_en").notNull(),
  contentCn: text("content_cn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const aboutDirectors = pgTable("about_directors", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentEn: text("content_en").notNull(),
  contentCn: text("content_cn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const aboutPurposes = pgTable("about_purposes", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentEn: text("content_en").notNull(),
  contentCn: text("content_cn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionTitle: text("section_title").notNull(),
  date: text("date").notNull(),
  titleCn: text("title_cn").notNull(),
  titleEn: text("title_en").notNull(),
  speaker: text("speaker").notNull(),
  speakerTitle: text("speaker_title").notNull(),
  location: text("location").notNull(),
  info: text("info"),
  image: text("image"),
  link: text("link"),
  color: varchar("color", { length: 10 }).default("blue").notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const associationMembers = pgTable("association_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameCn: text("name_cn").notNull(),
  nameEn: text("name_en").notNull(),
  workplace: text("workplace").notNull(),
  email: text("email").notNull(),
  email2: text("email2"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const focusItems = pgTable("focus_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleEn: text("title_en").notNull(),
  titleCn: text("title_cn").notNull(),
  descEn: text("desc_en").notNull(),
  descCn: text("desc_cn").notNull(),
  subItems: text("sub_items"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ============================================
// 活動錦集（Gallery）
// ============================================

export const galleryAlbums = pgTable("gallery_albums", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  eventDate: text("event_date").notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type MediaType = "image" | "video";

// 相簿內的一則媒體：照片或影片。表名維持 gallery_photos（改名等於破壞性
// migration，不值得）。
//
// imageUrl 對兩種型別的語意是「這一則在相片牆上顯示的那張圖」：
//   - mediaType=image：照片本身
//   - mediaType=video：影片封面圖
// 這樣既有的 NOT NULL 不用動，而且「影片一定要有封面」變成資料庫層的保證，
// 前台不會出現黑色方塊。既有 92 列會吃 mediaType 的預設值 'image'，
// 兩個新欄位為 NULL，完全符合下方的 CHECK。
export const galleryPhotos = pgTable(
  "gallery_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => galleryAlbums.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    mediaType: text("media_type").$type<MediaType>().notNull().default("image"),
    videoUrl: text("video_url"), // mediaType=video 且自架時的 Blob URL
    youtubeId: text("youtube_id"), // mediaType=video 且嵌入時的 11 字元 ID
  },
  (t) => [
    // 照片不得帶影片欄位；影片必須「恰好」有一個來源（XOR）。
    // 少了這道，壞掉的方式是前台 <video src=""> 靜默不播，沒有人會回報。
    check(
      "gallery_photos_media_payload_check",
      sql`(${t.mediaType} = 'image' AND ${t.videoUrl} IS NULL AND ${t.youtubeId} IS NULL)
       OR (${t.mediaType} = 'video' AND ((${t.videoUrl} IS NOT NULL) <> (${t.youtubeId} IS NOT NULL)))`
    ),
  ]
);

// ============================================
// 影片（Videos）
// ============================================

// ⚠️ 已停用，沒有任何程式碼讀寫這張表。
//
// 原本設計成與相簿並行的獨立影片區，後來客戶確認影片要放在活動相簿裡，
// 影片改存 gallery_photos（mediaType='video'）。這張表保留不刪，理由與
// posts / categories / tags 相同：避免 drizzle 產生 DROP TABLE。
// 它目前是 0 筆資料的空表，不要往裡面寫東西。
export type VideoSource = "upload" | "youtube";

// source 決定 videoUrl / youtubeId 哪一個有值，兩者互斥。
//
// 這是全專案唯一有 CHECK constraint 的表，理由：videos 是全新的表，加約束
// 沒有任何既有資料風險；而「三選一互斥」如果只靠 server action 把關，一旦
// 有人改壞驗證邏輯，壞掉的方式是前台 <video src=""> 靜默不播——沒有人會回報。
// action 裡仍然要先驗（見 src/lib/actions/videos.ts），CHECK 只是最後一道，
// 不是第一道，否則管理員會看到 Postgres 的英文 23514 錯誤原文。
//
// published 預設 false：本專案的 .env.local 與 Vercel Production 共用同一個
// DATABASE_URL（見 README），本機測試寫進去的資料會直接出現在正式站上。
// 透過後台表單建立時 checkbox 仍預設勾選，所以管理員的操作體感不變；
// 這個預設值保護的是 seed script、手動 SQL 之類不經過表單的寫入路徑。
export const videos = pgTable(
  "videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    source: text("source").$type<VideoSource>().notNull().default("upload"),
    videoUrl: text("video_url"), // source=upload：Vercel Blob URL
    youtubeId: text("youtube_id"), // source=youtube：11 字元影片 ID
    posterImage: text("poster_image"),
    eventDate: text("event_date"),
    published: boolean("published").default(false).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    check(
      "videos_source_payload_check",
      sql`(${t.source} = 'upload' AND ${t.videoUrl} IS NOT NULL AND ${t.youtubeId} IS NULL)
       OR (${t.source} = 'youtube' AND ${t.youtubeId} IS NOT NULL AND ${t.videoUrl} IS NULL)`
    ),
  ]
);

export const pageSections = pgTable("page_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  pageSlug: varchar("page_slug", { length: 50 }).notNull(),
  sectionKey: varchar("section_key", { length: 50 }).notNull(),
  contentEn: text("content_en"),
  contentCn: text("content_cn"),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  postTags: many(postTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const galleryAlbumsRelations = relations(galleryAlbums, ({ many }) => ({
  photos: many(galleryPhotos),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({ one }) => ({
  album: one(galleryAlbums, {
    fields: [galleryPhotos.albumId],
    references: [galleryAlbums.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// NextAuth 所需的表
// ============================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
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

export const galleryPhotos = pgTable("gallery_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  albumId: uuid("album_id")
    .notNull()
    .references(() => galleryAlbums.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const pageSections = pgTable("page_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  pageSlug: varchar("page_slug", { length: 50 }).notNull(),
  sectionKey: varchar("section_key", { length: 50 }).notNull(),
  contentEn: text("content_en"),
  contentCn: text("content_cn"),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================
// 聯絡人
// ============================================

export const contactPersons = pgTable("contact_persons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
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

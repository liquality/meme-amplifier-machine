import {
  integer,
  pgSchema,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const appSchema = pgSchema("collective_frames")

export const user = appSchema.table("user", {
  id: serial("id").primaryKey(),
  fid: integer("fid").notNull().unique(),
  signerUuid: varchar("signer_uuid", { length: 256 }).notNull(),
  walletAddress: varchar("wallet_address", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collective = appSchema.table("collective", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  cAddress: varchar("c_address", { length: 256 }).notNull(),
  cwallet: varchar("c_wallet", { length: 256 }).notNull(),
  cPool: varchar("c_pool", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expiresAt")
});

export const frame = appSchema.table("frame", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  slug: varchar("slug", { length: 256 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
  metaDataUrl: varchar("metadata_url", { length: 256 }).notNull(),
  tokenId: integer("token_id").notNull(),
  tokenAddress: varchar("token_address", { length: 256 }).notNull(),
  collectiveId: integer("collective_id").references(() => collective.id),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});


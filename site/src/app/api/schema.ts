import { pgTable, real, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const userPrizes = pgTable("userPrizes", {
    id: serial(),
    userAddress: text().notNull(),
    userid: text().notNull().default(""),
    assetID: text().notNull(),
    amount: real().notNull(),
    paid: boolean().notNull().default(false),
    date: timestamp().notNull().defaultNow()
})
import { pgTable, real, serial, text, boolean } from "drizzle-orm/pg-core";

export const userPrizes = pgTable("userPrizes", {
    id: serial(),
    userAddress: text().notNull(),
    assetID: text().notNull(),
    amount: real().notNull(),
    paid: boolean().notNull().default(false)
})
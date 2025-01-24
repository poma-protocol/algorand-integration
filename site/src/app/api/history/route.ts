import { NextRequest } from "next/server";
import db from "../database";
import { userPrizes } from "../schema";
import {eq, desc, or} from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const paginationParams = req.nextUrl.searchParams;
        const page = Number.parseInt(paginationParams.get('page')!);
        const size = Number.parseInt(paginationParams.get('size')!);

        const prizes = await db.select({
            id: userPrizes.id,
            address: userPrizes.userAddress,
            amount: userPrizes.amount,
            assetID: userPrizes.assetID,
            userid: userPrizes.userid,
            date: userPrizes.date,
            deleted: userPrizes.deleted,
            paid: userPrizes.paid
        }).from(userPrizes)
            .where(
                or(
                    eq(userPrizes.deleted, true),
                    eq(userPrizes.paid, true)
                )
            )
            .offset((page - 1) * size)
            .limit(size)
            .orderBy(desc(userPrizes.date))

        const parsedPrizes = prizes.map((p) => {
            return {
                id: p.id,
                address: p.address,
                amount: p.amount,
                assetID: p.assetID === "ALGO" ? p.assetID : Number.parseInt(p.assetID),
                userid: p.userid,
                date: p.date,
                paid: p.paid,
                deleted: p.deleted
            }
        })

        return Response.json(parsedPrizes, { status: 200 });
    } catch (err) {
        console.log("Error Getting History =>", err);
        return Response.json({ error: ["Could Not Get History of Prizes"] }, { status: 500 });
    }
}
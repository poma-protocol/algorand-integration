import { eq, desc, and } from "drizzle-orm";
import db from "../database";
import { userPrizes } from "../schema";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Get prizes where paid is false
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
        }).from(userPrizes)
            .where(and(eq(userPrizes.paid, false), eq(userPrizes.deleted, false)))
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
                date: p.date
            }
        })

        return Response.json(parsedPrizes, { status: 200 });
    } catch (err) {
        console.log("Error Getting Prizes =>", err);
        return Response.json({ error: ["Could Not Get Unpaid Prizes"] }, { status: 500 });
    }
}
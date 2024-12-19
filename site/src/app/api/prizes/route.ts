import { eq } from "drizzle-orm";
import db from "../database";
import { userPrizes } from "../schema";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Get prizes where paid is false
        const paginationParams = req.nextUrl.searchParams;
        const page = Number.parseInt(paginationParams.get('page')!);
        const size = Number.parseInt(paginationParams.get('size')!);
        let prizes = await db.select({
            id: userPrizes.id,
            address: userPrizes.userAddress,
            amount: userPrizes.amount,
            assetID: userPrizes.assetID
        }).from(userPrizes)
        .where(eq(userPrizes.paid, false))
        .offset((page - 1) * size)
        .limit(size)
        return Response.json(prizes, {status: 200});
    } catch(err) {
        console.log("Error Getting Prizes =>", err);
        return Response.json({error: ["Could Not Get Unpaid Prizes"]}, {status: 500});
    }
}
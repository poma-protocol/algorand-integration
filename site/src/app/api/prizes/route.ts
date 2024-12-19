import { eq } from "drizzle-orm";
import db from "../database";
import { userPrizes } from "../schema";

export async function GET() {
    try {
        // Get prizes where paid is false
        let prizes = await db.select().from(userPrizes).where(eq(userPrizes.paid, false));
        return Response.json(prizes, {status: 200});
    } catch(err) {
        console.log("Error Getting Prizes =>", err);
        return Response.json({error: ["Could Not Get Unpaid Prizes"]}, {status: 500});
    }
}
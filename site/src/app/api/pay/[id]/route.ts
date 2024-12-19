import { eq } from "drizzle-orm";
import db from "../../database";
import { userPrizes } from "../../schema";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const prizeId = Number.parseInt((await params).id);
        
        // Update db
        await db.update(userPrizes).set({
            paid: true
        }).where(eq(userPrizes.id, prizeId));
        return Response.json({message: "Prize Marked As Paid"}, {status: 201});
    } catch(err) {
        console.log("Error Marking Prize As Paid =>", err);
        return Response.json({error: ["Could Not Mark Prize As Paid"]}, {status: 500});
    }
}
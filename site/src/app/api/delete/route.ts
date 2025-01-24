import { NextRequest } from "next/server";
import db from "../database";
import { userPrizes } from "../schema";
import {eq} from "drizzle-orm";

export async function DELETE(req: NextRequest) {
    try {
        const paginationParams = req.nextUrl.searchParams;
        const id = Number.parseInt(paginationParams.get('id')!);

        await db.update(userPrizes).set({
            deleted: true
        }).where(eq(userPrizes.id, id))

        return Response.json({message: "Deleted Succesfully"}, { status: 200 });
    } catch (err) {
        console.log("Error Getting History =>", err);
        return Response.json({ error: ["Could Not Get History of Prizes"] }, { status: 500 });
    }
}
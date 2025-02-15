import { doesAccountExist, getAssetDetails, hasAccountOptedIn } from "@/utils/get-asset-details";
import {z} from "zod";
import algodClient from "../algodClient";
import db from "../database";
import { userPrizes } from "../schema";
const completionSchema = z.object({
    userAddress: z.string({message: "User Address Should Be A String"}),
    asset: z.union([z.literal("ALGO"), z.number()], {message: "Invalid Asset"}),
    amount: z.number({message: "Amount Should Be A Number"}).gt(0, "Amount Should Be Greater Than Zero"),
    userID: z.string({message: "User ID should be a string"})
});


export async function POST(req: Request) {
    try {
        const parsed = completionSchema.safeParse(await req.json());
        if (parsed.success) {
            const data = parsed.data
            // Verify that address exists
            const accountExist = await doesAccountExist(data.userAddress, algodClient);
            if (!accountExist) {
                return Response.json({error: ["User Account Does Not Exist"]}, {status: 400});
            }

            
            if (typeof(data.asset) === "number") {
                // Verify that asset exists
                try {
                    await getAssetDetails(algodClient, data.asset);
                } catch(err) {
                    console.log("Error =>", err);
                    return Response.json({error: ["Asset Does Not Exist"]}, {status: 400});
                }

                // Verify that address has opted in
                const accountOptIn = await hasAccountOptedIn(algodClient, data.userAddress, data.asset);
                if (!accountOptIn) {
                    return Response.json({error: ["User Has Not Opted In To Asset"]}, {status: 400});
                }
            }

            // Store details
            await db.insert(userPrizes)
                .values({
                    userAddress: data.userAddress,
                    assetID: data.asset.toString(),
                    amount: data.amount,
                    userid: data.userID,
                    paid: false
                });

            return Response.json({message: "Activity Prize Stored"}, {status: 201})
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            return Response.json({error: errors}, {status: 400})
        }
    } catch(err) {
        console.log("Error Storing Complete Activity =>", err);
        return Response.json({error: ["Could Not Mark Activity As Complete"]}, {status: 500});
    }
}
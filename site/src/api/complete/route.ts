import {z} from "zod";
const completionSchema = z.object({
    userAddress: z.string({message: "User Address Should Be A String"}),
    asset: z.union([z.literal("ALGO"), z.number()], {message: "Invalid Asset"}),
    amount: z.number({message: "Amount Should Be A Number"}).gt(0, "Amount Should Be Greater Than Zero")
})
export async function POST(req: Request) {
    try {
        // Store details in db
        const parsed = completionSchema.safeParse(req.json());
        if (parsed.success) {
            
        } else {
            let errors = parsed.error.issues.map((i) => i.message);
            return Response.json({error: errors}, {status: 400})
        }
    } catch(err) {
        console.log("Error Storing Complete Activity =>", err);
        return Response.json({error: ["Could Not Mark Activity As Complete"]}, {status: 500});
    }
}
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const prizeId = Number.parseInt((await params).id);
        

        return Response.json({message: "Prize Marked As Paid"}, {status: 201});
    } catch(err) {
        console.log("Error Marking Prize As Paid =>", err);
        return Response.json({error: ["Could Not Mark Prize As Paid"]}, {status: 500});
    }
}
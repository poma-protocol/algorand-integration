"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
const formSchema = z.object({
    assetID: z.number({message: "Asset ID must be a number"}),
    amount: z.number({message: "Amount Must Be a number"}).gt(0, {message: "Amount Must Be Greater Than 0"})
})
type SendToTreasuryType = z.infer<typeof formSchema>

export default function SendToTreasury() {
    const form = useForm<SendToTreasuryType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0
        }
    });

    function onSubmit(values: SendToTreasuryType) {
        // Check if smart contract has opted in

        // If not opt in

        // Send funds
        console.log(values);
    }
    
    return <div>

    </div>
}
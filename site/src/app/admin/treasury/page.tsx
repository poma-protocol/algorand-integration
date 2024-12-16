"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@txnlab/use-wallet";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WalletPopover } from "@/components/walletPopover";
import { truncateAddress } from "@/utils/truncateAddress";
import AssetInfo from "./asset-info";
import { useState } from "react";
import { hasContractOptedIn } from "@/utils/get-asset-details";
import algosdk from "algosdk";
import { algodClient, contract } from "@/utils/algod-client";
const formSchema = z.object({
    assetID: z.number({ message: "Asset ID must be a number" }),
    amount: z.number({ message: "Amount Must Be a number" }).gt(0, { message: "Amount Must Be Greater Than 0" })
})
type SendToTreasuryType = z.infer<typeof formSchema>

export default function SendToTreasury() {
    const { activeAddress, signTransactions, sendTransactions } = useWallet();
    const [assetID, setAssetID] = useState<string>("");
    const form = useForm<SendToTreasuryType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0
        }
    });

    async function onSubmit(values: SendToTreasuryType) {
        // Check if smart contract has opted in
        let optedIn = await hasContractOptedIn(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, values.assetID);

        // If not opt in
        if (!optedIn) {
            // Send funds
            const suggestedParams = await algodClient.getTransactionParams().do();
            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                amount: values.amount,
                from: activeAddress!,
                to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                assetIndex: values.assetID
            });

            let signedTransactions = await signTransactions([txn.toByte()]);
            await sendTransactions(signedTransactions, 4);
            console.log("Done!");
        }
    }

    return <div>
        {activeAddress
            ? <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 m-auto">
                    <div className="flex flex-col gap-y-1">
                        <FormField
                            control={form.control}
                            name="assetID"
                            render={({ field }) =>
                                <FormItem>
                                    <FormLabel>Asset ID</FormLabel>
                                    <FormControl>
                                        <Input onChange={e => setAssetID(e.currentTarget.value)} value={assetID}/>
                                    </FormControl>
                                    <AssetInfo assetID={Number.parseInt(assetID)} />
                                    <FormDescription>
                                        The ID of the asset on Algorand
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            }
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) =>
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The amount of the asset to send
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            }
                        />
                    </div>
                    <div className="mt-4 flex flex-row justify-center">
                        <Button type="submit" >Send</Button>
                    </div>
                </form>
            </Form>
            : <WalletPopover side="bottom" align="start" sideOffset={40}>
                <div className="flex flex-col items-center gap-y-4">
                    <p>Connect Wallet to Send Asset To Treasury</p>
                    <Button variant={"outline"} type="button">
                        {activeAddress ? truncateAddress(activeAddress) : "connect wallet"}
                    </Button>
                </div>
            </WalletPopover>}
    </div>

    return
}
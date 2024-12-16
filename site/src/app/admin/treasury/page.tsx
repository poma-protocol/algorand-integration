"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@txnlab/use-wallet-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WalletPopover } from "@/components/walletPopover";
import { truncateAddress } from "@/utils/truncateAddress";
import algosdk from "algosdk";
import { hasContractOptedIn } from "@/utils/get-asset-details";
import { contract } from "@/utils/algod-client";
// const formSchema = z.object({
//     assetID: z.number({ message: "Asset ID must be a number" }),
//     amount: z.number({ message: "Amount Must Be a number" }).gt(0, { message: "Amount Must Be Greater Than 0" })
// })
const formSchema = z.object({
    assetID: z.string(),
    amount: z.string()
})
type SendToTreasuryType = z.infer<typeof formSchema>

export default function SendToTreasury() {
    const { activeAddress, algodClient, transactionSigner } = useWallet();
    const form = useForm<SendToTreasuryType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            assetID: ""
        }
    });

    async function onSubmit(values: SendToTreasuryType) {
        const amount = Number.parseInt(values.amount);
        const assetID = Number.parseInt(values.assetID);

        try {
            const suggestedParams = await algodClient.getTransactionParams().do();
            const atc = new algosdk.AtomicTransactionComposer();

            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                from: activeAddress!,
                to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                amount: amount,
                assetIndex: assetID
            });

            let isOptedIn = await hasContractOptedIn(algodClient, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, assetID);
            if (!isOptedIn) {
                // Opt in
                atc.addMethodCall({
                    appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                    method: contract.getMethodByName("opt_in"),
                    methodArgs: [
                        assetID
                    ],
                    appForeignAssets: [assetID],
                    sender: activeAddress!,
                    signer: transactionSigner,
                    suggestedParams
                })
            }

            // Call transaction
            atc.addTransaction({ txn, signer: transactionSigner });
            await atc.execute(algodClient, 4);
            console.log("Done");
        } catch (err) {
            console.log("Error Submitting Transaction =>", err);
            throw new Error("Could Not Send Asset To Treasury")
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
                                        <Input type="number" {...field} />
                                    </FormControl>
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
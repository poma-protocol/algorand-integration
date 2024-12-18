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
import { getAssetDetails, hasContractOptedIn } from "@/utils/get-asset-details";
import { contract } from "@/utils/algod-client";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
// const formSchema = z.object({
//     assetID: z.number({ message: "Asset ID must be a number" }),
//     amount: z.number({ message: "Amount Must Be a number" }).gt(0, { message: "Amount Must Be Greater Than 0" })
// })
const formSchema = z.object({
    assetID: z.string(),
    amount: z.string()
})
type SendToTreasuryType = z.infer<typeof formSchema>

export default function FundTreasury() {
    const { activeAddress, algodClient, transactionSigner, signTransactions } = useWallet();
    const [sendAlgo, setSendAlgo] = useState(false);
    const form = useForm<SendToTreasuryType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            assetID: ""
        }
    });

    async function onSubmit(values: SendToTreasuryType) {
        const amount = Number.parseFloat(values.amount);
        const assetID = Number.parseInt(values.assetID);

        try {
            if (sendAlgo) {
                const suggestedParams = await algodClient.getTransactionParams().do();
                const atc = new algosdk.AtomicTransactionComposer();

                const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams,
                    from: activeAddress!,
                    to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                    amount: algosdk.algosToMicroalgos(amount)
                });

                atc.addTransaction({ txn: payTxn, signer: transactionSigner });
                await atc.execute(algodClient, 4);
            } else {
                // Get details of asset
                const assetInfo = await getAssetDetails(algodClient, assetID);
                const assetAmount = amount * (10 ** assetInfo.decimals);

                const suggestedParams = await algodClient.getTransactionParams().do();
                suggestedParams.fee = 4 * suggestedParams.fee
                const atc = new algosdk.AtomicTransactionComposer();

                const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    suggestedParams,
                    from: activeAddress!,
                    to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                    amount: assetAmount,
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
            }
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
                        <div className="flex flex-row gap-2 items-center">
                            <Checkbox 
                                id="algo" 
                                checked={sendAlgo}
                                onCheckedChange={() => setSendAlgo(!sendAlgo)}
                            />
                            <label
                                htmlFor="algo"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Send ALGO
                            </label>
                        </div>
                        {sendAlgo
                            ? <div></div>
                            : <FormField
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
                            />}
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
                                        {sendAlgo ? "The amount of the ALGO to send" : "The amount of the asset to send"}
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
}
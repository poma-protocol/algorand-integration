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
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { algodClient } from "@/utils/smartcontract/algoClient";

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
    const {toast} = useToast();
    const [balance, setBalance] = useState(0);
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    useEffect(() => {
        async function checkBalance() {
            const balance = await algodClient.accountInformation(CONTRACT_ADDRESS).do();
            console.log("Balance", balance);
            setBalance(balance?.amount/1000_000)
        }
        checkBalance();
    }, [CONTRACT_ADDRESS])
    const form = useForm<SendToTreasuryType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            assetID: ""
        }
    });

    function displayError(message: string) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: message
        });
    }

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
                    to: CONTRACT_ADDRESS,
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
                    to: CONTRACT_ADDRESS,
                    amount: assetAmount,
                    assetIndex: assetID
                });

                let isOptedIn = await hasContractOptedIn(algodClient, CONTRACT_ADDRESS, assetID);
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

            toast({
                title: "Success",
                description: "Funds successfully sent"
            });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes("overspend")) {
                    displayError("Insufficient Funds");
                } else if (err.message === "Could Not Get Asset Details") {
                    displayError("Asset Does Not Exist")
                }
                else {
                    console.log("Error =>", err);
                    displayError("Something Went Wrong");
                }
            } else {
                console.log("Error Submitting Transaction =>", err);
                displayError("Something Went Wrong");
            }
        }
    }

    return <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
        <div className="flex mx-auto justify-center items-center gap-x-2 mb-4">
           <p className="text-3xl font-semibold">{balance}</p>
            <div>

                <Image src="/assets/images/algorand-logo.png" width={20} height={20} alt="Algorand logo" />
            </div>
        </div>
        {activeAddress
            ? <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="mt-4 flex flex-row justify-center w-full">
                        <Button type="submit" className="w-full">Send</Button>
                    </div>
                </form>
            </Form>
            : <WalletPopover side="bottom" align="start" sideOffset={40}>
                <div className="flex flex-col items-center gap-y-4">
                    <p>Connect Wallet to Send Asset To Treasury</p>
                    <Button variant={"outline"} type="button" className="w-full">
                        {activeAddress ? truncateAddress(activeAddress) : "connect wallet"}
                    </Button>
                </div>
            </WalletPopover>}
    </div>
}
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { contract } from "@/utils/algod-client";
import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";
const formSchema = z.object({
    tokenType: z.string(),
    assetId: z.number().optional(),
    userAddress: z.string().min(1, "User Address is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
});

export default function SendRewards() {
    const [tokenType, setTokenType] = useState("algo"); // Default to "algo"
    const { activeAddress, algodClient, transactionSigner, signTransactions } = useWallet();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenType: "algo",
            userAddress: "",
            amount: 0,
            assetId: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Active Address", activeAddress);

        try {
            if (values.tokenType === "custom") {
                console.log("Sending custom token");
                if (values.assetId) {
                    // Send custom token
                    const suggestedParams = await algodClient.getTransactionParams().do();
                    const atc = new algosdk.AtomicTransactionComposer();
                    atc.addMethodCall({
                        appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                        method: contract.getMethodByName("send_reward"),
                        methodArgs: [
                            values.amount,
                            values.userAddress,
                            values.assetId
                        ],
                        appForeignAssets: [values.assetId],
                        sender: activeAddress!,
                        signer: transactionSigner,
                        suggestedParams
                    })
                    console.log(atc);
                    const result = await atc.execute(algodClient, 4)

                    console.info(`[App] ✅ Successfully sent transaction!`, {
                        confirmedRound: result.confirmedRound,
                        txIDs: result.txIDs
                    })
                    toast.success("Rewards sent successfully");
                    console.log("Done");
                    return
                }

            }
            else {
                console.log("Sending algo");
                // Send ALGO token
                const suggestedParams = await algodClient.getTransactionParams().do();
                const atc = new algosdk.AtomicTransactionComposer();
                atc.addMethodCall({
                    appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                    method: contract.getMethodByName("send_algo_reward"),
                    methodArgs: [
                        values.amount,
                        values.userAddress
                    ],
                    sender: activeAddress!,
                    signer: transactionSigner,
                    suggestedParams
                })

                const result = await atc.execute(algodClient, 4)

                console.info(`[App] ✅ Successfully sent transaction!`, {
                    confirmedRound: result.confirmedRound,
                    txIDs: result.txIDs
                })
                console.log("Done");
                toast.success("Rewards sent successfully");
                return
            }

        }
        catch (error) {
            toast.error("Error sending rewards");
            console.log("Error", error);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 text-center">Send Rewards</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Token Type Selection */}
                    <FormField
                        control={form.control}
                        name="tokenType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Token Type</FormLabel>
                                <FormControl>
                                    <Select
                                        value={tokenType}
                                        onValueChange={(value) => {
                                            setTokenType(value);
                                            field.onChange(value);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Token Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="algo">Send ALGO Token</SelectItem>
                                            <SelectItem value="custom">Send Custom Token</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Asset ID (conditionally rendered) */}
                    {tokenType === "custom" && (
                        <FormField
                            control={form.control}
                            name="assetId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asset ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter Asset ID"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The asset ID of the token you want to send.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* User Address */}
                    <FormField
                        control={form.control}
                        name="userAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="0x..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    The address of the user you want to send the token to.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter Amount"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The amount of the token you want to send.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );

}

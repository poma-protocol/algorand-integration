"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import smartContract from "@/utils/smartcontract";
const formSchema = z.object({
    tokenType: z.string(),
    assetId: z.number().optional(),
    userAddress: z.string().min(1, "User Address is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
});

export default function SendRewards() {
    const [tokenType, setTokenType] = useState("algo"); // Default to "algo"

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenType: "algo",
            userAddress: "",
            amount: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.tokenType === "custom") {
            if (values.assetId) {
                // Send custom token
                await smartContract.sendReward({
                    amount: values.amount,
                    receiver: values.userAddress,
                    assetId: values.assetId
                });
            }
        }
        else {
            // Send ALGO token
            await smartContract.sendReward({
                amount: values.amount,
                receiver: values.userAddress,
                assetId: 0
            });


        }
    }

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
            {/* <h2 className="text-xl font-semibold mb-4 text-center">Send Rewards</h2> */}
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

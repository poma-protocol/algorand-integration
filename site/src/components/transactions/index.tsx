"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { truncateAddress } from "@/utils/truncateAddress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoCopy } from "react-icons/go";
import { SiAlgorand } from "react-icons/si";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { contract } from "@/utils/algod-client";
import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";
interface Transaction {
    id: number;
    address: string;
    amount: number;
    assetId: number | "ALGO";
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 1,
            address: "33LA66XTH5NLQVLNZG34ULGV4GAFV3ZCN6PZ4NWCVUC73PNMLF5KODY7UE",
            amount: 1,
            assetId: "ALGO",
        },
        {
            id: 2,
            address: "33LA66XTH5NLQVLNZG34ULGV4GAFV3ZCN6PZ4NWCVUC73PNMLF5KODY7UE",
            amount: 1,
            assetId: 100,
        },
    ]);
    const { activeAddress, algodClient, transactionSigner } = useWallet();


    useEffect(() => {
        // Mock API call
        const fetchTransactions = async () => {
            const response = await fetch("/api/transactions"); // Replace with your API endpoint
            const data = await response.json();
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    async function handlePay(values: { tokenType: number | "ALGO", address: string, amount: number, id: number }) {
        if (!activeAddress) {
            toast.error("Please connect your wallet");
            return;
        }
        try {
            if (typeof values.tokenType === "number") {
                console.log("Sending custom token");

                // Send custom token
                const suggestedParams = await algodClient.getTransactionParams().do();
                const atc = new algosdk.AtomicTransactionComposer();
                atc.addMethodCall({
                    appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                    method: contract.getMethodByName("send_reward"),
                    methodArgs: [
                        values.amount,
                        values.address,
                        values.tokenType
                    ],
                    appForeignAssets: [values.tokenType],
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
            else if (values.tokenType === "ALGO") {
                console.log("Sending algo");
                // Send ALGO token
                const suggestedParams = await algodClient.getTransactionParams().do();
                const atc = new algosdk.AtomicTransactionComposer();
                atc.addMethodCall({
                    appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                    method: contract.getMethodByName("send_algo_reward"),
                    methodArgs: [
                        values.amount * 1000000,
                        values.address
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
            else {
                toast.error("Invalid token type");
                return;
            }

        }
        catch (error) {
            toast.error("Error sending rewards");
            console.log("Error", error);
        }
    }

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        toast.success("Copied!");
    };

    return (
        <Table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <TableCaption className="text-gray-500">
                A list of your recent transactions.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">Wallet Address</TableHead>
                    <TableHead className="text-left">Asset Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Mark as Paid</TableHead>
                    <TableHead className="text-center">Copy address</TableHead>
                    <TableHead className="text-center">Pay</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-left">
                            {truncateAddress(tx.address)}
                        </TableCell>
                        <TableCell className="text-left">{tx.assetId}</TableCell>
                        <TableCell className="text-right flex items-center justify-center">
                            {tx.amount} {tx.assetId === "ALGO" ? <SiAlgorand className="ml-2" /> : tx.assetId}
                        </TableCell>
                        <TableCell className="text-center">
                            <Checkbox id={`checkbox-${tx.id}`} />
                        </TableCell>
                        <TableCell className="text-center">
                            <Button variant="outline" size="icon" onClick={() => handleCopy(tx.address)}>
                                <GoCopy />
                            </Button>
                        </TableCell>
                        <TableCell className="text-center">
                            <Button
                                variant="secondary"
                                onClick={() => handlePay({ tokenType: tx.assetId, address: tx.address, amount: tx.amount, id: tx.id })}
                            >
                                Pay
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

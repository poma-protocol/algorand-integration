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
import axios from "axios";
import { getAssetDetails } from "@/utils/get-asset-details";
interface Transaction {
    id: number;
    address: string;
    amount: number;
    assetID: number | "ALGO";
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { activeAddress, algodClient, transactionSigner } = useWallet();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Adjust page size as needed
    const [isLoading, setIsLoading] = useState(false);


    // Fetch transactions with pagination
    const fetchTransactions = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/prizes?page=${page}&size=${pageSize}`)
            const data = await response.data;
            if (response.status === 200 || response.status === 201) {
                setTransactions(data)
            }
            else {
                console.log("Error occured", data);
            }
        } catch (error) {
            toast.error("Failed to fetch transactions");
            console.log("Error occured", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);
    // Mark a transaction as paid
    const handleMarkAsPaid = async (id: number) => {
        try {
           
            const response = await axios.post(`/api/pay/${id}`);
            if (response.status === 200 || response.status === 201) {
                toast.success("Marked as paid!");
            }
            else {
                toast.error("Failed to mark as paid");
                return;
            }
            setTransactions((prev) =>
                prev.map((tx) =>
                    tx.id === id ? { ...tx, paid: true } : tx
                )
            );
        } catch (error) {
            toast.error("Failed to mark as paid");
        }
    };

    async function handlePay(values: {
        tokenType: number | "ALGO", address: string, amount: number, id: number
    }) {
        if (!activeAddress) {
            toast.error("Please connect your wallet");
            return;
        }
        try {
            if (typeof values.tokenType === "number") {
                console.log("Sending custom token");

                // Send custom token
                const assetInfo = await getAssetDetails(algodClient, values.tokenType);
                const assetAmount = values.amount * (10 ** assetInfo.decimals);
                const suggestedParams = await algodClient.getTransactionParams().do();
                const atc = new algosdk.AtomicTransactionComposer();
                atc.addMethodCall({
                    appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                    method: contract.getMethodByName("send_reward"),
                    methodArgs: [
                        assetAmount,
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
                handleMarkAsPaid(values.id);
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
                handleMarkAsPaid(values.id);
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
    // Pagination handlers
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


    return (
        <div className="space-y-4">
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
                            <TableCell className="text-left">{tx.assetID}</TableCell>
                            <TableCell className="text-right flex items-center justify-center">
                                {tx.amount} {tx.assetID === "ALGO" && <SiAlgorand className="ml-2" />}
                            </TableCell>
                            <TableCell className="text-center">
                                <Checkbox id={`checkbox-${tx.id}`} onClick={() => handleMarkAsPaid(tx.id)} />
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" size="icon" onClick={() => handleCopy(tx.address)}>
                                    <GoCopy />
                                </Button>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePay({
                                        tokenType: tx.assetID, address: tx.address, amount: tx.amount, id: tx.id
                                    })}
                                >
                                    Pay
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || isLoading}
                >
                    Previous
                </Button>
                <span>Page {currentPage}</span>
                <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={transactions.length < pageSize || isLoading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
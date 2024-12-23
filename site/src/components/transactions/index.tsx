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
import Image from "next/image";
interface Transaction {
    id: number;
    address: string;
    amount: number;
    assetId: number | "ALGO";
    paid?: boolean; // New field for tracking payment status
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Adjust page size as needed
    const [isLoading, setIsLoading] = useState(false);

    // Fetch transactions with pagination
    const fetchTransactions = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://algorand.pomaprotocol.com/api/prizes?page=${page}&size=${pageSize}`);
            const data = await response.json();
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
            await fetch(`http://algorand.pomaprotocol.com/api/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prizeId: id }),
            });
            setTransactions((prev) =>
                prev.map((tx) =>
                    tx.id === id ? { ...tx, paid: true } : tx
                )
            );
            toast.success("Marked as paid!");
        } catch (error) {
            toast.error("Failed to mark as paid");
        }
    };

    // Copy wallet address
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
                        <TableHead className="text-center">Copy Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Loading transactions...
                            </TableCell>
                        </TableRow>
                    ) : transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                <div className="flex justify-center items-center">
                                    <Image src="/assets/images/empty-transactions.png"
                                    alt="Empty transactions image"
                                    height={200}
                                    width={200}
                                    
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((tx) => (
                            <TableRow
                                key={tx.id}
                                className={`hover:bg-gray-50 ${tx.paid ? "bg-green-50" : ""}`}
                            >
                                <TableCell className="font-medium text-left">
                                    {truncateAddress(tx.address)}
                                </TableCell>
                                <TableCell className="text-left">{tx.assetId}</TableCell>
                                <TableCell className="text-right flex items-center justify-end">
                                    {tx.amount} {tx.assetId === "ALGO" ? <SiAlgorand className="ml-2" /> : tx.assetId}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox
                                        id={`checkbox-${tx.id}`}
                                        checked={tx.paid}
                                        onChange={() => handleMarkAsPaid(tx.id)}
                                        disabled={tx.paid}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCopy(tx.address)}
                                    >
                                        <GoCopy />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
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

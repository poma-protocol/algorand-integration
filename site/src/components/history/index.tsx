"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";
interface Transaction {
    id: number;
    address: string;
    amount: number;
    assetID: number | "ALGO";
    userid: string;
    date: string;
    paid: boolean;
    deleted: boolean;
}

export default function History() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Adjust page size as needed
    const [isLoading, setIsLoading] = useState(false);
    const [success] = useState(false); // State to track success

    useEffect(() => {
        // Fetch transactions with pagination
        const fetchTransactions = async (page: number) => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/history?page=${page}&size=${pageSize}`)
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

        fetchTransactions(currentPage);
    }, [currentPage, success, pageSize]);
    // Mark a transaction as paid

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        toast.success("Copied!");
    };
    // Pagination handlers
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    function truncateDate(isoDate: string) {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    return (
        <div className="space-y-4">
            <Table className="w-full border border-gray-200 rounded-lg shadow-sm">
                <TableCaption className="text-gray-500">
                    A list of your recent transactions.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">ID</TableHead>
                        <TableHead className="text-left">Date</TableHead>
                        <TableHead className="text-left">Time</TableHead>
                        <TableHead className="text-left">Wallet Address</TableHead>
                        <TableHead className="text-left">Asset Type</TableHead>
                        <TableHead className="text-left">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-center">Copy address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-gray-50">
                            <TableCell className="text-left">
                                {tx.id}

                            </TableCell>
                            <TableCell className="text-left">
                                {truncateDate(tx.date)}
                            </TableCell>
                            <TableCell className="text-left">
                                {new Date(tx.date).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="font-medium text-left">
                                {truncateAddress(tx.address)}
                            </TableCell>
                            <TableCell className="text-left">{tx.assetID}</TableCell>
                            <TableCell className="text-left flex items-center justify-start">
                                {tx.amount} {tx.assetID === "ALGO" && <SiAlgorand className="ml-2" />}
                            </TableCell>
                            <TableCell className="text-right">
                                {tx.paid ? "PAID" : tx.deleted ? "DELETED" : "PENDING"}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" size="icon" onClick={() => handleCopy(tx.address)}>
                                    <GoCopy />
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
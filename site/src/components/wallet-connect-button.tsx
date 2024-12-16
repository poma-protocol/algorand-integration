"use client"
import { useWallet } from "@txnlab/use-wallet-react";
import { Button } from "./ui/button";
import WalletPopover from "./wallet-popover";
import { truncateAddress } from "@/utils/truncateAddress";

export default function WalletConnectButton() {
    const {activeAddress} = useWallet();
    return (
        <WalletPopover side="bottom" align="start" sideOffset={40}>
            <Button variant={"outline"} type="button">
                {activeAddress ? truncateAddress(activeAddress) : "connect wallet"}
            </Button>
        </WalletPopover>
    );
}
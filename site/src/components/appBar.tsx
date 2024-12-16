"use client";
import { useWallet } from "@txnlab/use-wallet-react";
import { Button } from "./ui/button";
import WalletPopover from "./wallet-popover";
import { truncateAddress } from "@/utils/truncateAddress";
import WalletConnectButton from "./wallet-connect-button";


export const AppBar = () => {
  const {activeAddress} = useWallet();
  return (
    <div className="flex items-center mr-14  py-3  mx-auto justify-end w-11/12">
      <WalletConnectButton />
    </div>
  );
};
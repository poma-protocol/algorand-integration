"use client";
import WalletConnectButton from "./wallet-connect-button";
import WalletPopover from "./wallet-popover";

export const AppBar = () => {
  return (
    <div className="flex items-center mr-14  py-3  mx-auto justify-end w-11/12">
      <WalletPopover side="bottom" align="start" sideOffset={40}>
        <WalletConnectButton />
      </WalletPopover>
    </div>
  );
};
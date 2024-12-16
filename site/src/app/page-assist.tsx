"use client";
import { useWallet } from "@txnlab/use-wallet-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function PageAssist() {
  const { wallets, activeAccount } = useWallet();
  return (
    <div className="flex flex-col gap-8">
      {wallets?.map((provider, i) => (
        <div key={i}>
          <h4 className="flex font-semibold items-center py-4 gap-x-2">
            <Image
              width={30}
              height={30}
              alt={`${provider.metadata.name} icon`}
              src={provider.metadata.icon}
            />
            {provider.metadata.name} {provider.isActive && "[active]"}
          </h4>

          <div className="gap-x-4 flex my-1">
            <Button
              size="sm"
              type="button"
              onClick={provider.connect}
              disabled={provider.isConnected}
            >
              Connect
            </Button>
            <Button
              size="sm"
              type="button"
              onClick={provider.disconnect}
              disabled={!provider.isConnected}
            >
              Disconnect
            </Button>

            <div className="hidden">
              {provider.isActive && provider.accounts.length && (
                <select
                  value={activeAccount?.address}
                  onChange={(e) => provider.setActiveAccount(e.target.value)}
                  title="Select an account"
                >
                  {provider.accounts.map((account) => (
                    <option key={account.address} value={account.address}>
                      {account.address}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
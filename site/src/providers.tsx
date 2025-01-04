'use client'
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'

const walletManager = new WalletManager({
    wallets: [
        WalletId.DEFLY,
        WalletId.PERA,
        WalletId.KIBISIS,
        {
            id: WalletId.WALLETCONNECT,
            options: { projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID! }
        }
    ],
    network: NetworkId.MAINNET
})

export function Providers({ children }: { children: React.ReactNode }) {
    return <WalletProvider manager={walletManager}>{children}</WalletProvider>
}

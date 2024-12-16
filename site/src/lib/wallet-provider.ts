import { NetworkId, WalletId, WalletManager } from '@txnlab/use-wallet-react'

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
  network: NetworkId.TESTNET
})
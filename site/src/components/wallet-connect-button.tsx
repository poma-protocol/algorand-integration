import { useWallet } from '@txnlab/use-wallet-react'
import { Button } from './ui/button';
import { truncateAddress } from '@/utils/truncateAddress';

export default function WalletConnectButton() {
  const {activeAddress} = useWallet();
  
  return (
    <Button variant={"outline"} type="button">
      {activeAddress ? truncateAddress(activeAddress) : "connect wallet"}
    </Button>
  );
}
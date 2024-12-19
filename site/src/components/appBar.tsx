"use client";
import WalletConnectButton from "./wallet-connect-button";
import Link from "next/link";
import Image from "next/image";

export const AppBar = () => {
  return (
    <div className="flex items-center py-5  justify-between w-screen shadow-md">
        <div className= "flex items-center  justify-around w-1/2 text-lg ">
                <div>
                    <Image src="/assets/images/clear-logo.png" width={100} height={50} alt="Poma logo" />
                </div>
                <Link href="https://pomaprotocol.com/search/1508488904037x864166748244315400" target="_blank" rel="noopener noreferrer">
                    <p>Activities</p>
                </Link>
                <Link href="https://pomaprotocol.com/how_it_works" target="_blank" rel="noopener noreferrer">
                    <p>How it Works</p>
                </Link>
                <Link href="https://pomaprotocol.com/about" target="_blank" rel="noopener noreferrer">
                    <p>About Us</p>
                </Link>

            </div>
      <WalletConnectButton />
    </div>
  );
};
"use client";
import { FiSend } from "react-icons/fi";
import { PiWalletBold } from "react-icons/pi";
import { MdSavings } from "react-icons/md";
import SendRewards from "../send-rewards";
import Treasury from "../treasury";
import { useState } from "react";
import FundTreasury from "../fund-treasury";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [activePage, setActivePage] = useState("Treasury Wallet");

    const Menus = [
        { title: "Treasury Wallet", Icon: PiWalletBold },
        { title: "Send Rewards", Icon: FiSend },
        // { title: "Fund Treasury", Icon: MdSavings, gap: true },
    ];

    const renderContent = () => {
        switch (activePage) {
            case "Treasury Wallet":
                return <FundTreasury />;
            case "Send Rewards":
                return <SendRewards />;
            
            default:
                return <FundTreasury />;
        }
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div
                className={`${
                    open ? "w-72" : "w-20"
                } bg-white border-r border-black p-5 pt-8 relative duration-300`}
            >
                <div className="flex gap-x-4 items-center">
                    <h1
                        className={`text-black origin-left font-medium text-xl duration-200 ${
                            !open && "scale-0"
                        }`}
                    >
                        Sidebar
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            onClick={() => setActivePage(Menu.title)}
                            className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-200 text-black text-sm items-center gap-x-4 mt-2  ${activePage === Menu.title ? "bg-gray-300" : ""}`}
                        >
                            <Menu.Icon size={20} />
                            <span
                                className={`${
                                    !open && "hidden"
                                } origin-left duration-200`}
                            >
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-5">
                <h2 className="text-2xl font-semibold mb-4 text-center">{activePage}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default Sidebar;

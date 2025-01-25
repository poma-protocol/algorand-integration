"use client";
import { FiSend } from "react-icons/fi";
import { PiWalletBold } from "react-icons/pi";
import SendRewards from "../send-rewards";
import Transactions from "../transactions";
import { useState } from "react";
import FundTreasury from "../fund-treasury";
import { GrTransaction } from "react-icons/gr";
import { MdHistory } from "react-icons/md";
import History from "../history";

const Sidebar = () => {
    const [activePage, setActivePage] = useState("Treasury Wallet");

    const Menus = [
        { title: "Treasury Wallet", Icon: PiWalletBold },
        { title: "Send Rewards", Icon: FiSend },
        { title: "Pending", Icon: GrTransaction, gap: true },
        { title: "History", Icon: MdHistory }
    ];

    const renderContent = () => {
        switch (activePage) {
            case "Treasury Wallet":
                return <FundTreasury />;
            case "Send Rewards":
                return <SendRewards />;
            case "Pending":
                return <Transactions />;
            case "History":
                return <History />;
            default:
                return <FundTreasury />;
        }
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div
                className={`${true ? "w-72" : "w-20"
                    } border-r border-black p-5 pt-8 relative duration-300`}
            >
                <div className="flex gap-x-4 items-center">
                    <h1
                        className={`text-black origin-left font-medium text-xl duration-200 ${!true && "scale-0"
                            }`}
                    >

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
                                className={`${!true && "hidden"
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

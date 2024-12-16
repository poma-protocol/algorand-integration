"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ElementRef, useRef } from "react";
import PageAssist from "@/app/page-assist";
interface WalletPopoverProps {
    align?: "start" | "center" | "end";
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}

export default function WalletPopover(props: WalletPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>{props.children}</PopoverTrigger>
            <PopoverContent
                align={props.align}
                side={props.side}
                sideOffset={props.sideOffset}
                className=" w-96 pt-3"
            >
                <PageAssist />
            </PopoverContent>
        </Popover>
    );
}
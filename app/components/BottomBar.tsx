"use client"
import Link from "next/link";
import { FunctionComponent, ReactElement } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import { usePathname } from "next/navigation";

interface BottomBarProps {

}

const BottomBar: FunctionComponent<BottomBarProps> = (): ReactElement => {
    const pathname = usePathname();

    const links = [
        {
            title: "Refer",
            icon: images.buffies,
            href: "/referral"
        },
        {
            title: "Task",
            icon: images.buffies,
            href: "/referral"
        },
        {
            title: "Tap",
            icon: images.clicker,
            href: "/"
        },
        {
            title: "Boost",
            icon: images.buffies,
            href: "/referral"
        },
        {
            title: "Stats",
            icon: images.buffies,
            href: "/referral"
        }
    ]

    return (
        <footer className="fixed bottom-4 bg-white/10 text-white rounded-xl p-2 flex flow-row gap-1 w-[calc(100vw_-_48px)] justify-between z-20">
            {
                links.map((link, index) => (
                    <Link key={index} href={link.href} className={`flex flex-col items-center rounded-lg p-2 w-full text-xs font-semibold ${pathname == link.href ? "bg-white/20 border-[1px] border-orange-400 shadow-inner" : ""}`}>
                        <span className="w-9 h-9 relative block"><CustomImage src={link.icon} alt="Buffy" /></span>
                        {link.title}
                    </Link>
                ))
            }
        </footer>
    );
}

export default BottomBar;
"use client"
import Image from "next/image"
import Link from "next/link";
import { MdEmail, MdFacebook } from "react-icons/md";
import { FaXTwitter, FaLinkedin, FaSquareInstagram, FaGithub } from "react-icons/fa6";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
export default function Footer() {
    return (
        <div className="flex bg-[#EDE6FF] w-screen justify-between px-20 text-base py-4">
            <section className="flex flex-col gap-y-3">
                <div>
                    <Image
                        src="/assets/images/logo.png"
                        alt="Poma logo"
                        width={100}
                        height={50}
                    />

                </div>
                <div className="flex items-center">
                    <MdEmail size={24} />
                    <p>info@pomaprotocol.com</p>
                </div>
                <div className="flex gap-x-3">
                    <Link href="https://www.facebook.com/pomaprotocol?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                        <MdFacebook size={24} />
                    </Link>
                    <Link href="https://x.com/POMAprotocol" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter size={24} />
                    </Link>
                    <Link href="https://www.linkedin.com/company/poma-protocol/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                    </Link>
                    <Link href="https://www.instagram.com/pomaprotocol/" target="_blank" rel="noopener noreferrer">
                        <FaSquareInstagram size={24} />
                    </Link>
                    <Link href="https://github.com/poma-protocol" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                    </Link>
                </div>
            </section>
            <section className="flex flex-col justify-around items-center">
                <Link href="https://pomaprotocol.com/about" target="_blank" rel="noopener noreferrer">
                    <p>About Us</p>
                </Link>
                <Link href="https://pomaprotocol.com/search/1508488904037x864166748244315400" target="_blank" rel="noopener noreferrer">
                    <p>Activities</p>
                </Link>
            </section>
            <section className="flex flex-col justify-around items-center">
                <Link href="https://pomaprotocol.com/privacy" target="_blank" rel="noopener noreferrer"><p>Privacy Policy</p></Link>
                <Link href="https://pomaprotocol.com/cookie" target="_blank" rel="noopener noreferrer"><p>Cookie Policy</p></Link>

                <Link href="https://pomaprotocol.com/terms" target="_blank" rel="noopener noreferrer"> <p>Terms and Conditions</p></Link>
            </section>
            <section className="flex flex-col gap-y-3 w-64">
                <p className="text-lg font-bold">Subscribe to our Newsletter</p>
                <Input placeholder="Enter your email address" />
                <Button size="default" className="w-full">Subscribe</Button>
            </section>

        </div>
    )
}
import React from "react";
import { Text } from "../ui/common";
import { Button } from "../ui/common";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full  px-5 py-5 flex justify-between items-center ">
      <div className="flex items-center">
        <img
          src="/app/favicon.png"
          alt="NFT Nexus Logo"
          className="h-10 w-10 mr-2"
        />
        <Text
          variant="h2"
          weight="semibold"
          className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
        >
          NFT Nexus
        </Text>
      </div>
      <div className="flex items-center justify-center px-5">
        <Link href="/signin">
          <Button variant="default" >
            Signin
          </Button>
        </Link>
      </div>
    </header>
  );
}

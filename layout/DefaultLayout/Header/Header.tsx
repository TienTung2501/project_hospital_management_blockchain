'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCaretDown } from 'react-icons/fa';
import images from '@/public/assets';

import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from '@/components/ui/sonner';
import ConnectWallet from '@/components/ConnectWallet/ConnectWallet';

export default function Header() {
  return (
    <div id="header-wrapper" className="border-b border-gray-200">
      <div className="flex justify-between items-center container mx-auto py-4 max-w-7xl font-semibold cursor-pointer">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={images.logo} alt="Logo" width={160} height={40} className="object-contain" />
          </Link>
        </div>

        {/* Navigation menu */}
        <nav className="flex justify-center space-x-6">
          <Link href="/home" className="menu-item">Home</Link>
          <Link href="/bidding" className="menu-item">Bidding</Link>
          <Link href="/voting" className="menu-item">Voting</Link>
          <Link href="/mint" className="menu-item">Create</Link>
          <Link href="/more" className="menu-item flex items-center">More <FaCaretDown className="ml-1" /></Link>
        </nav>

        {/* Connect Wallet */}
        <div className="flex items-center space-x-4">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}

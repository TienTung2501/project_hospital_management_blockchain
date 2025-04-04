'use client';

import React from "react";
import Image from "next/image";
import { FaCaretRight, FaFacebookF, FaYoutube, FaTwitter, FaTelegramPlane } from "react-icons/fa";
import images from "@/public/assets";

export default function Footer() {
  return (
    <div id="footer-wrapper" className="bg-purple-3 text-fog-2 cursor-pointer">
      <div id="footer" className="font-semibold container mx-auto max-w-7xl pt-12">
        {/* Top Section */}
        <div id="ft-top" className="flex justify-between items-start gap-12">
          {/* Logo */}
          <div id="ft-logo-wrapper" className="flex-shrink-0">
            <div id="logo" className="py-4">
              <Image src={images.logo} alt="Logo" width={240} height={80} className="object-contain" />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-12">
            {[ 
              { title: "Auction Platform", links: ["Home", "Bidding", "Create"] },
              { title: "Useful Link", links: ["Guide", "Contact", "Police Temp"] },
              { title: "Resources", links: ["Blogs", "Community", "Coming Soon"] },
            ].map((section, index) => (
              <ul key={index} className="text-white">
                <li className="mb-1.5 font-semibold">{section.title}</li>
                {section.links.map((link, i) => (
                  <li key={i} className="mb-1.5">{link}</li>
                ))}
              </ul>
            ))}
          </div>

          {/* Feedback */}
          <ul className="text-white">
            <li className="mb-1.5 font-semibold">Feedback</li>
            <li className="relative mb-3">
              <input
                type="text"
                name="email"
                className="bg-fog-1 border border-white px-6 py-2 rounded-lg font-light text-white placeholder:text-white"
                placeholder="Your Email"
              />
              <div className="absolute right-3 top-2">
                <FaCaretRight size={"1.5rem"} color="white" />
              </div>
            </li>
            {/* Social Media Icons */}
            <li className="mb-1.5">
              <ul className="flex justify-start items-center space-x-3">
                {[FaFacebookF, FaYoutube, FaTwitter, FaTelegramPlane].map((Icon, i) => (
                  <li key={i} className="border border-white p-2 rounded-lg bg-fog-1">
                    <Icon size={"1.5rem"} color="white" />
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div id="ft-bottom" className="flex justify-between py-6 mt-8 border-t-2">
          <div id="ft-bottom-left">English</div>
          <div id="ft-bottom-right" className="text-right">
            <div className="text-white">Design by: Blockalpha</div>
            <div>Contact us: blockalpha@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "होम", href: "/" },
    { name: "जयपुर", href: "/jaipur" },
    { name: "नगर-डगर", href: "/nagar-dagar" },
    { name: "दुनिया-जहान", href: "/duniya-jahan" },
    { name: "जीवन के रंग", href: "/jeevan-ke-rang" },
    { name: "खेल संसार", href: "/khel-sansar" },
    { name: "विविध", href: "/vividh" },
  ];

  return (
    <nav className="bg-[#006680] py-4 shadow-xl">
      <div className="container mx-auto px-4">
        {/* ---------- DESKTOP ---------- */}
        <div className="hidden md:block text-center">
          {/* LOGO CENTER — जैसा Public folder में है वैसा ही */}
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <img
                src="/logo.png" // ← public का original लोगो
                alt="Site Logo"
                className="object-contain mx-auto"
              />
            </Link>
          </div>

          {/* MENU — दूसरी लाइन में */}
          <div className="flex flex-wrap justify-center gap-3 bg-black/20 py-3 rounded-xl">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white px-3 py-2 font-bold transition rounded hover:bg-white hover:text-[#006680]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- MOBILE ---------- */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <Link href="/">
              <img src="/logo.png" alt="Site Logo" className="object-contain" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white border p-2 rounded-lg"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>

          {isOpen && (
            <ul className="bg-black/25 rounded py-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 px-4 text-white text-center font-bold hover:bg-white hover:text-[#006680] transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

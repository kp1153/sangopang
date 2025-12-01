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
    <nav className="bg-[#006680] py-3 shadow-md">
      <div className="container mx-auto px-4">
        {/* DESKTOP */}
        <div className="hidden md:block text-center">
          {/* LOGO CENTER — now properly scaled */}
          <div className="flex justify-center mb-3">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Site Logo"
                className="object-contain"
                style={{ height: "90px" }} // ← नई perfect height
              />
            </Link>
          </div>

          {/* MENU SECOND LINE */}
          <div className="flex justify-center gap-3 bg-black/20 py-3 rounded-xl flex-wrap">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-bold px-3 py-2 hover:bg-white hover:text-[#006680] transition rounded"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-2">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Site Logo"
                className="object-contain"
                style={{ height: "65px" }} // ← mobile cleaned proportional
              />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white border p-2 rounded"
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
                    className="block text-white text-center py-3 font-bold hover:bg-white hover:text-[#006680] transition"
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

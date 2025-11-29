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
    <>
      {/* Navigation */}
      <nav className="bg-zinc-900 py-6">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {/* First Row: Logo (left) + Sangopang (center) */}
            <div className="flex items-center justify-between mb-4 relative">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Sangopang Logo"
                  width="120"
                  height="120"
                  className="object-contain"
                />
              </Link>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/">
                  <h1
                    className="text-amber-600 hover:text-pink-700 text-8xl font-black whitespace-nowrap transition-colors cursor-pointer"
                    style={{
                      fontWeight: 900,
                      textShadow:
                        "4px 4px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.2)",
                    }}
                  >
                    सांगोपांग
                  </h1>
                </Link>
              </div>

              <div className="w-[120px]"></div>
            </div>

            {/* Second Row: Menu Items - Center */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-amber-600 px-6 py-2 hover:text-pink-700 hover:bg-zinc-800 font-bold text-base transition-colors rounded"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Sangopang Logo"
                  width="80"
                  height="80"
                  className="object-contain"
                />
              </Link>

              <h1
                className="text-amber-600 hover:text-pink-700 text-5xl font-black transition-colors"
                style={{
                  fontWeight: 900,
                  textShadow:
                    "3px 3px 0px rgba(0,0,0,0.3), 5px 5px 0px rgba(0,0,0,0.2)",
                }}
              >
                सांगोपांग
              </h1>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-amber-600 focus:outline-none p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {isOpen && (
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-3 px-4 text-amber-600 hover:bg-zinc-800 transition-colors font-bold text-center"
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
    </>
  );
}

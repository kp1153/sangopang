"use client";

import Link from "next/link";
import Image from "next/image";
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
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-gray-700">
            <Link
              href="/login"
              className="hover:text-red-600 transition-colors"
            >
              लॉगिन
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-red-600 transition-colors"
            >
              साइट मैप
            </Link>
            <Link href="/help" className="hover:text-red-600 transition-colors">
              सहायता
            </Link>
            <Link href="/faqs" className="hover:text-red-600 transition-colors">
              प्रश्न
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:text-red-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative group">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={250}
                height={83}
                className="object-contain"
              />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
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
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white px-4 py-3 hover:bg-red-600 font-semibold text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button className="text-white hover:text-red-600 transition-colors p-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <ul className="md:hidden space-y-1 text-sm pb-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 px-4 text-white hover:bg-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = [
    { name: "हमारे बारे में", href: "/hamare-bare-mein" },
    { name: "सहयोग करें", href: "/sahyog-karen" },
    { name: "आपकी राय", href: "/aapki-raay" },
    { name: "संपर्क करें", href: "/sampark-karen" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-black text-white mt-16 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="flex flex-col items-center gap-8">
          {/* Links Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group px-2 py-1"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-400">
                  {link.name}
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
          />

          {/* Copyright */}
          <motion.p variants={itemVariants} className="text-sm text-zinc-400">
            © {new Date().getFullYear()} सर्वाधिकार सुरक्षित
          </motion.p>

          {/* Developer Credit */}
          <motion.div variants={itemVariants} className="text-sm">
            <p className="text-zinc-400 mb-2">वेब डेवलपर:</p>
            <motion.a
              href="https://www.web-developer-kp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full font-semibold shadow-lg hover:shadow-amber-500/50 transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>क्रिएटिव सॉल्यूशंस</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </motion.a>
          </motion.div>

          {/* Decorative dots */}
          <motion.div variants={itemVariants} className="flex gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-pink-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

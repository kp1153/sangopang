import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-10 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/hamare-bare-mein"
              className="hover:text-pink-500 transition"
            >
              हमारे बारे में
            </Link>
            <Link
              href="/sahyog-karen"
              className="hover:text-pink-500 transition"
            >
              सहयोग करें
            </Link>
            <Link href="/aapki-raay" className="hover:text-pink-500 transition">
              आपकी राय
            </Link>
            <Link
              href="/sampark-karen"
              className="hover:text-pink-500 transition"
            >
              संपर्क करें
            </Link>
          </div>

          <p className="text-sm text-center">
            © {new Date().getFullYear()} सर्वाधिकार सुरक्षित
          </p>

          <p className="text-sm">
            वेब डेवलपर:{" "}
            <a
              href="https://www.web-developer-kp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 font-semibold hover:text-amber-500 transition"
            >
              क्रिएटिव सॉल्यूशंस
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

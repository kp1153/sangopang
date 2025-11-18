"use client";

import { useState } from "react";

export default function AapkiRaay() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `नाम: ${formData.name}%0Aईमेल: ${formData.email}%0Aसंदेश: ${formData.message}`;
    window.open(`https://wa.me/918010241881?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">आपकी राय</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <label className="block text-sm font-semibold mb-2">नाम</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">ईमेल</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">संदेश</label>
          <textarea
            required
            rows="5"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          WhatsApp पर भेजें
        </button>
      </form>
    </div>
  );
}

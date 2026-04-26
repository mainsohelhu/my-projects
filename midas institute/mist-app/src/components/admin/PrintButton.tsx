"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-2xl shadow-xl hover:scale-105 transition-all"
    >
      <Printer size={20} /> Print Receipt
    </button>
  );
}

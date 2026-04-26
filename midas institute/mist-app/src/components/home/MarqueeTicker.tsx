"use client";

import { motion } from "framer-motion";

const items = [
  "NEXT BATCH FOR FULL STACK DEVELOPMENT STARTS ON 15TH MAY",
  "TCS RECRUITMENT DRIVE FOR MIDAS STUDENTS",
  "100% PLACEMENT GUARANTEE ON CERTIFIED COURSES",
  "NEW DATA SCIENCE BOOTCAMP ENROLLMENT OPEN",
  "WIPRO HIRES 15 MIDAS ALUMNI THIS MONTH",
];

export default function MarqueeTicker() {
  return (
    <div className="bg-white border-y border-slate-100 py-5 overflow-hidden flex relative z-20 shadow-sm">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
      
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-primary font-outfit text-xs font-black tracking-[0.2em]">
              {text}
            </span>
            <span className="text-slate-200">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

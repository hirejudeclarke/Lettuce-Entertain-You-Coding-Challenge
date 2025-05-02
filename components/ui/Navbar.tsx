"use client";

import React from "react";
import Link from "next/link";
import { navLinks } from "@/data/links";

const Navbar = () => {
  return (
    <nav className="w-full font-accent lg:text-md z-50 bg-white">
      {/* Desktop links */}
      <div className="w-full justify-center hidden lg:flex">
        <div className="w-11/12 flex justify-center gap-[4%]">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="hover:text-brand-teal transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import React from "react";
import Link from "next/link";

interface NavLink {
  name: string;
  url: string;
}

const links: NavLink[] = [
  { name: "Reservations", url: "https://judeclarke.com/" },
  { name: "Menu", url: "https://judeclarke.com/" },
  { name: "Events", url: "https://judeclarke.com/" },
  { name: "Private Parties", url: "https://judeclarke.com/" },
  { name: "Pick Up", url: "https://judeclarke.com/" },
  { name: "Delivery", url: "https://judeclarke.com/" },
  { name: "Contact Us", url: "https://judeclarke.com/" },
  { name: "Gallery", url: "https://judeclarke.com/" },
];

const Navbar = () => {
  return (
    <nav className="w-full font-accent lg:text-md z-50 bg-white">
      {/* Desktop links */}
      <div className="w-full justify-center hidden lg:flex">
        <div className="w-11/12 flex justify-center gap-[4%]">
          {links.map((link, index) => (
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

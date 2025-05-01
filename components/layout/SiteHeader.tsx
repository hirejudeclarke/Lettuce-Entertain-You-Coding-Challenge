"use client";
import Image from "next/image";
import Navbar from "../ui/Navbar";
import { useLocation } from "@/contexts/location.context";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";
import SocialLinks from "../ui/SocialLinks";

const SiteHeader = () => {
  const { location, updateLocation } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Links from Navbar for mobile menu
  const links = [
    { name: "Reservations", url: "https://judeclarke.com/" },
    { name: "Menu", url: "https://judeclarke.com/" },
    { name: "Events", url: "https://judeclarke.com/" },
    { name: "Private Parties", url: "https://judeclarke.com/" },
    { name: "Pick Up", url: "https://judeclarke.com/" },
    { name: "Delivery", url: "https://judeclarke.com/" },
    { name: "Contact Us", url: "https://judeclarke.com/" },
    { name: "Gallery", url: "https://judeclarke.com/" },
  ];

  // Function to handle the change of location
  const handleLocationChange = () => {
    updateLocation();
  };

  return (
    <div className="flex flex-col items-center sm:gap-9">
      <div className="w-full flex justify-between">
        {/* Left side - Social links on desktop, empty on mobile */}
        <div className="hidden sm:block text-center pt-8 w-60 px-8 pb-4 border-b-2 border-brand-teal-faded">
          {/* Desktop social links */}
          <div className="hidden lg:block">
            <SocialLinks />
          </div>

          {/* Mobile: This space is empty */}
        </div>

        {/* Center - Logo */}
        <Link href="/" className="pl-10 sm:pl-0 flex-grow sm:flex-grow-0">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={300}
            height={75}
            className="pt-8 w-[180px] h-[75px] sm:w-[400px] sm:h-24"
          />
        </Link>

        {/* Right side - Location on desktop, Hamburger menu on mobile */}
        <div className="text-center pt-8 flex-grow sm:flex-grow-0 sm:w-60 px-8 pb-4 border-b-2 border-brand-teal-faded flex justify-end lg:block">
          {/* Desktop location */}
          <div
            className="hidden lg:block cursor-pointer"
            onClick={handleLocationChange}
          >
            <p className="font-accent text-xl">{location.city}</p>
            <p className="uppercase text-sm font-m">change location</p>
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-brand-blue text-4xl"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <IoClose /> : <TiThMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="flex flex-col gap-4 px-6 pb-4 w-full lg:hidden text-center items-center">
          {/* Location selector at the top of mobile menu */}
          <div
            className="w-full border-b border-gray-200 pb-4 mb-2 cursor-pointer flex flex-col"
            onClick={handleLocationChange}
          >
            <p className="font-accent text-xl">{location.city}</p>
            <p className="uppercase text-sm font-m">change location</p>
          </div>

          {/* Navigation links */}
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="w-full border-b border-gray-200 pb-2 hover:text-brand-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <SocialLinks />
        </div>
      )}

      {/* Navigation */}
      <Navbar />
    </div>
  );
};

export default SiteHeader;

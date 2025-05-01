"use client";
import Image from "next/image";
import Link from "next/link";
import _ from "lodash";
import { useLocation } from "@/contexts/location.context";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaPhone } from "react-icons/fa6";
import { TiLocation } from "react-icons/ti";

const ContactUs = () => {
  const { location, updateLocation } = useLocation();
  const handleChangeLocation = () => {
    updateLocation();
  };

  return (
    <div className="flex flex-col sm:flex-row bg-brand-blue text-white font-medium items-center">
      {/* Image section */}
      {/* THE IMAGE PROVIDED WAS CUT OFF */}
      <div className="hidden sm:flex sm:flex-1 w-full justify-center items-center">
        <Image
          src="/assets/Charcuterie.png"
          alt=""
          width={650}
          height={650}
          className="h-[70%] lg:w-full lg:h-auto object-cover sm:relative sm:top-15 sm:-left-[140px]"
        />
      </div>

      {/* Contact Info section */}
      <div className="sm:flex-1 w-[80%] px-6 py-10 lg:p-24 flex flex-col gap-12">
        <div className="flex flex-col gap-1">
          <h2 className="font-accent text-3xl sm:text-4xl">
            Mon Ami Gabi {_.startCase(_.toLower(location.city))}
          </h2>
          <p
            onClick={handleChangeLocation}
            className="uppercase italic text-xs pointer"
          >
            Change Location
          </p>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-1">
          {location.hours?.map((hour, index) => (
            <div
              key={index}
              className="flex w-74 sm:w-84 justify-between text-xl"
            >
              <span>{hour.days}</span>
              <span>{hour.time}</span>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-5 text-base sm:text-lg md:text-xl">
          <Link
            href="mailto:hirejudeclarke@gmail.com"
            className="flex gap-4 items-center"
          >
            <BsEnvelopeFill size={24} />
            <span>Contact Us</span>
          </Link>
          <div className="flex gap-4 items-center">
            <FaPhone size={24} />
            <span>{location.phone}</span>
          </div>
          <div className="flex gap-4 items-start">
            <TiLocation size={24} />
            <span className="flex flex-col">
              <span>{location.street}</span>
              <span>
                {location.city}, {location.state}{" "}
                {location.postalCode && <span>{location.postalCode}</span>}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

// We can store operating hours separately for each individual day, then write logic to group and display days with matching hours (like "Mon–Thu 5:00pm–9:30pm"). This approach gives me flexibility to easily update, extend, or customize hours later — for example, adding holiday schedules, adjusting brunch vs dinner times, or displaying special cases like "Sun Brunch" without hardcoding every possible combination. It keeps the data clean, consistent, and scalable as the site grows.

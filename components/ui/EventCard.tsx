"use client";

import React from "react";
import CtaButton from "./CtaButton";
import Image from "next/image";
import { parseHtmlContent } from "@/utilities";

// TypeScript interface for the component props
interface EventCardProps {
  id: string;
  title: string;
  date: string;
  cities?: string[];
  content: string;
  ctaUrl?: string;
  ctaBtn?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
}

const EventCard = ({
  id,
  title,
  date,
  cities = [],
  content,
  ctaUrl,
  ctaBtn = "Learn More",
  featuredImage,
}: EventCardProps) => {
  return (
    <div id={id} className="rounded-tl-xl overflow-hidden flex flex-col h-full">
      <div className="h-48 w-full overflow-hidden">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            className="w-full h-full object-cover"
            width={400}
            height={200}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="py-6 flex-grow flex flex-col">
        {/* Title with truncation */}
        <h2 className="text-xl font-bold mb-2 line-clamp-2 h-14">{title}</h2>

        {/* Date */}
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 truncate">{date}</p>
        </div>

        {/* Cities */}
        {cities.length > 0 && (
          <div className="flex items-start mb-4">
            <svg
              className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 truncate">{cities.join(", ")}</p>
          </div>
        )}

        {/* Content with truncation */}
        <div className="mb-4 prose h-24 overflow-hidden">
          {parseHtmlContent(content, 150)}
        </div>

        {/* CTA Button */}
        {ctaUrl && (
          <div className="mt-2">
            <CtaButton
              link={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium w-full text-center"
            >
              {ctaBtn}
            </CtaButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

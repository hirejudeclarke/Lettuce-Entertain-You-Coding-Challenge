"use client";

import React from "react";
import Link from "next/link";
import CtaButton from "./CtaButton";
import Image from "next/image";

// Enhanced parse function to handle <em> tags and truncate content
const parseHtmlContent = (htmlContent: string, maxLength = 150) => {
  if (!htmlContent) return null;

  // Handle both <a> and <em> tags
  const processedHtml = htmlContent.replace(
    /<em>(.*?)<\/em>/g,
    "<em-tag>$1</em-tag>"
  );

  // Regular expression to find anchor tags
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g;

  // Split the content by anchor tags
  const parts = processedHtml.split(linkRegex);

  // Truncate the content if needed
  let totalLength = 0;
  let truncated = false;
  const truncatedParts = [];

  // Check if content needs truncation
  const plainTextLength = htmlContent.replace(/<[^>]*>/g, "").length;
  if (plainTextLength > maxLength) {
    truncated = true;
  }

  if (parts.length === 1) {
    // No links found
    const content = processedHtml;

    if (truncated) {
      // Simple truncation for text only content
      const plainText = content.replace(/<[^>]*>/g, "");
      const truncatedText = plainText.substring(0, maxLength) + "...";

      // Process <em> tags in truncated content
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: truncatedText.replace(
              /<em-tag>(.*?)<\/em-tag>/g,
              "<em>$1</em>"
            ),
          }}
        />
      );
    } else {
      // Process <em> tags and return full content
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: content.replace(/<em-tag>(.*?)<\/em-tag>/g, "<em>$1</em>"),
          }}
        />
      );
    }
  }

  const result = [];
  let index = 0;
  let shouldContinue = true;

  // Process text and links
  for (let i = 0; i < parts.length && shouldContinue; i++) {
    if (i % 3 === 0) {
      // This is text content
      if (parts[i]) {
        let textContent = parts[i];

        // Process <em> tags in text
        textContent = textContent.replace(
          /<em-tag>(.*?)<\/em-tag>/g,
          "<em>$1</em>"
        );

        // Check if we need to truncate
        if (
          truncated &&
          totalLength + textContent.replace(/<[^>]*>/g, "").length > maxLength
        ) {
          const remainingLength = maxLength - totalLength;
          const plainText = textContent.replace(/<[^>]*>/g, "");

          if (remainingLength > 0) {
            // Partial truncation
            const truncatedText =
              plainText.substring(0, remainingLength) + "...";
            result.push(
              <span
                key={`text-${index++}`}
                dangerouslySetInnerHTML={{ __html: truncatedText }}
              />
            );
          } else {
            // Already reached max length
            result.push(<span key={`text-${index++}`}>...</span>);
          }
          shouldContinue = false;
        } else {
          // Add full text content
          result.push(
            <span
              key={`text-${index++}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          );
          totalLength += textContent.replace(/<[^>]*>/g, "").length;
        }
      }
    } else if (i % 3 === 1) {
      // This is the href
      const href = parts[i];
      const linkText = parts[i + 1];

      // Check if we need to truncate
      if (truncated && totalLength + linkText.length > maxLength) {
        const remainingLength = maxLength - totalLength;

        if (remainingLength > 0) {
          // Partial truncation of link text
          const truncatedLinkText =
            linkText.substring(0, remainingLength) + "...";
          result.push(
            <Link
              href={href}
              key={`link-${index++}`}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncatedLinkText}
            </Link>
          );
        } else {
          // Already reached max length, don't add link
          result.push(<span key={`text-${index++}`}>...</span>);
        }
        shouldContinue = false;
      } else {
        // Add full link
        result.push(
          <Link
            href={href}
            key={`link-${index++}`}
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </Link>
        );
        totalLength += linkText.length;
      }

      i++;
    }
  }

  return <div>{result}</div>;
};

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

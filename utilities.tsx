import Link from "next/link";
import { SelectedLocation } from "./data/locations";

// RESERVATIONS
// Cleans the date string by removing ordinal suffixes
const cleanDateString = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  // Removes ordinal suffixes like 1st, 2nd, 3rd, 4th, etc.
  return dateStr.replace(/(\d+)(st|nd|rd|th)/g, "$1");
};
// Parses a date string into a Date object or returns null if invalid
export const parseEventDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;

  const cleaned = cleanDateString(dateStr);
  if (!cleaned) return null;

  const parsed = new Date(cleaned);

  // Check if the date is valid
  return isNaN(parsed.getTime()) ? null : parsed;
};

// Parse time string from "4:00pm - 9:30pm" format to create Date objects
const parseTimeString = (timeString: string, date: Date) => {
  const [startTimeStr, endTimeStr] = timeString.split(" - ");

  const createTimeDate = (timeStr: string, baseDate: Date) => {
    const isPM = timeStr.toLowerCase().includes("pm");
    const time = timeStr
      .toLowerCase()
      .replace("am", "")
      .replace("pm", "")
      .trim();
    const [hours, minutes] = time.split(":").map((num) => parseInt(num));

    const newDate = new Date(baseDate);
    newDate.setHours(
      isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours,
      minutes,
      0,
      0
    );
    return newDate;
  };

  const startTime = createTimeDate(startTimeStr, date);
  const endTime = createTimeDate(endTimeStr, date);

  return { startTime, endTime };
};

export const generateTimeSlots = (date: Date, location: SelectedLocation) => {
  if (!date || !location?.hours) return [];

  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const relevantHours = location.hours.filter(({ days }) => {
    return (
      (days.includes("Mon-Thu") && dayOfWeek >= 1 && dayOfWeek <= 4) ||
      (days.includes("Fri-Sat") && (dayOfWeek === 5 || dayOfWeek === 6)) ||
      (days === "Sunday" && dayOfWeek === 0) ||
      (days === "Sun Brunch" && dayOfWeek === 0)
    );
  });

  if (relevantHours.length === 0) return [];

  const allSlots: Date[] = [];

  for (const hourSet of relevantHours) {
    const { startTime, endTime } = parseTimeString(hourSet.time, date);
    const currentSlot = new Date(startTime);
    const lastSlot = new Date(endTime);
    lastSlot.setHours(lastSlot.getHours() - 1); // Optional buffer before closing

    while (currentSlot <= lastSlot) {
      allSlots.push(new Date(currentSlot));
      currentSlot.setMinutes(currentSlot.getMinutes() + 30);
    }
  }

  // Remove duplicate slots (same time)
  const uniqueSlots = Array.from(
    new Map(allSlots.map((slot) => [slot.getTime(), slot])).values()
  );

  return uniqueSlots.sort((a, b) => a.getTime() - b.getTime());
};

// EVENTS

// Format date for display or return a placeholder for invalid dates
export const formatDateForDisplay = (dateStr: string | null): string => {
  if (!dateStr) return "Ongoing";

  const parsedDate = parseEventDate(dateStr);
  if (!parsedDate) return "Check website for dates";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface FeaturedImage {
  url: string;
  alt_text: string;
}

export interface Event {
  ID: string;
  cities: string[];
  content: string;
  created_at: string;
  cta_btn: string;
  cta_url: string;
  date: string | null;
  featured_image: FeaturedImage;
  permalink: string;
  title: string;
}
export const getCurrentEvents = (data: Event[]): Event[] => {
  const now = new Date();
  return data
    .filter((event) => {
      const parsed = parseEventDate(event.date);
      return parsed !== null && parsed >= now;
    })
    .sort((a, b) => {
      const aDate = parseEventDate(a.date);
      const bDate = parseEventDate(b.date);
      return (aDate?.getTime() ?? 0) - (bDate?.getTime() ?? 0);
    });
};

// Event Card

const result: React.ReactNode[] = [];
let index = 0;
let shouldContinue = true;

// Parse function to handle <em> tags and truncate content
export const parseHtmlContent = (htmlContent: string, maxLength = 150) => {
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

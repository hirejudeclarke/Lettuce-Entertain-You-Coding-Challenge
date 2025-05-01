"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CtaButton from "../ui/CtaButton";
import { useLocation } from "@/contexts/location.context";

const Reservation = () => {
  const partySizeRef = useRef<HTMLInputElement>(null);
  const [partySize, setPartySize] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  // Get the current location from context
  const { location, updateLocation } = useLocation();

  const handleLocationChange = () => {
    updateLocation();
  };

  const handleSpanClick = () => {
    partySizeRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!partySize || !selectedDate || !selectedTime) return;

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = selectedTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    setConfirmationMessage(
      `Your reservation for ${partySize} ${
        partySize > 1 ? "people" : "person"
      } has been made for ${formattedDate} at ${formattedTime}.`
    );

    console.log({
      partySize,
      selectedDate,
      selectedTime,
      location: location.city,
    });

    // Reset form fields
    setPartySize(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handlePartySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const number = value === "" ? null : parseInt(value);

    if (number === null || (number >= 1 && number <= 20)) {
      setPartySize(number);
    }
  };

  // Calculate the date 3 days from today
  const threeDaysFromToday = new Date();
  threeDaysFromToday.setDate(threeDaysFromToday.getDate() + 3);

  const placeholderDate = threeDaysFromToday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

  // Update available time slots when the selected date changes
  useEffect(() => {
    const generateTimeSlots = (date: Date) => {
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

    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
      setSelectedTime(null); // Reset selected time when date changes
    }
  }, [selectedDate, location]);

  // Custom filter for the time picker to only show available times
  const filterTime = (time: Date) => {
    if (availableTimeSlots.length === 0) return false;

    return availableTimeSlots.some(
      (slot) =>
        slot.getHours() === time.getHours() &&
        slot.getMinutes() === time.getMinutes()
    );
  };

  // Minimum date is today
  const minDate = new Date();

  // Maximum date is 3 months from today
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <div className="w-full flex flex-col items-center lg:items-end">
      <div className="w-full sm:w-84 flex flex-col items-center ">
        <h2 className="text-3xl sm:text-4xl font-accent w-full text-center sm:mb-4">
          Make a Reservation
        </h2>
        <p
          className="text-center mb-4 text-gray-600 sm:hidden"
          onClick={handleLocationChange}
        >
          {location.city}, {location.state} Location
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 w-[250px] sm:w-full"
        >
          <div className="relative text-lg font-medium">
            <label htmlFor="party-size" className="hidden">
              Number of people
            </label>
            <span
              className={`absolute ml-[50%] ${
                partySize && partySize > 9 ? "-left-4" : "-left-5"
              } top-[9px] ${partySize === null && "text-gray-500"}`}
              onClick={handleSpanClick}
            >
              {partySize && partySize < 2 ? "person" : "people"}
            </span>
            <input
              id="party-size"
              ref={partySizeRef}
              type="number"
              value={partySize ?? ""}
              onChange={handlePartySizeChange}
              className="border p-2 w-full rounded-tl-xl text-center border-brand-teal bg-white placeholder-gray-500 pr-16 no-spinner"
              placeholder="2"
              min={1}
              max={20}
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="hidden">
              Please choose the day
            </label>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText={placeholderDate}
                dateFormat="MMMM d, yyyy"
                className="border p-2 w-full text-center border-brand-teal bg-white text-lg font-medium placeholder-gray-500"
                id="date"
                minDate={minDate}
                maxDate={maxDate}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="hidden">
              Please select a time
            </label>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={selectedTime}
                onChange={(time) => setSelectedTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText={"7:00pm"}
                className="border p-2 w-full text-center border-brand-teal bg-white text-lg font-medium placeholder-gray-500"
                id="time"
                filterTime={filterTime}
                disabled={!selectedDate || availableTimeSlots.length === 0}
                autoComplete="off"
                required
              />
            </div>
            {selectedDate && availableTimeSlots.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                No reservations available for this date. Please select another
                date.
              </p>
            )}
          </div>
          <CtaButton
            type="submit"
            className="font-accent"
            disabled={!selectedDate || !selectedTime || !partySize}
          >
            Find a table
          </CtaButton>
          {confirmationMessage ? (
            ""
          ) : (
            <div className="text-sm text-gray-600 mt-2 sm:hidden">
              <p>Hours for this location:</p>
              <ul className="mt-1">
                {location.hours.map((hour, index) => (
                  <li key={index} className="flex justify-between w-full">
                    <span>{hour.days}:</span>
                    <span>{hour.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
      {confirmationMessage && (
        <div className="mt-4 p-4 w-full bg-green-100 border border-green-400 text-green-700 rounded-md text-center lg:w-84">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default Reservation;

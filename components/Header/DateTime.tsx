import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { useDateTimeSettings } from "@/app/DateTimeContext";

export const DateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { settings } = useDateTimeSettings();
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update time every second if showing seconds, otherwise every minute
  React.useEffect(() => {
    const timer = setInterval(
      () => {
        setCurrentTime(new Date());
      },
      settings.showSeconds ? 1000 : 60000
    );

    return () => clearInterval(timer);
  }, [settings.showSeconds]);

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      second: settings.showSeconds ? "2-digit" : undefined,
      hour12: !settings.use24Hour,
      timeZone: settings.timezone,
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    const formatter = new Intl.DateTimeFormat(
      settings.useUSDateFormat ? "en-US" : "en-IN",
      options
    );

    return formatter.format(date);
  };

  const handleDateChange = (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (value instanceof Date) {
      setCurrentTime(value);
    }
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative text-base-content" ref={calendarRef}>
      <button
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="btn btn-ghost btn-sm gap-2 text-base-content flex items-center"
      >
        <CalendarIcon size={16} className="text-base-content" />
        <span className="font-mono text-base-content flex items-center">
          {formatDateTime(currentTime)}
        </span>
      </button>

      {isCalendarOpen && (
        <div className="absolute top-full right-0 mt-2 bg-base-200 rounded-box shadow-lg border border-base-300 z-50">
          <div className="p-2 bg-base-200">
            <Calendar
              onChange={handleDateChange}
              value={currentTime}
              className="!bg-transparent border-none"
              tileClassName="hover:bg-base-300 rounded-lg"
              calendarClassName="!bg-transparent !text-base-content"
            />
          </div>
        </div>
      )}
    </div>
  );
};

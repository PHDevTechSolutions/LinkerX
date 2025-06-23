import React, { useState, useCallback } from "react";

interface CalendarProps {
  title: string;
  details: string;
  start: Date;
  end: Date;
}

// Helper to check if a date is valid
const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());

// Safer formatter for Google Calendar and ICS (UTC format)
const formatDateForCalendar = (date: Date) => {
  if (!isValidDate(date)) {
    throw new Error("Invalid Date passed to formatDateForCalendar");
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

// Google Calendar URL builder
export const buildGoogleCalendarUrl = ({ title, details, start, end }: CalendarProps) => {
  try {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details,
      dates: `${formatDateForCalendar(start)}/${formatDateForCalendar(end)}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return "#";
  }
};

// Outlook Calendar URL builder
export const buildOutlookCalendarUrl = ({ title, details, start, end }: CalendarProps) => {
  try {
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: title,
      body: details,
      startdt: start.toISOString(),
      enddt: end.toISOString(),
    });
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  } catch {
    return "#";
  }
};

// ICS file generator
export const buildICSFileContent = ({ title, details, start, end }: CalendarProps) => {
  try {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//EN
BEGIN:VEVENT
UID:${Date.now()}@yourapp.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${formatDateForCalendar(start)}
DTEND:${formatDateForCalendar(end)}
SUMMARY:${title}
DESCRIPTION:${details}
END:VEVENT
END:VCALENDAR`;
  } catch {
    return "";
  }
};

const Calendar: React.FC<CalendarProps> = ({ title, details, start, end }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDownloadICS = useCallback(() => {
    const content = buildICSFileContent({ title, details, start, end });
    if (!content) return;

    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "event.ics";
    link.click();

    URL.revokeObjectURL(url);
    setShowOptions(false);
  }, [title, details, start, end]);

  // Don't render if dates are invalid
  if (!isValidDate(start) || !isValidDate(end)) {
    console.warn("Invalid date passed to Calendar component");
    return null;
  }

  return (
    <div className="relative">
      <p className="font-semibold text-gray-600 text-xs">Optional:</p>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={showOptions}
        onClick={() => setShowOptions(!showOptions)}
        className="mb-2 px-3 py-1 bg-orange-400 text-white rounded text-xs hover:bg-orange-500"
      >
        Save to Calendar?
      </button>

      {showOptions && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow w-48 text-xs">
          <a
            href={buildGoogleCalendarUrl({ title, details, start, end })}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 hover:bg-gray-100"
            onClick={() => setShowOptions(false)}
          >
            Google Calendar
          </a>
          <a
            href={buildOutlookCalendarUrl({ title, details, start, end })}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 hover:bg-gray-100"
            onClick={() => setShowOptions(false)}
          >
            Outlook Calendar
          </a>
          <button
            onClick={handleDownloadICS}
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Download iCal (.ics)
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;

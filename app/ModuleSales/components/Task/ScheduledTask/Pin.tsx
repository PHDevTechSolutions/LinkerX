import React, { useEffect, useRef, useState } from "react";
import { GiPin } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

interface PinProps {
  isPinned: boolean;
  onToggle: (newPinned: boolean) => Promise<void> | void;
  companyname: string;
  loading?: boolean;
}

const MAX_PINS = 3;

const Pin: React.FC<PinProps> = ({
  isPinned,
  onToggle,
  companyname,
  loading = false,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Tooltip show/hide with delay
  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => setTooltipVisible(true), 600);
  };
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTooltipVisible(false);
  };

  const handleToggle = async () => {
    if (loading) return;

    const pinnedCompanies = JSON.parse(
      localStorage.getItem("pinnedCompanies") || "[]"
    ) as string[];

    if (!isPinned && pinnedCompanies.length >= MAX_PINS) {
      setLimitReached(true);
      setTimeout(() => setLimitReached(false), 700); // bounce reset
      return;
    }

    await onToggle(!isPinned);

    const updatedList = isPinned
      ? pinnedCompanies.filter((c) => c !== companyname)
      : [...pinnedCompanies, companyname];

    localStorage.setItem("pinnedCompanies", JSON.stringify(updatedList));
    // Trigger update to external listeners (e.g., parent badge)
    window.dispatchEvent(new Event("storage"));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        disabled={loading}
        aria-pressed={isPinned}
        aria-label={isPinned ? `Unpin ${companyname}` : `Pin ${companyname}`}
        title={isPinned ? "Unpin this post" : "Pin this post"}
        type="button"
        className="p-1 rounded hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <motion.div
          animate={{
            rotate: isPinned ? 15 : 0,
            scale: limitReached
              ? [1, 1.5, 0.9, 1]
              : isPinned
              ? [1, 1.4, 1]
              : 1,
            color: isPinned ? "#fbbf24" : "#9ca3af",
          }}
          transition={{
            rotate: { type: "spring", stiffness: 300, damping: 20 },
            scale: { duration: 0.5, ease: "easeInOut" },
            color: { duration: 0.3 },
          }}
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <GiPin size={15} aria-hidden="true" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {tooltipVisible && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-700 text-white text-xs rounded pointer-events-none select-none whitespace-nowrap z-10"
            role="tooltip"
          >
            {isPinned ? "Unpin this post" : "Pin this post"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pin;

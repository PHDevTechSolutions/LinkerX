import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface RemarksProps {
  remarks: string;
  setremarks: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
}

const Remarks: React.FC<RemarksProps> = ({
  remarks,
  setremarks,
  maxLength = 500,
  placeholder = "Enter remarks here...",
  required = true,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [history, setHistory] = useState<string[]>([remarks ?? ""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let input = e.target.value;

    // Remove all characters except letters, numbers, spaces, dot, comma, and #
    const pattern = /[^a-zA-Z0-9\s.,#]/g;
    let filtered = input.replace(pattern, "");

    // Convert to lowercase first
    filtered = filtered.toLowerCase();

    // Capitalize first letter of each word
    filtered = filtered.replace(/\b\w/g, (c) => c.toUpperCase());

    if (filtered.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed.`);
      return;
    } else {
      setError(null);
    }

    setremarks(filtered);
    setIsDirty(true);

    if (history[historyIndex] !== filtered) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(filtered);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };


  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setremarks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setremarks(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newText = (remarks ?? "") + emojiData.emoji;
    if (newText.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed.`);
      return;
    }
    setremarks(newText);
    setIsDirty(true);

    if (history[historyIndex] !== newText) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4 relative">
      <label className="block text-xs font-bold mb-2">
        Remarks {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        ref={textareaRef}
        value={typeof remarks === "string" ? remarks : String(remarks ?? "")}
        onChange={handleChange}
        className={`w-full px-3 py-2 border-b text-xs capitalize resize-y ${error ? "border-red-500" : "border-gray-300"
          }`}
        rows={1}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        spellCheck={false}
        lang="en"
      />

      <div className="flex items-center mt-1 space-x-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-[10px] px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          aria-label="Toggle Emoji Picker"
        >
          😊
        </button>

        <button
          type="button"
          onClick={undo}
          disabled={historyIndex === 0}
          className={`text-[10px] px-2 py-1 border rounded ${historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          aria-label="Undo"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={historyIndex === history.length - 1}
          className={`text-[10px] px-2 py-1 border rounded ${historyIndex === history.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          aria-label="Redo"
        >
          Redo
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-10">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <p className="text-[10px] text-gray-500 mt-1">
        Character Count: {remarks ? remarks.length : 0} / {maxLength}
      </p>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Remarks;

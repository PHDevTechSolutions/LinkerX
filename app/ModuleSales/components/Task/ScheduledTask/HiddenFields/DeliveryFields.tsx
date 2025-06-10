import React, { useState, useEffect, useCallback } from "react";
import { CiPaperplane } from "react-icons/ci";

interface DeliveryFieldsProps {
  actualsales: string;
  setactualsales: (value: string) => void;
  emailaddress: string;
  setemailaddress: (value: string) => void;
}

const EMAIL_STORAGE_KEY = "recentEmails";

const DeliveryFields: React.FC<DeliveryFieldsProps> = ({
  actualsales,
  setactualsales,
  emailaddress,
  setemailaddress,
}) => {
  // Local state
  const [emailOptions, setEmailOptions] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentEmails, setRecentEmails] = useState<string[]>([]);

  // Load recent emails from localStorage on mount
  useEffect(() => {
    const savedEmails = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (savedEmails) {
      setRecentEmails(JSON.parse(savedEmails));
    }
  }, []);

  // Example to populate email options (replace this with actual fetch or props)
  useEffect(() => {
    // For demo, combine recentEmails with current email if not duplicate
    const emailsSet = new Set(recentEmails);
    if (emailaddress) emailsSet.add(emailaddress);
    setEmailOptions(Array.from(emailsSet));
  }, [recentEmails, emailaddress]);

  // Validate email format helper
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle sending email
  const sendEmail = useCallback(async () => {
    if (!emailaddress || !isValidEmail(emailaddress)) {
      setErrorMessage("Please select a valid email.");
      return;
    }
    setErrorMessage(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailaddress, message: customMessage }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Email sent successfully!");
        // Save email to recent emails
        const updatedEmails = [emailaddress, ...recentEmails.filter(e => e !== emailaddress)].slice(0, 10);
        setRecentEmails(updatedEmails);
        localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(updatedEmails));
        setCustomMessage("");
        setShowConfirm(false);
      } else {
        setErrorMessage("Error sending email: " + data.message);
      }
    } catch (error) {
      setErrorMessage("Unexpected error: " + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  }, [emailaddress, customMessage, recentEmails]);

  // Reset form inputs
  const resetForm = () => {
    setactualsales("");
    setemailaddress("");
    setCustomMessage("");
    setErrorMessage(null);
  };

  // Character limit for message
  const MESSAGE_CHAR_LIMIT = 500;

  // Confirmation modal component
  const ConfirmModal = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
    >
      <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
        <h2 id="confirm-dialog-title" className="text-lg font-bold mb-4">
          Confirm Send Email
        </h2>
        <p className="mb-4">
          Are you sure you want to send the survey to <strong>{emailaddress}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={sendEmail}
            className={`px-4 py-2 rounded text-white ${
              isSending ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
        <label htmlFor="actualsales" className="block text-xs font-bold mb-2">
          SI (Actual Sales)
        </label>
        <input
          id="actualsales"
          type="text"
          inputMode="decimal"
          value={actualsales}
          onChange={(e) => {
            const inputValue = e.target.value;
            const formattedValue = inputValue
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
            setactualsales(formattedValue);
          }}
          className="w-full px-3 py-2 border rounded text-xs"
          required
          placeholder="Enter actual sales amount"
          disabled={isSending}
          aria-describedby="actualsales-desc"
        />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4 flex flex-col space-y-4">
        <div>
          <label htmlFor="emailaddress" className="block text-xs font-bold mb-2">
            Send Email Survey
          </label>
          <select
            id="emailaddress"
            value={emailaddress}
            onChange={(e) => setemailaddress(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            required
            disabled={isSending}
            aria-required="true"
            aria-invalid={!!errorMessage}
          >
            <option value="">Select Email</option>
            {emailOptions.length === 0 && <option disabled>No emails available</option>}
            {emailOptions.map((email, idx) => (
              <option key={idx} value={email}>
                {email}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p role="alert" className="text-red-600 text-xs mt-1">
              {errorMessage}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customMessage" className="block text-xs font-bold mb-2">
            Custom Message (optional)
          </label>
          <textarea
            id="customMessage"
            value={customMessage}
            maxLength={MESSAGE_CHAR_LIMIT}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs resize-none"
            placeholder="Add a custom message to include in the email"
            disabled={isSending}
            aria-describedby="charcount"
          />
          <div id="charcount" className="text-right text-gray-500 text-xs">
            {customMessage.length}/{MESSAGE_CHAR_LIMIT}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!emailaddress || isSending}
            className={`p-2 rounded flex items-center space-x-2 ${
              emailaddress && !isSending
                ? "bg-green-800 text-white hover:bg-green-900"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            type="button"
            aria-disabled={!emailaddress || isSending}
          >
            <CiPaperplane size={15} />
            <span>Send</span>
          </button>

          <button
            onClick={resetForm}
            type="button"
            disabled={isSending && !emailaddress}
            className="p-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && <ConfirmModal />}
    </>
  );
};

export default DeliveryFields;

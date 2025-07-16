import React from "react";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: any;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen || !email) return null;

  const renderBadgeList = (value: string) => {
    return value
      .split(",")
      .map((item, idx) => (
        <span
          key={idx}
          className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-1 mb-1 text-xs"
        >
          {item.trim()}
        </span>
      ));
  };

  const renderAttachments = () => {
    if (!email.attachments || email.attachments.length === 0) return null;

    return (
      <div className="mt-2">
        <strong>Attachments:</strong>
        <div className="mt-1 space-y-2">
          {email.attachments.map((att: any, idx: number) => {
            const isImage = att.contentType.startsWith("image/");
            const fileUrl = `data:${att.contentType};base64,${att.content}`;

            return (
              <div key={idx} className="border p-2 rounded text-xs">
                <div className="mb-1 font-medium">{att.filename}</div>
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={att.filename}
                    className="max-w-xs max-h-48 border"
                  />
                ) : (
                  <a
                    href={fileUrl}
                    download={att.filename}
                    className="text-blue-600 underline"
                  >
                    Download file
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-xs max-h-[90vh] overflow-y-auto">
        <h2 className="text-sm font-bold mb-4">📧 Email Details</h2>

        <div className="space-y-2">
          <div>
            <strong>From:</strong> <div className="mt-1">{renderBadgeList(email.from?.text || "Unknown")}</div>
          </div>
          <div>
            <strong>To:</strong> <div className="mt-1">{renderBadgeList(email.to || "N/A")}</div>
          </div>
          <div>
            <strong>CC:</strong> <div className="mt-1">{renderBadgeList(email.cc || "N/A")}</div>
          </div>
          <div>
            <strong>Date:</strong> {new Date(email.date).toLocaleString()}
          </div>
          <div>
            <strong>Subject:</strong> {email.subject || "No Subject"}
          </div>
          <div>
            <strong>Message:</strong>
            <div className="mt-1 border p-2 rounded text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {email.body || "(No content)"}
            </div>
          </div>
          {renderAttachments()}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;

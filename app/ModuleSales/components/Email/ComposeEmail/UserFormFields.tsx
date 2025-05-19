import React, { useState } from "react";
import { SiLocal } from "react-icons/si";
import { AiOutlineGlobal } from "react-icons/ai";

interface FormFieldsProps {
  referenceid: string;
  setreferenceid: (value: string) => void;
  sender: string;
  setsender: (value: string) => void;
  recepient: string;
  setrecepient: (value: string) => void;
  subject: string;
  setsubject: (value: string) => void;
  message: string;
  setmessage: (value: string) => void;
  channel: string;
  setchannel: (value: string) => void;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  referenceid,
  setreferenceid,
  sender,
  setsender,
  recepient,
  setrecepient,
  subject,
  setsubject,
  message,
  setmessage,
  channel,
  setchannel,
}) => {
  const [wordCount, setWordCount] = useState(0);

  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setmessage(newMessage);
    setWordCount(calculateWordCount(newMessage));
  };

  return (
    <>
      <input
        type="hidden"
        id="referenceid"
        value={referenceid}
        onChange={(e) => setreferenceid(e.target.value)}
      />

      <div className="flex flex-wrap -mx-4">
        <div className="w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2">From Email:</label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setsender(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            disabled
          />
        </div>

        <div className="w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2">Recipients</label>
          <input
            type="email"
            value={recepient}
            onChange={(e) => setrecepient(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            placeholder="example@email.com"
            spellCheck
          />
        </div>

        <div className="w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setsubject(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            spellCheck
          />
        </div>

        <div className="w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2 flex items-center gap-2">
            <span>Channel</span>
            {channel === "System" ? (
              <SiLocal className="text-blue-500" />
            ) : (
              <AiOutlineGlobal className="text-green-500" />
            )}
          </label>

          <select
            value={channel}
            onChange={(e) => setchannel(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          >
            <option value="System">System (ERP System Only)</option>
            <option value="Global">Global (via Mailjet/Gmail/Email)</option>
          </select>
        </div>

        <div className="w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2">Message</label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            className="w-full min-h-[150px] border rounded px-3 py-2 text-xs capitalize"
            placeholder="Type your message here"
            spellCheck
          />
          <p className="text-[10px] text-right text-gray-400 mt-1">
            Word Count: {wordCount}
          </p>
        </div>
      </div>
    </>
  );
};

export default UserFormFields;

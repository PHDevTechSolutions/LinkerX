// src/components/HiddenFields/QuotationFields.tsx
import React from "react";

interface QuotationFieldsProps {
  quotationnumber: string;
  setquotationnumber: (val: string) => void;
  quotationamount: string;
  setquotationamount: (val: string) => void;
  typecall: string;
  settypecall: (val: string) => void;
}

const QuotationFields: React.FC<QuotationFieldsProps> = ({
  quotationnumber,
  setquotationnumber,
  quotationamount,
  setquotationamount,
  typecall,
  settypecall,
}) => {
  // Handler to sanitize quotation number input (letters and numbers only)
  const handleQuotationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const sanitized = input.replace(/[^a-zA-Z0-9]/g, "");
    setquotationnumber(sanitized.toUpperCase());
  };

  // Handler to allow only numbers and one decimal point
  const handleQuotationAmountChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;

    // Allow only digits and one dot
    const validInput = inputValue
      .replace(/[^\d.]/g, "")       // Remove non-numeric and non-dot characters
      .replace(/^(\d*\.\d*).*$/, "$1") // Allow only one dot (remove additional)
      .replace(/^0+(?=\d)/, "");    // Remove leading zeros except before decimal

    setquotationamount(validInput);
  };

  return (
    <>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Quotation Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={quotationnumber || ""}
          onChange={handleQuotationNumberChange}
          className="w-full px-3 py-2 border-b text-xs uppercase"
          required
        />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Quotation Amount <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={quotationamount || ""}
          onInput={handleQuotationAmountChange}
          className="w-full px-3 py-2 border-b text-xs"
          required
        />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Type <span className="text-red-500">*</span></label>
        <select
          value={typecall || ""}
          onChange={(e) => settypecall(e.target.value)}
          className="w-full px-3 py-2 border-b text-xs capitalize bg-white"
          required
        >
          <option value="">Select Status</option>
          <option value="Follow Up Pending">Follow Up Pending</option>
          <option value="Requirements">No Requirements</option>
          <option value="Request for Quotation">Request for Quotation</option>
          <option value="Sent Quotation - Standard">Sent Quotation - Standard</option>
          <option value="Sent Quotation - With Special Price">Sent Quotation - With Special Price</option>
          <option value="Sent Quotation - With SPF">Sent Quotation - With SPF</option>
          <option value="With SPFS">With SPFS</option>
        </select>
      </div>
    </>
  );
};

export default QuotationFields;

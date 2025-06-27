import React from "react";

interface QuotationFieldsProps {
    sonumber: string;
    setsonumber: (val: string) => void;
    soamount: string;
    setsoamount: (val: string) => void;
    typecall: string;
    settypecall: (val: string) => void;
}

const SoFields: React.FC<QuotationFieldsProps> = ({
    sonumber,
    setsonumber,
    soamount,
    setsoamount,
    typecall,
    settypecall,
}) => {
    // Handler to sanitize quotation number input (letters and numbers only)
    const handleSONumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const sanitized = input.replace(/[^a-zA-Z0-9]/g, "");
        setsonumber(sanitized.toUpperCase());
    };

    // Handler to format quotation amount input (allow numbers and decimals)
    const handleSOAmountChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        // Remove commas, allow only one decimal point
        const formattedValue = inputValue.replace(/,/g, "").replace(/(\..*)\./g, "$1");
        setsoamount(formattedValue);
    };

    return (
        <>
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">SO Number</label>
                <input
                    type="text"
                    value={sonumber || ""}
                    onChange={handleSONumberChange}
                    className="w-full px-3 py-2 border-b text-xs uppercase"
                    required
                />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">SO Amount</label>
                <input
                    type="text"
                    value={soamount || ""}
                    onInput={handleSOAmountChange}
                    className="w-full px-3 py-2 border-b text-xs"
                    required
                />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Type</label>
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

export default SoFields;

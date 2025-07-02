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

    // Handler to allow only numbers and one decimal point
    const handleSOAmountChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;

        // Allow only digits and one dot
        const validInput = inputValue
            .replace(/[^\d.]/g, "")       // Remove non-numeric and non-dot characters
            .replace(/^(\d*\.\d*).*$/, "$1") // Allow only one dot (remove additional)
            .replace(/^0+(?=\d)/, "");    // Remove leading zeros except before decimal

        setsoamount(validInput);
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
                    <option value="Regular SO">Regular SO</option>
                    <option value="Willing to Wait">Willing to Wait</option>
                    <option value="SPF - Special Project">SPF - Special Project</option>
                    <option value="Local SPF">Local SPF</option>
                    <option value="SPF - Local">SPF - Local</option>
                    <option value="SPF - Foreign">SPF - Foreign</option>
                    <option value="Promo">Promo</option>
                    <option value="FB Marketplace">FB Marketplace</option>
                    <option value="Internal Order">Internal Order</option>
                </select>
            </div>
        </>
    );
};

export default SoFields;

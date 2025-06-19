import React from "react";
import Select from "react-select";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

interface AccordionProps {
    typeactivity: string; settypeactivity: (value: string) => void;
    projectname: string; setprojectname: (value: string) => void;
    projectcategory: string; setprojectcategory: (value: string) => void;
    projecttype: string; setprojecttype: (value: string) => void;
    source: string; setsource: (value: string) => void;
}

// Define product category options for react-select
const productCategoryOptions = [
    { value: "Bollard Light", label: "Bollard Light" },
    { value: "Bulb Light", label: "Bulb Light" },
    { value: "Canopy Light", label: "Canopy Light" },
    { value: "Downlight", label: "Downlight" },
    { value: "Emergency Light", label: "Emergency Light" },
    { value: "Exit Light", label: "Exit Light" },
    { value: "Flood Light", label: "Flood Light" },
    { value: "Garden Light", label: "Garden Light" },
    { value: "High Bay Light", label: "High Bay Light" },
    { value: "Lamp Post", label: "Lamp Post" },
    { value: "Light Fixtures and Housing", label: "Light Fixtures and Housing" },
    { value: "Linear Light", label: "Linear Light" },
    { value: "Louver Light", label: "Louver Light" },
    { value: "Neon Light", label: "Neon Light" },
    { value: "Panel Light", label: "Panel Light" },
    { value: "Pendant Light", label: "Pendant Light" },
    { value: "Power Supply", label: "Power Supply" },
    { value: "Rope Light", label: "Rope Light" },
    { value: "Solar Flood Light", label: "Solar Flood Light" },
    { value: "Solar Light", label: "Solar Light" },
    { value: "Solar Road Light", label: "Solar Road Light" },
    { value: "Solar Street Light", label: "Solar Street Light" },
    { value: "Spotlight", label: "Spotlight" },
    { value: "Street Light", label: "Street Light" },
    { value: "Strip Light", label: "Strip Light" },
    { value: "Swimming Pool Light", label: "Swimming Pool Light" },
    { value: "Track Light", label: "Track Light" },
    { value: "Tube Light", label: "Tube Light" },
    { value: "UV Disinfection Light", label: "UV Disinfection Light" },
    { value: "Wall Light", label: "Wall Light" },
    { value: "Weatherproof Fixture", label: "Weatherproof Fixture" },
    { value: "SPF ( Special Items )", label: "SPF ( Special Items )" },
    { value: "Various Lighting", label: "Various Lighting" },
    { value: "Item Not Carried", label: "Item Not Carried" },
];

const Accordion: React.FC<AccordionProps> = ({
    typeactivity, settypeactivity,
    projectname, setprojectname,
    projectcategory, setprojectcategory,
    projecttype, setprojecttype,
    source, setsource,
}) => {

    // Find selected option object for react-select based on current value
    const selectedCategory = productCategoryOptions.find(
        (opt) => opt.value === projectcategory
    ) || null;

    return (
        <div className="mb-4">
            <div>
                {typeactivity === "Quotation Preparation" && (
                    <div className="flex flex-wrap -mx-4 rounded">
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Project Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border-b text-xs capitalize"
                                placeholder="Project Name"
                                value={projectname || ""}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const sanitized = input.replace(/[^a-zA-Z0-9,\s/]/g, "");
                                    setprojectname(sanitized);
                                }}
                            />
                            <span className="text-[10px] text-red-500 capitalize">(enter "N/A" if not applicable)</span>
                        </div>

                        {/* Product Category - replaced with react-select */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Item Category</label>
                            <Select
                                options={productCategoryOptions}
                                value={selectedCategory}
                                onChange={(option) => setprojectcategory(option ? option.value : "")}
                                placeholder="Select Item"
                                isClearable
                                classNamePrefix="react-select"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        border: "none",
                                        borderBottom: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB",
                                        boxShadow: "none",
                                        borderRadius: "0px",
                                        minHeight: "3px",
                                        fontSize: "12px",
                                        backgroundColor: "white",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        fontSize: "10px",
                                        zIndex: 5,
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        textTransform: "capitalize",
                                    }),
                                }}
                            />
                        </div>


                        {/* Project Type */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Project Type</label>
                            <select
                                value={projecttype ?? ""}
                                onChange={(e) => setprojecttype(e.target.value)}
                                className="w-full px-3 py-2 border-b text-xs capitalize bg-white">
                                <option value="">Select Type</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                                <option value="B2G">B2G</option>
                                <option value="General Trade">GENTRADE</option>
                                <option value="Modern Trade">MODERN TRADE</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap -mx-4 rounded">
                {/* Source */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-1 text-black">Source</label>
                    <select
                        value={source ?? ""}
                        onChange={(e) => setsource(e.target.value)}
                        className="w-full px-3 py-2 border-b text-xs capitalize bg-white">
                        <option value="">Select Source</option>
                        <option value="Existing Client">Existing Client</option>
                        <option value="CSR Inquiry">CSR Inquiry</option>
                        <option value="Outbound - Follow-up">Outbound - Follow-up</option>
                        <option value="Outbound - Touchbase">Outbound - Touchbase</option>
                        <option value="Government">Government</option>
                        <option value="Philgeps- Website">Philgeps- Website</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Modern Trade">Modern Trade</option>
                        <option value="Facebook Marketplace">Facebook Marketplace</option>
                        <option value="Walk-in / Showroom">Walk-in / Showroom</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Accordion;

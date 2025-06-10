import React, { useState } from "react";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

interface AccordionProps {
    projectname: string;
    setprojectname: (value: string) => void;
    projectcategory: string;
    setprojectcategory: (value: string) => void;
    projecttype: string;
    setprojecttype: (value: string) => void;
    source: string;
    setsource: (value: string) => void;
}

const Accordion: React.FC<AccordionProps> = ({
    projectname,
    setprojectname,
    projectcategory,
    setprojectcategory,
    projecttype,
    setprojecttype,
    source,
    setsource,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <div className="border rounded-lg shadow-sm">
                {/* Accordion Header */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer transition"
                >
                    <span className="text-xs text-dark">Project Information</span>
                    {isOpen ? (
                        <CiSquareMinus className="text-xl text-black" />
                    ) : (
                        <CiSquarePlus className="text-xl text-black" />
                    )}
                </div>

                {/* Accordion Content */}
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "p-4" : "max-h-0 p-0"}`}>
                    <div className="flex flex-wrap -mx-4 rounded">
                        {/* Project Name */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Project Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded text-xs capitalize"
                                placeholder="Project Name"
                                value={projectname || ""} // ← Fix here
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const sanitized = input.replace(/[^a-zA-Z0-9,\s/]/g, "");
                                    setprojectname(sanitized);
                                }}
                            />

                            <span className="text-[10px] text-red-500 capitalize">(enter "N/A" if not applicable)</span>
                        </div>

                        {/* Project Category */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Project Category</label>
                            <select value={projectcategory ?? ""} onChange={(e) => setprojectcategory(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                <option value="">Select Category</option>
                                <option value="Bollard Light">Bollard Light</option>
                                <option value="Bulb Light">Bulb Light</option>
                                <option value="Canopy Light">Canopy Light</option>
                                <option value="Downlight">Downlight</option>
                                <option value="Emergency Ligh">Emergency Light</option>
                                <option value="Exit Light">Exit Light</option>
                                <option value="Flood Light">Flood Light</option>
                                <option value="Garden Light">Garden Light</option>
                                <option value="High Bay Light">High Bay Light</option>
                                <option value="Lamp Post">Lamp Post</option>
                                <option value="Light Fixtures and Housing">Light Fixtures and Housing</option>
                                <option value="Linear Light">Linear Light</option>
                                <option value="Louver Light">Louver Light</option>
                                <option value="Neon Light">Neon Light</option>
                                <option value="Panel Light">Panel Light</option>
                                <option value="Pendant Light">Pendant Light</option>
                                <option value="Power Supply">Power Supply</option>
                                <option value="Rope Light">Rope Light</option>
                                <option value="Solar Flood Light">Solar Flood Light</option>
                                <option value="Solar Light">Solar Light</option>
                                <option value="Solar Road Light">Solar Road Light</option>
                                <option value="Solar Street Light">Solar Street Light</option>
                                <option value="Spotlight">Spotlight</option>
                                <option value="Street Light">Street Light</option>
                                <option value="Strip Light">Strip Light</option>
                                <option value="Swimming Pool Light">Swimming Pool Light</option>
                                <option value="Track Light">Track Light</option>
                                <option value="Tube Light">Tube Light</option>
                                <option value="UV Disinfection Light">UV Disinfection Light</option>
                                <option value="Wall Light">Wall Light</option>
                                <option value="Weatherproof Fixture">Weatherproof Fixture</option>
                                <option value="SPF ( Special Items )">SPF ( Special Items )</option>
                                <option value="Various Lighting">Various Lighting</option>
                                <option value="Item Not Carried">Item Not Carried</option>
                            </select>
                        </div>

                        {/* Project Type */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Project Type</label>
                            <select value={projecttype ?? ""} onChange={(e) => setprojecttype(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                <option value="">Select Category</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                                <option value="B2G">B2G</option>
                                <option value="General Trade">General Trade</option>
                                <option value="Personal">Personal</option>
                                <option value="Building Maintenance">Building Maintenance</option>
                            </select>
                        </div>

                        {/* Source */}
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-1 text-black">Source</label>
                            <select value={source ?? ""} onChange={(e) => setsource(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                <option value="">Select Category</option>
                                <option value="Direct Client">Direct Client</option>
                                <option value="CSR Inquiries">CSR Inquiries</option>
                                <option value="Outbound">Outbound</option>
                                <option value="Philgeps">Philgeps</option>
                                <option value="Distributor">Distributor</option>
                                <option value="Modern Trade">Modern Trade</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;

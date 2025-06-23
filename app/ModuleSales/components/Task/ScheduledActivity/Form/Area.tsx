import React from "react";

interface AreaProps {
  area: string;
  setarea: (val: string) => void;
}

const Area: React.FC<AreaProps> = ({ area, setarea }) => {
  return (
    <select
      id="area"
      value={area ?? ""}
      onChange={(e) => setarea(e.target.value)}
      className="w-full px-3 py-2 border-b text-xs capitalize bg-white"
      required
    >
      <option value="">Select Region</option>
      <option value="Ilocos Region">Region I - Ilocos Region</option>
      <option value="Cagayan Valley">Region II - Cagayan Valley</option>
      <option value="Central Luzon">Region III - Central Luzon</option>
      <option value="Calabarzon">Region IV - CALABARZON</option>
      <option value="Bicol Region">Region V - Bicol Region</option>
      <option value="Western Visayas">Region VI - Western Visayas</option>
      <option value="Central Visayas">Region VII - Central Visayas</option>
      <option value="Easter Visayas">Region VIII - Easter Visayas</option>
      <option value="Zamboanga Peninsula">Region IX - Zamboanga Peninsula</option>
      <option value="Northern Mindanao">Region X - Northern Mindanao</option>
      <option value="Davao Region">Region XI - Davao Region</option>
      <option value="Soccsksargen">Region XII - SOCCSKSARGEN</option>
      <option value="National Capital Region">NCR</option>
      <option value="Cordillera Administrative Region">CAR</option>
      <option value="Bangsamoro Autonomous Region in Muslim Mindanao">BARMM</option>
      <option value="Caraga">Region XIII</option>
      <option value="Mimaropa Region">MIMAROPA Region</option>
    </select>
  );
};

export default Area;

// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-600 text-white font-bold py-4 w-full">
      <div className="container mx-auto text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Ecoshift Corporation | Enterprise Resource Planning Module <span className="bg-orange-700 p-2 rounded-md text-[10px]">Version 3.2</span></p>
      </div>
    </footer>
  );
};

export default Footer;

// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white py-4 w-full">
      <div className="container mx-auto text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Ecoshift Corporation | Enterprise Resource Planning Module </p>
      </div>
    </footer>
  );
};

export default Footer;

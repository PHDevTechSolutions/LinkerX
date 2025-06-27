import React, { useEffect } from "react";
import Image from "next/image";

interface FuturisticSpinnerProps {
  setShowSpinner: (visible: boolean) => void;
}

const FuturisticSpinner: React.FC<FuturisticSpinnerProps> = ({ setShowSpinner }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 2000); // Shorter delay for faster perceived load

    return () => clearTimeout(timer);
  }, [setShowSpinner]);

  return (
    <div className="flex justify-center items-center h-full w-full relative">
      {/* Rotating, glowing, fading logo */}
      <div className="relative z-10 animate-logo-spin-glow">
        <Image
          src="/taskflow.png"
          alt="Taskflow Logo"
          width={64}
          height={64}
          priority // Faster image fetch
        />
      </div>

      <style jsx>{`
        @keyframes logoSpinGlow {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
            filter: drop-shadow(0 0 6px #00ffff88) drop-shadow(0 0 12px #00ffffaa);
          }
          30% {
            transform: rotate(90deg) scale(1.05);
          }
          60% {
            transform: rotate(360deg) scale(1.1);
            filter: drop-shadow(0 0 24px #00ffffee) drop-shadow(0 0 36px #00ffffee);
          }
          80% {
            transform: rotate(1080deg) scale(1.15);
          }
          100% {
            transform: rotate(2160deg) scale(1.2);
            opacity: 0;
            filter: drop-shadow(0 0 0px #00ffff00);
          }
        }

        .animate-logo-spin-glow {
          animation: logoSpinGlow 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default FuturisticSpinner;

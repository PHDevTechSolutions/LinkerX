import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa"; // Using a spinner for loading state

const SessionChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Check localStorage first for cached session status
      const cachedSession = localStorage.getItem("isLoggedIn");

      if (cachedSession) {
        setLoading(false);
        const parsedSession = JSON.parse(cachedSession);
        if (!parsedSession.isLoggedIn) {
          router.push("/login");
        }
      } else {
        // Fetch session data if not cached
        try {
          const response = await fetch("/api/session");
          const data = await response.json();

          if (data.isLoggedIn) {
            // Cache session status for future checks
            localStorage.setItem("isLoggedIn", JSON.stringify(data));
            setLoading(false);
          } else {
            router.push("/login");
          }
        } catch (error) {
          console.error("Error checking session:", error);
          router.push("/login");
        }
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionChecker;

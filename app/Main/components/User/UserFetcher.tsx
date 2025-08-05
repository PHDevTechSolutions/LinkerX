
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa"; // Using a spinner icon for loading state

const UserFetcher: React.FC<{
  children: (user: Record<string, any> | null, loading: boolean) => React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      const cachedUser = localStorage.getItem(`user-${userId}`);
      if (cachedUser) {
        // Use cached user data if available
        setUser(JSON.parse(cachedUser));
        setLoading(false);
      } else {
        // Fetch user data if not cached
        fetch(`/api/user?id=${encodeURIComponent(userId)}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            return response.json();
          })
          .then((data) => {
            setUser(data);
            localStorage.setItem(`user-${userId}`, JSON.stringify(data)); // Cache the user data
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            setUser(null); // Reset user to null on error
          })
          .finally(() => {
            setLoading(false); // Set loading to false after fetch
          });
      }
    } else {
      setLoading(false); // No userId in URL; stop loading
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-gray-500" size={24} />
        </div>
      ) : (
        children(user, loading)
      )}
    </>
  );
};

export default UserFetcher;


export const FetchUserName = async (
    userId: string, 
    setUserName: React.Dispatch<React.SetStateAction<string>>
) => {
    if (userId) {
        try {
            const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
            const data = await response.json();
            
            if (data.Firstname && data.Lastname) {
                setUserName(`${data.Firstname} ${data.Lastname}`);
            } else {
                setUserName("");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
};
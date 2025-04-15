import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun, CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { motion } from "framer-motion";
import axios from "axios";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  status: string;  // Replaced typeactivity with status
  typeclient: string;
  date_updated: string;
  date_created: string;
  ticketreferencenumber: string;  // Assuming ticket reference number is important
  salesagentname: string;  // Assuming this is included in the notification object
  message: string;
  type: string;
  csragent: string;
  typeactivity: string;
  typecall: string;
  agentfullname: string;
  _id: string;
  recepient: string;
  sender: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

type TrackingItem = {
  _id: string; // MongoDB ObjectId (stored as a string)
  message: string;
  id: number;
  userName: string | null;  // Changed from agentfullname to userName
  type: string;
  status: string;
  createdAt: string;
  TrackingStatus: string;
  TicketConcern: string;
  CompanyName: string;
};

type Inquiries = {
  _id: string; // MongoDB ObjectId (stored as a string)
  message: string;
  id: number;
  userName: string | null;  // Changed from agentfullname to userName
  type: string;
  Status: string;
  createdAt: string;
  WrapUp: string;
  CompanyName: string;
  NotificationStatus: string;
};

type Email = {
  id: number;
  message: string;
  Email: string;
  subject: string;
  status: string;
  recepient: string;
  sender: string;
  date_created: string;
  NotificationStatus: string;
  recipientEmail: string;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Unread notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const [trackingNotifications, setTrackingNotifications] = useState<TrackingItem[]>([]);
  const [wrapUpNotifications, setWrapUpNotifications] = useState<Inquiries[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<Email[]>([]);

  const allNotifications = [...notifications, ...trackingNotifications];

  const [shake, setShake] = useState(false);

  const soundPlayed = localStorage.getItem("soundPlayed");

  // Play sound only once
  const playSound = () => {
    const audio = new Audio("/simple_notification.mp3");
    audio.play();
  };

  const hasNotifications = [
    trackingNotifications.filter((notif) => notif.type === "Taskflow Notification" && notif.status === "pending").length,
    trackingNotifications.filter((notif) => notif.type === "DTracking Notification" && notif.TrackingStatus === "Open" && notif.status !== "Read").length,
    wrapUpNotifications.filter((notif) => notif.type === "WrapUp Notification" && notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length
  ].some(count => count > 0);

  useEffect(() => {
    if (hasNotifications) {
      setShake(true); // Start shaking
    } else {
      setShake(false); // Stop shaking when no notifications
    }
  }, [hasNotifications]);

  useEffect(() => {
    if (hasNotifications && !soundPlayed) {
      playSound();
      localStorage.setItem("soundPlayed", "true"); // Mark sound as played
    }
  }, [hasNotifications, soundPlayed]);

  useEffect(() => {
    if (hasNotifications) {
      setShake(true); // Start shaking
    } else {
      setShake(false); // Stop shaking when no notifications
    }
  }, [hasNotifications]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setUserName(data.Firstname);
          setUserEmail(data.Email);
          setUserReferenceId(data.ReferenceID || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers"); // API endpoint mo
        const data = await response.json();
        setUsersList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Load dismissed notifications from localStorage
  useEffect(() => {
    if (!userReferenceId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/ModuleSales/Task/Callback/FetchCallback?referenceId=${userReferenceId}`
        );
        const data = await res.json();

        if (!data.success) return;

        // Get current date (without time) for checking notifications
        const today = new Date().setHours(0, 0, 0, 0);

        // ✅ Filter valid notifications based on type (including CSR Notification)
        const validNotifications = data.data
          .map((notif: any) => {
            // Hanapin ang Agent na may parehong ReferenceID sa usersList
            const agent = usersList.find((user) => user.ReferenceID === notif.referenceid);

            return {
              ...notif,
              agentfullname: agent
                ? `${agent.Firstname} ${agent.Lastname}`
                : "Unknown Agent",
            };
          })
          .filter((notif: any) => {
            switch (notif.type) {
              case "Taskflow Notification":
                if (notif.date_created) {
                  const inquiryDate = new Date(notif.date_created).setHours(0, 0, 0, 0);

                  // ✅ Check if CSR agent matches userReferenceId and date is valid
                  if (notif.csragent === userReferenceId && inquiryDate <= today) {
                    return true;
                  }
                }
                return false;

              default:
                return false;
            }
          })
          // ✅ Sort notifications by date_created or callback in DESCENDING order
          .sort((a: any, b: any) => {
            const dateA = new Date(a.callback || a.date_created).getTime();
            const dateB = new Date(b.callback || b.date_created).getTime();
            return dateB - dateA; // Descending order
          });

        // ✅ Set valid notifications
        setNotifications(validNotifications);
        setNotificationCount(validNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userReferenceId, usersList]);

  const fetchTrackingData = async () => {
    try {
      if (!userReferenceId) {
        console.error("userReferenceId is missing.");
        return;
      }

      const res = await fetch(`/api/ModuleCSR/DTracking/FetchTrackingNotification?referenceId=${userReferenceId}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: TrackingItem[] = await res.json();

      // Filter by "Delivery / Pickup" and "Quotation" TicketConcern types
      const filtered = data.filter((item: TrackingItem) =>
        item.TicketConcern === "Delivery / Pickup" ||
        item.TicketConcern === "Quotation" ||
        item.TicketConcern === "Documents" ||
        item.TicketConcern === "Return Call" ||
        item.TicketConcern === "Payment Terms" ||
        item.TicketConcern === "Refund" ||
        item.TicketConcern === "Replacement" ||
        item.TicketConcern === "Site Visit" ||
        item.TicketConcern === "TDS" ||
        item.TicketConcern === "Shop Drawing" ||
        item.TicketConcern === "Dialux" ||
        item.TicketConcern === "Product Testing" ||
        item.TicketConcern === "SPF" ||
        item.TicketConcern === "Accreditation Request" ||
        item.TicketConcern === "Job Request" ||
        item.TicketConcern === "Product Recommendation" ||
        item.TicketConcern === "Product Certificate"
      );

      if (filtered.length > 0) {
        const mapped = filtered.map((item: TrackingItem) => {
          const createdAt = new Date(item.createdAt || new Date().toISOString());
          const currentTime = new Date();

          const timeDifference = currentTime.getTime() - createdAt.getTime();
          const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
          const hoursDifference = timeDifference / (1000 * 3600);

          if (item.TrackingStatus === "Open") {
            const baseNotification = {
              _id: item._id,
              userName: item.userName || "System",
              type: "DTracking Notification",
              TrackingStatus: "Open",
              createdAt: createdAt.toISOString(),
              TicketConcern: item.TicketConcern,
              CompanyName: item.CompanyName,
              status: item.status,
            };

            if (item.TicketConcern === "Delivery / Pickup" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `The 'Delivery/Pickup' ticket is still unresolved after ${daysDifference} days.`,
              };
            }

            if (item.TicketConcern === "Quotation" && hoursDifference >= 4) {
              return {
                ...baseNotification,
                message: `You have an active 'Quotation' ticket that has been open for over 4 hours.`,
              };
            }

            if (item.TicketConcern === "Documents" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `You have an active 'Documents' ticket that is still open after 1 day.`,
              };
            }

            if (item.TicketConcern === "Return Call" && hoursDifference >= 4) {
              return {
                ...baseNotification,
                message: `You currently have an active 'Return Call' ticket. Please take the necessary action.`,
              };
            }

            if (item.TicketConcern === "Payment Terms" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Payment Terms' ticket is still open and needs your attention.`,
              };
            }

            if (item.TicketConcern === "Refund" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Refund' ticket is still open and requires your attention.`,
              };
            }

            if (item.TicketConcern === "Replacement" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'Replacement' ticket remains open. Please follow up.`,
              };
            }

            if (item.TicketConcern === "Site Visit" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Site Visit' ticket is still open and awaiting your follow-up.`,
              };
            }

            if (item.TicketConcern === "TDS" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'TDS' ticket is still open. Please take action.`,
              };
            }

            if (item.TicketConcern === "Shop Drawing" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Shop Drawing' ticket is still open. Kindly address it.`,
              };
            }

            if (item.TicketConcern === "Dialux" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'Dialux' ticket remains open. Please follow up.`,
              };
            }

            if (item.TicketConcern === "Product Testing" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Product Testing' ticket remains open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "SPF" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'SPF' ticket remains open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Accreditation Request" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Accreditation Request' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Job Request" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Job Request' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Product Recommendation" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Product Recommendation' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Product Certificate" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Product Certificate' ticket is still open. Kindly resolve it.`,
              };
            }
          }

          return null;
        }).filter(Boolean); // Remove nulls

        // Filter out null values before setting the state
        const validMapped = mapped.filter(item => item !== null) as TrackingItem[];

        if (validMapped.length > 0) {
          setTrackingNotifications(validMapped); // Set notifications in state
        }
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    }
  };

  // Trigger the fetch when userReferenceId changes
  useEffect(() => {
    if (userReferenceId) {
      fetchTrackingData(); // Initial fetch

      const interval = setInterval(() => {
        fetchTrackingData(); // Fetch every 30 seconds
      }, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userReferenceId]);

  const fetchWrapUpData = async () => {
    try {
      if (!userReferenceId) {
        console.error("userReferenceId is missing.");
        return;
      }

      const res = await fetch(`/api/ModuleCSR/WrapUp/FetchWrapUpNotification?referenceId=${userReferenceId}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: Inquiries[] = await res.json();

      const validWrapUps = [
        "Customer Inquiry Sales",
        "Customer Inquiry Non-Sales",
        "Follow Up Sales",
        "After Sales",
        "Customer Complaint",
        "Follow Up Non-Sales",
      ];

      const filtered = data.filter(
        (item) =>
          validWrapUps.includes(item.WrapUp) &&
          item.Status === "Endorsed" &&
          item.NotificationStatus !== "Read"
      );

      const notifications = filtered
        .map((item) => {
          const createdAt = new Date(item.createdAt || new Date().toISOString());
          const currentTime = new Date();
          const timeDiff = currentTime.getTime() - createdAt.getTime();

          const hours = timeDiff / (1000 * 3600);
          const days = Math.floor(timeDiff / (1000 * 3600 * 24));

          let shouldNotify = false;

          switch (item.WrapUp) {
            case "Customer Inquiry Sales":
            case "Follow Up Sales":
              shouldNotify = hours >= 4;
              break;

            case "Customer Inquiry Non-Sales":
              shouldNotify = hours >= 4;
              break;

            case "After Sales":
              shouldNotify = days >= 3;
              break;

            case "Customer Complaint":
              shouldNotify = timeDiff >= 24 * 60 * 60 * 1000;
              break;

            case "Follow Up Non-Sales":
              shouldNotify = timeDiff >= 60 * 1000;
              break;

            default:
              shouldNotify = false;
          }

          if (shouldNotify) {
            return {
              _id: item._id,
              message: `The '${item.WrapUp}' ticket is still unresolved.`,
              userName: item.userName || "System",
              type: "WrapUp Notification",
              Status: item.Status,
              createdAt: createdAt.toISOString(),
              WrapUp: item.WrapUp,
              CompanyName: item.CompanyName,
              NotificationStatus: item.NotificationStatus,
            };
          }

          return null;
        })
        .filter(Boolean) as Inquiries[];

      if (notifications.length > 0) {
        setWrapUpNotifications(notifications);
      }
    } catch (error) {
      console.error("Error fetching wrap-up data:", error);
    }
  };

  // Trigger the fetch when userReferenceId changes
  useEffect(() => {
    if (userReferenceId) {
      fetchWrapUpData(); // Initial fetch

      const interval = setInterval(() => {
        fetchWrapUpData(); // Fetch every 30 seconds
      }, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userReferenceId]);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        if (!userReferenceId) {
          console.error("userReferenceId is missing.");
          return;
        }

        const res = await fetch(`/api/ModuleCSR/Email/FetchEmail?referenceId=${userReferenceId}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const jsonResponse = await res.json();
        console.log("API Response:", jsonResponse);  // Log to inspect the response

        // Ensure that data is an array
        const data: Email[] = Array.isArray(jsonResponse.data) ? jsonResponse.data : [];

        // Filter emails with status 'Pending' and NotificationStatus not 'Read', 
        // and check if the recipient email matches the user's email
        const filteredEmails = data.filter(
          (item: Email) => // Specify the type for 'item'
            item.status === "Pending" &&
            item.recepient === userEmail // Match recipient's email to your email
        );

        if (filteredEmails.length > 0) {
          setEmailNotifications(filteredEmails); // Update state with filtered emails
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
      }
    };

    if (userReferenceId && userEmail) {
      fetchEmailData(); // Initial fetch

      const interval = setInterval(() => {
        fetchEmailData(); // Fetch every 30 seconds
      }, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userReferenceId, userEmail]);

  // ✅ Handle click outside to close notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
    sessionStorage.clear();
    router.replace("/Login");
  };

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ✅ Handle notification click and dismiss
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false); // This could be closing the modal prematurely
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (notifId: number) => {
    try {
      setLoadingId(notifId); // Start loading

      const response = await fetch(
        "/api/ModuleSales/Notification/UpdateNotifications",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notifId, status: "Read" }),
        }
      );

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedNotifications = notifications.map((notif) =>
          notif.id === notifId ? { ...notif, status: "Read" } : notif
        );
        setNotifications(updatedNotifications);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notifId)
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        console.error("Error updating notification status");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  const handleMarkAsStatusRead = async (notifId: string) => {
    try {
      setLoadingId(notifId); // Start loading with the string ID

      const response = await fetch("/api/ModuleCSR/DTracking/UpdateNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifId, status: "Read" }),
      });

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedNotifications = notifications.map((notif) =>
          notif._id === notifId ? { ...notif, status: "Read" } : notif
        );
        setNotifications(updatedNotifications);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif._id !== notifId)
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        const errorDetails = await response.json();
        console.error("Error updating notification status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  const handleMarkAsNotifStatusRead = async (notifId: string) => {
    try {
      setLoadingId(notifId); // Start loading with the string ID

      const response = await fetch("/api/ModuleCSR/WrapUp/UpdateNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifId, NotificationStatus: "Read" }),
      });

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedNotifications = notifications.map((notif) =>
          notif._id === notifId ? { ...notif, NotificationStatus: "Read" } : notif
        );
        setNotifications(updatedNotifications);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif._id !== notifId)
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        const errorDetails = await response.json();
        console.error("Error updating notification status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  const UpdateEmailStatus = async (emailId: string) => {
    try {
      setLoadingId(emailId); // Start loading with the string ID

      const emailIdAsString = emailId.toString(); // Ensure it's always a string

      const response = await fetch("/api/ModuleSales/Email/ComposeEmail/UpdateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [emailIdAsString], // Send emailId as an array
          status: "Read",
        }),
      });

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedEmails = emailNotifications.map((email) =>
          email.id.toString() === emailIdAsString // Convert email.id to string for comparison
            ? { ...email, status: "Read" }
            : email
        );
        setEmailNotifications(updatedEmails);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setEmailNotifications((prev) =>
            prev.filter((email) => email.id.toString() !== emailIdAsString) // Convert to string for comparison
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        const errorDetails = await response.json();
        console.error("Error updating email status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking email as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  return (
    <div className={`sticky top-0 z-[999] flex justify-between items-center p-4 shadow-md transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <span className="flex items-center text-gray-900 border text-sm shadow-md text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
          <CiClock2 className="mr-1" /> {currentTime}
        </span>
      </div>

      <div className="relative flex items-center text-center text-xs space-x-2" ref={dropdownRef}>
        <button
          onClick={onToggleTheme}
          className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-8 p-1 transition-all duration-300"
        >
          {/* Toggle Knob with Icon Centered */}
          <div
            className={`w-6 h-6 bg-white dark:bg-yellow-400 rounded-full shadow-md flex justify-center items-center transform transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? (
              <CiDark size={16} className="text-gray-900 dark:text-gray-300" />
            ) : (
              <CiSun size={16} className="text-yellow-500" />
            )}
          </div>
        </button>

        {/* Notification Icon */}
        <button onClick={() => setShowSidebar((prev) => !prev)} className="p-2 relative flex items-center hover:bg-gray-200 hover:rounded-full">
          <CiBellOn size={20} className={`${shake ? "animate-shake" : ""}`} />

          {/* Combined Count for All Unread or Pending Notifications */}

          {(() => {
            const taskflowCount = trackingNotifications.filter(
              (notif) => notif.type === "Taskflow Notification" && notif.status === "pending"
            ).length;

            const dTrackingCount = trackingNotifications.filter(
              (notif) => notif.type === "DTracking Notification" &&
                notif.TrackingStatus === "Open" &&
                notif.status !== "Read"
            ).length;

            const wrapUpCount = wrapUpNotifications.filter(
              (notif) => notif.type === "WrapUp Notification" &&
                notif.Status === "Endorsed" &&
                notif.NotificationStatus !== "Read"
            ).length;

            const emailCount = emailNotifications.filter(
              (notif) => notif.status === "Pending" && notif.recepient === userEmail
            ).length;

            const totalCount = taskflowCount + dTrackingCount + wrapUpCount + emailCount;

            return totalCount > 0 ? (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalCount}
              </span>
            ) : null;
          })()}
        </button>

        {showSidebar && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-lg z-[1000] flex flex-col"
          >
            {/* 🔧 Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <button onClick={() => setShowSidebar(false)}>
                <IoIosCloseCircleOutline size={20} />
              </button>
            </div>

            {/* 📜 Notifications List */}
            <div className="flex-1 overflow-auto p-2">
              <div className="flex border-b mb-2">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "notifications" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "messages" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                >
                  Messages
                </button>
              </div>

              {activeTab === "notifications" ? (
                <>
                  {notifications.filter((notif) => notif.status === "pending").length > 0 ? (
                    <ul className="space-y-2">
                      {notifications
                        .filter((notif) => notif.status === "pending")
                        .map((notif, index) => (
                          <li
                            key={notif.id || index}
                            className={`p-3 border-b hover:bg-gray-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "Inquiry Notification" ? "bg-yellow-200" : "bg-gray-100"}`}
                          >
                            <p className="text-[10px] mt-5">{notif.message} Processed By {notif.agentfullname}</p>

                            {/* Timestamp for Callback Notification */}
                            {notif.date_created && notif.type === "Taskflow Notification" && (
                              <span className="text-[8px] mt-1 block">
                                {new Date(notif.date_created).toLocaleString()}
                              </span>
                            )}

                            {/* ✅ Mark as Read Button */}
                            <button
                              onClick={() => handleMarkAsStatusRead(notif._id)} // Pass string _id
                              disabled={loadingId === notif._id} // Disable if loadingId matches _id
                              className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                                ? "text-green-600 font-bold"
                                : loadingId === notif._id
                                  ? "text-gray-500 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-800"
                                }`}
                            >
                              {loadingId === notif._id
                                ? "Loading..."
                                : notif.status === "Read"
                                  ? "Read"
                                  : "Mark as Read"}
                            </button>

                          </li>
                        ))}
                    </ul>
                  ) : (
                    <></>
                  )}

                  {trackingNotifications.filter((notif) => notif.TrackingStatus === "Open" && notif.status !== "Read").length > 0 ? (
                    <ul className="space-y-2">
                      {trackingNotifications
                        .filter((notif) => notif.TrackingStatus === "Open" && notif.status !== "Read")
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((notif, index) => (
                          <li
                            key={notif._id || index}
                            className={`p-3 mb-2 hover:bg-green-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "DTracking Notification" ? "bg-green-100" : "bg-green-500"}`}
                          >
                            <p className="text-[12px] mt-5 font-bold uppercase italic">{notif.CompanyName} </p>
                            <p className="text-[10px] mt-1 font-semibold">{notif.message}</p>
                            <p className="text-[10px] mt-1 font-semibold">{notif.status}</p>
                            <span className="text-[8px] mt-1 block">{new Date(notif.createdAt).toLocaleString()}</span>
                            <button
                              onClick={() => handleMarkAsStatusRead(notif._id)} // Make sure this is a string ID
                              disabled={loadingId === notif._id} // Disabled based on _id
                              className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                                ? "text-green-600 font-bold"
                                : loadingId === notif._id
                                  ? "text-gray-500 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-800"
                                }`}
                            >
                              {loadingId === notif._id
                                ? "Loading..."
                                : notif.status === "Read"
                                  ? "Read"
                                  : "Mark as Read"}
                            </button>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <></>
                  )}

                  {wrapUpNotifications.filter((notif) => notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length > 0 ? (
                    <ul className="space-y-2">
                      {wrapUpNotifications
                        .filter((notif) => notif.Status === "Endorsed")
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((notif, index) => (
                          <li
                            key={notif._id || index}
                            className={`p-3 mb-2 hover:bg-orange-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "WrapUp Notification" ? "bg-orange-100" : "bg-green-500"}`}
                          >
                            <p className="text-[12px] mt-5 font-bold uppercase italic">{notif.CompanyName} </p>
                            <p className="text-[10px] mt-1 font-semibold">{notif.message}</p>
                            <span className="text-[8px] mt-1 block">{new Date(notif.createdAt).toLocaleString()}</span>
                            <button
                              onClick={() => handleMarkAsNotifStatusRead(notif._id)} // Make sure this is a string ID
                              disabled={loadingId === notif._id} // Disabled based on _id
                              className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.NotificationStatus === "Read"
                                ? "text-green-600 font-bold"
                                : loadingId === notif._id
                                  ? "text-gray-500 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-800"
                                }`}
                            >
                              {loadingId === notif._id
                                ? "Loading..."
                                : notif.NotificationStatus === "Read"
                                  ? "Read"
                                  : "Mark as Read"}
                            </button>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  <>
                    {emailNotifications.length > 0 ? (
                      <ul className="space-y-2">
                        {emailNotifications
                          .filter((notif) => notif.status === "Pending") // Filter only "Pending" status emails
                          .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by latest date
                          .map((email, index) => (
                            <li
                              key={index}
                              className="p-3 mb-2 hover:bg-blue-200 hover:text-black text-xs text-gray-900 bg-blue-900 text-white capitalize text-left rounded-md relative"
                            >
                              <p className="text-[10px] mt-5 font-bold uppercase italic">Sender: {email.sender}</p>
                              <p className="text-[10px] mt-5 font-bold uppercase italic">Subject: {email.subject}</p>
                              <p className="text-[10px] mt-1 font-semibold">
                                Message: {email.message.length > 100 ? `${email.message.substring(0, 100)}...` : email.message}
                              </p>
                              <span className="text-[8px] mt-1 block">{new Date(email.date_created).toLocaleString()}</span>
                              <button
                                onClick={() => UpdateEmailStatus(email.id.toString())} // Convert email.id to string
                                disabled={loadingId === email.id.toString()} // Convert email.id to string for comparison
                                className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${email.status === "Read"
                                  ? "text-green-600 font-bold"
                                  : loadingId === email.id.toString()
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "text-white hover:text-blue-800"
                                  }`}
                              >
                                {loadingId === email.id.toString()
                                  ? "Loading..."
                                  : email.status === "Read"
                                    ? "Read"
                                    : "Mark as Read"}
                              </button>

                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div>No pending notifications</div> // Placeholder for when there are no pending emails
                    )}
                  </>
                </div>

              )}
            </div>
          </motion.div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 p-2 hover:rounded-full">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
            <p className="px-4 py-2 text-gray-700 text-xs border-b">{userReferenceId}</p>
            <button
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-100 flex justify-center items-center"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-red-500" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
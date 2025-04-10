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

  const allNotifications = [...notifications, ...trackingNotifications];

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
          const createdAt = new Date(item.createdAt || new Date().toISOString()); // Parse createdAt
          const currentTime = new Date(); // Get current time

          // Get the time difference in milliseconds
          const timeDifference = currentTime.getTime() - createdAt.getTime();
          const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
          const hoursDifference = timeDifference / (1000 * 3600);

          // Check if the status is still "Open"
          if (item.TrackingStatus === "Open") {
            // Notification logic for "Delivery / Pickup Notify Every 3 Days until status becomes Closed
            if (item.TicketConcern === "Delivery / Pickup" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `The 'Delivery/Pickup' ticket is still unresolved after ${daysDifference} days.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Quotation" - after 4 hours
            if (item.TicketConcern === "Quotation" && hoursDifference >= 4 && hoursDifference < 8) {
              return {
                _id: item._id,
                message: `You have an active 'Quotation' ticket that has been open for over 4 hours. Please review the status.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Documents" notify after 1 day
            if (item.TicketConcern === "Documents" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `You have an active 'Documents' ticket that is still open after 1 day.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Return Call" - notify once after 4 hours if status is still "Open"
            if (item.TicketConcern === "Return Call" && hoursDifference >= 4 && hoursDifference < 8) {
              return {
                _id: item._id,
                message: `You currently have an active 'Return Call' ticket that is still open and awaiting further action. Please take the necessary steps to address it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }


            // Notification logic for "Payment Terms" - notify every 2 days until status becomes Closed
            if (item.TicketConcern === "Payment Terms" && daysDifference >= 2 && daysDifference % 2 === 0) {
              return {
                _id: item._id,
                message: `Your 'Payment Terms' ticket is still open and requires your attention. Kindly take the appropriate steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Refund" - notify every 2 days until status becomes Closed
            if (item.TicketConcern === "Refund" && daysDifference >= 2 && daysDifference % 2 === 0) {
              return {
                _id: item._id,
                message: `Your 'Refund' ticket is still open and requires your attention. Kindly take the appropriate steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Replacement" - notify every 3 days until status becomes Closed
            if (item.TicketConcern === "Replacement" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `Your 'Replacement' ticket remains open and requires your follow-up. Kindly take the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Site Visit" - notify every 2 days until status becomes Closed
            if (item.TicketConcern === "Site Visit" && daysDifference >= 2 && daysDifference % 2 === 0) {
              return {
                _id: item._id,
                message: `Your 'Site Visit' ticket is still open and awaiting your follow-up. Please take the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "TDS" - notify after 1 day until status becomes Closed
            if (item.TicketConcern === "TDS" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `Your 'TDS' ticket is still open and awaiting your follow-up. Please take the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Shop Drawing" - notify after 1 day until status becomes Closed
            if (item.TicketConcern === "Shop Drawing" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `Your 'Shop Drawing' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Dialux" - notify every 3 days until status becomes Closed
            if (item.TicketConcern === "Dialux" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `Your 'Dialux' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Product Testing" - notify every 2 days until status becomes Closed
            if (item.TicketConcern === "Product Testing" && daysDifference >= 2 && daysDifference % 2 === 0) {
              return {
                _id: item._id,
                message: `Your 'Product Testing' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "SPF" - notify every 3 days until status becomes Closed
            if (item.TicketConcern === "SPF" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `Your 'SPF' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Accreditation Request" - notify after 1 day until status becomes Closed
            if (item.TicketConcern === "Accreditation Request" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `Your 'Accreditation Request' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Job Request" - notify every 3 days until status becomes Closed
            if (item.TicketConcern === "Job Request" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `Your 'Job Request' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Product Recommendation" - notify after 1 day until status becomes Closed
            if (item.TicketConcern === "Product Recommendation" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `Your 'Product Recommendation' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            // Notification logic for "Product Certificate" - notify after 1 day until status becomes Closed
            if (item.TicketConcern === "Product Certificate" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `Your 'Product Certificate' ticket remains open and is awaiting your attention. Kindly proceed with the necessary steps to resolve it.`,
                userName: item.userName || "System",
                type: "DTracking Notification",
                TrackingStatus: "Open",
                createdAt: createdAt.toISOString(),
                TicketConcern: item.TicketConcern,
                CompanyName: item.CompanyName,
                status: item.status,
              };
            }

            //if (item.TicketConcern === "Product Certificate" && timeDifference >= 60 * 1000) {
            //return {
            //_id: item._id,
            //message: `Your 'Product Certificate' ticket is still open and requires your attention. Kindly take the appropriate steps to resolve it.`,
            //userName: item.userName || "System",
            //type: "DTracking Notification",
            //TrackingStatus: "Open",
            //createdAt: createdAt.toISOString(),
            //TicketConcern: item.TicketConcern,
            //CompanyName: item.CompanyName,
            //status: item.status,
            //};
            //}
          }

          return null; // No notification if status is not "Open" or conditions are not met
        });

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

      // Filter by "Delivery / Pickup" and "Quotation" TicketConcern types
      const filtered = data.filter((item: Inquiries) =>
        item.WrapUp === "Customer Inquiry Sales" ||
        item.WrapUp === "Customer Inquiry Non-Sales" ||
        item.WrapUp === "Follow Up Sales" ||
        item.WrapUp === "After Sales" ||
        item.WrapUp === "Customer Complaint" ||
        item.WrapUp === "Follow Up Non-Sales"
      );

      if (filtered.length > 0) {
        const mapped = filtered.map((item: Inquiries) => {
          const createdAt = new Date(item.createdAt || new Date().toISOString()); // Parse createdAt
          const currentTime = new Date(); // Get current time

          // Get the time difference in milliseconds
          const timeDifference = currentTime.getTime() - createdAt.getTime();
          const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
          const hoursDifference = timeDifference / (1000 * 3600);

          // Check if the status is still "Open"
          if (item.Status === "Endorsed") {
            // Notification logic for "Customer Inquiry Sales
            if (item.WrapUp === "Customer Inquiry Sales" && hoursDifference >= 4 && hoursDifference < 8) {
              return {
                _id: item._id,
                message: `The 'Customer Inquiry Sales' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }

            if (item.WrapUp === "Customer Inquiry Non-Sales" && hoursDifference >= 4 && hoursDifference < 4) {
              return {
                _id: item._id,
                message: `The 'Customer Inquiry Non-Sales' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }

            if (item.WrapUp === "Follow Up Sales" && hoursDifference >= 4 && hoursDifference < 8) {
              return {
                _id: item._id,
                message: `The 'Follow Up Sales' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }

            if (item.WrapUp === "After Sales" && daysDifference >= 3 && daysDifference % 3 === 0) {
              return {
                _id: item._id,
                message: `The 'After Sales' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }

            if (item.WrapUp === "Customer Complaint" && timeDifference >= 24 * 60 * 60 * 1000) {
              return {
                _id: item._id,
                message: `The 'Customer Complaint' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }

            if (item.WrapUp === "Follow Up Non-Sales" && timeDifference >= 60 * 1000) {
              return {
                _id: item._id,
                message: `The 'Follow Up Non-Sales' ticket is still unresolved.`,
                userName: item.userName || "System",
                type: "WrapUp Notification",
                Status: "Endorsed",
                createdAt: createdAt.toISOString(),
                WrapUp: item.WrapUp,
                CompanyName: item.CompanyName,
                NotificationStatus: item.NotificationStatus,
              };
            }
          }
          
          return null; // No notification if status is not "Open" or conditions are not met
        });

        // Filter out null values before setting the state
        const validMapped = mapped.filter(item => item !== null) as Inquiries[];

        if (validMapped.length > 0) {
          setWrapUpNotifications(validMapped); // Set notifications in state
        }
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
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
          <CiBellOn size={20} />

          {/* Count for CSR Notifications */}
          {trackingNotifications.filter((notif) => notif.type === "Taskflow Notification" && notif.status === "pending").length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {trackingNotifications.filter((notif) => notif.type === "Taskflow Notification" && notif.status === "pending").length}
            </span>
          )}

          {/* Count for DTracking Notifications, excluding "Read" */}
          {trackingNotifications.filter((notif) => notif.type === "DTracking Notification" && notif.TrackingStatus === "Open" && notif.status !== "Read").length > 0 && (
            <span className="absolute top-0 right-0 bg-green-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {trackingNotifications.filter((notif) => notif.type === "DTracking Notification" && notif.TrackingStatus === "Open" && notif.status !== "Read").length}
            </span>
          )}
          
          {wrapUpNotifications.filter((notif) => notif.type === "WrapUp Notification" && notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length > 0 && (
            <span className="absolute top-0 right-0 bg-green-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {wrapUpNotifications.filter((notif) => notif.type === "WrapUp Notification" && notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length}
            </span>
          )}
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
                <div className="p-4 text-center text-xs text-gray-500">No messages available</div>
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
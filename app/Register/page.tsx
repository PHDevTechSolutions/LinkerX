"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { CiDark, CiSun } from "react-icons/ci";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { motion } from "framer-motion";

interface RoleCardProps {
    title: string;
    value: string;
    selected: string;
    setSelected: (value: string) => void;
    icon: string;
    description: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
    title,
    value,
    selected,
    setSelected,
    icon,
    description,
}) => {
    const isSelected = selected === value;
    return (
        <div
            onClick={() => setSelected(value)}
            className={`cursor-pointer border rounded-lg p-4 transition transform hover:scale-[1.02] ${isSelected
                ? "border-cyan-500 bg-cyan-100/10 backdrop-blur-sm"
                : "border-gray-300 bg-transparent"
                }`}
        >
            <div className="flex items-center mb-2 text-base font-medium">
                <span className="text-xl mr-2">{icon}</span>
                {title}
            </div>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
};

const Register: React.FC = () => {
    const steps = ["Account Info", "Department", "Role", "Review & Submit"];
    const [currentStep, setCurrentStep] = useState(0);
    const [userName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Role, setRole] = useState("");
    const [Department, setDepartment] = useState("");
    const [Firstname, setFirstname] = useState("");
    const [Lastname, setLastname] = useState("");
    const [Location, setLocation] = useState("");
    const [ReferenceID, setReferenceID] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const router = useRouter();

    const isDark = theme === "dark";
    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    const getPasswordSuggestion = () => {
        if (Password.length === 0) return "Password must be at least 6 characters";
        if (Password.length < 6) return "Password too short";
        if (!/[A-Z]/.test(Password)) return "Include at least 1 capital letter";
        if (!/[0-9]/.test(Password)) return "Include at least 1 number";
        if (!/[\W_]/.test(Password)) return "Include at least 1 special character";
        return "Strong password!";
    };

    const validateStep = () => {
        if (currentStep === 0) {
            if (!userName || !Email || !Password) {
                toast.error("Please fill out all account info fields.");
                return false;
            }
            if (getPasswordSuggestion() !== "Strong password!") {
                toast.error("Please fix your password according to suggestions.");
                return false;
            }
        }
        if (currentStep === 1 && !Department) {
            toast.error("Please select a role.");
            return false;
        }
        if (currentStep === 2 && !Role) {
            toast.error("Please select a department.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Function para gumawa ng random 6-digit number
  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates 6-digit number
  };

  // useEffect para auto-generate ang Reference ID
  useEffect(() => {
    if (Firstname && Lastname && Location) {
      const firstLetterFirstName = Firstname.charAt(0).toUpperCase();
      const firstLetterLastName = Lastname.charAt(0).toUpperCase();
      const randomNum = generateRandomNumber();
      const newReferenceID = `${firstLetterFirstName}${firstLetterLastName}-${Location}-${randomNum}`;
      setReferenceID(newReferenceID);
    }
  }, [Firstname, Lastname, Location]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateStep()) return;
            setLoading(true);
            try {
                const response = await fetch("/api/Register/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName, Email, Password, Role, Department, Firstname, Lastname, Location, ReferenceID }),
                });

                const result = await response.json();
                if (response.ok) {
                    toast.success("Registration successful!");
                    setTimeout(() => router.push("/Login"), 1500);
                } else {
                    toast.error(result.message || "Registration failed!");
                }
            } catch {
                toast.error("An error occurred while registering!");
            } finally {
                setLoading(false);
            }
        },
        [userName, Email, Password, Role, Department, router]
    );

    const containerVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
    };

    return (
        <div
            className={`flex min-h-screen items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300 ${isDark
                ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
                : "bg-gradient-to-br from-white via-gray-100 to-white text-black"
                }`}
        >
            <ToastContainer
                className="text-xs"
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
                transition={Slide}
            />

            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00ffcc33_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

            {/* Theme Toggle */}
            <div className="absolute top-5 right-5 z-20">
                <motion.button
                    onClick={toggleTheme}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-yellow-400" : "bg-gray-800"
                        } text-white shadow-md transition-colors duration-300`}
                    title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
                >
                    {isDark ? <CiSun className="w-5 h-5 text-black" /> : <CiDark className="w-5 h-5 text-white" />}
                </motion.button>
            </div>

            {/* Animation / Motion */}
            <motion.div
                key={currentStep} // important for animation on step change
                custom={currentStep}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className={`p-10 backdrop-blur-xl ${isDark ? "bg-white/10 border-white/20" : "bg-black/2 border-black/20"
                    } border rounded-2xl shadow-2xl`}
            >
                <div className="flex flex-col items-center mb-6 text-center">
                    <Image src="/ecoshift.png" alt="Ecoshift Corporation" width={200} height={100} className="mb-4" />
                    <h1 className="text-xl font-bold tracking-widest">Create Your Account</h1>
                    <p className="text-xs mt-2 max-w-sm">{steps[currentStep]}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    {/* Step 0: User info */}
                    {currentStep === 0 && (
                        <>
                            <div>
                                <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)} />
                                <label className="text-xs block mb-1">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className={`w-full px-4 py-2 bg-transparent border capitalize ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                        } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label className="text-xs block mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 bg-transparent border ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                        } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label className="text-xs block mb-1">Firstname</label>
                                <input
                                    type="text"
                                    placeholder="Enter your Firstname"
                                    value={Firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className={`w-full px-4 py-2 bg-transparent border capitalize ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                        } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="firstname"
                                />
                            </div>

                            <div>
                                <label className="text-xs block mb-1">Lastname</label>
                                <input
                                    type="text"
                                    placeholder="Enter your Lastname"
                                    value={Lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className={`w-full px-4 py-2 bg-transparent border capitalize ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                        } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="lastname"
                                />
                            </div>

                            <div>
                                <label className="text-xs block mb-1">Designation</label>
                                <select value={Location} onChange={(e) => setLocation(e.target.value)} className={`w-full px-4 py-2 bg-transparent border capitalize ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                    } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="location">
                                    <option value="">Select Location</option>    
                                    <option value="NCR">Metro Manila</option>
                                    <option value="Cebu">Cebu</option>
                                    <option value="Davao">Davao</option>
                                    <option value="CDO">Cagayan De Oro</option>
                                    <option value="NL">North Luzon</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className="text-xs block mb-1">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="6+ chars, 1 capital letter, 1 number, 1 special char"
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-2 bg-transparent border ${isDark ? "border-white/30 text-white" : "border-black/30 text-black"
                                        } text-xs rounded-md backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none transition duration-300 ease-in-out transform focus:scale-[1.01]`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-[28px] text-cyan-400 hover:text-cyan-600 transition duration-200"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <VscEyeClosed className="w-5 h-5" /> : <VscEye className="w-5 h-5" />}
                                </button>
                            </div>

                            <p
                                className={`text-xs font-semibold ${getPasswordSuggestion() === "Strong password!" ? "text-green-400" : "text-yellow-400"
                                    }`}
                            >
                                {getPasswordSuggestion()}
                            </p>
                        </>
                    )}

                    {/* Step 1: Department selection */}
                    {currentStep === 1 && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                <RoleCard
                                    title="Sales"
                                    value="Sales"
                                    selected={Department}
                                    setSelected={setDepartment}
                                    icon="📊"
                                    description="Handles all things related to selling and revenue."
                                />
                                <RoleCard
                                    title="CSR"
                                    value="Csr"
                                    selected={Department}
                                    setSelected={setDepartment}
                                    icon="🎧"
                                    description="Customer support and service excellence."
                                />
                                <RoleCard
                                    title="Business Development"
                                    value="Bd"
                                    selected={Department}
                                    setSelected={setDepartment}
                                    icon="🚀"
                                    description="Business development and partnerships."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Role selection based on department */}
                    {currentStep === 2 && Department && (
                        <div>
                            <label className="text-xs block mb-2">Select Role in {Department} Department</label>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                {Department === "Sales" && (
                                    <>
                                        <RoleCard
                                            title="Territory Sales Manager"
                                            value="Territory Sales Manager"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="🧭"
                                            description="Oversees regional sales goals and performance."
                                        />
                                        <RoleCard
                                            title="Territory Sales Associate"
                                            value="Territory Sales Associate"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="📈"
                                            description="Assists in expanding sales within a designated area."
                                        />
                                    </>
                                )}
                                {Department === "Csr" && (
                                    <>
                                        <RoleCard
                                            title="CSR Manager"
                                            value="CSR Manager"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="🎧"
                                            description="Leads the customer support team and oversees service quality."
                                        />
                                        <RoleCard
                                            title="CSR Staff"
                                            value="CSR Staff"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="💬"
                                            description="Handles direct customer inquiries and issues."
                                        />
                                    </>
                                )}
                                {Department === "Bd" && (
                                    <>
                                        <RoleCard
                                            title="Business Development Manager"
                                            value="Business Development Manager"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="🚀"
                                            description="Drives company growth through new partnerships."
                                        />
                                        <RoleCard
                                            title="Business Development Officer"
                                            value="Business Development Officer"
                                            selected={Role}
                                            setSelected={setRole}
                                            icon="🤝"
                                            description="Supports business expansion efforts and client engagement."
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                        <div className="text-xs space-y-2">
                            <p className="capitalize"><strong>Username:</strong> {userName}</p>
                            <p className="capitalize"><strong>Fullname:</strong> {Lastname}, {Firstname} </p>
                            <p><strong>Email:</strong> {Email}</p>
                            <p><strong>Role:</strong> {Role}</p>
                            <p><strong>Department:</strong><span className="uppercase"> {Department}</span></p>
                            <p><strong>Designation:</strong> {Location}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 0 || loading}
                            className="px-4 py-2 text-xs rounded bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 0 && (!userName || !Email || !Password)) ||
                                    (currentStep === 1 && !Department) ||
                                    (currentStep === 2 && !Role)
                                }
                                className="px-4 py-2 text-xs rounded bg-cyan-500 hover:bg-cyan-400 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 text-xs rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                        )}
                    </div>
                </form>

                <p className="mt-4 text-center text-xs font-light tracking-wider">
                    Already have an account?{" "}
                    <Link href="/Login" className="text-cyan-400 underline hover:text-cyan-600">
                        Sign In
                    </Link>
                </p>

                <p className="mt-6 text-center text-xs font-light tracking-wider">
                    XentrixFlow | ERP System – Developed by the IT Department
                </p>
            </motion.div>

        </div>
    );
};

export default Register;

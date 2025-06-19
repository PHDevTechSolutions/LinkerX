import React, { useState, useEffect } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

interface PasswordProps {
  Password: string;
  ContactPassword: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordStrength: "weak" | "medium" | "strong" | "";
}

const strengthColor = {
  weak: "bg-red-500",
  medium: "bg-yellow-400",
  strong: "bg-green-600",
} as const;

const Password: React.FC<PasswordProps> = ({
  Password,
  ContactPassword,
  onChange,
  passwordStrength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Validate password length and complexity
  useEffect(() => {
    if (Password.length > 0 && Password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else if (Password.length > 10) {
      setPasswordError("Password cannot exceed 10 characters");
    } else {
      setPasswordError("");
    }
  }, [Password]);

  // Validate confirm password matches password
  useEffect(() => {
    if (ContactPassword && ContactPassword !== Password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  }, [ContactPassword, Password]);

  return (
    <>
      <div className="relative mb-4">
        <label
          htmlFor="Password"
          className="block text-xs font-medium text-gray-700"
        >
          Current Password / Change Password (6-10 chars)
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="Password"
          name="Password"
          value={Password}
          onChange={onChange}
          maxLength={10}
          aria-describedby="passwordHelp passwordError"
          className={`mt-1 block w-full px-4 py-2 pr-10 border-b text-xs text-black ${
            passwordError ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 bottom-[20px] flex items-center cursor-pointer text-gray-500"
        >
          {showPassword ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
        </button>

        {/* Password Strength Meter */}
        {passwordStrength && (
          <div className="mt-1 h-1 w-full bg-gray-300 rounded" id="passwordStrengthMeter">
            <div
              className={`${strengthColor[passwordStrength]} h-1 rounded transition-all duration-300`}
              style={{
                width:
                  passwordStrength === "weak"
                    ? "33%"
                    : passwordStrength === "medium"
                    ? "66%"
                    : "100%",
              }}
            />
          </div>
        )}

        {/* Password requirements hint */}
        <p
          id="passwordHelp"
          className="mt-1 text-xs text-gray-500 select-none"
        >
          Password must be 6-10 characters.
        </p>

        {/* Password error message */}
        {passwordError && (
          <p id="passwordError" className="mt-1 text-xs text-red-600">
            {passwordError}
          </p>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="ContactPassword"
          className="block text-xs font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="ContactPassword"
          name="ContactPassword"
          value={ContactPassword}
          onChange={onChange}
          maxLength={10}
          aria-describedby="confirmPasswordError"
          className={`mt-1 block w-full px-4 py-2 border-b text-xs text-black ${
            confirmError ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          className="absolute inset-y-0 right-3 bottom-[5px] flex items-center cursor-pointer text-gray-500"
        >
          {showConfirmPassword ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
        </button>

        {/* Confirm password error */}
        {confirmError && (
          <p id="confirmPasswordError" className="mt-1 text-xs text-red-600">
            {confirmError}
          </p>
        )}
      </div>
    </>
  );
};

export default Password;

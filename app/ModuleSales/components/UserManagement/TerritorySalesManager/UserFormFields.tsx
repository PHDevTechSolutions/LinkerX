import React, { useEffect, useState } from "react";
import Select from "react-select";

interface FormFieldsProps {
  ReferenceID: string; setReferenceID: (value: string) => void;
  UserId: string; setUserId: (value: string) => void;
  Firstname: string; setFirstname: (value: string) => void;
  Lastname: string; setLastname: (value: string) => void;
  Email: string; setEmail: (value: string) => void;
  userName: string; setuserName: (value: string) => void;
  Password: string; setPassword: (value: string) => void;
  Role: string; setRole: (value: string) => void;
  Department: string; setDepartment: (value: string) => void;
  Location: string; setLocation: (value: string) => void;
  Company: string; setCompany: (value: string) => void;
  Manager: string; setManager: (value: string) => void;

  Status: string; setStatus: (value: string) => void;
  LoginAttempts: string; setLoginAttempts: (value: string) => void;
  LockUntil: string; setLockUntil: (value: string) => void;

  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  ReferenceID, setReferenceID,
  UserId, setUserId,
  Firstname, setFirstname,
  Lastname, setLastname,
  Email, setEmail,
  userName, setuserName,
  Password, setPassword,
  Role, setRole,
  Department, setDepartment,
  Location, setLocation,
  Company, setCompany,
  Manager, setManager,

  Status, setStatus,
  LoginAttempts, setLoginAttempts,
  LockUntil, setLockUntil,

  editPost,
}) => {
  const [managerOptions, setManagerOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedManager, setSelectedManager] = useState<{ value: string; label: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch managers on mount
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("/api/manager?Role=Manager");
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();

        // Use ReferenceID as value
        const options = data.map((user: any) => ({
          value: user.ReferenceID, // ReferenceID ang isesend
          label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
        }));

        setManagerOptions(options);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

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
  }, [Firstname, Lastname, Location]); // Nag-trigger kapag may pagbabago sa tatlong fields

  useEffect(() => {
    if (editPost) {
      setIsEditing(true); // Kapag nag-e-edit, gawing input text
      setManager(editPost.Manager || ""); // Set default manager value
    }
  }, [editPost]);

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Manager">Manager</label>
          {isEditing ? (
            <input
              type="text"
              id="Manager"
              value={Manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly
            />
          ) : (
            <Select
              id="Manager"
              options={managerOptions}
              value={selectedManager}
              onChange={(option) => {
                setSelectedManager(option);
                setManager(option ? option.value : ""); // Save ReferenceID as Manager
              }}
              className="text-xs capitalize"
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <input type="hidden" id="userId" value={UserId} onChange={(e) => setUserId(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
          <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
          <label className="block text-xs font-bold mb-2" htmlFor="Firstname">Firstname</label>
          <input type="text" id="Firstname" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Lastname">Lastname</label>
          <input type="text" id="Lastname" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
          <input type="text" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="userName">Username</label>
          <input type="text" id="userName" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Password">Password</label>
          <input type="password" id="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Role">Role</label>
          <select id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" required>
            <option>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="Territory Sales Manager">Territory Sales Manager</option>
            <option value="Territory Sales Associate">Territory Sales Associate</option>
            <option value="Staff">CSR Staff</option>
            <option value="E-Commerce Staff">E-Commerce Staff</option>
            <option value="Business Development Manager">Business Development Manager</option>
            <option value="Business Development Officer">Business Development Officer</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Role">Department</label>
          <select id="Department" value={Department || ""} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" required>
            <option>Select Department</option>
            <option value="Sales">Sales Department</option>
            <option value="CSR">CSR Department</option>
            <option value="IT">IT Department</option>
            <option value="Ecommerce">E-Commerce Department</option>
            <option value="Business Development">Business Development Department</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Location">Location</label>
          <select id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option>Select Location</option>
            <option value="PH" className="bg-green-800 hover:bg-green-900 text-white">Philippines</option>
            <option value="NCR">Metro Manila</option>
            <option value="CBU">Cebu</option>
            <option value="DVO">Davao</option>
            <option value="CDO">Cagayan De Oro</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Company">Company</label>
          <select id="Company" value={Company || ""} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option>Select Company</option>
            <option value="Ecoshift Corporation">Ecoshift Corporation</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/6 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
          <select id="Status" value={Status || ""} onChange={(e) => {
              const newStatus = e.target.value;
              setStatus(newStatus);

              if (newStatus === "Active") {
                setLoginAttempts("0"); // Convert number to string
                setLockUntil("0"); // Convert number to string
              }
            }}
            className="w-full px-3 py-2 border rounded text-xs bg-gray-50"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Resigned">Resigned</option>
            <option value="Terminated">Terminated</option>
            <option value="Locked" disabled={["Active", "Inactive", "Resigned", "Terminated"].includes(Status)}>
              Locked
            </option>
          </select>
        </div>

        {Status === "Locked" && (
          <>
            <div className="w-full sm:w-1/2 md:w-1/6 px-4 mb-4">
              <label className="block text-xs font-bold mb-2" htmlFor="LoginAttempts">Login Attempts</label>
              <input type="text" id="LoginAttempts" value={LoginAttempts} onChange={(e) => setLoginAttempts(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/6 px-4 mb-4">
              <label className="block text-xs font-bold mb-2" htmlFor="LockUntil">Lock Until</label>
              <input type="text" id="LockUntil" value={LockUntil} onChange={(e) => setLockUntil(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default UserFormFields;

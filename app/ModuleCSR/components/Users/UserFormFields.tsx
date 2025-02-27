import React, { useEffect } from "react";

interface FormFieldsProps {
  UserId: string;
  setUserId: (value: string) => void;
  ReferenceID: string;
  setReferenceID: (value: string) => void;
  Firstname: string;
  setFirstname: (value: string) => void;
  Lastname: string;
  setLastname: (value: string) => void;
  Email: string;
  setEmail: (value: string) => void;
  userName: string;
  setUserName: (value: string) => void;
  Password: string;
  setPassword: (value: string) => void;
  Role: string;
  setRole: (value: string) => void;
  Department: string;
  setDepartment: (value: string) => void;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  UserId,
  setUserId,
  ReferenceID,
  setReferenceID,
  Firstname,
  setFirstname,
  Lastname,
  setLastname,
  Email,
  setEmail,
  userName,
  setUserName,
  Password,
  setPassword,
  Role,
  setRole,
  Department,
  setDepartment,
}) => {
  useEffect(() => {
    if (Firstname && Lastname && Department && !ReferenceID) {
      const generatedID = `${Firstname.charAt(0).toUpperCase()}${Lastname.charAt(0).toUpperCase()}-${Department}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceID(generatedID);
    }
  }, [Firstname, Lastname, Department]);

  return (
    <div className="flex flex-wrap -mx-4">
      {/* Hidden User ID */}
      <input type="hidden" id="userId" value={UserId} onChange={(e) => setUserId(e.target.value)} />
      <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)}/>

      {/* Firstname */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Firstname">Firstname</label>
        <input type="text" id="Firstname" value={Firstname || ""} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
      </div>

      {/* Lastname */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Lastname">Lastname</label>
        <input type="text" id="Lastname" value={Lastname || ""} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
      </div>


      {/* Email */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
        <input type="text" id="Email" value={Email || ""} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
      </div>

      {/* Username */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="userName">Username</label>
        <input type="text" id="userName" value={userName || ""} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
      </div>

      {/* Role */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Role">Role</label>
        <select id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      {/* Department */}
      <div className="w-full sm:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Department">Department</label>
        <select id="Department" value={Department || ""} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
          <option value="">Select Department</option>
          <option value="CSR">CSR</option>
        </select>
      </div>
    </div>
  );
};

export default UserFormFields;

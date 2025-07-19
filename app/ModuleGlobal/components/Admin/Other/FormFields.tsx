import React, { useEffect } from "react";

interface FormFieldsProps {
  ReferenceID: string; setReferenceID: (value: string) => void;
  UserId: string; setUserId: (value: string) => void;
  Firstname: string; setFirstname: (value: string) => void;
  Lastname: string; setLastname: (value: string) => void;
  Email: string; setEmail: (value: string) => void;
  userName: string; setuserName: (value: string) => void;
  Password: string; setPassword: (value: string) => void;
  Role: string; setRole: (value: string) => void;
  Position: string; setPosition: (value: string) => void;
  Department: string; setDepartment: (value: string) => void;
  Location: string; setLocation: (value: string) => void;
  Company: string; setCompany: (value: string) => void;

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
  Position, setPosition,
  Department, setDepartment,
  Location, setLocation,
  Company, setCompany,
  Status, setStatus,
  LoginAttempts, setLoginAttempts,
  LockUntil, setLockUntil,
  
  editPost,
}) => {

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

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <input type="hidden" id="userId" value={UserId} onChange={(e) => setUserId(e.target.value)}/>
          <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)}/>
          <label className="block text-xs font-bold mb-2" htmlFor="Firstname">Firstname</label>
          <input type="text" id="Firstname" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Lastname">Lastname</label>
          <input type="text" id="Lastname" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize" />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
          <input type="text" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border-b text-xs" />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="userName">Username</label>
          <input type="text" id="userName" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize" required />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Password">Password</label>
          <input type="password" id="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border-b text-xs" required />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Role">Role</label>
          <select id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs" required>
            <option>Select Role</option>
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Role">Position</label>
          <select id="Position" value={Position || ""} onChange={(e) => setPosition(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs" required>
            <option>Select Position</option>
            <option value="Accounting Associate">Accounting Associate</option>
            <option value="Accounting Officer - CPA">Accounting Officer - CPA</option>
            <option value="Accounts Payable Supervisor">Accounts Payable Supervisor</option>
            <option value="Accounts Receivable Associate">Accounts Receivable Associate</option>
            <option value="Accounts Receivable Supervisor">Accounts Receivable Supervisor</option>
            <option value="Admin Associate">Admin Associate</option>
            <option value="Admin Manager">Admin Manager</option>
            <option value="Billing Associate">Billing Associate</option>
            <option value="Billing Supervisor">Billing Supervisor</option>
            <option value="Business Development Manager">Business Development Manager</option>
            <option value="Business Development Officer">Business Development Officer</option>
            <option value="Cashier">Cashier</option>
            <option value="Customer Service Manager">Customer Service Manager</option>
            <option value="Customer Service Representative">Customer Service Representative</option>
            <option value="Dispatcher">Dispatcher</option>
            <option value="Driver">Driver</option>
            <option value="E-Commerce Associate">E-Commerce Associate</option>
            <option value="Electrician">Electrician</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Engineering Supervisor">Engineering Supervisor</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Fullstack Web Developer / Software Engineer">Fullstack Web Developer / Software Engineer</option>
            <option value="Graphic Artist">Graphic Artist</option>
            <option value="HR Associate">HR Associate</option>
            <option value="HR Assistant Manager">HR Assistant Manager</option>
            <option value="HR Generalist">HR Generalist</option>
            <option value="HR Manager">HR Manager</option>
            <option value="HR Supervisor">HR Supervisor</option>
            <option value="Inventory Associate">Inventory Associate</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="IT Associate">IT Associate</option>
            <option value="IT Manager">IT Manager</option>
            <option value="IT Senior Supervisor">IT Senior Supervisor</option>
            <option value="Liaison Associate">Liaison Associate</option>
            <option value="Logistics Assistant">Logistics Assistant</option>
            <option value="Logistics Associate">Logistics Associate</option>
            <option value="Logistics Manager">Logistics Manager</option>
            <option value="Logistics Planner">Logistics Planner</option>
            <option value="Logistics Supervisor">Logistics Supervisor</option>
            <option value="Marketing Manager">Marketing Manager</option>
            <option value="Messenger / Collector">Messenger / Collector</option>
            <option value="Office Sales Associate">Office Sales Associate</option>
            <option value="Office Sales Manager">Office Sales Manager</option>
            <option value="Processing Associate - Ecommerce">Processing Associate - Ecommerce</option>
            <option value="Processing Supervisor">Processing Supervisor</option>
            <option value="Product Development Associate">Product Development Associate</option>
            <option value="Procuct Replacement Associate">Product Replacement Associate</option>
            <option value="Purchasing Associate">Purchasing Associate</option>
            <option value="Purchasing Supervisor">Purchasing Supervisor</option>
            <option value="Sales Coordinator">Sales Coordinator</option>
            <option value="Sales Engineer">Sales Engineer</option>
            <option value="Sales Order Associate">Sales Order Associate</option>
            <option value="Sales Support Associate">Sales Support Associate</option>
            <option value="Sales Support Head">Sales Support Head</option>
            <option value="Sample Associate">Sample Associate</option>
            <option value="Senior Sales Associate">Senior Sales Associate</option>
            <option value="Seo Specialist">Seo Specialist</option>
            <option value="Shipment Receiving Supervisor">Shipment Receiving Supervisor</option>
            <option value="Technical Associate - Projects">Technical Associate - Projects</option>
            <option value="Technical Associate - Quality Assurance">Technical Associate - Quality Assurance</option>
            <option value="Technical Associate - Repair">Technical Associate - Repair</option>
            <option value="Technical Associate - Return and Replacement">Technical Associate - Return and Replacement</option>
            <option value="Technical Service Engineer - Operations">Technical Service Engineer - Operations</option>
            <option value="Technical Service Engineer - Product Quality">Technical Service Engineer - Product Quality</option>
            <option value="Technical Service Engineer - Product Training">Technical Service Engineer - Product Training</option>
            <option value="Technical Service Engineer - Projects">Technical Service Engineer - Projects</option>
            <option value="Technical Services - Team Lead">Technical Services - Team Lead</option>
            <option value="Technical Support Engineer">Technical Support Engineer</option>
            <option value="Territory Sales Associate">Territory Sales Associate</option>
            <option value="Territory Sales Manager">Territory Sales Manager</option>
            <option value="Warehouse Admin Supervisor">Warehouse Admin Supervisor</option>
            <option value="Warehouse Operations Manager">Warehouse Operations Manager</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Role">Department</label>
          <select id="Department" value={Department || ""} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs" required>
            <option>Select Department</option>
            <option value="Accounting">Accounting Department</option>
            <option value="Admin">Administration</option>
            <option value="Business Devt">Business Devt</option>
            <option value="CSR">Customer Service Department</option>
            <option value="Ecommerce">Ecommerce Department</option>
            <option value="Engineering">Engineering Department</option>
            <option value="Human Resources">Human Resources Department</option>
            <option value="Information Technology">IT Department</option>
            <option value="Marketing">Marketing Department</option>
            <option value="Procurement">Procurement Department</option>
            <option value="Sales">Sales Department</option>
            <option value="Warehouse Operations">Warehouse Operations</option>
          </select>
        </div>
        </div>
        <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Location">Location</label>
          <select id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs" required>
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
          <select id="Company" value={Company || ""} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs" required>
            <option>Select Company</option>
            <option value="Ecoshift Corporation">Ecoshift Corporation</option>
            <option value="Disruptive Solutions Inc">Disruptive Solutions Inc</option>
          </select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/6 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
          <select
            id="Status"
            value={Status || ""}
            onChange={(e) => {
              const newStatus = e.target.value;
              setStatus(newStatus);

              if (newStatus === "Active") {
                setLoginAttempts("0");
                setLockUntil("0");
              }
            }}
            className="w-full px-3 py-2 border-b bg-white text-xs bg-gray-50"
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
              <input type="text" id="LoginAttempts" value={LoginAttempts} onChange={(e) => setLoginAttempts(e.target.value)} className="w-full px-3 py-2 border-b text-xs" required />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/6 px-4 mb-4">
              <label className="block text-xs font-bold mb-2" htmlFor="LockUntil">Lock Until</label>
              <input type="text" id="LockUntil" value={LockUntil} onChange={(e) => setLockUntil(e.target.value)} className="w-full px-3 py-2 border-b text-xs" required />
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default UserFormFields;

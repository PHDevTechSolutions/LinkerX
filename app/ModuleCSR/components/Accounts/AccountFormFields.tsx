import React from "react";

interface FormFieldsProps {
  CompanyName: string;
  setCompanyName: (value: string) => void;
  CustomerName: string;
  setCustomerName: (value: string) => void;
  Gender: string;
  setGender: (value: string) => void;
  ContactNumber: string;
  setContactNumber: (value: string) => void;
  Email: string;
  setEmail: (value: string) => void;
  CityAddress: string;
  setCityAddress: (value: string) => void;
  CustomerSegment: string;
  setCustomerSegment: (value: string) => void;
  CustomerType: string;
  setCustomerType: (value: string) => void;
  editPost?: any;
}

const AccountFormFields: React.FC<FormFieldsProps> = ({ CompanyName, setCompanyName, CustomerName, setCustomerName, Gender, setGender, ContactNumber, setContactNumber, Email, setEmail, 
  CityAddress, setCityAddress, CustomerSegment, setCustomerSegment, CustomerType, setCustomerType, editPost
}) => {
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
        <input type="text" id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="CustomerName">Customer Name</label>
        <input type="text" id="CustomerName" value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Gender">Gender</label>
        <select id="Gender" value={Gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
          <option value="">Select Gender</option>
          {genderOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">Contact Number</label>
        <input type="text" id="ContactNumber" value={ContactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
        <input type="text" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="CustomerSegment">Customer Segment</label>
        <select id="CustomerSegment" value={CustomerSegment} onChange={(e) => setCustomerSegment(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
          <option value="">Select Segment</option>
          <option value="Agriculture, Hunting and Forestry">Agriculture, Hunting and Forestry</option>
          <option value="Fishing">Fishing</option>
          <option value="Mining">Mining</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Electricity, Gas and Water">Electricity, Gas and Water</option>
          <option value="Construction">Construction</option>
          <option value="Wholesale and Retail">Wholesale and Retail</option>
          <option value="Hotels and Restaurants">Hotels and Restaurants</option>
          <option value="Transport, Storage and Communication">Transport, Storage and Communication</option>
          <option value="Finance and Insurance">Finance and Insurance</option>
          <option value="Real State and Rentings">Real State and Rentings</option>
          <option value="Education">Education</option>
          <option value="Health and Social Work">Health and Social Work</option>
          <option value="Personal Services">Personal Services</option>
          <option value="Government Offices">Government Offices</option>
          <option value="Data Center">Data Center</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="CustomerType">Customer Type</label>
        <select id="CustomerType" value={CustomerType} onChange={(e) => setCustomerType(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Type</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        <option value="B2G">B2G</option>
                        <option value="Gentrade">Gentrade</option>
                        <option value="Modern Trade">Modern Trade</option>
                    </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="CityAddress">City Address</label>
        <input type="text" id="CityAddress" value={CityAddress} onChange={(e) => setCityAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
      </div>
    </>
  );
};

export default AccountFormFields;

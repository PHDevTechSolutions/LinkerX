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
  editPost?: any; // Can be typed better if you want
}

const AccountFormFields: React.FC<FormFieldsProps> = ({
  CompanyName,
  setCompanyName,
  CustomerName,
  setCustomerName,
  Gender,
  setGender,
  ContactNumber,
  setContactNumber,
  Email,
  setEmail,
  CityAddress,
  setCityAddress,
  CustomerSegment,
  setCustomerSegment,
  CustomerType,
  setCustomerType,
  editPost,
}) => {
  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const customerSegmentOptions = [
    "Agriculture, Hunting and Forestry",
    "Fishing",
    "Mining",
    "Manufacturing",
    "Electricity, Gas and Water",
    "Construction",
    "Wholesale and Retail",
    "Hotels and Restaurants",
    "Transport, Storage and Communication",
    "Finance and Insurance",
    "Real Estate and Rentings",
    "Education",
    "Health and Social Work",
    "Personal Services",
    "Government Offices",
    "Data Center",
  ];

  const customerTypeOptions = [
    "B2B",
    "B2C",
    "B2G",
    "Gentrade",
    "Modern Trade",
  ];

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="CompanyName"
          >
            Company Name
          </label>
          <input
            type="text"
            id="CompanyName"
            value={CompanyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            placeholder="Enter company name"
            aria-label="Company Name"
            required
            autoComplete="organization"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="CustomerName"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="CustomerName"
            value={CustomerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            placeholder="Enter customer name"
            aria-label="Customer Name"
            required
            autoComplete="name"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Gender">
            Gender
          </label>
          <select
            id="Gender"
            value={Gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 rounded text-xs"
            aria-label="Select Gender"
            required
          >
            {genderOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="ContactNumber"
          >
            Contact Number
          </label>
          <input
            type="tel"
            id="ContactNumber"
            value={ContactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            placeholder="Enter contact number"
            aria-label="Contact Number"
            pattern="[0-9+\-() ]{7,15}"
            title="Please enter a valid phone number (7-15 digits, may include +, -, parentheses)"
            required
            autoComplete="tel"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Email">
            Email
          </label>
          <input
            type="email"
            id="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            placeholder="Enter email address"
            aria-label="Email Address"
            required
            autoComplete="email"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="CustomerSegment"
          >
            Customer Segment
          </label>
          <select
            id="CustomerSegment"
            value={CustomerSegment}
            onChange={(e) => setCustomerSegment(e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 rounded text-xs"
            aria-label="Select Customer Segment"
            required
          >
            <option value="">Select Customer Segment</option>
            {customerSegmentOptions.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="CustomerType"
          >
            Customer Type
          </label>
          <select
            id="CustomerType"
            value={CustomerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 rounded text-xs"
            aria-label="Select Customer Type"
            required
          >
            <option value="">Select Customer Type</option>
            {customerTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label
            className="block text-xs font-bold mb-2"
            htmlFor="CityAddress"
          >
            City Address
          </label>
          <input
            type="text"
            id="CityAddress"
            value={CityAddress}
            onChange={(e) => setCityAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            placeholder="Enter city address"
            aria-label="City Address"
            required
            autoComplete="address-level2"
          />
        </div>
      </div>
    </>
  );
};

export default AccountFormFields;

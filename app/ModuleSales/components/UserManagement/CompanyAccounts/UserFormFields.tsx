import React, { useEffect } from "react";

interface FormFieldsProps {
  UserId: string; setUserId: (value: string) => void;
  CompanyName: string; setCompanyName: (value: string) => void;
  ContactPerson: string; setContactPerson: (value: string) => void;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  UserId, setUserId,
  CompanyName, setCompanyName,
  ContactPerson, setContactPerson,
  editPost,
}) => {

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <input type="hidden" id="userId" value={UserId} onChange={(e) => setUserId(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
          <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
          <input type="text" id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="ContactPerson">Contact Person</label>
          <input type="text" id="ContactPerson" value={ContactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
        </div>
      </div>
    </>
  );
};

export default UserFormFields;

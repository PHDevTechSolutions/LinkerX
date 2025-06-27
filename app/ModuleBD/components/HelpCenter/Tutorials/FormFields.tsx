import React from "react";

interface FormFieldsProps {
    title: string; settitle: (value: string) => void;
    description: string; setdescription: (value: string) => void;
    link: string; setlink: (value: string) => void;
    type: string; settype: (value: string) => void;
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    title, settitle,
    description, setdescription,
    link, setlink,
    type, settype,
    editPost,
}) => {
    return (
        <>
            <div className="mb-4 border rounded-lg shadow-sm p-4">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Title</label>
                        <input type="text" id="title" value={title ?? ""} onChange={(e) => settitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Video URL</label>
                        <input type="text" id="link" value={link ?? ""} onChange={(e) => setlink(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">ERP Module</label>
                        <select id="link" value={type ?? ""} onChange={(e) => settype(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" >
                            <option value="">Select Module</option>
                            <option value="Taskflow">Taskflow (Advance Timemotion and Daily Activities Management System)</option>
                            <option value="Ecodesk">Ecodesk (Customer Ticketing Management System)</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Description</label>
                        <textarea value={description ?? ""} onChange={(e) => setdescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5}></textarea>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFormFields;

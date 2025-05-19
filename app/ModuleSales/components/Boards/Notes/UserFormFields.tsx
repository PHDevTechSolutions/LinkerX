import React from "react";

interface FormFieldsProps {
    referenceid: string; setreferenceid: (value: string) => void;
    title: string; settitle: (value: string) => void;
    description: string; setdescription: (value: string) => void;
    status: string; setstatus: (value: string) => void;
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid, setreferenceid,
    title, settitle,
    description, setdescription,
    status, setstatus,
    editPost,
}) => {
    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <input type="hidden" id="referenceid" value={referenceid ?? ""} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Title</label>
                    <input type="text" id="title" value={title ?? ""} onChange={(e) => settitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
                <div className="w-full px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Status</label>
                    <select value={status ?? ""} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-100">
                        <option value="">Select Status</option>
                        <option value="Backlogs">Backlogs</option>
                        <option value="Priority">Priority</option>
                        <option value="Important">Important</option>
                        <option value="Finished">Finished</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Description</label>
                    <textarea value={description ?? ""} onChange={(e) => setdescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5}></textarea>
                </div>
            </div>

        </>
    );
};

export default UserFormFields;

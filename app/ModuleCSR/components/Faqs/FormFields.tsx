import React, { useState, useEffect } from 'react';

interface ReceivedFieldsProps {
    userName: string; setuserName: (value: string) => void;
    ReferenceID: string; setReferenceID: (value: string) => void;
    Title: string; setTitle: (value: string) => void;
    Description: string; setDescription: (value: string) => void;
    DateCreated: string; setDateCreated: (value: string) => void;
    editPost?: any;
}

const AddTrackingFields: React.FC<ReceivedFieldsProps> = ({
    userName, setuserName,
    ReferenceID, setReferenceID,
    Title, setTitle,
    Description, setDescription,
    DateCreated, setDateCreated,
    editPost
}) => {
  
    return (
        <>
            <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Title">Title</label>
                    <input type="text" id="Title" value={Title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateCreated">Date Created</label>
                    <input type="datetime-local" id="DateCreated" value={DateCreated} onChange={(e) => setDateCreated(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/1 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Description">Description</label>
                    <textarea value={Description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" rows={10}></textarea>
                </div>
            </div>
        </>
    );
};

export default AddTrackingFields;

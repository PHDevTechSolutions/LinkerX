import React, { useMemo } from "react";

interface GridXchireProps {
    updatedUser: any[];
    bulkDeleteMode: boolean;
    bulkEditMode: boolean;
    selectedUsers: Set<string>;
    handleSelectUser: (id: string) => void;
    handleEdit: (post: any) => void;
    formatDate: (timestamp: number) => string;
    statusColors: Record<string, string>;
}

const GridXchire: React.FC<GridXchireProps> = ({
    updatedUser,
    bulkDeleteMode,
    bulkEditMode,
    selectedUsers,
    handleSelectUser,
    handleEdit,
    formatDate,
    statusColors,
}) => {
    const showCheckbox = bulkDeleteMode || bulkEditMode;

    const cards = useMemo(() => {
        return updatedUser.map((post) => {
            const statusClass = statusColors[post.activitystatus as keyof typeof statusColors] || "bg-gray-300 text-black";
            const checkboxColor =
                bulkDeleteMode
                    ? "text-red-600"
                    : bulkEditMode
                    ? "text-blue-600"
                    : "";

            return (
                <div
                    key={post.id}
                    className="p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all bg-white"
                >
                    {showCheckbox && (
                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={selectedUsers.has(post.id)}
                                onChange={() => handleSelectUser(post.id)}
                                className={`w-4 h-4 ${checkboxColor}`}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-[8px] px-2 py-1 rounded-full font-semibold ${statusClass}`}>
                            {post.activitystatus}
                        </span>
                        <button
                            onClick={() => handleEdit(post)}
                            className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>

                    <div className="text-xs space-y-1">
                        <Info label="Company" value={post.companyname} />
                        <Info label="Contact" value={`${post.contactperson} (${post.contactnumber})`} />
                        <Info label="Email" value={post.emailaddress} />
                        <Info label="Address" value={post.address} />
                        <Info label="Area" value={post.area} />
                        <Info label="Client Type" value={post.typeclient} />
                        <Info label="Project" value={`${post.projectname} (${post.projectcategory}, ${post.projecttype})`} />
                        <Info label="Source" value={post.source} />
                        <Info label="Quota" value={post.targetquota} />
                        <Info label="Remarks" value={post.activityremarks} />
                        <Info label="Ticket #" value={post.ticketreferencenumber} />
                        <Info label="Wrap Up" value={post.wrapup} />
                        <Info label="Inquiries" value={post.inquiries} />
                        <Info label="CSR" value={post.csragent} />
                        <Info label="TSM" value={`${post.referenceid} | ${post.tsm}`} />
                        <Info label="Date" value={formatDate(new Date(post.date_created).getTime())} />
                    </div>
                </div>
            );
        });
    }, [
        updatedUser,
        selectedUsers,
        bulkDeleteMode,
        bulkEditMode,
        handleSelectUser,
        handleEdit,
        formatDate,
        statusColors,
    ]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.length > 0 ? cards : (
                <div className="col-span-full text-center text-gray-500">No accounts available</div>
            )}
        </div>
    );
};

const Info = ({ label, value }: { label: string; value: string }) => (
    <div>
        <strong>{label}:</strong> {value}
    </div>
);

export default GridXchire;

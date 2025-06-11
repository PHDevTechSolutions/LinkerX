import React from "react";
import { motion } from "framer-motion";

interface SidebarModalCustomizeProps {
    visibleItems: Record<string, boolean>; // Tracks visibility of main/sub items (keyed as 'Main' or 'Main::Sub')
    filteredMenuItems: {
        title: string;
        icon: React.ElementType;
        subItems: { title: string; href: string; icon?: React.ElementType }[];
    }[];
    activeTab: number; // 0 = Main Items, 1 = Sub Items
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    toggleVisibility: (key: string, forcedValue?: boolean) => void;
    onClose: () => void;
}

const SidebarModalCustomize: React.FC<SidebarModalCustomizeProps> = ({
    visibleItems,
    filteredMenuItems,
    activeTab,
    setActiveTab,
    toggleVisibility,
    onClose,
}) => {
    // Extract all main item titles for easy loop/reference
    const mainKeys = filteredMenuItems.map((item) => item.title);

    // Extract sub item keys (only from visible main sections)
    const subKeys = filteredMenuItems
        .filter((item) => visibleItems[item.title])
        .flatMap((item) => item.subItems.map((sub) => `${item.title}::${sub.title}`));

    // Enables all items in the current tab
    const selectAll = () => {
        const keys = activeTab === 0 ? mainKeys : subKeys;
        keys.forEach((key) => toggleVisibility(key, true));
    };

    // Disables all items in the current tab
    const removeAll = () => {
        const keys = activeTab === 0 ? mainKeys : subKeys;
        keys.forEach((key) => toggleVisibility(key, false));
    };

    // Reusable toggle switch UI
    const renderSwitch = (checked: boolean, onClick: () => void) => (
        <div
            role="switch"
            aria-checked={checked}
            onClick={onClick}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300 ${checked ? "bg-cyan-400" : "bg-gray-300"
                } cursor-pointer`}
        >
            <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${checked ? "translate-x-4" : "translate-x-1"
                    }`}
            />
        </div>
    );

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg w-[90vw] max-w-3xl m-4 p-4 max-h-[80vh] overflow-auto"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                {/* Header */}
                <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">
                    Customize Sidebar
                </h2>

                {/* Tabs: Main Items | Sub Items */}
                <div className="flex border-b border-gray-300 dark:border-gray-600 mb-4 text-xs">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 0
                                ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                        onClick={() => setActiveTab(0)}
                    >
                        Main Items
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 1
                                ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                        onClick={() => setActiveTab(1)}
                    >
                        Sub Items
                    </button>
                </div>

                {/* Visibility Summary + Controls */}
                <div className="flex justify-between items-center mb-2 text-xs">
                    <div className="text-gray-600 dark:text-gray-300 text-[10px]">
                        {activeTab === 0
                            ? `Visible: ${mainKeys.filter((key) => visibleItems[key]).length}/${mainKeys.length}`
                            : `Visible: ${subKeys.filter((key) => visibleItems[key]).length}/${subKeys.length}`}
                    </div>
                    <div className="flex gap-2 text-[10px]">
                        <button
                            onClick={selectAll}
                            className="px-1 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-500"
                        >
                            Select All
                        </button>
                        <button
                            onClick={removeAll}
                            className="px-1 py-1 bg-red-400 text-white rounded hover:bg-red-200"
                        >
                            Remove All
                        </button>
                    </div>
                </div>

                {/* Tab Panel: Main or Sub Items */}
                <div className="space-y-2 max-h-[50vh] text-xs overflow-y-auto text-black">
                    {/* Main Items */}
                    {activeTab === 0 &&
                        filteredMenuItems.map((item) => (
                            <div
                                key={item.title}
                                className="flex items-center border p-2 rounded shadow-sm gap-2 justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon size={18} />
                                    <span>{item.title}</span>
                                </div>
                                {renderSwitch(visibleItems[item.title] ?? true, () =>
                                    toggleVisibility(item.title)
                                )}
                            </div>
                        ))}

                    {/* Sub Items */}
                    {activeTab === 1 &&
                        filteredMenuItems
                            .filter((item) => visibleItems[item.title])
                            .flatMap((item) =>
                                item.subItems.map((sub) => (
                                    <div
                                        key={`${item.title}::${sub.title}`}
                                        className="flex items-center border p-2 rounded shadow-sm gap-2 justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            {sub.icon && <sub.icon size={16} />}
                                            <span>
                                                {item.title} - {sub.title}
                                            </span>
                                        </div>
                                        {renderSwitch(
                                            visibleItems[`${item.title}::${sub.title}`] ?? true,
                                            () => toggleVisibility(`${item.title}::${sub.title}`)
                                        )}
                                    </div>
                                ))
                            )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 mb-4">
                    Choose which main and sub navigation items should be visible in your sidebar. Use the toggles or the "Select All" and "Remove All" buttons to quickly configure your preferred layout.
                </p>
                {/* Modal Footer */}
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SidebarModalCustomize;

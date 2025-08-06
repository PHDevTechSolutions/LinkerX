'use client';

import React, { useEffect } from 'react';

interface Props {
    mode: 'add' | 'edit';
    formData: {
        Url: string;
        Email: string;
        Title: string;
        Description: string;
        PhotoFile: File | null;
        Category: string;
    };
    setFormData: (data: Props['formData']) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const BASE_URL = 'https://linker-x.vercel.app/Main/LinkerX/Notes';

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

const Form: React.FC<Props> = ({
    mode,
    formData,
    setFormData,
    onSubmit,
    onCancel,
}) => {
    // Auto-generate URL on Title change (only in add mode)
    useEffect(() => {
        if (mode === 'add' && formData.Title) {
            const slug = slugify(formData.Title);
            setFormData({ ...formData, Url: BASE_URL + slug });
        }
    }, [formData.Title]);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-xs mb-1">URL / Link</label>
                <input
                    type="url"
                    required
                    value={formData.Url}
                    readOnly={mode === 'add'}
                    onChange={(e) =>
                        mode === 'edit' &&
                        setFormData({ ...formData, Url: e.target.value })
                    }
                    placeholder="https://linker-x.vercel.app/Main/LinkerX/my-title"
                    className={`w-full border-b px-3 py-2 text-xs ${
                        mode === 'add' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                />
            </div>

            <div>
                <label className="block text-xs mb-1">Title</label>
                <input
                    type="text"
                    required
                    value={formData.Title}
                    onChange={(e) =>
                        setFormData({ ...formData, Title: e.target.value })
                    }
                    placeholder="My favorite site"
                    className="w-full border-b px-3 py-2 text-xs capitalize"
                />
            </div>

            <div>
                <label className="block text-xs mb-1">Description</label>
                <textarea
                    value={formData.Description}
                    onChange={(e) =>
                        setFormData({ ...formData, Description: e.target.value })
                    }
                    placeholder="Link Description.."
                    className="w-full border-b px-3 py-2 text-xs capitalize"
                    rows={5}
                ></textarea>
            </div>

            <div>
                <label className="block text-xs mb-1">Category</label>
                <select
                    value={formData.Category}
                    onChange={(e) =>
                        setFormData({ ...formData, Category: e.target.value })
                    }
                    className="w-full border-b px-3 py-2 text-xs bg-white"
                >
                    <option value="">-- Select Category --</option>
                    <option value="Social">Social</option>
                    <option value="Work">Work</option>
                    <option value="Tools">Tools</option>
                    <option value="News">News</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                    <option value="Others">Others</option>
                </select>
            </div>

            <div>
                <label className="block text-xs mb-1">Photo (optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            PhotoFile: e.target.files ? e.target.files[0] : null,
                        })
                    }
                    className="w-full border-b px-3 py-2 text-xs"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4 text-xs">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#5e17eb] text-white rounded-md hover:bg-violet-800 transition"
                >
                    {mode === 'add' ? 'Save' : 'Update'}
                </button>
            </div>
        </form>
    );
};

export default Form;

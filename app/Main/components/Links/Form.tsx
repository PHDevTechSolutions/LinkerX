'use client';

import React from 'react';

interface Props {
  mode: 'add' | 'edit';
  formData: {
    Url: string;
    LinkName: string;
    Description: string;
    PhotoFile: File | null;
  };
  setFormData: (data: {
    Url: string;
    LinkName: string;
    Description: string;
    PhotoFile: File | null;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const Form: React.FC<Props> = ({
  mode,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs mb-1">URL/Link</label>
        <input
          type="url"
          required
          value={formData.Url}
          onChange={(e) =>
            setFormData({ ...formData, Url: e.target.value })
          }
          placeholder="https://example.com"
          className="w-full border-b px-3 py-2 text-xs"
        />
      </div>

      <div>
        <label className="block text-xs mb-1">Link Name</label>
        <input
          type="text"
          required
          value={formData.LinkName}
          onChange={(e) =>
            setFormData({ ...formData, LinkName: e.target.value })
          }
          placeholder="My favorite site"
          className="w-full border-b px-3 py-2 text-xs"
        />
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

      <div>
        <label className="block text-xs mb-1">Description</label>
        <textarea value={formData.Description}
          onChange={(e) =>
            setFormData({ ...formData, Description: e.target.value })
          }
          placeholder="Link Description.."
          className="w-full border-b px-3 py-2 text-xs capitalize" rows={5}></textarea>
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

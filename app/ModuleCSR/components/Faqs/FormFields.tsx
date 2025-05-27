"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

interface FieldsProps {
  userName: string;
  setuserName: (value: string) => void;
  ReferenceID: string;
  setReferenceID: (value: string) => void;
  Title: string;
  setTitle: (value: string) => void;
  Description: string; // stored as JSON string
  setDescription: (value: string) => void;
  DateCreated: string;
  setDateCreated: (value: string) => void;
  editPost?: any;
}

const Fields: React.FC<FieldsProps> = ({
  userName,
  setuserName,
  ReferenceID,
  setReferenceID,
  Title,
  setTitle,
  Description,
  setDescription,
  DateCreated,
  setDateCreated,
  editPost,
}) => {
  const editorRef = useRef<Editor>(null);

  // Initialize EditorState from Description JSON string
  const [editorState, setEditorState] = useState(() => {
    if (Description) {
      try {
        const contentState = convertFromRaw(JSON.parse(Description));
        return EditorState.createWithContent(contentState);
      } catch {
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });

  // Update Description JSON string whenever editorState changes
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    setDescription(JSON.stringify(raw));
  }, [editorState, setDescription]);

  // Toolbar handlers
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): "handled" | "not-handled" => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Clear editor content function
  const clearEditor = () => {
    const emptyState = EditorState.push(
      editorState,
      ContentState.createFromText(""),
      "remove-range"
    );
    setEditorState(emptyState);
  };

  // Calculate character count (excluding formatting)
  const charCount = editorState
    .getCurrentContent()
    .getPlainText("")
    .length;

  return (
    <>
      {/* Hidden Inputs */}
      <input
        type="hidden"
        id="Username"
        value={userName}
        onChange={(e) => setuserName(e.target.value)}
        className="w-full px-3 py-2 border rounded text-xs capitalize"
        disabled
      />
      <input
        type="hidden"
        id="ReferenceID"
        value={ReferenceID}
        onChange={(e) => setReferenceID(e.target.value)}
        className="w-full px-3 py-2 border rounded text-xs capitalize"
        disabled
      />

      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Title">
            Title
          </label>
          <input
            type="text"
            id="Title"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="DateCreated">
            Date Created
          </label>
          <input
            type="date"
            id="DateCreated"
            value={DateCreated}
            onChange={(e) => setDateCreated(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-full px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Description">
            Description
          </label>

          {/* Toolbar */}
          <div className="mb-2 flex flex-wrap gap-2 text-xs items-center">
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                toggleInlineStyle("BOLD");
              }}
              className="cursor-pointer px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              title="Bold"
            >
              B
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                toggleInlineStyle("ITALIC");
              }}
              className="cursor-pointer px-3 py-1 border rounded italic bg-gray-100 hover:bg-gray-200"
              title="Italic"
            >
              I
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                toggleInlineStyle("UNDERLINE");
              }}
              className="cursor-pointer px-3 py-1 border rounded underline bg-gray-100 hover:bg-gray-200"
              title="Underline"
            >
              U
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockType("unordered-list-item");
              }}
              className="cursor-pointer px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              title="Bullet List"
            >
              • List
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockType("ordered-list-item");
              }}
              className="cursor-pointer px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              title="Numbered List"
            >
              1. List
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={clearEditor}
              className="ml-auto px-3 py-1 border rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs"
              title="Clear Description"
            >
              Clear
            </button>
          </div>

          {/* Editor */}
          <div
            className="border rounded p-2 min-h-[200px] cursor-text capitalize"
            onClick={() => editorRef.current?.focus()}
          >
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              spellCheck={true}
            />
          </div>

          {/* Character Count */}
          <div className="text-right text-xs text-gray-500 mt-1">
            {charCount} character{charCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default Fields;

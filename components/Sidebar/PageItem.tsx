import React from "react";
import { Page } from "@/types";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  MoreHorizontal,
  FolderPlus,
  FolderMinus,
  Check,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { deletePage } from "@/store/PagesSlice";
import type { AppDispatch } from "@/store/store";
import { useState } from "react";

interface PageItemProps {
  page: Page;
  level: number;
  selectedPageId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  isCollapsed: boolean;
  folders: Array<{ _id: string; name: string; pageIds: string[] }>;
  onAddToFolder: (folderId: string, pageId: string) => void;
  onRemoveFromFolder: (folderId: string, pageId: string) => void;
}

export default function PageItem({
  page,
  level,
  selectedPageId,
  onSelect,
  onToggle,
  isCollapsed,
  folders,
  onAddToFolder,
  onRemoveFromFolder,
}: PageItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isSelected = selectedPageId === page._id;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteConfirmRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        deleteConfirmRef.current &&
        !deleteConfirmRef.current.contains(event.target as Node)
      ) {
        setShowDeleteConfirm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  return (
    <div className="relative">
      <div
        className={`
          flex items-center cursor-pointer justify-between group
          ${isSelected ? "bg-base-300" : "hover:bg-base-300"}
          ${isCollapsed ? "justify-center py-2 px-0" : "px-2 py-1"}
        `}
        onClick={() => onSelect(page._id)}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "w-full justify-center" : ""
          }`}
        >
          {!isCollapsed && (
            <>
              <div style={{ width: `${level * 12}px` }} />
              {page.children && page.children.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(page._id);
                  }}
                  className="btn btn-ghost btn-xs btn-square"
                >
                  {page.isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}
              <span className="ml-1">{page.icon || "📄"}</span>
              <span className="ml-2 truncate text-base-content">
                {page.title || "Untitled"}
              </span>
            </>
          )}
          {isCollapsed && <span title={page.title}>{page.icon || "📄"}</span>}
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-2 text-base-content">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-base-200 ring-1 ring-black ring-opacity-5 z-50"
                  style={{ minWidth: "200px" }}
                >
                  <div className="py-1">
                    {folders?.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-base-content/70">
                        No folders available
                      </div>
                    ) : (
                      folders?.map((folder) => (
                        <button
                          key={folder._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (folder.pageIds.includes(page._id)) {
                              onRemoveFromFolder(folder._id, page._id);
                            } else {
                              onAddToFolder(folder._id, page._id);
                            }
                            setShowDropdown(false);
                          }}
                          className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-base-300"
                        >
                          {folder.pageIds.includes(page._id) ? (
                            <>
                              <FolderMinus className="h-4 w-4 mr-2" />
                              Remove from {folder.name}
                            </>
                          ) : (
                            <>
                              <FolderPlus className="h-4 w-4 mr-2" />
                              Add to {folder.name}
                            </>
                          )}
                        </button>
                      ))
                    )}
                    <div className="border-t border-base-300 mt-1"></div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(e);
                        }}
                        className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-base-300 text-error"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete page
                      </button>

                      {showDeleteConfirm && (
                        <div
                          ref={deleteConfirmRef}
                          className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-base-200 ring-1 ring-black ring-opacity-5 p-3"
                        >
                          <p className="text-sm mb-2">Are you sure?</p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(false);
                              }}
                              className="btn btn-sm btn-ghost btn-square"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(deletePage(page._id));
                                setShowDeleteConfirm(false);
                              }}
                              className="btn btn-sm btn-error btn-square"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed &&
        page.isExpanded &&
        page.children?.map((childPage) => (
          <PageItem
            key={childPage._id}
            page={childPage}
            level={level + 1}
            selectedPageId={selectedPageId}
            onSelect={onSelect}
            onToggle={onToggle}
            isCollapsed={isCollapsed}
            folders={folders}
            onAddToFolder={onAddToFolder}
            onRemoveFromFolder={onRemoveFromFolder}
          />
        ))}
    </div>
  );
}

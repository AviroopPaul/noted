import React from "react";
import { Page } from "@/types";
import { ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deletePage } from "@/store/PagesSlice";
import type { AppDispatch } from "@/store/store";

interface PageItemProps {
  page: Page;
  level: number;
  selectedPageId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  isCollapsed: boolean;
}

export default function PageItem({
  page,
  level,
  selectedPageId,
  onSelect,
  onToggle,
  isCollapsed,
}: PageItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isSelected = selectedPageId === page._id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this page?")) {
      dispatch(deletePage(page._id));
    }
  };

  return (
    <>
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
                {page.title}
              </span>
            </>
          )}
          {isCollapsed && <span title={page.title}>{page.icon || "📄"}</span>}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleDelete}
            className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
            title="Delete page"
          >
            <Trash2 className="h-4 w-4 text-error" />
          </button>
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
          />
        ))}
    </>
  );
}

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { createPage, selectPage, togglePageExpand } from "@/store/PagesSlice";
import { useTheme } from "@/app/ThemeContext";
import PageItem from "./PageItem";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pages = useSelector((state: RootState) => state.pages.pages);
  const selectedPageId = useSelector(
    (state: RootState) => state.pages.selectedPageId
  );

  const handleAddPage = () => {
    dispatch(
      createPage({
        title: "Untitled",
        content: "",
      })
    );
  };

  const handleSelectPage = (pageId: string) => {
    dispatch(selectPage(pageId));
  };

  return (
    <div
      className={`transition-all duration-300 border-r border-base-300 bg-base-200 flex flex-col ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="p-2 border-b border-base-300 flex justify-between items-center">
        {!isCollapsed && (
          <span className="text-base-content font-medium px-2">Pages</span>
        )}
        <div className="flex items-center">
          {!isCollapsed && (
            <button
              onClick={handleAddPage}
              className="btn btn-ghost btn-sm btn-circle"
              title="New Page"
            >
              <Plus size={20} className="text-base-content" />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn btn-ghost btn-sm btn-circle"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-base-content" />
            ) : (
              <ChevronLeft size={20} className="text-base-content" />
            )}
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {pages.map((page) => (
          <PageItem
            key={page._id}
            page={page}
            level={0}
            selectedPageId={selectedPageId}
            onSelect={(id) => handleSelectPage(id)}
            onToggle={(id) => dispatch(togglePageExpand(id))}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
}

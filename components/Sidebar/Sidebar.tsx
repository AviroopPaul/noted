import React, { useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { createPage, selectPage, togglePageExpand } from "@/store/PagesSlice";
import PageItem from "./PageItem";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function Sidebar() {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(256); // 256px = 16rem (w-64)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const MIN_WIDTH = 48; // 3rem (w-12)
  const MAX_WIDTH = 384; // 24rem

  const pages = useSelector((state: RootState) => state.pages.pages);
  const selectedPageId = useSelector(
    (state: RootState) => state.pages.selectedPageId
  );

  const handleAddPage = () => {
    dispatch(
      createPage({
        title: "Untitled",
        content: "",
        isExpanded: false,
      })
    );
  };

  const handleSelectPage = async (pageId: string) => {
    if (pageId === selectedPageId) return; // Don't reload if already selected

    setIsLoading(true);

    // Clear current selection
    dispatch(selectPage(null));

    // Wait for state to clear
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Select new page
    dispatch(selectPage(pageId));
    setIsLoading(false);
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX;
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setWidth(newWidth);
      setIsCollapsed(newWidth <= MIN_WIDTH + 10);
    }
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`transition-all duration-300 border-r border-base-300 bg-base-200 flex flex-col relative`}
      style={{ width: isCollapsed ? MIN_WIDTH : width }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
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
          <div
            key={page._id}
            className="border-b border-base-300 last:border-b-0"
          >
            <PageItem
              page={page}
              level={0}
              selectedPageId={selectedPageId}
              onSelect={(id) => handleSelectPage(id)}
              onToggle={(id) => dispatch(togglePageExpand(id))}
              isCollapsed={isCollapsed}
            />
          </div>
        ))}
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
        onMouseDown={startResizing}
      />
    </div>
  );
}

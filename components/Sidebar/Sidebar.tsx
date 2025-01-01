import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { createPage, selectPage, togglePageExpand } from "@/store/PagesSlice";
import PageItem from "./PageItem";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";
import type { SortOption } from "@/types/page";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handleAddPage = () => {
    dispatch(
      createPage({
        title: "",
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

  const filterPages = (pages: Page[]) => {
    return pages.filter((page) => {
      const matchesSearch = page.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesIcon = !selectedIcon || page.icon === selectedIcon;
      return matchesSearch && matchesIcon;
    });
  };

  const getUniqueIcons = (pages: Page[]): string[] => {
    const icons = new Set<string>();
    pages.forEach((page) => {
      if (page.icon) icons.add(page.icon);
    });
    return Array.from(icons);
  };

  const sortPages = (pages: Page[]) => {
    switch (sortOption) {
      case "alphabetical":
        return [...pages].sort((a, b) => a.title.localeCompare(b.title));
      case "icon":
        return [...pages].sort((a, b) => {
          if (!a.icon && !b.icon) return 0;
          if (!a.icon) return 1;
          if (!b.icon) return -1;
          return a.icon.localeCompare(b.icon);
        });
      case "recent":
      default:
        return [...pages].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  };

  useEffect(() => {
    const loadSortPreference = async () => {
      try {
        const response = await fetch("/api/user/settings");
        const data = await response.json();
        if (data.sidebarSort) {
          setSortOption(data.sidebarSort);
        }
      } catch (error) {
        console.error("Failed to load sort preference:", error);
      }
    };
    loadSortPreference();
  }, []);

  const handleSortChange = async (newSort: SortOption) => {
    setSortOption(newSort);
    setShowSortDropdown(false);
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sidebarSort: newSort }),
      });
    } catch (error) {
      console.error("Failed to save sort preference:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`hidden md:flex transition-all duration-300 border-r border-base-300 bg-base-200 flex-col relative`}
      style={{ width: isCollapsed ? MIN_WIDTH : width }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <div className="p-2 border-b border-base-300 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          {!isCollapsed && (
            <span className="text-base-content font-medium px-2">Pages</span>
          )}
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <>
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="btn btn-ghost btn-sm btn-circle"
                    title="Sort pages"
                  >
                    <ArrowUpDown
                      size={18}
                      className={`text-base-content ${
                        sortOption !== "recent" ? "text-base-content" : ""
                      }`}
                    />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-base-200 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleSortChange("recent")}
                          className={`block px-4 py-2 text-sm w-full text-left hover:bg-base-300 ${
                            sortOption === "recent" ? "bg-base-300" : ""
                          }`}
                        >
                          Sort by Recent
                        </button>
                        <button
                          onClick={() => handleSortChange("alphabetical")}
                          className={`block px-4 py-2 text-sm w-full text-left hover:bg-base-300 ${
                            sortOption === "alphabetical" ? "bg-base-300" : ""
                          }`}
                        >
                          Sort Alphabetically
                        </button>
                        <button
                          onClick={() => handleSortChange("icon")}
                          className={`block px-4 py-2 text-sm w-full text-left hover:bg-base-300 ${
                            sortOption === "icon" ? "bg-base-300" : ""
                          }`}
                        >
                          Sort by Icon
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-ghost btn-sm btn-circle"
                  title="Filter by icon"
                >
                  <Filter
                    size={18}
                    className={`text-base-content ${
                      selectedIcon ? "text-primary" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={handleAddPage}
                  className="btn btn-ghost btn-sm btn-circle"
                  title="New Page"
                >
                  <Plus size={20} className="text-base-content" />
                </button>
              </>
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

        {!isCollapsed && (
          <>
            <div className="flex items-center px-2 gap-2">
              <Search size={16} className="text-base-content opacity-70" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm input-ghost w-full focus:outline-none p-0"
              />
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-1 px-2">
                <button
                  onClick={() => setSelectedIcon(null)}
                  className={`btn btn-xs ${
                    !selectedIcon ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  All
                </button>
                {getUniqueIcons(pages).map((icon) => (
                  <button
                    key={icon}
                    onClick={() =>
                      setSelectedIcon(icon === selectedIcon ? null : icon)
                    }
                    className={`btn btn-xs ${
                      icon === selectedIcon ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {sortPages(filterPages(pages)).map((page) => (
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

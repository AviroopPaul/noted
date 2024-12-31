import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { createPage, selectPage } from "@/store/PagesSlice";
import { Plus, Menu, Search, X } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Page } from "@/types/page";

export default function MobileSidebar() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pages = useSelector((state: RootState) => state.pages.pages);
  const selectedPageId = useSelector(
    (state: RootState) => state.pages.selectedPageId
  );

  const handleAddPage = () => {
    dispatch(
      createPage({
        title: "",
        content: "",
        isExpanded: false,
      }).unwrap()
    );
    setIsOpen(false);
  };

  const handleSelectPage = async (pageId: string) => {
    if (pageId === selectedPageId) return;

    setIsLoading(true);
    dispatch(selectPage(null));
    await new Promise((resolve) => setTimeout(resolve, 50));
    dispatch(selectPage(pageId));
    setIsLoading(false);
    setIsOpen(false);
  };

  const filterPages = (pages: Page[]) => {
    return pages.filter((page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-40 btn btn-circle btn-primary shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-80 bg-base-200 shadow-xl flex flex-col text-base-content">
          {/* Header */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-lg font-bold">Pages</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-base-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pr-10"
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-base-content/50" />
            </div>
          </div>

          {/* Pages List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              filterPages(pages).map((page) => (
                <button
                  key={page._id}
                  onClick={() => handleSelectPage(page._id)}
                  className={`w-full p-4 text-left border-b border-base-300 flex items-center gap-2 ${
                    page._id === selectedPageId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-300"
                  }`}
                >
                  <span className="text-xl">{page.icon || "📄"}</span>
                  <span className="flex-1 truncate">
                    {page.title || "Untitled"}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Add Page Button */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={handleAddPage}
              className="btn btn-primary w-full gap-2"
            >
              <Plus size={20} />
              New Page
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 -z-10"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}

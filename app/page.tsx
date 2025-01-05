"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePage, deletePage, fetchPages } from "@/store/PagesSlice";
import { useTheme } from "./ThemeContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { Trash2, ImagePlus, Maximize2, Minimize2 } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Welcome from "@/components/Welcome/Welcome";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { AppDispatch } from "@/store/store";
import Footer from "@/components/Footer/Footer";
import CoverImageModal from "@/components/CoverImageModal/CoverImageModal";
import MobileSidebar from "@/components/Mobile/MobileSidebar";

const RichTextEditor = dynamic(
  () => import("@/components/Editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse w-full h-[200px] bg-base-200"></div>
    ),
  }
);

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const pages = useSelector((state: RootState) => state.pages.pages);
  const selectedPageId = useSelector(
    (state: RootState) => state.pages.selectedPageId
  );

  const selectedPage = pages.find((page) => page._id === selectedPageId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [isExpandedCover, setIsExpandedCover] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);

  useEffect(() => {
    // Clear content when switching pages
    setIsPageLoading(true);
    setTitle("");
    setContent("");

    if (selectedPage) {
      // Small delay to ensure state is cleared before setting new content
      const timer = setTimeout(() => {
        setTitle(selectedPage.title || "");
        setContent(selectedPage.content || "");
        setIsPageLoading(false);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setIsPageLoading(false);
    }
  }, [selectedPage?._id]);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  useEffect(() => {
    // Cleanup function to reset state when component unmounts
    // or when selectedPageId changes
    return () => {
      setTitle("");
      setContent("");
      setIsPageLoading(false);
    };
  }, [selectedPageId]);

  const handleUpdatePage = useCallback(() => {
    if (selectedPageId && selectedPage) {
      console.log("Saving page...", { title, content }); // Debug log
      dispatch(
        updatePage({
          id: selectedPageId,
          title,
          content,
          icon: selectedPage.icon,
          cover: selectedPage.cover,
          isExpanded: selectedPage.isExpanded,
        })
      );
    }
  }, [selectedPageId, selectedPage, title, content, dispatch]);

  const handleDeletePage = () => {
    if (selectedPageId) {
      dispatch(deletePage(selectedPageId));
    }
  };

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedPageId) {
      try {
        setIsCoverLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        dispatch(
          updatePage({
            id: selectedPageId,
            title,
            content,
            cover: data.url,
          })
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsCoverLoading(false);
      }
    }
  };

  const handleRemoveCover = () => {
    if (selectedPageId) {
      dispatch(
        updatePage({
          id: selectedPageId,
          title,
          content,
          cover: undefined,
        })
      );
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (selectedPageId) {
      dispatch(
        updatePage({
          id: selectedPageId,
          icon: emoji,
        })
      );
      setShowEmojiPicker(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <div className="flex flex-1 h-[calc(100vh-57px-53px)]">
        {session && (
          <>
            <Sidebar />
            <MobileSidebar />
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-base-100">
          {!session ? (
            <Welcome />
          ) : selectedPage ? (
            <>
              <div className="relative">
                {selectedPage.cover ? (
                  <div className="w-full relative group">
                    <div
                      className={`w-full transition-all duration-300 ease-in-out cursor-pointer ${
                        isExpandedCover ? "h-96" : "h-56"
                      }`}
                      onClick={() => setIsExpandedCover(!isExpandedCover)}
                    >
                      <img
                        src={selectedPage.cover}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      {isCoverLoading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            className="btn btn-circle btn-sm bg-base-100 text-base-content hover:bg-base-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsExpandedCover(!isExpandedCover);
                            }}
                          >
                            {isExpandedCover ? (
                              <Minimize2 size={20} />
                            ) : (
                              <Maximize2 size={20} />
                            )}
                          </button>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                          <button
                            className="btn btn-sm bg-base-100 text-base-content hover:bg-base-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCoverModal(true);
                            }}
                          >
                            Edit cover
                          </button>
                          <button
                            className="btn btn-sm bg-base-100 text-base-content hover:bg-base-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCover();
                            }}
                          >
                            Remove cover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center border-b border-dashed border-base-300 bg-base-200/50">
                    <div className="text-center">
                      <button
                        className="btn btn-ghost btn-sm gap-2 text-base-content"
                        onClick={() => setShowCoverModal(true)}
                      >
                        <ImagePlus size={20} />
                        <span className="text-base-content">
                          Add cover image
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="btn btn-ghost btn-sm btn-circle text-2xl"
                    >
                      {selectedPage.icon || "📄"}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-1 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiData) =>
                            handleEmojiSelect(emojiData.emoji)
                          }
                          theme={
                            [
                              "dark",
                              "synthwave",
                              "cyberpunk",
                              "halloween",
                              "forest",
                              "black",
                              "luxury",
                              "dracula",
                              "business",
                              "night",
                              "coffee",
                            ].includes(theme)
                              ? "dark"
                              : "light"
                          }
                          as
                          const
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleUpdatePage}
                    className="input input-ghost text-2xl font-bold w-full focus:outline-none text-base-content placeholder:text-base-content/50"
                    placeholder="Untitled"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeletePage}
                    className="btn btn-ghost btn-sm btn-circle text-error hover:bg-base-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-base-100">
                {!isPageLoading ? (
                  <RichTextEditor
                    key={selectedPage?._id}
                    content={content}
                    onChange={(newContent) => {
                      console.log(
                        "Content changed:",
                        newContent.substring(0, 100)
                      ); // Debug log
                      setContent(newContent);
                      handleUpdatePage(); // Save immediately on change
                    }}
                    onBlur={handleUpdatePage}
                  />
                ) : (
                  <div className="animate-pulse w-full h-[200px] bg-base-200"></div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50 bg-base-100">
              Select a page or create a new one
            </div>
          )}
        </div>
      </div>
      <Footer />
      <CoverImageModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        onImageSelect={(imageUrl) => {
          if (selectedPageId) {
            dispatch(
              updatePage({
                id: selectedPageId,
                title,
                content,
                cover: imageUrl,
              })
            );
            setShowCoverModal(false);
          }
        }}
        onFileUpload={handleCoverImage}
      />
    </main>
  );
}

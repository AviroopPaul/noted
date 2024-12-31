import { Editor } from "@tiptap/react";
import { useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import AIModal from "../Editor/MenuBar/AIModal";
import { Menu, X } from "lucide-react";

interface MobileMenuBarProps {
  editor: Editor | null;
}

export const MobileMenuBar = ({ editor }: MobileMenuBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  if (!editor) {
    return null;
  }

  // Reuse existing handler functions from MenuBar
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
          setIsUploading(true);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (data.url) {
            editor.chain().focus().setImage({ src: data.url }).run();
          }
        } catch (error) {
          console.error("Upload failed:", error);
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const handleAIFormat = async () => {
    const content = editor.getHTML();
    setIsFormatting(true);

    try {
      const response = await fetch("/api/ai/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.response) {
        editor.commands.setContent(data.response);
        editor.commands.focus();
      }
    } catch (error) {
      console.error("Format failed:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <>
      {/* Mobile Format Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 btn btn-circle btn-primary shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Format Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out text-base-content ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-80 bg-base-200 shadow-xl flex flex-col ml-auto">
          {/* Header */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-lg font-bold">Formatting</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formatting Options */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Text Style Section */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-2 text-base-content">
                  Text Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    onChange={(e) => {
                      const family = e.target.value;
                      if (family === "default") {
                        editor.chain().focus().clearNodes().run();
                      } else {
                        editor.chain().focus().setFontFamily(family).run();
                      }
                    }}
                    className="select select-sm select-bordered w-full"
                    value={
                      editor.getAttributes("textStyle").fontFamily || "default"
                    }
                  >
                    <option value="default">Font</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>

                  <select
                    onChange={(e) => {
                      const size = e.target.value;
                      if (size === "default") {
                        editor.chain().focus().unsetFontSize().run();
                      } else {
                        editor.chain().focus().setFontSize(size).run();
                      }
                    }}
                    className="select select-sm select-bordered w-full"
                    value={
                      editor.getAttributes("textStyle").fontSize || "default"
                    }
                  >
                    <option value="default">Size</option>
                    <option value="12pt">12</option>
                    <option value="14pt">14</option>
                    <option value="16pt">16</option>
                    <option value="18pt">18</option>
                    <option value="20pt">20</option>
                    <option value="24pt">24</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editor.chain().focus().setTextAlign("left").run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive({ textAlign: "left" })
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().setTextAlign("center").run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive({ textAlign: "center" })
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().setTextAlign("right").run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive({ textAlign: "right" })
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    Right
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive("bold") ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive("italic") ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    Italic
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive("underline") ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    Underline
                  </button>
                </div>
              </div>

              {/* Lists Section */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-2 text-base-content">Lists</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive("bulletList")
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    Bullet List
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`btn btn-sm flex-1 text-base-content ${
                      editor.isActive("orderedList")
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    Numbered List
                  </button>
                </div>
              </div>

              {/* AI Features */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-2 text-base-content">
                  AI Features
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleAIFormat}
                    disabled={isFormatting}
                    className="btn btn-sm flex-1 text-base-content"
                  >
                    {isFormatting ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      "AI Format"
                    )}
                  </button>
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="btn btn-sm flex-1 text-base-content"
                  >
                    NotedAI
                  </button>
                </div>
              </div>

              {/* Insert Section */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-2 text-base-content">Insert</h3>
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="btn btn-sm w-full text-base-content"
                >
                  {isUploading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    "Insert Image"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 -z-10"
          onClick={() => setIsOpen(false)}
        />
      </div>

      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </>
  );
};

export default MobileMenuBar;

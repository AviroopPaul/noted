import { Editor } from "@tiptap/react";
import { useState } from "react";
import LoadingSpinner from "../../UI/LoadingSpinner";
import AIModal from "./AIModal";

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  if (!editor) {
    return null;
  }

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
        editor.options.onUpdate?.({ editor, transaction: editor.state.tr });
        editor.commands.blur();
      }
    } catch (error) {
      console.error("Format failed:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <>
      <div className="relative bg-base-100 border-b border-base-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 left-2 z-10 p-2 hover:bg-base-200 rounded-lg text-base-content"
          title="Formatting Options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          className={`transition-all duration-200 ease-in-out text-base-content bg-base-100 ${
            isExpanded ? "ml-0 opacity-100" : "-ml-[200px] opacity-0"
          } pl-12`}
        >
          <div className="flex flex-wrap gap-2 p-2 text-base-content ">
            <select
              onChange={(e) => {
                const family = e.target.value;
                if (family === "default") {
                  editor.chain().focus().clearNodes().run();
                } else {
                  editor.chain().focus().setFontFamily(family).run();
                }
              }}
              className="select select-sm select-ghost border-base-300"
              value={editor.getAttributes("textStyle").fontFamily || "default"}
            >
              <option value="default">Font</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>

            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("bold") ? "btn-primary" : "btn-ghost"
              }`}
              title="Bold"
            >
              <strong>B</strong>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("italic") ? "btn-primary" : "btn-ghost"
              }`}
              title="Italic"
            >
              <em>I</em>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("underline") ? "btn-primary" : "btn-ghost"
              }`}
              title="Underline"
            >
              <span style={{ textDecoration: "underline" }}>U</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("strike") ? "btn-primary" : "btn-ghost"
              }`}
              title="Strikethrough"
            >
              <span style={{ textDecoration: "line-through" }}>S</span>
            </button>
            <div className="btn-group">
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive("heading", { level: 1 })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Heading 1"
              >
                <span className="font-bold text-lg">H1</span>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive("heading", { level: 2 })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Heading 2"
              >
                <span className="font-bold text-md">H2</span>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive("heading", { level: 3 })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Heading 3"
              >
                <span className="font-bold text-xs">H3</span>
              </button>
            </div>

            <div className="btn-group">
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive({ textAlign: "left" })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Align Left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="12"
                    x2="15"
                    y2="12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="18"
                    x2="18"
                    y2="18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive({ textAlign: "center" })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Align Center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="12"
                    x2="18"
                    y2="12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="18"
                    x2="20"
                    y2="18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={`btn btn-sm text-base-content ${
                  editor.isActive({ textAlign: "right" })
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                title="Align Right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="9"
                    y1="12"
                    x2="21"
                    y2="12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="18"
                    x2="21"
                    y2="18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("bulletList") ? "btn-primary" : "btn-ghost"
              }`}
              title="Bullet List"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line
                  x1="9"
                  y1="6"
                  x2="20"
                  y2="6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="9"
                  y1="12"
                  x2="20"
                  y2="12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="9"
                  y1="18"
                  x2="20"
                  y2="18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="4" cy="6" r="2" fill="currentColor" />
                <circle cx="4" cy="12" r="2" fill="currentColor" />
                <circle cx="4" cy="18" r="2" fill="currentColor" />
              </svg>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("orderedList") ? "btn-primary" : "btn-ghost"
              }`}
              title="Numbered List"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line
                  x1="9"
                  y1="6"
                  x2="20"
                  y2="6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="9"
                  y1="12"
                  x2="20"
                  y2="12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="9"
                  y1="18"
                  x2="20"
                  y2="18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text x="2" y="7" fontSize="8" fill="currentColor">
                  1
                </text>
                <text x="2" y="13" fontSize="8" fill="currentColor">
                  2
                </text>
                <text x="2" y="19" fontSize="8" fill="currentColor">
                  3
                </text>
              </svg>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("taskList") ? "btn-primary" : "btn-ghost"
              }`}
              title="Task List"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="5" width="4" height="4" strokeWidth="2" />
                <line
                  x1="9"
                  y1="7"
                  x2="20"
                  y2="7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect x="3" y="13" width="4" height="4" strokeWidth="2" />
                <line
                  x1="9"
                  y1="15"
                  x2="20"
                  y2="15"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M4 14 L5 16 L7 13" strokeWidth="1" />
              </svg>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`btn btn-sm text-base-content ${
                editor.isActive("codeBlock") ? "btn-primary" : "btn-ghost"
              }`}
              title="Code Block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline
                  points="16 18 22 12 16 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="8 6 2 12 8 18"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={handleImageUpload}
              className="btn btn-sm text-base-content btn-ghost"
              title="Insert Image"
              disabled={isUploading}
            >
              {isUploading ? (
                <LoadingSpinner size="small" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </button>

            <button
              onClick={handleAIFormat}
              disabled={isFormatting}
              className="btn btn-sm btn-ghost flex items-center gap-1"
              title="AI Format"
            >
              {isFormatting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span
                    style={{
                      background: `linear-gradient(
                        45deg,
                        oklch(var(--p)) 0%,
                        oklch(var(--s)) 33%,
                        oklch(var(--a)) 66%,
                        oklch(var(--p)) 100%
                      )`,
                      backgroundSize: "300% auto",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "gradient 3s linear infinite",
                    }}
                    className="font-bold text-lg"
                  >
                    AI-Format{" "}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAIModalOpen(true)}
              className="btn btn-sm btn-ghost flex items-center gap-1 group"
              title="AI Assistant"
            >
              <span
                style={{
                  background: `linear-gradient(
                    45deg,
                    oklch(var(--p)) 0%,
                    oklch(var(--s)) 33%,
                    oklch(var(--a)) 66%,
                    oklch(var(--p)) 100%
                  )`,
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradient 3s linear infinite",
                }}
                className="font-bold text-lg"
              >
                <span className="text-sm">✨</span> NotedAI{" "}
                <span className="text-sm">✨</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 300% center;
          }
        }
        @keyframes format-gradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </>
  );
};

export default MenuBar;

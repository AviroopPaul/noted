"use client";

import {
  useEditor,
  EditorContent,
  Editor,
  NodeViewWrapper,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import { useEffect, useState } from "react";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import LoadingSpinner from "../UI/LoadingSpinner";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";

const lowlight = createLowlight(all);

// DaisyUI light themes
const LIGHT_THEMES = [
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "retro",
  "cyberpunk",
  "valentine",
  "garden",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "cmyk",
  "autumn",
  "acid",
  "lemonade",
  "winter",
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur: () => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-base-300 relative">
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
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "ml-0 opacity-100" : "-ml-[200px] opacity-0"
        } pl-12`}
      >
        <div className="flex flex-wrap gap-2 p-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("bold") ? "btn-primary" : "btn-ghost"
            }`}
            title="Bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
              />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("italic") ? "btn-primary" : "btn-ghost"
            }`}
            title="Italic"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line
                x1="19"
                y1="4"
                x2="10"
                y2="4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="20"
                x2="5"
                y2="20"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="4"
                x2="9"
                y2="20"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("strike") ? "btn-primary" : "btn-ghost"
            }`}
            title="Strikethrough"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.5 6.5C17.5 4.5 15 4 12 4S6.5 4.5 6.5 6.5c0 2.5 5.5 2.5 5.5 5 0 2-3 2.5-5.5 2.5"
              />
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
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("paragraph") ? "btn-primary" : "btn-ghost"
            }`}
            title="Paragraph"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h12m-12 6h16"
              />
            </svg>
          </button>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
              <circle cx="2" cy="6" r="1" />
              <circle cx="2" cy="12" r="1" />
              <circle cx="2" cy="18" r="1" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("orderedList") ? "btn-primary" : "btn-ghost"
            }`}
            title="Ordered List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
              <text x="1" y="7" fontSize="6" fill="currentColor">
                1
              </text>
              <text x="1" y="13" fontSize="6" fill="currentColor">
                2
              </text>
              <text x="1" y="19" fontSize="6" fill="currentColor">
                3
              </text>
            </svg>
          </button>
          <button
            onClick={async () => {
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
            }}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 14l2 2 4-4"
              />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`btn btn-sm text-base-content ${
              editor.isActive("underline") ? "btn-primary" : "btn-ghost"
            }`}
            title="Underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="4"
                y1="21"
                x2="20"
                y2="21"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <select
            onChange={(e) => {
              const family = e.target.value;
              if (family === "default") {
                editor.chain().focus().clearNodes().run();
              } else {
                editor.chain().focus().setFontFamily(family).run();
              }
            }}
            className="select select-sm select-ghost"
            value={editor.getAttributes("textStyle").fontFamily || "default"}
          >
            <option value="default">Font</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>

          <div className="btn-group">
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
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
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
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
        </div>
      </div>
    </div>
  );
};

const ImageComponent = ({
  node,
  selected,
}: {
  node: any;
  selected: boolean;
}) => {
  return (
    <NodeViewWrapper className="image-wrapper">
      <img
        src={node.attrs.src}
        className={`editor-image ${selected ? "selected" : ""}`}
        alt={node.attrs.alt || ""}
      />
    </NodeViewWrapper>
  );
};

const RichTextEditor = ({ content, onChange, onBlur }: RichTextEditorProps) => {
  const [isPasting, setIsPasting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        selectable: true,
        draggable: true,
        nodeView: () => ({
          dom: document.createElement("div"),
          contentDOM: document.createElement("div"),
          update: (node: any) => {
            return true;
          },
        }),
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TextStyle.configure({
        types: ["textStyle"],
      }),
      Color,
      FontFamily.configure({
        types: ["textStyle"],
        defaultFamily: "Arial",
      }),
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none text-base-content",
      },
      handlePaste: async (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItems = items.filter((item) =>
          item.type.startsWith("image")
        );

        if (imageItems.length > 0) {
          event.preventDefault();
          setIsPasting(true);

          try {
            for (const item of imageItems) {
              const file = item.getAsFile();
              if (!file) continue;

              const formData = new FormData();
              formData.append("file", file);

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const data = await response.json();
              if (data.url) {
                editor?.chain().focus().setImage({ src: data.url }).run();
              }
            }
          } catch (error) {
            console.error("Image upload failed:", error);
          } finally {
            setIsPasting(false);
          }
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur,
  });

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const isLightTheme = LIGHT_THEMES.includes(currentTheme || "");
      document
        .querySelector(".ProseMirror")
        ?.classList.toggle("dark-theme", !isLightTheme);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col relative">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-auto relative">
        {isPasting && (
          <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="large" />
          </div>
        )}
        <style jsx global>{`
          .ProseMirror {
            min-height: 100%;
            padding: 1rem;
            background: transparent;
            color: hsl(var(--bc));
          }

          .ProseMirror p {
            margin: 1em 0;
            color: hsl(var(--bc));
          }

          .ProseMirror:focus {
            outline: none;
          }

          .ProseMirror h1,
          .ProseMirror h2,
          .ProseMirror h3,
          .ProseMirror h4,
          .ProseMirror h5,
          .ProseMirror h6 {
            line-height: 1.1;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: hsl(var(--bc));
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5em;
            color: hsl(var(--bc));
          }

          .ProseMirror code {
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 0.2em 0.4em;
            border-radius: 0.3em;
            line-height: 1.2;
            white-space: pre;
            tab-size: 4;
          }

          .ProseMirror pre {
            background: #1a1a1a;
            border-radius: 0.5em;
            color: #fff;
            font-family: "JetBrainsMono", monospace;
            padding: 0.75rem 1rem;
            margin: 1em 0;
          }

          .ProseMirror pre code {
            background: none;
            color: inherit;
            font-size: 0.9rem;
            padding: 0;
            line-height: 1.4;
            display: block;
            background-color: #1a1a1a;
          }

          .ProseMirror strong {
            color: hsl(var(--bc));
          }

          .ProseMirror em {
            color: hsl(var(--bc));
          }

          /* Syntax highlighting styles */
          .hljs-comment,
          .hljs-quote {
            color: #616161;
          }

          .hljs-variable,
          .hljs-template-variable,
          .hljs-attribute,
          .hljs-tag,
          .hljs-name,
          .hljs-regexp,
          .hljs-link,
          .hljs-name,
          .hljs-selector-id,
          .hljs-selector-class {
            color: #f98181;
          }

          .hljs-number,
          .hljs-meta,
          .hljs-built_in,
          .hljs-builtin-name,
          .hljs-literal,
          .hljs-type,
          .hljs-params {
            color: #fbbc88;
          }

          .hljs-string,
          .hljs-symbol,
          .hljs-bullet {
            color: #b9f18d;
          }

          .hljs-title,
          .hljs-section {
            color: #faf594;
          }

          .hljs-keyword,
          .hljs-selector-tag {
            color: #70cff8;
          }

          .hljs-emphasis {
            font-style: italic;
          }

          .hljs-strong {
            font-weight: 700;
          }

          .editor-image {
            max-width: 30%;
            height: auto;
            margin: 1em 0;
            border-radius: 0.5em;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
          }

          .editor-image.ProseMirror-selectednode {
            outline: 3px solid hsl(var(--p));
            outline-offset: 2px;
          }

          .editor-image:hover {
            outline: 2px solid hsl(var(--p) / 0.5);
            outline-offset: 2px;
          }

          ul[data-type="taskList"] {
            list-style: none;
            padding: 0;

            li {
              display: flex;
              align-items: flex-start;
              margin: 0.5em 0;

              > label {
                margin-right: 0.5em;
                user-select: none;
              }

              > div {
                flex: 1;
                margin-bottom: 0.5em;

                > p {
                  margin: 0;
                }
              }
            }

            input[type="checkbox"] {
              cursor: pointer;
            }
          }

          .image-wrapper {
            position: relative;
            display: inline-block;
          }

          .editor-image {
            max-width: 30%;
            height: auto;
            margin: 1em 0;
            border-radius: 0.5em;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
          }

          .editor-image.selected {
            outline: 3px solid hsl(var(--p));
            outline-offset: 2px;
          }

          .editor-image:hover {
            outline: 2px solid hsl(var(--p) / 0.5);
            outline-offset: 2px;
          }

          /* Add this to ensure the image node is selectable */
          .ProseMirror-selectednode .editor-image {
            outline: 3px solid hsl(var(--p));
            outline-offset: 2px;
          }

          /* Add these new styles */
          .ProseMirror {
            position: relative;
          }

          .image-wrapper {
            position: relative;
            display: inline-block;
          }

          /* Add these to your existing styles */
          [data-text-align="center"] {
            text-align: center;
          }

          [data-text-align="right"] {
            text-align: right;
          }

          [data-text-align="justify"] {
            text-align: justify;
          }

          .ProseMirror [style*="font-family"] {
            font-family: inherit;
          }

          .ProseMirror [style*="font-family: Arial"] {
            font-family: Arial, sans-serif;
          }

          .ProseMirror [style*="font-family: Times New Roman"] {
            font-family: "Times New Roman", serif;
          }

          .ProseMirror [style*="font-family: Courier New"] {
            font-family: "Courier New", monospace;
          }

          .ProseMirror [style*="font-family: Georgia"] {
            font-family: Georgia, serif;
          }
        `}</style>
        <EditorContent editor={editor} className="text-base-content" />
      </div>
    </div>
  );
};

export default RichTextEditor;

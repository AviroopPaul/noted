"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight, all } from "lowlight";
import { useEffect, useState } from "react";

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
        </div>
      </div>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, onBlur }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none text-base-content",
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

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-auto">
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
        `}</style>
        <EditorContent editor={editor} className="text-base-content" />
      </div>
    </div>
  );
};

export default RichTextEditor;

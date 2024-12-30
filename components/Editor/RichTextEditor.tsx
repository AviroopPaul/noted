"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import { useEffect, useState } from "react";
import MenuBar from "./MenuBar/MenuBar";
import LoadingSpinner from "../UI/LoadingSpinner";
import { getExtensions } from "./config/extensions";
import { THEMES } from "../../lib/constants/themes";
import "./styles/editor.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur: () => void;
}

const RichTextEditor = ({ content, onChange, onBlur }: RichTextEditorProps) => {
  const [isPasting, setIsPasting] = useState(false);
  const [codeToInsert, setCodeToInsert] = useState<{
    text: string;
    language: string;
  } | null>(null);

  const detectLanguage = (text: string) => {
    // Common language patterns
    const patterns = {
      javascript: /(const|let|var|function|=>|import|export)/,
      python: /(def|import|class|if __name__|print)/,
      html: /(<\/?[a-z][\s\S]*>)/i,
      css: /({[\s\S]*}|@media|@keyframes)/,
      sql: /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)/i,
    };

    for (const [language, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return language;
      }
    }

    return "plain"; // default to plain text
  };

  const editor = useEditor({
    extensions: getExtensions(),
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none text-base-content",
      },
      handlePaste: (view, event, slice) => {
        // Check if we're pasting inside a code block
        const isInCode = editor?.isActive("codeBlock");

        if (event.clipboardData?.types.includes("text/plain")) {
          const text = event.clipboardData.getData("text/plain");

          // If we're already in a code block, just paste the text
          if (isInCode) {
            view.dispatch(view.state.tr.insertText(text));
            return true;
          }

          // Try to detect if the content looks like code
          const looksLikeCode =
            /^(import|function|class|const|let|var|if|for|while|\{|\}|\/\/|\/\*|\*\/|#include|def|async|await)/.test(
              text.trim()
            );

          if (looksLikeCode) {
            const language = detectLanguage(text);
            setCodeToInsert({ text, language });
            return true;
          }

          // For regular text, let default paste behavior handle it
          return false;
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      console.log(
        "Editor content updated:",
        newContent.substring(0, 100) + "..."
      );
      onChange(newContent);
    },
    onBlur: () => {
      console.log("Editor blur event triggered");
      onBlur();
    },
  });

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const isLightTheme = THEMES.light.includes(currentTheme || "");
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

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="sticky top-0 z-25 bg-base-100">
        <MenuBar editor={editor} />
      </div>
      <div className="flex-1 overflow-y-auto relative">
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="bg-base-100 shadow-lg rounded-lg px-2 py-1 border border-base-300 flex gap-1 text-base-content"
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-base-200 ${
                editor.isActive("bold") ? "bg-base-300" : ""
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-base-200 ${
                editor.isActive("italic") ? "bg-base-300" : ""
              }`}
            >
              <i>I</i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded hover:bg-base-200 ${
                editor.isActive("underline") ? "bg-base-300" : ""
              }`}
            >
              <u>U</u>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1 rounded hover:bg-base-200 ${
                editor.isActive("strike") ? "bg-base-300" : ""
              }`}
            >
              <s>S</s>
            </button>
            <div className="w-px bg-base-300 mx-1" /> {/* Separator */}
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-1 rounded hover:bg-base-200 ${
                editor.isActive("highlight") ? "bg-yellow-200 text-black" : ""
              }`}
            >
              Highlight
            </button>
          </BubbleMenu>
        )}
        {isPasting && (
          <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="large" />
          </div>
        )}
        <EditorContent editor={editor} className="text-base-content" />
      </div>
      {codeToInsert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-4 rounded-lg">
            <p>This looks like code. How would you like to paste it?</p>
            <select
              value={codeToInsert.language}
              onChange={(e) =>
                setCodeToInsert({ ...codeToInsert, language: e.target.value })
              }
            >
              <option value="plain">Plain text</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              {/* Add more languages */}
            </select>
            <button
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setCodeBlock({ language: codeToInsert.language })
                  .insertContent(codeToInsert.text)
                  .run();
                setCodeToInsert(null);
              }}
            >
              Insert as Code
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().insertContent(codeToInsert.text).run();
                setCodeToInsert(null);
              }}
            >
              Insert as Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

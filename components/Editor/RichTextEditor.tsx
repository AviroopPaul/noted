"use client";

import { useEditor, EditorContent } from "@tiptap/react";
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

  const editor = useEditor({
    extensions: getExtensions(),
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none text-base-content",
      },
      handlePaste: async (view, event) => {
        // Paste handler code...
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

  return (
    <div className="flex flex-col relative">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-auto relative">
        {isPasting && (
          <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="large" />
          </div>
        )}
        <EditorContent editor={editor} className="text-base-content" />
      </div>
    </div>
  );
};

export default RichTextEditor;

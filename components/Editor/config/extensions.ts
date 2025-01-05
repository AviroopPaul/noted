import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { createLowlight, all } from "lowlight";
import { FontSize } from "./FontSize";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

const lowlight = createLowlight(all);

export const getExtensions = () => [
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
      update: () => true,
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
    HTMLAttributes: {
      class: "text-style",
    },
  }),
  Color.configure({
    types: ["textStyle"],
  }),
  FontFamily.configure({
    types: ["textStyle"],
    defaultFamily: "Arial",
  }),
  Underline,
  FontSize,
  Highlight.configure({
    multicolor: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary hover:underline cursor-pointer",
    },
  }),
];

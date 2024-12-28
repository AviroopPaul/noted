export interface Page {
  _id: string;
  userId: string;
  title: string;
  content?: string;
  icon?: string;
  cover?: string;
  children?: Page[];
  isExpanded?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Block {
  id: string;
  type:
    | "text"
    | "heading1"
    | "heading2"
    | "heading3"
    | "todo"
    | "bullet"
    | "numbered"
    | "toggle"
    | "quote"
    | "divider"
    | "image";
  content: string;
  checked?: boolean;
  children?: Block[];
}

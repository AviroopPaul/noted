export type SortOption = "alphabetical" | "recent" | "icon";

export interface Page {
  _id: string;
  title: string;
  content: string;
  icon?: string;
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

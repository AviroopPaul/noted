export interface Page {
  _id: string;
  title: string;
  content: string;
  icon?: string;
  isExpanded: boolean;
  // Add any other properties your page object might have
}

export interface TreeItem {
  key: string;
  label: string;
  pid?: string;
  root?: boolean;
  children: TreeItem[];
}

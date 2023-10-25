import { TreeItem } from "../types/category";
export function dfs(node: TreeItem, visit: (node: TreeItem) => void) {
  if (node) {
    visit(node);
    if (node.children) {
      for (const child of node.children) {
        dfs(child, visit);
      }
    }
  }
}

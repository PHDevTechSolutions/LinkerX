declare module "draft-js-export-html" {
  import { ContentState } from "draft-js";

  export function stateToHTML(content: ContentState, options?: any): string;
}

declare module '*.scss';
declare module 'draftjs-to-html' {
  export default function draftToHtml(a:ContentState): string;
}
declare module 'html-to-draftjs' {
  export default function htmlToDraft(a:string): ContentState;
}
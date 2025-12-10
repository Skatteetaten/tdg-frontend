declare module 'kotlin-playground' {
  export type PlaygroundOptions = {
    server: string;
    version: string;
    onChange: (code: string) => void;
    callback: (targetNode: HTMLElement, mountNode: HTMLElement) => void;
  };

  export default function playground(
    element: string | HTMLElement,
    options: PlaygroundOptions,
  ): void;
}

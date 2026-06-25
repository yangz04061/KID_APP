declare module "react" {
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (value: T | ((previousState: T) => T)) => void];
}

declare module "*.css";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react/jsx-runtime" {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(node: unknown): void;
  };
}

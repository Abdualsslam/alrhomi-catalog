// Module declarations for non-TypeScript imports

// Image file imports
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

// CSS imports
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// stylis-rtl module
declare module "stylis-rtl" {
  interface StylisPlugin {
    (element: any, index: number, children: any[], callback: Function): any;
  }

  const rtl: StylisPlugin;
  export default rtl;
}

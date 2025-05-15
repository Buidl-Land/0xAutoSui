declare namespace JSX {
  interface IntrinsicElements {
    'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      icon: string;
      mode?: string;
      inline?: boolean | string;
      width?: string | number;
      height?: string | number;
      rotate?: string | number;
      flip?: string;
      color?: string;
      // Add any other props you expect to use for iconify-icon
    };
  }
}
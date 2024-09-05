// Declare the module for custom elements
declare module 'react' {
    interface IntrinsicElements {
      'gmpx-place-picker': React.DetailedHTMLProps<React.HTMLProps<HTMLElement>, HTMLElement>;
    }
}
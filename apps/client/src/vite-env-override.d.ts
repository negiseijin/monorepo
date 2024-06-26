declare module "*react2.svg" {
  const content: string;
  export default content;
}

declare module "*react3.svg" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

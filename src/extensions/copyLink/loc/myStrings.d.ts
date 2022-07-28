declare interface ICopyLinkCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CopyLinkCommandSetStrings' {
  const strings: ICopyLinkCommandSetStrings;
  export = strings;
}

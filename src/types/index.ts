export enum TypeComponent {
  PARAGRAPH = "PARAGRAPH",
  BUTTON = "BUTTON",
}

export interface PropsParagraph {
  text?: string;
}

export interface PropsButton {
  text?: string;
  message?: string;
}

export interface Data {
  _id: string;
  component: TypeComponent;
  props?: PropComponent<unknown>;
  isActived?: boolean;
}

export type PropComponent<T> = T extends TypeComponent.PARAGRAPH
  ? PropsParagraph
  : PropsButton;

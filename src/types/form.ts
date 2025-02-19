export type FieldType = "number" | "string" | "multiline" | "boolean" | "date" | "enum";

export interface FormField {
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  defaultValue?: any;
}

export interface FormConfig {
  title?: string;
  items: FormField[];
  buttons: string[];
}

export interface FormData {
  [key: string]: any;
}

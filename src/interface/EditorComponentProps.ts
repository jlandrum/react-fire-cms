export interface EditorComponentProps<T> {
  onUpdate: (value: T) => void;
  value: T;
}
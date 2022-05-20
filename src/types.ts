export type PubSubCreator<T> = () => {
  [KeyOn in keyof T as `on${Capitalize<string & KeyOn>}`]: (
    callback: (payload: T[KeyOn]) => void
  ) => Function;
} & {
  [KeyOn in keyof T as `once${Capitalize<string & KeyOn>}`]: (
    callback: (payload: T[KeyOn]) => void
  ) => Function;
} & {
  [KeySet in keyof T as `set${Capitalize<string & KeySet>}`]: (payload: T[KeySet]) => void;
};

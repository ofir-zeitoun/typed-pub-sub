export type PubSubCreator<T> = () => {
  [Key in keyof T as `on${Capitalize<string & Key>}`]: (
    callback: (payload: T[Key]) => void
  ) => Function;
} & {
  [Key in keyof T as `once${Capitalize<string & Key>}`]: (
    callback: (payload: T[Key]) => void
  ) => Function;
} & {
  [KeySet in keyof T as `set${Capitalize<string & KeySet>}`]: (payload: T[KeySet]) => void;
};

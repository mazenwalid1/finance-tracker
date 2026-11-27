import { useRef, useState, type Dispatch, type SetStateAction } from "react";

type StorageState<T> = {
  value: T;
  error: string | null;
  canPersist: boolean;
  canReset: boolean;
};

export function useLocalStorage<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
) {
  const [state, setState] = useState<StorageState<T>>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return { value: initial, error: null, canPersist: true, canReset: false };
      }

      const parsed: unknown = JSON.parse(raw);
      if (!isValid(parsed)) {
        return {
          value: initial,
          error:
            "Saved transactions are unreadable. They have not been overwritten, and changes are not being saved.",
          canPersist: false,
          canReset: true,
        };
      }

      return { value: parsed, error: null, canPersist: true, canReset: false };
    } catch {
      return {
        value: initial,
        error:
          "Saved transactions could not be read. They have not been overwritten, and changes are not being saved.",
        canPersist: false,
        canReset: true,
      };
    }
  });
  const stateRef = useRef(state);

  const setValue: Dispatch<SetStateAction<T>> = (nextValue) => {
    const current = stateRef.current;
    const value =
      typeof nextValue === "function"
        ? (nextValue as (previous: T) => T)(current.value)
        : nextValue;
    let nextState: StorageState<T> = {
      ...current,
      value,
    };

    if (current.canPersist) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        if (!current.canReset) nextState = { ...nextState, error: null };
      } catch {
        nextState = {
          ...nextState,
          error: "Changes could not be saved to this browser.",
          canReset: false,
        };
      }
    }

    stateRef.current = nextState;
    setState(nextState);
  };

  const clearUnreadableStorage = () => {
    const current = stateRef.current;

    try {
      localStorage.removeItem(key);
      let nextState: StorageState<T> = {
        ...current,
        error: null,
        canPersist: true,
        canReset: false,
      };
      try {
        localStorage.setItem(key, JSON.stringify(current.value));
      } catch {
        nextState = {
          ...nextState,
          error: "Current transactions could not be saved to this browser.",
        };
      }
      stateRef.current = nextState;
      setState(nextState);
    } catch {
      const nextState = {
        ...current,
        error: "Unreadable saved transactions could not be cleared.",
      };
      stateRef.current = nextState;
      setState(nextState);
    }
  };

  return {
    value: state.value,
    setValue,
    storageError: state.error,
    canResetStorage: state.canReset,
    clearUnreadableStorage,
  };
}

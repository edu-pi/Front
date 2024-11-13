import { createContext, SetStateAction, Dispatch } from "react";

// Create contexts
interface InputErrorContextType {
  isInputError: boolean;
  setIsInputError: Dispatch<SetStateAction<boolean>>;
}
export const InputErrorContext = createContext<InputErrorContextType>({
  isInputError: false,
  setIsInputError: () => {},
});

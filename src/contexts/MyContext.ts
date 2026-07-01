import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  component: any;
  updateCpackage: any;
  updateComponent: any;
};

const initialState = {
  cpackage: undefined,
  component: undefined,
  updateCpackage: undefined,
  updateComponent: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

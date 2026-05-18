import { createContext } from "react";

type MyDropdownContextType = {
  contractPackage: any;
  component: any;
  chartPanelwidth: any;
  updateContractpackage: any;
  updateComponent: any;
  updateChartPanelwidth: any;
};

const initialState = {
  contractPackage: undefined,
  component: undefined,
  chartPanelwidth: undefined,
  updateContractpackage: undefined,
  updateComponent: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

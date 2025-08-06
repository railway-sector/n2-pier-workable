import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import { contractPackageNamesList, componentNamesList } from "./UniqueValues";
import MapPanel from "./components/MapPanel";
import AsOfDatePanel from "./components/AsOfDatePanel";

type MyDropdownContextType = {
  contractPackage: any;
  updateContractpackage: any;
  component: any;
  updateComponent: any;
};

const initialState = {
  contractPackage: undefined,
  updateContractpackage: undefined,
  component: undefined,
  updateComponent: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [contractPackage, setContractPackage] = useState<any>(
    contractPackageNamesList[0]
  );
  const [component, setComponentNames] = useState<any>(componentNamesList[0]);

  const updateContractpackage = (newContractPackage: any) => {
    setContractPackage(newContractPackage);
  };

  const updateComponent = (newComponent: any) => {
    setComponentNames(newComponent);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            contractPackage,
            updateContractpackage,
            component,
            updateComponent,
          }}
        >
          <MapPanel />
          <AsOfDatePanel />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;

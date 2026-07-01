import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import { contractPackageNamesList, componentNamesList } from "./UniqueValues";
import MapPanel from "./components/MapPanel";
import AsOfDatePanel from "./components/AsOfDatePanel";
import { MyContext } from "./contexts/MyContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authenticate } from "./autho";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "gCCFDRw5QmlAzzqy");
  }, []);

  const [cpackage, setContractPackage] = useState<any>(
    contractPackageNamesList[1],
  );
  const [component, setComponentNames] = useState<any>(componentNamesList[0]);

  const updateCpackage = (newContractPackage: any) => {
    setContractPackage(newContractPackage);
  };

  const updateComponent = (newComponent: any) => {
    setComponentNames(newComponent);
  };

  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell>
            <MyContext
              value={{
                cpackage,
                component,
                updateCpackage,
                updateComponent,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <MapPanel />
                <AsOfDatePanel />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;

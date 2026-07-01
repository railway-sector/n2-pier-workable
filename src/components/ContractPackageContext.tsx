import { useState, use } from "react";
import "../index.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-label";
import { contractPackageNamesList } from "../UniqueValues";
import { MyContext } from "../contexts/MyContext";

export default function ContractPackageSegmentedList() {
  const { updateCpackage } = use(MyContext);

  const [contractPackageSelected, setConractPackageSelected] = useState<any>(
    contractPackageNamesList[1],
  );

  return (
    <>
      <calcite-label>
        Contract Package
        <calcite-segmented-control
          oncalciteSegmentedControlChange={(event: any) => {
            setConractPackageSelected(event.target.selectedItem.id);
            updateCpackage(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {contractPackageSelected &&
            contractPackageNamesList.map((category: any, index: any) => {
              return (
                <calcite-segmented-control-item
                  {...(contractPackageSelected === category
                    ? { checked: true }
                    : {})}
                  key={index}
                  value={category}
                  id={category}
                >
                  {category}
                </calcite-segmented-control-item>
              );
            })}
        </calcite-segmented-control>
      </calcite-label>
    </>
  );
}

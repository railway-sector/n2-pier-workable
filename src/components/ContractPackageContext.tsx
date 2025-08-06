import { useState, use } from "react";
import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-label";
import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteLabel,
} from "@esri/calcite-components-react";
import { MyContext } from "../App";
import { contractPackageNamesList } from "../UniqueValues";

export default function ContractPackageSegmentedList() {
  const { updateContractpackage } = use(MyContext);

  const [contractPackageSelected, setConractPackageSelected] = useState<any>(
    contractPackageNamesList[0]
  );

  return (
    <>
      <CalciteLabel>
        Contract Package
        <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event: any) => {
            setConractPackageSelected(event.target.selectedItem.id);
            updateContractpackage(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {contractPackageSelected &&
            contractPackageNamesList.map((category: any, index: any) => {
              return (
                <CalciteSegmentedControlItem
                  {...(contractPackageSelected === category
                    ? { checked: true }
                    : {})}
                  key={index}
                  value={category}
                  id={category}
                >
                  {category}
                </CalciteSegmentedControlItem>
              );
            })}
        </CalciteSegmentedControl>
      </CalciteLabel>
    </>
  );
}

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
import { componentNamesList } from "../UniqueValues";

export default function ComponentSegmentedList() {
  const { updateComponent } = use(MyContext);

  const [componentSelected, setComponentSelected] = useState<any>(
    componentNamesList[0]
  );

  return (
    <>
      <CalciteLabel>
        Pre-construction Work
        <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event: any) => {
            setComponentSelected(event.target.selectedItem.id);
            updateComponent(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {componentSelected &&
            componentNamesList.map((category: any, index: any) => {
              return (
                <CalciteSegmentedControlItem
                  {...(componentSelected === category ? { checked: true } : {})}
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

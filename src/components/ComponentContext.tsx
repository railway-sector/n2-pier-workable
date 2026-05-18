import { useState, use } from "react";
import "../index.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-label";
import { componentNamesList } from "../UniqueValues";
import { MyContext } from "../contexts/MyContext";

export default function ComponentSegmentedList() {
  const { updateComponent } = use(MyContext);

  const [componentSelected, setComponentSelected] = useState<any>(
    componentNamesList[0],
  );

  return (
    <>
      <calcite-label>
        Pre-construction Work
        <calcite-segmented-control
          oncalciteSegmentedControlChange={(event: any) => {
            setComponentSelected(event.target.selectedItem.id);
            updateComponent(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {componentSelected &&
            componentNamesList.map((category: any, index: any) => {
              return (
                <calcite-segmented-control-item
                  {...(componentSelected === category ? { checked: true } : {})}
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

import { use } from "react";
import "../index.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-label";
import { MyContext } from "../contexts/MyContext";
import { work_name_to_field } from "../uniqueValue";

export default function ComponentSegmentedList() {
  const { updateComponent, component } = use(MyContext);

  return (
    <>
      <calcite-label>
        Pre-construction Work
        <calcite-segmented-control
          oncalciteSegmentedControlChange={(event: any) => {
            updateComponent(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {component &&
            work_name_to_field.map((f: any, index: any) => {
              return (
                <calcite-segmented-control-item
                  {...(component === f.name ? { checked: true } : {})}
                  key={index}
                  value={f.name}
                  id={f.name}
                >
                  {f.name}
                </calcite-segmented-control-item>
              );
            })}
        </calcite-segmented-control>
      </calcite-label>
    </>
  );
}

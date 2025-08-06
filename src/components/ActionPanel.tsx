import "@esri/calcite-components/dist/components/calcite-card";
import { CalciteCard } from "@esri/calcite-components-react";
import ContractPackageSegmentedList from "./ContractPackageContext";
import ComponentSegmentedList from "./ComponentContext";

const ActionPanel = (props: any) => {
  return (
    <>
      <div style={{ display: props.id === true ? "block" : "none" }}>
        <CalciteCard style={{ fontSize: "0.5rem" }}>
          <ContractPackageSegmentedList />
          <ComponentSegmentedList />
        </CalciteCard>
      </div>
    </>
  );
};

export default ActionPanel;

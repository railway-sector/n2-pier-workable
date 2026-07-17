import "@esri/calcite-components/dist/components/calcite-card";
import ContractPackageSegmentedList from "./ContractPackageContext";
import ComponentSegmentedList from "./ComponentContext";

const ActionPanel = () => {
  return (
    <>
      <div>
        <calcite-card style={{ fontSize: "0.5rem" }}>
          <ContractPackageSegmentedList />
          <ComponentSegmentedList />
        </calcite-card>
      </div>
    </>
  );
};

export default ActionPanel;

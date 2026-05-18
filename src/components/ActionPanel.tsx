import "@esri/calcite-components/dist/components/calcite-card";
import ContractPackageSegmentedList from "./ContractPackageContext";
import ComponentSegmentedList from "./ComponentContext";

const ActionPanel = (props: any) => {
  return (
    <>
      <div
        style={{
          display: props.id === true ? "block" : "none",
        }}
      >
        <calcite-card style={{ fontSize: "0.5rem" }}>
          <ContractPackageSegmentedList />
          <ComponentSegmentedList />
        </calcite-card>
      </div>
    </>
  );
};

export default ActionPanel;

import { memo } from "react";
import { dateUpdate } from "../query";
import { useQuery } from "@tanstack/react-query";

//- Use `memo` to prevent re-rendering the Component
//- when the obstruction elements are changed.
const AsOfDatePanel = memo(() => {
  const { data } = useQuery<any>({
    queryKey: ["As_Of_Date"],
    queryFn: () => dateUpdate("Viaduct"),
    staleTime: Infinity,
  });
  const asofdate = data ?? "";

  return (
    <>
      <div
        style={{
          color: "rgb(54, 52, 52)",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
          zIndex: "1",
          position: "fixed",
          bottom: 5,
          left: "20px",
        }}
      >
        {!asofdate ? "" : "As of " + asofdate}
      </div>
    </>
  );
});

export default AsOfDatePanel;

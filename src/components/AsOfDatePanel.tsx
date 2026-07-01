import { updatedDateCategoryNames } from "../UniqueValues";
import { useQuery } from "@tanstack/react-query";
import type { DisplayDates } from "../interfaceKeys";
import { dateDisplayKeys } from "../interfaceKeys";
import { dateUpdate } from "../Query";

function AsOfDatePanel() {
  const { data } = useQuery<DisplayDates | any>({
    queryKey: [dateDisplayKeys.selected],
    queryFn: () => dateUpdate(updatedDateCategoryNames),
    select: (response) => {
      return { asOfDate: response[0][0] };
    },
    staleTime: Infinity,
  });
  const asOfDate = data?.asOfDate || "";

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
        As of {asOfDate}
      </div>
    </>
  );
}

export default AsOfDatePanel;

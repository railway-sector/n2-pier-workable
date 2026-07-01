import { use, useEffect, useRef, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import { chartRenderer } from "../ChartRenderer";
import { piechart, pileCapLayer } from "../layers";
import { name_to_workable_fields, workableStatusArray } from "../UniqueValues";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import type { ChartResponse } from "../interfaceKeys";
import { useQuery } from "@tanstack/react-query";

const WorkablePileCapChart = () => {
  const { cpackage, component } = use(MyContext);
  const [_chartPanelwidth, setChartPanelwidth] = useState<any>();
  const status_statistic_field = name_to_workable_fields.filter(
    (item: any) => item.name === component,
  )[0].field;

  const { data } = useQuery<ChartResponse | any>({
    queryKey: [cpackage, status_statistic_field, component, pileCapLayer],
    queryFn: async () => {
      piechart.qChart = cpackage === "All" ? "1=1" : `CP = '${cpackage}'`;
      piechart.layer = pileCapLayer;
      piechart.statusList = workableStatusArray;
      piechart.statusField = status_statistic_field;
      piechart.statisticField = status_statistic_field;
      piechart.statisticType = "count";

      const chartData = await piechart.chartDataPieSeries();

      return {
        chartData: chartData[0] || [],
      };
    },
  });
  const chartData = data?.chartData || [];

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "pie-two";

  const new_pieSeriesScale = 200;
  const new_pieInnerValueFontSize = "1.3rem";
  const new_pieInnerLabelFontSize = "0.55em";

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: -15 });
    chartRef.current = chart;

    // Create series
    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 55,
      innerRadius: 35,
      legendLabelText:
        '{category}[/] ([#000000; bold]{value.formatNumber("#.")}[/]) ',
    });
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: -16,
      scale: 1.4,
      // marginTop: -10,
    });
    legendRef.current = legend;
    legend.setAll({ marginTop: -20 });
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      pieSeriesScale: new_pieSeriesScale,
      pieInnerLabel: "TOTAL PILE CAP",
      pieInnerLabelFontSize: new_pieInnerLabelFontSize,
      pieInnerValueFontSize: new_pieInnerValueFontSize,
    });

    pieSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <div
      id={chartID}
      style={{
        width: "17rem",
        height: "17rem",
        backgroundColor: "#E1E1E1",
        borderStyle: "solid",
        borderWidth: "0.5px",
        borderColor: "grey",
        scrollbarWidth: "none",
      }}
    ></div>
  );
}; // End of lotChartgs

export default WorkablePileCapChart;

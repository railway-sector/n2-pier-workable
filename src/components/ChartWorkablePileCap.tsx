import { memo, use, useEffect, useRef, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import { pileCapLayer } from "../layers";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import type { ChartResponse } from "../interfaceKeys";
import { useQuery } from "@tanstack/react-query";
import ChartPieSeriesRender from "chart-pie-series-render";
import ChartPieSeries from "chart-pie-series";
import { cp_f, work_name_to_field, work_status_q } from "../uniqueValue";
import QueryExpressionLayers from "query-layers-expression";

//---------------------//
//    usePileCapData   //
//---------------------//
function usePileCapData(
  cpackage: string,
  component: string,
  statistic_f: string,
  query: any,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [cpackage, statistic_f, component, pileCapLayer],
    queryFn: async () => {
      const chartData = await new ChartPieSeries({
        where: query.queryExpression(),
        layer: pileCapLayer,
        statusList: work_status_q,
        statusField: statistic_f,
        statisticField: statistic_f,
        statisticType: "count",
      }).pieSeries();

      return { chartData };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

const WorkablePileCapChart = memo(() => {
  const { cpackage, component } = use(MyContext);
  const arcgisMap = document.querySelector("arcgis-map");

  const [_chartPanelwidth, setChartPanelwidth] = useState<any>();

  const statistic_f = work_name_to_field.filter(
    (item: any) => item.name === component,
  )[0].field;

  const q1 = new QueryExpressionLayers({
    qFields: [cp_f],
    qValues: [cpackage === "All" ? undefined : cpackage],
  });

  const { data, isLoading } = usePileCapData(
    cpackage,
    component,
    statistic_f,
    q1,
  );
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

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendValueText:
        "[#000000]{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 55,
      innerRadius: 35,
      legendLabelText:
        '[#000000]{category}[/][#000000] ([#000000; bold]{value.formatNumber("#.")}[/][#000000])',
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
    new ChartPieSeriesRender({
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: q1,
      q2Expression: undefined,
      status_field: statistic_f,
      view: arcgisMap?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "TOTAL PILE CAP",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: pileCapLayer,
      statusArray: work_status_q,
      bkg_color_switch: true,
      seriesFillHash: undefined,
    }).chartDataRenderer();

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
        opacity: isLoading ? 0 : 1,
      }}
    ></div>
  );
}); // End of lotChartgs

export default WorkablePileCapChart;

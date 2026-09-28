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
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ChartPieSeriesRender, {
  thousands_separators,
} from "chart-pie-series-render";
import ChartPieSeries from "chart-pie-series";
import { cp_f, work_name_to_field, work_status_q } from "../uniqueValue";
import QueryExpressionLayers from "query-layers-expression";
import { fieldStatistic } from "../query";

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
      const baseArgs = {
        layer: pileCapLayer,
        statisticField: statistic_f,
        statisticType: "count" as const,
        where: query.queryExpression(),
      };

      const [chartData, totalNumber] = await Promise.all([
        new ChartPieSeries({
          ...baseArgs,
          statusList: work_status_q,
          statusField: statistic_f,
        }).pieSeries(),

        fieldStatistic({ ...baseArgs }),
      ]);

      return { chartData, totalNumber };
    },
    placeholderData: keepPreviousData,
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
    (f: any) => f.name === component,
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
  const totalNumber = thousands_separators(data?.totalNumber || 0);

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const renderRef = useRef<ChartPieSeriesRender | null>(null);
  const chartID = "pie-two";

  const seriesScale = 200;
  const innerValueFontSize = "1.3rem";
  const innerLabelFontSize = "0.55em";

  //--- Keep click-handler-relevant values fresh without rebuilding the
  //    chart. view lives here too (not passed statically to the
  //    renderer) since arcgis-scene's view may not be ready on first
  //    mount.
  const configRef = useRef({
    qChart: q1,
    q2Expression: undefined,
    status_field: statistic_f,
    view: arcgisMap?.view,
  });

  useEffect(() => {
    configRef.current = {
      qChart: q1,
      q2Expression: undefined,
      status_field: statistic_f,
      view: arcgisMap?.view,
    };
  }, [data, statistic_f, arcgisMap]);

  //--- Pie Chart Renderer - created ONCE (mount only)
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, centerY: 25, y: 10 });
    chartRef.current = chart;
    const pieSeries = seriesSetter({
      chart,
      root,
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
      chart,
      root,
      centerX: -16,
      scale: 1.4,
    });
    legendRef.current = legend;
    legend.setAll({ marginTop: -20 });
    legend.data.setAll(pieSeries.dataItems);

    //--- NOTE: no `view` here — it's read live from configRef.current
    //    inside chartrender.ts, since arcgis-scene may not have a
    //    ready `.view` yet at this point.
    const renderer = new ChartPieSeriesRender({
      chart,
      pieSeries,
      legend,
      root,
      configRef,
      updateChartPanelwidth: setChartPanelwidth,
      data: [],
      seriesScale,
      innerValue: totalNumber,
      innerLabel: "TOTAL PILE CAP",
      innerLabelColor: "#000000",
      innerLabelFontSize,
      innerValueFontSize,
      layer: pileCapLayer,
      statusArray: work_status_q,
      seriesFillHash: undefined,
    });
    renderRef.current = renderer;
    renderRef.current.chartDataRenderer();

    return () => {
      root.dispose();
      renderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-once — do not add dependencies here

  //--- Push new data / inner value / affected-area figures into the
  //    already-mounted chart. No dispose, no rebuild -> no blink.
  //    NOTE: affectedAreaValue is NOT called here directly — it's
  //    registered once inside chartrender.ts and reads live data via
  //    closures, which updateData() keeps in sync. Calling it here on
  //    every render would both miss the first paint and stack
  //    duplicate adapters.
  useEffect(() => {
    if (!renderRef.current) return;
    renderRef.current.updateData(chartData, totalNumber, work_status_q);
  }, [chartData, totalNumber, work_status_q]);

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

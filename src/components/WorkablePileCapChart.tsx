import { use, useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { MyContext } from "../contexts/MyContext";
import { chartRenderer } from "../ChartRenderer";
import { pieChartStatusData } from "../ChartGenerator";
import { pileCapLayer } from "../layers";
import {
  name_to_workable_fields,
  workableStatusArray,
  workableStatusColor,
} from "../UniqueValues";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

const WorkablePileCapChart = () => {
  const { contractPackage, component, updateChartPanelwidth } = use(MyContext);

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [workableData, setWorkableData] = useState<unknown | any | undefined>(
    [],
  );

  const chartID = "pie-two";

  useEffect(() => {
    const status_statistic_field = name_to_workable_fields.filter(
      (item: any) => item.name === component,
    )[0].field;

    pieChartStatusData({
      qChart: contractPackage === "All" ? "1=1" : `CP = '${contractPackage}'`,
      layer: pileCapLayer,
      statusList: workableStatusArray,
      statusColor: workableStatusColor,
      statusField: status_statistic_field,
      statisticField: status_statistic_field,
      statisticType: "count",
    }).then((result: any) => {
      setWorkableData(result[0]);
    });
  }, [contractPackage, component]);

  const new_pieSeriesScale = 200;
  const new_pieInnerValueFontSize = "1.3rem";
  const new_pieInnerLabelFontSize = "0.55em";

  useEffect(() => {
    // Dispose previously created root element
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );
    chartRef.current = chart;

    // Create series
    const pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        radius: am5.percent(70), // outer radius
        innerRadius: am5.percent(40),
        y: am5.percent(-5),
        legendLabelText:
          '{category}[/] ([#000000; bold]{value.formatNumber("#.")}[/]) ',
        legendValueText: "", //"{valuePercentTotal.formatNumber('#.')}% ({value})"
      }),
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        x: am5.percent(20),
        y: am5.percent(65),
        scale: 1.4,
      }),
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      updateChartPanelwidth: updateChartPanelwidth,
      data: workableData,
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
    pieSeriesRef.current?.data.setAll(workableData);
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
      }}
    ></div>
  );
}; // End of lotChartgs

export default WorkablePileCapChart;

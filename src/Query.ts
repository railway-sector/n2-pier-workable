/* eslint-disable @typescript-eslint/no-unused-expressions */
import { dateTable } from "./layers";
import { home_rotation } from "./uniqueValue";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";
import QueryExpressionLayers from "query-layers-expression";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

//---------------------------------------------//
//               Pie chart                     //
//---------------------------------------------//
// 'piechart' = constant declared from class ChartPieSeries in layers.ts
interface pieChartDataType {
  piechart: any;
  qChart: any;
  layer: any;
  statusList: any;
  statusField: any;
  statisticField: any;
  statisticType: "sum" | "count";
}
export async function pieChartData({
  piechart,
  qChart,
  layer,
  statusList,
  statusField,
  statisticField,
  statisticType,
}: pieChartDataType) {
  Object.assign(piechart, {
    qChart: qChart.queryExpression(),
    layer,
    statusList,
    statusField,
    statisticField,
    statisticType,
  });
  return await piechart.chartDataPieSeries();
}

//--- Chart Render helper function
// `pieChartRender` function helps to assign parameter names to class `ChartPieSeriesRender`
interface PieChartRenderType {
  render: any | null; // the first instance of new ChartPieSeriesRender
  chart: any; // amChart
  pieSeries: any;
  legend: any;
  root: any;
  qChart: any;
  q2Expression?: any;
  status_field: any;
  view: any;
  updateChartPanelwidth: any;
  data: any;
  seriesScale: any;
  innerLabel?: any;
  innerLabelFontSize?: any;
  innerValueFontSize?: any;
  layer: FeatureLayer | any;
  statusArray: StatusQueryItem[];
  bkg_color_switch?: boolean;
  seriesFillHash?: boolean;
}

interface StatusQueryItem {
  category: string;
  value: number | string;
  color: string;
}

export async function PieChartRender({ render, ...props }: PieChartRenderType) {
  Object.assign(render, props);
  return await render.chartDataRenderer();
}

//--- Returns query expression
export const makeQuery = (
  qValues: string[],
  qFields: string[],
  qExpression?: string,
  q2Expression?: string,
) => {
  const q = new QueryExpressionLayers();
  q.qValues = qValues;
  q.qFields = qFields;
  if (qExpression) q.qExpression = qExpression;
  if (q2Expression) q.q2Expression = q2Expression;
  return q;
};

//---------------------------------------------------------//
//                 StripMap  Renderer                      //
//---------------------------------------------------------//
export async function stripMapRenderer(
  layer: any,
  overviewLayer: any,
  map: any,
  overviewMap: any,
) {
  await layer?.when();
  map?.view.on("click", async (event: any) => {
    const response = await map?.view.hitTest(event);
    const result: any = response.results[0];
    const layer_name = result.graphic.layer.title;

    if (layer_name !== "Strip Map") return;
    map.view.rotation = 305;

    // overview new extent
    const attrs = result.graphic.attributes;
    overviewLayer.definitionExpression = "PageNumber = " + attrs["PageNumber"];

    const { extent } = result.graphic.geometry;
    const new_extent = new Extent({
      xmax: extent.xmax,
      ymax: extent.ymax,
      xmin: extent.xmin,
      ymin: extent.ymin,
      spatialReference: { wkid: 102100 },
    });

    //--- Wait until overviewMap is ready
    if (!overviewMap) return;

    overviewMap.extent = new_extent;
    overviewMap.rotation = 360 - attrs["Angle"];
    overviewMap.zoom = 17;

    //--- Highlight selected strip
    let highlight: any;
    const strips = attrs["OBJECTID"];
    if (!strips) return;

    const layerView = await map?.whenLayerView(layer);
    highlight = layerView.highlight(strips);
    map?.view.on("click", () => {
      highlight.remove();
    });
  });
}

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer1?: FeatureLayer | any; // pilecapLayer, pilecapLayer_overview
  featureLayers2?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
  array?: any;
  selectedItem?: any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer1,
  featureLayers2,
  array,
  selectedItem,
}: queryDefinitionExpressionType) {
  const selected = array?.find((f: any) => f.component === selectedItem);

  // pielcap layer
  featureLayer1.definitionExpression = queryExpression;
  featureLayer1.renderer = selected?.renderer;
  featureLayer1.labelingInfo = selected?.labelInfo;

  // definition Expression
  featureLayers2.map((layer: any) => {
    layer.definitionExpression = queryExpression;

    if (selectedItem === "All") {
      layer.visible = true;
    } else if (selectedItem === "Others") {
      layer.visible = false;
    } else {
      layer.visible = layer.title === selected?.layerv?.title;
    }
  });
}

//------------------------------------------------//
//            Update As-of date                   //
//------------------------------------------------//
// Updat date
export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export function toAsofdate(date: Date) {
  //--- Return displayed date: (as of date)
  const { year, day } = yearMonthDay(date);
  const cmonth = date?.toLocaleString("en-US", { month: "long" });

  return year <= 1970 ? "" : `${cmonth} ${day}, ${year}`;
}

export async function dateUpdate(category: string) {
  //--- Only executed during an initial render
  const query = dateTable.createQuery();
  query.where = `project = 'N2' AND category = '${category}'`;

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    return toAsofdate(new Date(attributes.date));
  });
}

//------------------------------------------------//
//            Overview Map constraint             //
//------------------------------------------------//
const PROHIBITED_ZOOM_KEYS = new Set([
  "+",
  "-",
  "Shift",
  "_",
  "=",
  "ArrowUp",
  "ArrowDown",
  "ArrowRight",
  "ArrowLeft",
]);

export function disableZooming(view: any) {
  view.popup.dockEnabled = true;
  view.popup.actions = [];
  view.ui.components = [];

  // stops propagation of default behavior when an event fires
  function stopEvtPropagation(event: any) {
    event.stopPropagation();
  }

  const blockedInteractions: [string, string[]?][] = [
    ["mouse-wheel"],
    ["double-click"],
    ["double-click", ["Control"]],
    ["drag"],
    ["drag", ["Shift"]],
    ["drag", ["Shift", "Control"]],
  ];

  blockedInteractions.forEach(([eventName, modifiers]) => {
    modifiers
      ? view.on(eventName, modifiers)
      : view.on(eventName, stopEvtPropagation);
  });

  // prevents zooming with the + and - keys
  view.on("key-down", (event: any) => {
    if (PROHIBITED_ZOOM_KEYS.has(event.key)) {
      event.stopPropagation();
    }
  });

  return view;
}

//------------------------------------------------//
//                 Other functions                //
//------------------------------------------------//
// Zoom to layer
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view?.goTo(response.extent, { speedFactor: 2 }).catch((error: any) => {
      if (error.name !== "AbortError") {
        console.log("error");
      }
    });
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}

// Return to home extent
const home_center: any = [120.9, 14.7832299];
export function homeExtentRenderer(view: any) {
  view.rotation = home_rotation;
  view.scale = 577790.5542885;
  view.center = home_center;
}

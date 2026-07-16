/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  dateTable,
  lotLayer,
  lotLayer_overview,
  nloLayer,
  nloLayer_overview,
  structureLayer,
  structureLayer_overview,
  utilityPointLayer,
  utilityPointLayer_overview,
} from "./layers";
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
  piechart.qChart = qChart.queryExpression();
  piechart.layer = layer;
  piechart.statusList = statusList;
  piechart.statusField = statusField;
  piechart.statisticField = statisticField;
  piechart.statisticType = statisticType;

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

export async function PieChartRenderType({
  render,
  chart,
  pieSeries,
  legend,
  root,
  qChart,
  q2Expression,
  status_field,
  view,
  updateChartPanelwidth,
  data,
  seriesScale,
  innerLabel,
  innerLabelFontSize,
  innerValueFontSize,
  layer,
  statusArray,
  bkg_color_switch,
  seriesFillHash,
}: PieChartRenderType) {
  render.chart = chart;
  render.pieSeries = pieSeries;
  render.legend = legend;
  render.root = root;
  render.qChart = qChart;
  render.q2Expression = q2Expression;
  render.status_field = status_field;
  render.view = view;
  render.updateChartPanelwidth = updateChartPanelwidth;
  render.data = data;
  render.seriesScale = seriesScale;
  render.innerLabel = innerLabel;
  render.innerLabelFontSize = innerLabelFontSize;
  render.innerValueFontSize = innerValueFontSize;
  render.layer = layer;
  render.statusArray = statusArray;
  render.bkg_color_switch = bkg_color_switch;
  render.seriesFillHash = seriesFillHash;

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

    if (result) {
      if (result.graphic.layer) {
        const layer_name = result.graphic.layer.title;
        if (layer_name === "Strip Map") {
          map.view.rotation = 305;

          // overview new extent
          const attributes = result.graphic.attributes;
          overviewLayer.definitionExpression =
            "PageNumber = " + attributes["PageNumber"];

          const extent = result.graphic.geometry.extent;
          const new_extent = new Extent({
            xmax: extent.xmax,
            ymax: extent.ymax,
            xmin: extent.xmin,
            ymin: extent.ymin,
            spatialReference: { wkid: 102100 },
          });

          overviewMap.extent = new_extent;
          overviewMap.rotation = 360 - attributes["Angle"];
          overviewMap.zoom = 17;

          //--- Highlight selected strip
          let highlight: any;
          const selectedStrip = attributes["OBJECTID"];
          if (selectedStrip) {
            const layerView = await map?.whenLayerView(layer);
            highlight = layerView.highlight(selectedStrip);
            map?.view.on("click", () => {
              highlight.remove();
            });
          }
        }
      }
    }
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
  componentArray?: any;
  componentSelected?: any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer1,
  featureLayers2,
  componentArray,
  componentSelected,
}: queryDefinitionExpressionType) {
  const find = componentArray.find(
    (item: any) => item.component === componentSelected,
  );
  const new_renderer = find?.renderer;
  const new_labelInfo = find?.labelInfo;
  const new_visible_layer = find?.layerv;

  // pielcap layer
  featureLayer1.definitionExpression = queryExpression;
  featureLayer1.renderer = new_renderer;
  featureLayer1.labelingInfo = new_labelInfo;

  // definition Expression
  featureLayers2.map((layer: any) => {
    layer.definitionExpression = queryExpression;
  });

  // other layers
  if (componentSelected === "All") {
    featureLayers2.map((layer: any) => {
      layer.visible = true;
    });
  } else if (componentSelected === "Others") {
    featureLayers2.map((layer: any) => {
      layer.visible = false;
    });
  } else {
    featureLayers2.map((layer: any) => {
      if (layer.title === new_visible_layer.title) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
    });
  }
}

//------------------------------------------------//
//            Update As-of date                   //
//------------------------------------------------//
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

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
  query.where = `project = 'SC' AND category = '${category}'`;

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    const date = new Date(attributes.date);
    const asofdate = toAsofdate(date);

    return asofdate;
  });
}

//------------------------------------------------//
//            Overview Map constraint             //
//------------------------------------------------//
export function disableZooming(view: any) {
  view.popup.dockEnabled = true;

  // Removes the zoom action on the popup
  view.popup.actions = [];

  // stops propagation of default behavior when an event fires
  function stopEvtPropagation(event: any) {
    event.stopPropagation();
  }

  // exlude the zoom widget from the default UI
  // view.ui.components = [];
  view.ui.components = [];

  // disable mouse wheel scroll zooming on the overView
  view?.on("mouse-wheel", stopEvtPropagation);

  // disable zooming via double-click on the overView
  view.on("double-click", stopEvtPropagation);

  // disable zooming out via double-click + Control on the overView
  view.on("double-click", ["Control"], stopEvtPropagation);

  // disables pinch-zoom and panning on the overView
  view.on("drag", stopEvtPropagation);

  // disable the overView's zoom box to prevent the Shift + drag
  // and Shift + Control + drag zoom gestures.
  view.on("drag", ["Shift"], stopEvtPropagation);
  view.on("drag", ["Shift", "Control"], stopEvtPropagation);

  // prevents zooming with the + and - keys
  view.on("key-down", (event: any) => {
    const prohibitedKeys = [
      "+",
      "-",
      "Shift",
      "_",
      "=",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    const keyPressed = event.key;
    if (prohibitedKeys.indexOf(keyPressed) !== -1) {
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
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          // console.error(error);
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

export const layersVisibleFalse = () => {
  lotLayer.visible = false;
  structureLayer.visible = false;
  nloLayer.visible = false;
  utilityPointLayer.visible = false;

  lotLayer_overview.visible = false;
  structureLayer_overview.visible = false;
  nloLayer_overview.visible = false;
  utilityPointLayer_overview.visible = false;
};

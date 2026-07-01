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
import { home_rotation } from "./UniqueValues";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

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
            spatialReference: {
              wkid: 102100,
            },
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
export async function dateUpdate(category: any) {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = `project = 'N2' AND category = '${category}'`;

  const response = await dateTable.queryFeatures(query);
  const dates = response.features.map((result: any) => {
    // get today and date recorded in the table
    const today = new Date();
    const date = new Date(result.attributes.date);

    // Calculate the number of days passed since the last update
    const time_passed = today.getTime() - date.getTime();
    const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

    const year = date.getFullYear();
    const month = monthList[date.getMonth()];
    const day = date.getDate();
    const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
    return [final, days_passed];
  });
  return dates;
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
